import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { buildKriyaSubmission } from '../../utils/kriyaSnapshot.js';

const FinalizeDesignModal = ({ placed, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    title: 'My Kriya Bouquet',
    notes: '',
  });

  const [rendering, setRendering] = useState(true);
  const [submission, setSubmission] = useState(null); // { previewBlob, previewUrl, absoluteElements, canvasSize }
  const [submitting, setSubmitting] = useState(false);

  // Render the snapshot once, as soon as the modal opens, so the customer
  // can preview exactly what will be sent before they fill in the form.
  useEffect(() => {
    let cancelled = false;
    setRendering(true);
    buildKriyaSubmission(placed)
      .then(({ previewBlob, absoluteElements, canvasSize }) => {
        if (cancelled) return;
        setSubmission({
          previewBlob,
          previewUrl: previewBlob ? URL.createObjectURL(previewBlob) : '',
          absoluteElements,
          canvasSize,
        });
      })
      .catch(() => {
        // Preview rendering failed (e.g. an image blocked the canvas) — the
        // design can still be submitted, just without a preview thumbnail.
        if (!cancelled) {
          setSubmission({
            previewBlob: null,
            previewUrl: '',
            absoluteElements: placed.map((el) => ({
              element: el.elementId, image: el.image, x: 0, y: 0, width: 0, height: 0,
              rotation: el.rotation, zIndex: el.zIndex, flipX: el.flipX,
            })),
            canvasSize: { width: 1000, height: 1000 },
          });
        }
      })
      .finally(() => { if (!cancelled) setRendering(false); });
    return () => cancelled = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submission) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('title', form.title);
      fd.append('notes', form.notes);
      fd.append('canvasSize', JSON.stringify(submission.canvasSize));
      fd.append('elements', JSON.stringify(submission.absoluteElements));
      if (submission.previewBlob) fd.append('preview', submission.previewBlob, 'kriya-design.png');

      const { data } = await api.post('/kriya/designs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Design sent! We\'ll follow up with a quote soon 🌸', 'success');
      onSuccess(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative bg-canvas rounded-3xl shadow-card w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-canvas flex items-center justify-between px-6 py-4 border-b-2 border-ink/5 z-10">
          <h3 className="font-display font-bold text-lg text-ink flex items-center gap-2"><Sparkles size={18} className="text-rani" /> Finalize Your Design</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-blush flex items-center justify-center"><X size={18} /></button>
        </div>

        <div className="p-6">
          <div className="aspect-square rounded-2xl bg-white shadow-soft overflow-hidden flex items-center justify-center mb-5">
            {rendering ? (
              <p className="text-sm text-ink/40 animate-pulse">Rendering your preview…</p>
            ) : submission?.previewUrl ? (
              <img src={submission.previewUrl} alt="Your Kriya design" className="w-full h-full object-cover" />
            ) : (
              <p className="text-sm text-ink/40 px-6 text-center">Preview unavailable, but your design will still be submitted with all {placed.length} element(s).</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" placeholder="Give your design a name" value={form.title} onChange={handleChange} className="w-full bg-blush/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40" />
            <div className="grid sm:grid-cols-2 gap-3">
              <input name="name" required placeholder="Your Name" value={form.name} onChange={handleChange} className="bg-blush/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40" />
              <input type="email" name="email" required placeholder="Email Address" value={form.email} onChange={handleChange} className="bg-blush/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40" />
            </div>
            <input name="phone" required placeholder="Phone / WhatsApp Number" value={form.phone} onChange={handleChange} className="w-full bg-blush/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40" />
            <textarea name="notes" rows={3} placeholder="Anything else we should know? (occasion, size, wrap style…)" value={form.notes} onChange={handleChange} className="w-full bg-blush/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40" />

            <button disabled={submitting || rendering} className="btn-sticker bg-rani text-white w-full py-3.5 hover:bg-rani-dark disabled:opacity-60">
              {submitting ? 'Sending…' : rendering ? 'Preparing preview…' : 'Send for a Quote'}
            </button>
            <p className="text-[11px] text-ink/40 text-center">
              This isn't a final price — our team will confirm a quote for your custom arrangement over {form.phone ? 'WhatsApp/email' : 'email'}.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FinalizeDesignModal;
