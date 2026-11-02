import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { RotateCcw } from 'lucide-react';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';

const STATUS_COLORS = {
  Requested: 'bg-blush text-ink/70',
  Approved: 'bg-mint text-mehendi-dark',
  Rejected: 'bg-ink/10 text-ink/50',
  'Refund Initiated': 'bg-lavender text-indigo_ink',
  'Refund Completed': 'bg-mehendi/20 text-mehendi-dark',
};

// Plain-language explanation of where a refund currently stands.
const refundMessage = (r) => {
  const amount = (r.order?.totalAmount || 0) + (r.order?.walletUsed || 0);
  switch (r.status) {
    case 'Requested':
      return 'We are reviewing your return request.';
    case 'Rejected':
      return 'This request was not approved. Contact us if you have questions.';
    case 'Approved':
      return `Approved. Our team is processing your refund of ₹${amount}. It will show up here and in your wallet once it's done.`;
    case 'Refund Initiated':
      return `₹${r.refundAmount} is being sent back to your original payment method. We'll let you know once it's sent.${r.walletCredited > 0 ? ` ₹${r.walletCredited} was added to your wallet.` : ''}`;
    case 'Refund Completed':
      return r.refundMethod === 'wallet'
        ? `Refund complete: ₹${r.walletCredited} was added to your Utsaah Wallet. ✅`
        : `Refund complete: ₹${r.refundAmount} was sent to your original payment method.${r.walletCredited > 0 ? ` ₹${r.walletCredited} was added to your wallet.` : ''} ✅`;
    default:
      return '';
  }
};

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/returns/my').then((res) => { setReturns(res.data); setLoading(false); });
  }, []);

  if (loading) return <Loader />;

  if (returns.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-soft text-center">
        <RotateCcw size={40} className="mx-auto text-ink/20 mb-3" />
        <p className="font-display font-semibold text-lg text-ink mb-1">No returns or refunds</p>
        <p className="text-ink/50 text-sm">Return requests and refunds for cancelled orders will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Helmet><title>Returns & Refunds — Utsaah</title></Helmet>
      {returns.map((r) => (
        <div key={r._id} className="bg-white rounded-3xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <p className="font-display font-semibold text-ink text-sm">
              {r.type === 'cancellation' ? 'Cancelled order' : 'Return'} · Order #{r.order?.orderNumber}
            </p>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[r.status] || 'bg-blush'}`}>{r.status}</span>
          </div>
          <p className="text-sm text-ink/60">Reason: {r.reason}</p>
          {r.description && r.type !== 'cancellation' && <p className="text-sm text-ink/50 mt-1">{r.description}</p>}
          <p className="text-xs font-semibold text-mehendi mt-3 pt-3 border-t border-ink/5">{refundMessage(r)}</p>
        </div>
      ))}
    </div>
  );
};

export default Returns;
