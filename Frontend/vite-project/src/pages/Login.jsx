import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, HeartHandshake } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const toastId = toast.loading('Credentials check ho rahe hain...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      if (token && user) {
        toast.success(`Khush Aamdeed, ${user.name.split(' ')[0]}! 🎉`, {
          id: toastId,
          style: { fontWeight: 700, borderRadius: '12px' },
        });
        login(user, token);
        setTimeout(() => {
          navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }, 1000);
      } else {
        throw new Error('Invalid server response. Please try again.');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Login failed. Email ya password check karein.';
      setError(errorMsg);
      toast.error(errorMsg, {
        id: toastId,
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    toast.loading('Google ki taraf redirect ho raha hai...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background blobs */}
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
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30 shadow-lg">
              <HeartHandshake size={30} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Khush Aamdeed</h2>
            <p className="text-emerald-100 mt-1 font-medium">ZakatCare Portal mein sign in karein</p>
          </motion.div>
        </div>

        <div className="p-8">
          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3.5 rounded-xl mb-5 text-sm font-semibold flex items-center gap-2"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            type="button"
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold shadow-sm hover:border-gray-300 transition-all flex items-center justify-center space-x-3 mb-6 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google se Continue Karein</span>
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 font-semibold uppercase tracking-widest">
                ya email se karein
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all"
                >
                  Bhool gaye?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-2 btn-glow"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In Karein</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm font-medium">
            Account nahi hai?{' '}
            <Link
              to="/register"
              className="text-emerald-600 font-black hover:text-emerald-700 hover:underline underline-offset-4 transition-all"
            >
              Register Karein
            </Link>
          </p>
        </div>

        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
      </motion.div>
    </div>
  );
};

export default Login;
