import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { User, Mail, Phone, Lock, UserPlus, Loader2, Eye, EyeOff, HeartHandshake } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords match nahi ho rahe';
      setError(msg);
      toast.error(msg, { style: { fontWeight: 600, borderRadius: '12px' } });
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Account ban raha hai...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authAPI.register(registerData);
      const { token, ...userData } = response.data;

      toast.success('Account successfully ban gaya! 🎉', {
        id: toastId,
        style: { fontWeight: 700, borderRadius: '12px' },
      });

      login(userData, token);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration fail ho gayi';
      setError(errorMsg);
      toast.error(errorMsg, {
        id: toastId,
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/60 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-emerald-100 relative z-10"
      >
        {/* Header */}
        <div className="p-8 text-center text-white relative overflow-hidden" style={{ background: '#047857' }}>
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl" />

          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30 shadow-lg">
              <HeartHandshake size={30} />
            </div>
            <h2 className="text-3xl font-black">Account Banayein</h2>
            <p className="text-emerald-100 mt-1 font-medium">ZakatCare family mein shamil ho jayein</p>
          </motion.div>
        </div>

        <div className="p-8">
          {/* Error */}
          <AnimatePresence>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Poora Naam</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Muhammad Ali"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-2 btn-glow"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Account Banayein</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm font-medium">
            Pehle se account hai?{' '}
            <Link
              to="/login"
              className="text-emerald-600 font-black hover:text-emerald-700 hover:underline underline-offset-4 transition-all"
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

export default Register;
