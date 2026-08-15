import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import StatusPill from '../components/StatusPill.jsx';

const STATUSES = ['New', 'In Discussion', 'Quotation Sent', 'Accepted', 'Converted To Order', 'Declined'];

const KriyaRequests = () => {
  const { showToast } = useToast();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [status, setStatus] = useState('');
  const [adminReply, setAdminReply] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAll = () => api.get('/kriya/designs/admin/all').then((res) => { setDesigns(res.data); setLoading(false); });
  useEffect(() => { fetchAll(); }, []);

  const openDesign = (d) => {
    setActive(d);
    setStatus(d.status);
    setAdminReply(d.adminReply || '');
    setQuotedPrice(d.quotedPrice || '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/kriya/designs/${active._id}`, { status, adminReply, quotedPrice });
      showToast('Design updated — customer notified', 'success');
      setActive(null);
      fetchAll();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-ink mb-1 flex items-center gap-2"><Layers size={26} className="text-rani" /> Kriya Designs</h1>
      <p className="text-ink/50 text-sm mb-6">{designs.length} designs finalized by customers on the Kriya canvas</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((d) => (
          <button key={d._id} onClick={() => openDesign(d)} className="text-left bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-shadow">
            <div className="aspect-square bg-blush/50 flex items-center justify-center overflow-hidden">
              {d.previewImage ? (
                <img src={d.previewImage} alt={d.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl opacity-40">🌸</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <p className="font-display font-semibold text-ink text-sm truncate">{d.title}</p>
                <StatusPill status={d.status} />
              </div>
              <p className="text-xs text-ink/50">{d.name} · {d.elements?.length || 0} elements</p>
              <p className="text-xs text-ink/40 mt-1">{new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
          </button>
        ))}
        {designs.length === 0 && <p className="text-ink/40 text-sm col-span-full text-center py-12">No Kriya designs submitted yet.</p>}
      </div>

      {active && (
        <Modal title={active.title} onClose={() => setActive(null)} wide>
          <div className="grid sm:grid-cols-[220px_1fr] gap-5">
            <div className="rounded-2xl overflow-hidden bg-blush/50 aspect-square flex items-center justify-center shrink-0">
              {active.previewImage ? (
                <img src={active.previewImage} alt={active.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl opacity-40">🌸</span>
              )}
            </div>
            <div>
              <div className="mb-4 space-y-1 text-sm text-ink/60">
                <p><span className="font-semibold text-ink">Name:</span> {active.name}</p>
                <p><span className="font-semibold text-ink">Contact:</span> {active.email} · {active.phone}</p>
                <p><span className="font-semibold text-ink">Elements used:</span> {active.elements?.length || 0}</p>
                {active.notes && <p><span className="font-semibold text-ink">Notes:</span> {active.notes}</p>}
              </div>
              <form onSubmit={handleSave} className="space-y-3 pt-3 border-t-2 border-ink/5">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="number" placeholder="Quoted Price ₹" value={quotedPrice} onChange={(e) => setQuotedPrice(e.target.value)} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                <textarea placeholder="Reply to customer…" rows={3} value={adminReply} onChange={(e) => setAdminReply(e.target.value)} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                <button disabled={saving} className="btn-sticker bg-rani text-white px-6 py-3 text-sm disabled:opacity-60">{saving ? 'Saving…' : 'Save & Notify Customer'}</button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default KriyaRequests;
