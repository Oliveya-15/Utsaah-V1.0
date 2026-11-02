import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import StatusPill from '../components/StatusPill.jsx';

const Returns = () => {
  const { showToast } = useToast();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const fetchAll = () => api.get('/returns/admin/all').then((res) => { setReturns(res.data); setLoading(false); });
  useEffect(() => { fetchAll(); }, []);

  const run = async (id, request, successMessage) => {
    setBusyId(id);
    try {
      await request();
      showToast(successMessage, 'success');
      await fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setBusyId('');
    }
  };

  const decide = (id, decision) =>
    run(id, () => api.put(`/returns/${id}/decision`, { decision }), `Return ${decision.toLowerCase()}`);

  const processRefund = (r, refundMethod) => {
    const cash = r.order?.totalAmount || 0;
    const walletPortion = r.order?.walletUsed || 0;
    const text = refundMethod === 'wallet'
      ? `Add ₹${cash + walletPortion} to ${r.user?.name}'s Utsaah Wallet now?`
      : `Refund ₹${cash} to the customer's original payment method?\n\nYou send this money back yourself (UPI/bank), then press "Mark Refund Completed".${walletPortion > 0 ? `\n\n₹${walletPortion} they paid from their wallet goes back to their wallet right now.` : ''}`;
    if (!window.confirm(text)) return;
    run(r._id, () => api.put(`/returns/${r._id}/refund`, { refundMethod }), refundMethod === 'wallet' ? 'Refund added to wallet' : 'Refund started');
  };

  const markCompleted = (id) =>
    run(id, () => api.put(`/returns/${id}/complete`), 'Refund marked as completed');

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-ink mb-1">Returns &amp; Refunds</h1>
      <p className="text-ink/50 text-sm mb-6">
        {returns.length} requests. A customer's wallet only receives money when you process the refund here.
      </p>

      <div className="space-y-4">
        {returns.map((r) => {
          const cash = r.order?.totalAmount || 0;
          const walletPortion = r.order?.walletUsed || 0;
          const busy = busyId === r._id;
          return (
            <div key={r._id} className="bg-white rounded-3xl p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <p className="font-display font-semibold text-ink">
                    {r.type === 'cancellation' ? 'Cancelled order' : 'Return'} · Order #{r.order?.orderNumber}
                  </p>
                  <p className="text-xs text-ink/50">{r.user?.name} · {r.user?.email}{r.user?.phone ? ` · ${r.user.phone}` : ''}</p>
                </div>
                <StatusPill status={r.status} />
              </div>

              <p className="text-sm text-ink/60"><span className="font-semibold">Reason:</span> {r.reason}</p>
              {r.description && r.type !== 'cancellation' && <p className="text-sm text-ink/50 mt-1">{r.description}</p>}
              <p className="text-xs text-ink/40 mt-2">
                Requested {new Date(r.requestedAt).toLocaleDateString()} · Customer paid ₹{cash} via UPI
                {walletPortion > 0 ? ` + ₹${walletPortion} from wallet` : ''}
              </p>

              {r.status === 'Requested' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-ink/5">
                  <button disabled={busy} onClick={() => decide(r._id, 'Approved')} className="btn-sticker bg-mehendi text-white px-4 py-2 text-xs disabled:opacity-60">Approve Return</button>
                  <button disabled={busy} onClick={() => decide(r._id, 'Rejected')} className="btn-sticker bg-ink/10 text-ink px-4 py-2 text-xs disabled:opacity-60">Reject</button>
                </div>
              )}

              {r.status === 'Approved' && (
                <div className="mt-3 pt-3 border-t border-ink/5">
                  <p className="text-xs font-semibold text-ink/60 mb-2">
                    Refund due: ₹{cash + walletPortion}. Choose how to refund it:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button disabled={busy} onClick={() => processRefund(r, 'wallet')} className="btn-sticker bg-rani text-white px-4 py-2 text-xs disabled:opacity-60">
                      Refund to Wallet (₹{cash + walletPortion})
                    </button>
                    {cash > 0 && (
                      <button disabled={busy} onClick={() => processRefund(r, 'original_payment')} className="btn-sticker bg-blush text-ink px-4 py-2 text-xs disabled:opacity-60">
                        Refund via UPI / Original Payment (₹{cash})
                      </button>
                    )}
                  </div>
                </div>
              )}

              {r.status === 'Refund Initiated' && (
                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-ink/5 items-center">
                  <p className="text-xs text-ink/50">
                    Send ₹{r.refundAmount} back to the customer yourself, then confirm it here.
                    {r.walletCredited > 0 ? ` (₹${r.walletCredited} already went back to their wallet.)` : ''}
                  </p>
                  <button disabled={busy} onClick={() => markCompleted(r._id)} className="btn-sticker bg-rani text-white px-4 py-2 text-xs disabled:opacity-60">Mark Refund Completed</button>
                </div>
              )}

              {r.status === 'Refund Completed' && (
                <p className="text-xs text-mehendi font-semibold mt-3 pt-3 border-t border-ink/5">
                  ✅ Refund completed:{' '}
                  {r.refundMethod === 'wallet'
                    ? `₹${r.walletCredited} added to the customer's wallet`
                    : `₹${r.refundAmount} sent via original payment${r.walletCredited > 0 ? `, ₹${r.walletCredited} returned to wallet` : ''}`}
                </p>
              )}
            </div>
          );
        })}
        {returns.length === 0 && <p className="text-center py-16 text-ink/40 text-sm bg-white rounded-3xl shadow-soft">No return or refund requests yet.</p>}
      </div>
    </div>
  );
};

export default Returns;
