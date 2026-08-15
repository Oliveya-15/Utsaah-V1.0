import { useRef, useCallback } from 'react';

const MIN_WIDTH_PCT = 5;
const MAX_WIDTH_PCT = 85;

// A single item the user has placed on the canvas. All the interaction math
// (drag / resize / rotate) is done with native Pointer Events so the exact
// same code works for mouse, trackpad and touch — no drag-and-drop library
// needed for this part, since we're moving something already on the canvas
// rather than reordering a list.
const PlacedElement = ({ el, canvasRef, isSelected, onSelect, onChange }) => {
  const dragState = useRef(null);

  const getCanvasRect = () => canvasRef.current?.getBoundingClientRect();

  // ---------- move ----------
  const handleDragPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(el.uid);
      const rect = getCanvasRect();
      if (!rect) return;
      dragState.current = {
        mode: 'move',
        startClientX: e.clientX,
        startClientY: e.clientY,
        startXPct: el.xPct,
        startYPct: el.yPct,
        rect,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [el.uid, el.xPct, el.yPct, onSelect]
  );

  // ---------- resize (distance-from-center based — rotation-invariant) ----------
  const handleResizePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      const rect = getCanvasRect();
      if (!rect) return;
      const centerClientX = rect.left + (el.xPct / 100) * rect.width;
      const centerClientY = rect.top + (el.yPct / 100) * rect.height;
      const startDist = Math.hypot(e.clientX - centerClientX, e.clientY - centerClientY) || 1;
      dragState.current = {
        mode: 'resize',
        centerClientX,
        centerClientY,
        startDist,
        startWidthPct: el.widthPct,
        rect,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [el.xPct, el.yPct, el.widthPct]
  );

  // ---------- rotate (pure angle from center) ----------
  const handleRotatePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      const rect = getCanvasRect();
      if (!rect) return;
      const centerClientX = rect.left + (el.xPct / 100) * rect.width;
      const centerClientY = rect.top + (el.yPct / 100) * rect.height;
      const startAngle = Math.atan2(e.clientY - centerClientY, e.clientX - centerClientX) * (180 / Math.PI);
      dragState.current = {
        mode: 'rotate',
        centerClientX,
        centerClientY,
        startAngle,
        startRotation: el.rotation,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [el.xPct, el.yPct, el.rotation]
  );

  const handlePointerMove = useCallback(
    (e) => {
      const s = dragState.current;
      if (!s) return;

      if (s.mode === 'move') {
        const deltaXPct = ((e.clientX - s.startClientX) / s.rect.width) * 100;
        const deltaYPct = ((e.clientY - s.startClientY) / s.rect.height) * 100;
        onChange(el.uid, {
          xPct: clamp(s.startXPct + deltaXPct, -15, 115),
          yPct: clamp(s.startYPct + deltaYPct, -15, 115),
        });
      } else if (s.mode === 'resize') {
        const dist = Math.hypot(e.clientX - s.centerClientX, e.clientY - s.centerClientY);
        const scale = dist / s.startDist;
        onChange(el.uid, { widthPct: clamp(s.startWidthPct * scale, MIN_WIDTH_PCT, MAX_WIDTH_PCT) });
      } else if (s.mode === 'rotate') {
        const angle = Math.atan2(e.clientY - s.centerClientY, e.clientX - s.centerClientX) * (180 / Math.PI);
        let rotation = s.startRotation + (angle - s.startAngle);
        if (e.shiftKey) rotation = Math.round(rotation / 15) * 15; // snap while holding Shift
        onChange(el.uid, { rotation });
      }
    },
    [el.uid, onChange]
  );

  const handlePointerUp = useCallback((e) => {
    dragState.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
  }, []);

  return (
    <div
      className="absolute select-none"
      style={{
        left: `${el.xPct}%`,
        top: `${el.yPct}%`,
        width: `${el.widthPct}%`,
        transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scaleX(${el.flipX ? -1 : 1})`,
        zIndex: el.zIndex,
        touchAction: 'none',
        cursor: isSelected ? 'grab' : 'pointer',
      }}
      onPointerDown={handleDragPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <img src={el.image} alt="" draggable={false} className="w-full h-auto block pointer-events-none drop-shadow-md" crossOrigin="anonymous" />

      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-dashed border-rani/70 rounded-sm pointer-events-none" style={{ margin: -4 }} />

          {/* rotate handle */}
          <div className="absolute left-1/2 pointer-events-none bg-rani/50" style={{ top: -28, width: 1, height: 24, transform: 'translateX(-50%)' }} />
          <div
            onPointerDown={handleRotatePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-rani shadow cursor-grab active:cursor-grabbing"
            style={{ left: '50%', top: -34, transform: 'translate(-50%, -50%)', touchAction: 'none' }}
            title="Drag to rotate (hold Shift to snap)"
          />

          {/* resize handle */}
          <div
            onPointerDown={handleResizePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-rani shadow cursor-nwse-resize"
            style={{ right: -10, bottom: -10, touchAction: 'none' }}
            title="Drag to resize"
          />
        </>
      )}
    </div>
  );
};

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

export default PlacedElement;
