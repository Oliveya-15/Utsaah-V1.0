import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ResetPassword = () => {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      showToast('Password reset! You\'re now logged in 🌸', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      // Most likely cause: the link is invalid/expired/already used.
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-blush">
      <Helmet><title>Reset Password — Utsaah</title></Helmet>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8 sm:p-10">
        <div className="text-center mb-8">
          <img src="/favicon.png" alt="Utsaah" className="h-12 w-auto mx-auto" />
          <h1 className="font-display font-bold text-2xl text-ink mt-2">Set a new password</h1>
          <p className="text-ink/50 text-sm mt-1">Choose a new password for your Utsaah account</p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 bg-rani/10 text-rani text-sm rounded-2xl px-4 py-3 mb-5">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type={showPassword ? 'text' : 'password'} required placeholder="New password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-blush/60 rounded-full pl-11 pr-11 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40">
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type={showPassword ? 'text' : 'password'} required placeholder="Confirm new password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-blush/60 rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-rani/40"
            />
          </div>
          <button disabled={loading} className="btn-sticker bg-rani text-white w-full py-3.5 hover:bg-rani-dark disabled:opacity-60">
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          Link expired? <Link to="/forgot-password" className="font-semibold text-rani hover:underline">Request a new one</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;