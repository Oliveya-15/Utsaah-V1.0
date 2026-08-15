import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles, RotateCcw, Trash2, Copy, FlipHorizontal, ChevronUp, ChevronDown, Undo2,
} from 'lucide-react';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import ElementSidebar from '../components/kriya/ElementSidebar.jsx';
import KriyaCanvas from '../components/kriya/KriyaCanvas.jsx';
import FinalizeDesignModal from '../components/kriya/FinalizeDesignModal.jsx';

let uidCounter = 0;
const nextUid = () => `el-${Date.now()}-${++uidCounter}`;

const Kriya = () => {
  const { showToast } = useToast();
  const canvasRef = useRef(null);

  // ---------- library (categories + elements), fully admin-driven ----------
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [elements, setElements] = useState([]);
  const [elementsLoading, setElementsLoading] = useState(false);

  // ---------- what the user has built ----------
  const [placed, setPlaced] = useState([]);
  const [selectedUid, setSelectedUid] = useState(null);
  const zCounter = useRef(1);

  // ---------- finalize flow ----------
  const [showFinalize, setShowFinalize] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    api.get('/kriya/categories').then((res) => {
      setCategories(res.data);
      setActiveCategoryId(res.data[0]?._id || null);
      setCategoriesLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!activeCategoryId) { setElements([]); return; }
    setElementsLoading(true);
    api.get(`/kriya/elements?category=${activeCategoryId}`).then((res) => {
      setElements(res.data);
      setElementsLoading(false);
    });
  }, [activeCategoryId]);

  /* ---------------- placing & editing elements ---------------- */

  // A freshly admin-uploaded image's px size is only a hint — this converts
  // it into an initial % of the (responsive) canvas width so it starts at a
  // sensible on-screen size regardless of viewport.
  const REFERENCE_PX = 640;
  const initialWidthPctFor = (defaultSize) => {
    const pct = ((defaultSize || 140) / REFERENCE_PX) * 100;
    return Math.min(60, Math.max(10, pct));
  };

  const addElement = useCallback((sourceElement, xPct = 50, yPct = 50) => {
    const jitter = () => (Math.random() - 0.5) * 6;
    const uid = nextUid();
    setPlaced((prev) => [
      ...prev,
      {
        uid,
        elementId: sourceElement._id,
        image: sourceElement.image,
        xPct: clamp(xPct + (xPct === 50 ? jitter() : 0), 8, 92),
        yPct: clamp(yPct + (yPct === 50 ? jitter() : 0), 8, 92),
        widthPct: initialWidthPctFor(sourceElement.defaultSize),
        rotation: 0,
        zIndex: zCounter.current++,
        flipX: false,
      },
    ]);
    setSelectedUid(uid);
  }, []);

  const handleAddFromSidebar = (el) => addElement(el);

  const handleDropElement = (elementId, xPct, yPct) => {
    const source = elements.find((e) => e._id === elementId);
    if (source) addElement(source, xPct, yPct);
  };

  const handleChangeElement = useCallback((uid, patch) => {
    setPlaced((prev) => prev.map((el) => (el.uid === uid ? { ...el, ...patch } : el)));
  }, []);

  const selected = placed.find((el) => el.uid === selectedUid) || null;

  const bringForward = () => selected && handleChangeElement(selected.uid, { zIndex: zCounter.current++ });
  const sendBackward = () => {
    if (!selected) return;
    const minZ = Math.min(0, ...placed.map((el) => el.zIndex));
    handleChangeElement(selected.uid, { zIndex: minZ - 1 });
  };
  const flipSelected = () => selected && handleChangeElement(selected.uid, { flipX: !selected.flipX });
  const resetRotation = () => selected && handleChangeElement(selected.uid, { rotation: 0 });
  const duplicateSelected = () => {
    if (!selected) return;
    const uid = nextUid();
    setPlaced((prev) => [
      ...prev,
      { ...selected, uid, xPct: clamp(selected.xPct + 5, 5, 95), yPct: clamp(selected.yPct + 5, 5, 95), zIndex: zCounter.current++ },
    ]);
    setSelectedUid(uid);
  };
  const deleteSelected = useCallback(() => {
    if (!selectedUid) return;
    setPlaced((prev) => prev.filter((el) => el.uid !== selectedUid));
    setSelectedUid(null);
  }, [selectedUid]);
  const clearCanvas = () => {
    if (placed.length === 0) return;
    if (!confirm('Clear everything from the canvas and start over?')) return;
    setPlaced([]);
    setSelectedUid(null);
  };

  // Keyboard shortcuts — guarded so they don't fire while typing in a form field.
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedUid) { e.preventDefault(); deleteSelected(); }
      if (e.key === 'Escape') setSelectedUid(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedUid, deleteSelected]);

  /* ---------------- finalize ---------------- */

  const handleFinalizeClick = () => {
    if (placed.length === 0) {
      showToast('Add at least one element to your canvas first', 'error');
      return;
    }
    setSelectedUid(null);
    setShowFinalize(true);
  };

  const handleSubmitted = (design) => {
    setShowFinalize(false);
    setSubmitted(design);
  };

  const startNewDesign = () => {
    setPlaced([]);
    setSelectedUid(null);
    setSubmitted(null);
  };

  /* ---------------- render ---------------- */

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🎉</p>
        <h1 className="font-display font-bold text-3xl text-ink mb-3">Design Received!</h1>
        <p className="text-ink/60 mb-8">
          Thank you, {submitted.name?.split(' ')[0]}! We've saved "{submitted.title}" and our team will reach out with a quote within 1 business day.
        </p>
        <button onClick={startNewDesign} className="btn-sticker bg-rani text-white px-6 py-3">Start a New Design</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Helmet><title>Kriya — Design Your Own Bouquet — Utsaah</title></Helmet>

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 bg-blush px-3.5 py-1.5 rounded-full text-xs font-display font-semibold text-rani mb-4">
          <Sparkles size={14} /> Kriya — Made by You
        </span>
        <h1 className="font-display font-bold text-4xl text-ink mb-3">Design Your Own Bouquet</h1>
        <p className="text-ink/60 max-w-lg mx-auto">
          Drag flowers and paper onto the canvas, arrange them your way, and send us your design — we'll bring it to life.
        </p>
      </div>

      {categoriesLoading ? (
        <Loader fullScreen />
      ) : (
        <div className="grid lg:grid-cols-[260px_1fr] gap-5 items-start">
          <ElementSidebar
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            elements={elements}
            elementsLoading={elementsLoading}
            onAddElement={handleAddFromSidebar}
          />

          <div className="space-y-4">
            <KriyaCanvas
              canvasRef={canvasRef}
              placed={placed}
              selectedUid={selectedUid}
              onSelect={setSelectedUid}
              onChange={handleChangeElement}
              onDropElement={handleDropElement}
            />

            {/* Selection toolbar — always reserves its row so the layout doesn't jump */}
            <div className="flex flex-wrap items-center justify-center gap-2 min-h-[44px]">
              {selected ? (
                <>
                  <ToolbarButton icon={ChevronUp} label="Forward" onClick={bringForward} />
                  <ToolbarButton icon={ChevronDown} label="Backward" onClick={sendBackward} />
                  <ToolbarButton icon={FlipHorizontal} label="Flip" onClick={flipSelected} />
                  <ToolbarButton icon={RotateCcw} label="Straighten" onClick={resetRotation} />
                  <ToolbarButton icon={Copy} label="Duplicate" onClick={duplicateSelected} />
                  <ToolbarButton icon={Trash2} label="Delete" onClick={deleteSelected} danger />
                </>
              ) : (
                <p className="text-xs text-ink/35">Tap an item on the canvas to move, resize, rotate, or delete it.</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <button onClick={clearCanvas} disabled={placed.length === 0} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/40 hover:text-rani disabled:opacity-30 disabled:hover:text-ink/40">
                <Undo2 size={13} /> Clear canvas
              </button>
              <button onClick={handleFinalizeClick} className="btn-sticker bg-rani text-white px-7 py-3.5 hover:bg-rani-dark">
                <Sparkles size={16} /> Finalize & Get a Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinalize && (
        <FinalizeDesignModal placed={placed} onClose={() => setShowFinalize(false)} onSuccess={handleSubmitted} />
      )}
    </div>
  );
};

const ToolbarButton = ({ icon: Icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-display font-semibold shadow-soft transition-colors ${
      danger ? 'bg-white text-rani hover:bg-rani hover:text-white' : 'bg-white text-ink/70 hover:bg-blush'
    }`}
  >
    <Icon size={14} /> {label}
  </button>
);

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

export default Kriya;
