import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Menu,
  X,
  User,
  LayoutDashboard,
  Megaphone,
  HeartHandshake,
  ShieldCheck,
  ChevronDown,
  Heart,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = user
    ? [
        { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
        {
          name: isAdmin ? 'Admin Panel' : 'My Dashboard',
          path: isAdmin ? '/admin' : '/dashboard',
          icon: isAdmin ? ShieldCheck : LayoutDashboard,
        },
      ]
    : [
        { name: 'Login', path: '/login', icon: null },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'shadow-2xl shadow-emerald-900/30'
          : 'shadow-lg'
      }`}
      style={{ background: scrolled ? 'rgba(4, 78, 59, 0.97)' : '#047857' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white p-2.5 rounded-xl shadow-md"
            >
              <HeartHandshake className="text-emerald-700" size={22} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-white text-xl font-black tracking-tight uppercase">
                Zakat<span className="text-emerald-300">Care</span>
              </span>
              <span className="text-emerald-300/70 text-[10px] font-semibold tracking-widest uppercase">
                Donation Portal
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────── */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white/20 text-white'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.icon && <link.icon size={17} />}
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                  />
                )}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-3 ml-3 pl-3 border-l border-emerald-600/50">
                {/* User badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-800/60 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                  <div className="w-7 h-7 bg-emerald-400/30 rounded-full flex items-center justify-center">
                    <User size={14} className="text-emerald-200" />
                  </div>
                  <span className="text-white text-sm font-bold">
                    {user?.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#f0fdf4' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  <LogOut size={15} />
                  Logout
                </motion.button>
              </div>
            ) : (
              <Link
                to="/register"
                className="ml-3 inline-flex items-center gap-2 bg-emerald-400 text-emerald-900 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-white hover:text-emerald-700 transition-all shadow-lg"
              >
                <Heart size={15} fill="currentColor" />
                Register
              </Link>
            )}
          </div>

          {/* ── Mobile Menu Toggle ────────────────────────── */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2.5 rounded-xl bg-emerald-800/50 border border-emerald-600/40"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                    <X size={24} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                    <Menu size={24} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Mobile Dropdown ───────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
            style={{ background: '#065f46' }}
          >
            <div className="p-5 space-y-3">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 text-white text-base font-bold p-4 rounded-2xl transition-all ${
                      isActive(link.path) ? 'bg-white/20' : 'bg-emerald-700/50 hover:bg-emerald-700'
                    }`}
                  >
                    {link.icon && <link.icon size={20} />}
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-700/40 rounded-2xl">
                    <div className="w-8 h-8 bg-emerald-400/30 rounded-full flex items-center justify-center">
                      <User size={16} className="text-emerald-200" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{user?.name || 'User'}</p>
                      <p className="text-emerald-300 text-xs">{isAdmin ? 'Administrator' : 'Donor'}</p>
                    </div>
                  </div>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 bg-red-500/90 hover:bg-red-500 text-white p-4 rounded-2xl font-black text-base transition-all"
                  >
                    <LogOut size={20} /> Logout
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-emerald-400 text-emerald-900 p-4 rounded-2xl font-black text-base hover:bg-white transition-all"
                  >
                    <Heart size={18} fill="currentColor" />
                    Register Karein — Free
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
