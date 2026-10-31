import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { Shield, ArrowLeft, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import axios from 'axios';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!email) {
      toast.error('Email required. Redirect ho raha hai...', {
        style: { fontWeight: 600, borderRadius: '12px' },
      });
      setTimeout(() => navigate('/forgot-password'), 2000);
    } else {
      // Focus first input on mount
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...pastedData.split(''), ...Array(6).fill('')].slice(0, 6);
    setOtp(newOtp);
    const lastIdx = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIdx]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Poora 6-digit OTP enter karein');
      return;
    }
    setError('');
    setLoading(true);
    const toastId = toast.loading('OTP verify ho raha hai...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });

    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp: otpString });
      toast.success('OTP verify ho gaya! ✓', {
        id: toastId,
        style: { fontWeight: 700, borderRadius: '12px' },
      });
      setTimeout(() => navigate('/reset-password', { state: { email, otp: otpString } }), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid OTP';
      setError(errorMsg);
      toast.error(errorMsg, {
        id: toastId,
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    const toastId = toast.loading('OTP dobara bheja ja raha hai...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      toast.success('Naya OTP aapki email par bheja gaya!', {
        id: toastId,
        style: { fontWeight: 700, borderRadius: '12px' },
      });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('OTP resend nahi ho saka', {
        id: toastId,
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

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
              <Shield size={30} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">OTP Enter Karein</h2>
            <p className="text-emerald-100 mt-1 font-medium text-sm">
              Code bheja gaya: <span className="font-black">{email}</span>
            </p>
          </motion.div>
        </div>

        {/* Body */}
        <div className="p-8">
          <Link
            to="/forgot-password"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP boxes */}
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 text-center">
                6-Digit Verification Code
              </p>
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 outline-none transition-all ${
                      digit
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-gray-50 text-gray-800'
                    } focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10`}
                  />
                ))}
              </div>
            </div>

            {/* Resend */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2 font-medium">Code nahi mila?</p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="inline-flex items-center gap-2 text-emerald-600 font-black hover:text-emerald-700 underline-offset-4 hover:underline transition-all disabled:opacity-50 text-sm"
              >
                <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Bheja ja raha hai...' : 'OTP Dobara Bhejein'}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>OTP Verify Karein</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
