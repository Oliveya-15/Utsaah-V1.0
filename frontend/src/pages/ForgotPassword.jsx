import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      // Backend always responds the same way whether or not the email is
      // registered (so this page can't be used to check who has an account)
      // — we just show the confirmation state either way.
      setSent(true);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-blush">
      <Helmet><title>Forgot Password — Utsaah</title></Helmet>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8 sm:p-10">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto mb-4">
              <MailCheck size={28} className="text-rani" />
            </div>
            <h1 className="font-display font-bold text-2xl text-ink mb-2">Check your email</h1>
            <p className="text-ink/50 text-sm mb-8">
              If an account exists for <span className="font-semibold text-ink">{email}</span>, we've sent a link to reset your password.
              It expires in 30 minutes.
            </p>
            <Link to="/login" className="btn-sticker bg-rani text-white w-full py-3.5 hover:bg-rani-dark inline-flex items-center justify-center">
              Back to Login
            </Link>
            <button onClick={() => setSent(false)} className="block mx-auto mt-4 text-sm font-semibold text-ink/40 hover:text-rani">
              Try a different email
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <img src="/favicon.png" alt="Utsaah" className="h-12 w-auto mx-auto" />
              <h1 className="font-display font-bold text-2xl text-ink mt-2">Forgot your password?</h1>
              <p className="text-ink/50 text-sm mt-1">No worries — enter your email and we'll send you a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="email" required placeholder="Email address"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-blush/60 rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40"
                />
              </div>
              <button disabled={loading} className="btn-sticker bg-rani text-white w-full py-3.5 hover:bg-rani-dark disabled:opacity-60">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-ink/50 hover:text-rani mt-6">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;