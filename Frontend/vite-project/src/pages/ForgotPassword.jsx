import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const toastId = toast.loading('OTP bheja ja raha hai...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      toast.success(response.data.message, {
        id: toastId,
        style: { fontWeight: 700, borderRadius: '12px' },
      });
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'OTP send nahi ho saka';
      setError(errorMsg);
      toast.error(errorMsg, {
        id: toastId,
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl" />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
              <Mail size={30} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Password Bhool Gaye?</h2>
            <p className="text-emerald-100 mt-1 font-medium">OTP receive karne ke liye email daalen</p>
          </motion.div>
        </div>

        {/* Body */}
        <div className="p-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Login par Wapas Jayein</span>
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

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl mb-6">
            <p className="text-emerald-800 text-sm leading-relaxed font-medium">
              Aapka registered email enter karein. Hum aapko ek One-Time Password (OTP) bhejenge jisse aap apna password reset kar sakein.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={18} />
                  <span>OTP Bhejein</span>
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

export default ForgotPassword;
