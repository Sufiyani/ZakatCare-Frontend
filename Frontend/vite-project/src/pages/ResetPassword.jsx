import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!email || !otp) {
      toast.error('Invalid access. Redirect ho raha hai...', {
        style: { fontWeight: 600, borderRadius: '12px' },
      });
      setTimeout(() => navigate('/forgot-password'), 2000);
    }
  }, [email, otp, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validatePassword = () => {
    if (formData.newPassword.length < 6) {
      setError('Password kam az kam 6 characters ka hona chahiye');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords match nahi ho rahe');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validatePassword()) return;

    setLoading(true);
    const toastId = toast.loading('Password reset ho raha hai...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword: formData.newPassword,
      });
      toast.success('Password reset ho gaya! ✓', {
        id: toastId,
        style: { fontWeight: 700, borderRadius: '12px' },
      });
      setFormData({ newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate('/login', {
        state: { message: 'Password reset successful. Naye password se login karein.' },
      }), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Password reset nahi ho saka. Dobara try karein.';
      setError(errorMsg);
      toast.error(errorMsg, {
        id: toastId,
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/60 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-emerald-100 relative z-10"
      >
        {/* Header */}
        <div className="p-8 text-center text-white relative overflow-hidden" style={{ background: '#047857' }}>
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
              <Lock size={30} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Password Reset Karein</h2>
            <p className="text-emerald-100 mt-1 font-medium">Apne account ke liye naya password banayein</p>
          </motion.div>
        </div>

        {/* Body */}
        <div className="p-8">
          <Link
            to="/verify-otp"
            state={{ email }}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Wapas Jayein</span>
          </Link>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3.5 rounded-xl mb-5 text-sm font-semibold"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                Naya Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300"
                  placeholder="Naya password daalen"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 ml-1">Kam az kam 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                Password Confirm Karein
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300"
                  placeholder="Password dobara daalen"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Reset ho raha hai...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Password Reset Karein</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm font-medium">
            Password yaad aa gaya?{' '}
            <Link
              to="/login"
              className="text-emerald-600 font-black hover:text-emerald-700 underline-offset-4 hover:underline transition-all"
            >
              Sign in karein
            </Link>
          </p>
        </div>

        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
      </motion.div>
    </div>
  );
};

export default ResetPassword;
