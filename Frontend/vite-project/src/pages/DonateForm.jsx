import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { donationAPI, campaignAPI } from '../services/api';
import { generateReceipt } from '../utils/pdfGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  Heart,
  CreditCard,
  Coins,
  LayoutList,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

const DonateForm = () => {
  const { campaignId } = useParams();
  const { user, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'Zakat',
    category: 'General',
    paymentMethod: 'Cash',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (campaignId && campaignId !== 'general') fetchCampaign();
  }, [campaignId, user, authLoading, navigate]);

  const fetchCampaign = async () => {
    try {
      const response = await campaignAPI.getById(campaignId);
      setCampaign(response.data);
    } catch {
      toast.error('Campaign details load nahi ho sake', {
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const setQuickAmount = (amount) => setFormData({ ...formData, amount: String(amount) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Donation process ho rahi hai...', {
      style: { fontWeight: 600, borderRadius: '12px' },
    });

    try {
      const donationData = {
        ...formData,
        amount: parseFloat(formData.amount),
        campaignId: (campaignId && campaignId !== 'general') ? campaignId : null,
      };

      const response = await donationAPI.create(donationData);
      generateReceipt(response.data, user.name);

      toast.success('Alhamdulillah! Donation successful ho gayi 🎉', {
        id: toastId,
        style: { fontWeight: 700, borderRadius: '12px' },
      });
      setSuccess(true);

      setTimeout(() => navigate('/dashboard'), 2800);
    } catch (error) {
      const msg = error.response?.data?.message || 'Donation fail ho gayi';
      toast.error(msg, {
        id: toastId,
        style: { fontWeight: 600, borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
        <p className="text-emerald-800 font-medium">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-emerald-100"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="text-emerald-600" size={52} />
          </motion.div>
          <h2 className="text-4xl font-black text-gray-800 mb-2">JazakAllah!</h2>
          <p className="text-emerald-600 font-bold mb-3 text-lg">Donation Successful ✓</p>
          <p className="text-gray-400 text-sm font-medium">
            Aapki receipt automatically download ho gayi. Dashboard ki taraf ja rahe hain...
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'linear' }}
            className="h-1 bg-emerald-500 rounded-full mt-6"
          />
        </motion.div>
      </div>
    );
  }

  const selectClass =
    'w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer font-medium text-gray-800 transition-all';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-4">
      <Toaster position="top-center" />

      <div className="max-w-xl mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-700 font-bold mb-6 hover:text-emerald-800 transition-all group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Wapas Jayein
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-emerald-50"
        >
          {/* Header */}
          <div className="p-8 text-center text-white relative overflow-hidden" style={{ background: '#047857' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute top-4 right-6 opacity-10"
            >
              <Heart size={70} fill="white" />
            </motion.div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                <Heart size={28} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black mb-1">Donation Karein</h2>
              <p className="text-emerald-100 font-medium opacity-90">Aapka sadqa kisi ki zindagi badal sakta hai</p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* Campaign banner */}
            <AnimatePresence>
              {campaign && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mb-6 flex items-center gap-4"
                >
                  <div className="bg-emerald-600 p-3 rounded-xl text-white flex-shrink-0">
                    <Coins size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      Campaign ke liye donate:
                    </p>
                    <p className="text-base font-black text-emerald-900">{campaign.title}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Quick Amount Presets */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 block mb-3">
                  Quick Amount (PKR)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {QUICK_AMOUNTS.map((amt) => (
                    <motion.button
                      key={amt}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setQuickAmount(amt)}
                      className={`py-2.5 rounded-xl text-sm font-black border-2 transition-all ${
                        formData.amount === String(amt)
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                    >
                      {amt >= 1000 ? `${amt / 1000}K` : amt}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                  Custom Amount (PKR)
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-600 text-sm">
                    PKR
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full pl-16 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xl font-black text-gray-800"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                    Donation Type
                  </label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={17} />
                    <select name="type" value={formData.type} onChange={handleChange} className={selectClass}>
                      <option value="Zakat">Zakat</option>
                      <option value="Sadqah">Sadqah</option>
                      <option value="Fitra">Fitra</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                    Category
                  </label>
                  <div className="relative">
                    <LayoutList className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={17} />
                    <select name="category" value={formData.category} onChange={handleChange} className={selectClass}>
                      <option value="Food">Food</option>
                      <option value="Education">Education</option>
                      <option value="Medical">Medical</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                  Payment Method
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={17} />
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={selectClass}>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Online">Online Payment</option>
                  </select>
                </div>
              </div>

              {/* Amount Preview */}
              {formData.amount && parseFloat(formData.amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between"
                >
                  <span className="text-emerald-700 font-semibold text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    Aapki contribution:
                  </span>
                  <span className="text-emerald-800 font-black text-xl">
                    PKR {parseFloat(formData.amount).toLocaleString()}
                  </span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-2 btn-glow"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Donation Complete Karein</span>
                    <Heart size={20} fill="currentColor" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-emerald-700/50 text-xs mt-8 font-bold tracking-widest uppercase"
        >
          Allah aapki nek niyati ko qubool farmaye — Ameen
        </motion.p>
      </div>
    </div>
  );
};

export default DonateForm;
