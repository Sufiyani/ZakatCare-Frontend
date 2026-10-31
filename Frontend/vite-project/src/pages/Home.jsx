import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Heart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
  HandHeart,
  BookOpen,
  Stethoscope,
  Home as HomeIcon,
  Quote,
} from 'lucide-react';

/* ── Animated counter hook ─────────────────────────────── */
function useAnimatedCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ── Stat card ─────────────────────────────────────────── */
const StatCard = ({ label, value, suffix = '', icon: Icon, color }) => {
  const { count, ref } = useAnimatedCounter(value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-center"
    >
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-4 ${color}`}>
        <Icon size={26} />
      </div>
      <div className="text-3xl font-black text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-emerald-100 text-sm font-semibold">{label}</p>
    </motion.div>
  );
};

/* ── Main Component ────────────────────────────────────── */
const Home = () => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: Heart,
      title: 'Zakat, Sadqah & Fitra',
      desc: 'Give your obligatory and voluntary charity through our verified platform — Zakat, Sadqah, Fitra, aur General donations.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      icon: ShieldCheck,
      title: 'Mukammal Transparency',
      desc: 'Har donation ka PDF receipt turant milta hai. Admin verification system se aapka paisa sahi jagah jaata hai.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      icon: Zap,
      title: 'Campaign Support',
      desc: 'Hamare specific campaigns mein contribute karein — Flood Relief, Education Fund, Medical Aid aur boht kuch.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  const categories = [
    { icon: BookOpen, label: 'Education Fund', amount: 'PKR 2.5M+', color: 'from-blue-500 to-blue-600' },
    { icon: Stethoscope, label: 'Medical Aid', amount: 'PKR 1.8M+', color: 'from-red-500 to-red-600' },
    { icon: HomeIcon, label: 'Shelter Program', amount: 'PKR 3.2M+', color: 'from-amber-500 to-amber-600' },
    { icon: HandHeart, label: 'Food Relief', amount: 'PKR 4.1M+', color: 'from-emerald-500 to-emerald-600' },
  ];

  const checklistItems = [
    'Instant PDF receipt download karta hai',
    'Secure authentication & data protection',
    'Admin verification system',
    'Multiple payment methods support karta hai',
    'Real-time campaign tracking',
    'Automated Zakat calculation',
    'Donation history dashboard',
    'Google login support',
  ];

  const testimonials = [
    {
      name: 'Ahmed Siddiqui',
      city: 'Karachi',
      text: 'ZakatCare platform boht easy hai. Mera Zakat process 5 minutes mein complete ho gaya aur PDF receipt bhi turant mili.',
      stars: 5,
    },
    {
      name: 'Fatima Zahra',
      city: 'Lahore',
      text: 'Pehle mujhe pata nahi hota tha ke Zakat calculate kaise karte hain. Yahan ka calculator boht helpful hai.',
      stars: 5,
    },
    {
      name: 'Muhammad Usman',
      city: 'Islamabad',
      text: 'Campaigns section dekh ke pata chalta hai ke humara donation exactly kahan ja raha hai. Full transparency hai.',
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] overflow-x-hidden">

      {/* ── Hero Section ──────────────────────────────────── */}
      <div
        className="relative py-20 sm:py-28 md:py-36 overflow-hidden hero-pattern"
        style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #064e3b 100%)' }}
      >

        {/* Floating blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-bold tracking-wider text-emerald-100 uppercase bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              ZakatCare — Trusted Online Donation Portal
            </motion.span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
              <span className="block">Zakat</span>
              <span className="text-amber-400">Care</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-100 mt-2">
                Donation Management System
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl mb-10 sm:mb-12 text-emerald-100 max-w-2xl mx-auto leading-relaxed opacity-90 px-2">
              Apni Zakat, Sadqah, aur Fitra securely submit karein. Har contribution ka transparent record
              aur instant PDF receipt milta hai — <span className="text-emerald-300 font-bold">ZakatCare ke saath.</span>
            </p>

            <div className="flex flex-col xs:flex-row sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4">
              {user ? (
                <>
                  <Link
                    to="/campaigns"
                    className="group btn-glow bg-white text-emerald-700 px-8 sm:px-10 py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 w-full sm:w-auto justify-center"
                  >
                    Campaigns Dekhein
                    <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
                  </Link>
                  <Link
                    to="/donate/general"
                    className="btn-glow glass border-2 border-white/30 text-white px-8 sm:px-10 py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all shadow-lg flex items-center gap-3 w-full sm:w-auto justify-center"
                  >
                    <Heart size={20} className="text-red-400" />
                    Abhi Donate Karein
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group btn-glow bg-white text-emerald-700 px-8 sm:px-10 py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 w-full sm:w-auto justify-center"
                  >
                    Shuru Karein
                    <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-glow glass border-2 border-white/30 text-white px-8 sm:px-10 py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all shadow-lg w-full sm:w-auto text-center"
                  >
                    Sign In Karein
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-14 sm:mt-20 max-w-4xl mx-auto px-2"
          >
            <StatCard label="Active Donors" value={500} suffix="+" icon={Users} color="text-white" />
            <StatCard label="Campaigns Completed" value={48} suffix="+" icon={CheckCircle2} color="text-white" />
            <StatCard label="Total Raised (Lakh PKR)" value={150} suffix="L+" icon={HandHeart} color="text-white" />
            <StatCard label="Cities Covered" value={12} suffix="+" icon={HomeIcon} color="text-white" />
          </motion.div>
        </div>
      </div>

      {/* ── Feature Cards ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white p-8 rounded-[2rem] shadow-xl border ${f.border} group cursor-default`}
            >
              <div className={`${f.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={f.color} size={30} />
              </div>
              <h3 className="text-xl font-black mb-3 text-gray-800">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Impact Categories ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Hamari Khidmat</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mt-2 mb-4">Aapka Paisa Kahan Jaata Hai</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-[2rem] group cursor-default"
            >
              <div className={`bg-gradient-to-br ${cat.color} p-8 text-white`}>
                <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <cat.icon size={26} />
                </div>
                <h3 className="text-lg font-black mb-1">{cat.label}</h3>
                <p className="text-white/80 text-sm font-semibold">Distributed</p>
                <p className="text-2xl font-black mt-2">{cat.amount}</p>
                {/* shine effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Why Choose ZakatCare ───────────────────────── */}
      <div
        className="py-24 relative overflow-hidden hero-pattern"
        style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #064e3b 100%)' }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-emerald-300 font-bold text-sm uppercase tracking-widest">Kyun Chunein</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">ZakatCare Platform Ko</h2>
            <p className="text-emerald-100 max-w-xl mx-auto">
              Pakistan ka ek trusted welfare network — jahan har rupaya counted aur transparent hai.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl group hover:bg-white/20 transition-all"
              >
                <div className="bg-emerald-400/20 p-2 rounded-xl group-hover:bg-emerald-400/30 transition-all flex-shrink-0">
                  <CheckCircle2 size={20} className="text-emerald-300" />
                </div>
                <span className="text-white font-semibold">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-white text-emerald-700 px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-2xl"
              >
                <Heart size={20} fill="currentColor" className="text-red-500" />
                Abhi Register Karein — Bilkul Free
                <ArrowRight size={20} />
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Testimonials ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Donor Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mt-2 mb-4">Donors Kya Kehte Hain</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl border border-emerald-50 relative"
            >
              <Quote size={36} className="text-emerald-100 mb-4" />
              <p className="text-gray-600 leading-relaxed mb-6 font-medium text-sm">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-gray-800">{t.name}</p>
                  <p className="text-emerald-600 text-sm font-semibold">{t.city}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              {/* Accent bar */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #064e3b 100%)' }}
        >
          <div className="absolute inset-0 hero-pattern" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              "Kharch Karo Allah Ki Raah Mein"
            </h2>
            <p className="text-emerald-100 mb-8 text-base sm:text-lg max-w-xl mx-auto">
              Aaj hi apni Zakat ada karein aur zaroormandon ki madad karein. ZakatCare Trust ke saath.
            </p>
            {user ? (
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-3 bg-white text-emerald-700 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl"
              >
                Campaigns Dekhein <ArrowRight size={20} />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-white text-emerald-700 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl"
              >
                Abhi Join Karein <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{ background: '#022c22' }} className="text-center py-10">
        <p className="text-emerald-400 font-black text-sm uppercase tracking-widest mb-2">
          ZakatCare — Donation Management System
        </p>
        <p className="text-emerald-600 text-xs">
          © 2026 ZakatCare Foundation • Karachi, Pakistan • info@zakatcare.org
        </p>
        <p className="text-emerald-500 text-xs mt-2 italic">
          "The best of people are those that bring most benefit to the rest of mankind." — Prophet Muhammad ﷺ
        </p>
      </footer>
    </div>
  );
};

export default Home;
