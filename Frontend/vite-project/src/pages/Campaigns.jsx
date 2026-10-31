import { useState, useEffect } from 'react';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Search, Loader2, LayoutGrid, X } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(campaigns);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        campaigns.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      );
    }
  }, [search, campaigns]);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignAPI.getAll();
      setCampaigns(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="text-emerald-600" size={52} />
        </motion.div>
        <p className="text-emerald-800 font-bold tracking-wider mt-4">
          Campaigns load ho rahe hain...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-2xl text-emerald-600 mb-5"
          >
            <Megaphone size={34} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Active <span className="text-emerald-600">Campaigns</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            ZakatCare ki verified campaigns mein contribute karein — food, education,
            medical aur shelter ke liye.
          </motion.p>
        </div>

        {/* ── Toolbar ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-black uppercase text-xs tracking-widest">
            <LayoutGrid size={16} />
            {filtered.length} Active Campaigns
            {search && (
              <span className="text-emerald-600 normal-case font-semibold text-xs">
                "{search}" ke natayij
              </span>
            )}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Campaign dhundhein..."
              className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm text-sm font-medium"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Campaign Grid ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-dashed border-emerald-200"
            >
              <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5">
                <Megaphone className="text-emerald-300" size={44} />
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">
                {search ? 'Koi campaign nahi mila' : 'Abhi koi active campaign nahi hai'}
              </h3>
              <p className="text-gray-400 font-medium">
                {search
                  ? 'Alag search try karein ya search clear karein'
                  : 'Thori der baad dobara check karein.'}
              </p>
              {search && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearch('')}
                  className="mt-6 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
                >
                  Search Clear Karein
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((campaign, index) => (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="h-full"
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Trust Badges ─────────────────────────────── */}
        <div className="mt-24 text-center border-t border-gray-100 pt-12">
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6">
            Hamara Wada
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {['100% Transparent', 'Verified Causes', 'Secure Giving', 'Instant Receipts'].map(
              (badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="font-black text-base text-gray-700 underline decoration-emerald-500 decoration-2 underline-offset-4"
                >
                  {badge}
                </motion.span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
