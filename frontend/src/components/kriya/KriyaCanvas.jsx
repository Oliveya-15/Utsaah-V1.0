import PlacedElement from './PlacedElement.jsx';

// A responsive square "artboard". Every placed element stores its position
// and size as a percentage of this box, so the whole layout scales correctly
// on any screen without any JS resize math — the browser's CSS engine does
// it for free.
const KriyaCanvas = ({ canvasRef, placed, selectedUid, onSelect, onChange, onDropElement, backgroundLabel }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData('text/plain');
    if (!elementId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    onDropElement(elementId, xPct, yPct);
  };

  return (
    <div className="w-full flex justify-center">
      <div
        ref={canvasRef}
        className="relative w-full max-w-[640px] aspect-square bg-white rounded-3xl shadow-card overflow-hidden touch-none"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #F9F3EA 25%, transparent 25%), linear-gradient(-45deg, #F9F3EA 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F9F3EA 75%), linear-gradient(-45deg, transparent 75%, #F9F3EA 75%)',
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0px',
        }}
        onClick={() => onSelect(null)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {placed.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-8 text-center">
            <p className="text-ink/30 font-display font-semibold text-sm sm:text-base">
              {backgroundLabel || 'Tap an element from below to start your bouquet 🌸'}
            </p>
          </div>
        )}

        {placed.map((el) => (
          <PlacedElement key={el.uid} el={el} canvasRef={canvasRef} isSelected={selectedUid === el.uid} onSelect={onSelect} onChange={onChange} />
        ))}
      </div>
    </div>
  );
};

export default KriyaCanvas;
