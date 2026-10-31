import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { donationAPI } from '../services/api';
import { generateReceipt } from '../utils/pdfGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  Wallet,
  History,
  Download,
  CheckCircle,
  Clock,
  TrendingUp,
  Loader2,
  Calculator,
  ChevronDown,
  ChevronUp,
  Info,
  Heart,
  Plus,
} from 'lucide-react';

/* ── Nisab Calculator ──────────────────────────────────── */

const SILVER_NISAB_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;

const ZakatCalculator = ({ onDonateNow }) => {
  const [silverRate, setSilverRate] = useState('');
  const [cash, setCash] = useState('');
  const [gold, setGold] = useState('');
  const [goldRate, setGoldRate] = useState('');
  const [businessGoods, setBusinessGoods] = useState('');
  const [receivables, setReceivables] = useState('');
  const [result, setResult] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const calculate = () => {
    const silver = parseFloat(silverRate) || 0;
    const nisabAmount = silver * SILVER_NISAB_GRAMS;
    const cashVal = parseFloat(cash) || 0;
    const goldVal = (parseFloat(gold) || 0) * (parseFloat(goldRate) || 0);
    const businessVal = parseFloat(businessGoods) || 0;
    const receivablesVal = parseFloat(receivables) || 0;
    const totalWealth = cashVal + goldVal + businessVal + receivablesVal;
    const zakatDue = totalWealth >= nisabAmount ? totalWealth * ZAKAT_RATE : 0;
    setResult({ totalWealth, nisabAmount, zakatDue, eligible: totalWealth >= nisabAmount });
  };

  const reset = () => {
    setSilverRate(''); setCash(''); setGold('');
    setGoldRate(''); setBusinessGoods(''); setReceivables('');
    setResult(null);
  };

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-500 transition-all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden mt-10"
    >
      <div className="px-6 sm:px-8 py-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-3">
          <div className="bg-emerald-100 p-2.5 rounded-xl">
            <Calculator className="text-emerald-600" size={22} />
          </div>
          Zakat Calculator
        </h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-1.5 text-sm text-emerald-600 font-bold hover:text-emerald-800 transition-colors"
        >
          <Info size={15} />
          {showInfo ? 'Chupa Dein' : 'Kaise Kaam Karta Hai'}
          {showInfo ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-8 py-4 bg-emerald-50 text-sm text-emerald-800 border-b border-emerald-100">
              <p className="font-black mb-1">Nisab ka Hisab:</p>
              <p>Nisab = Silver rate (PKR/gram) × 612.36 grams</p>
              <p className="mt-1">Agar aapki total daulat ≥ Nisab → Zakat = Total × 2.5%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 sm:px-8 py-8">
        <div className="mb-6">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
            Silver Rate (PKR per gram) *
          </label>
          <input type="number" value={silverRate} onChange={(e) => setSilverRate(e.target.value)}
            placeholder="e.g. 250" className={inputClass} />
          <p className="text-xs text-gray-400 mt-1.5">Aaj ka silver rate kisi jeweller se ya online check karein</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {[
            { label: 'Cash & Bank Balance (PKR)', value: cash, setter: setCash, placeholder: 'e.g. 500000' },
            { label: 'Sone ka Wazn (grams)', value: gold, setter: setGold, placeholder: 'e.g. 10' },
            { label: 'Sone ka Rate (PKR per gram)', value: goldRate, setter: setGoldRate, placeholder: 'e.g. 22000' },
            { label: 'Business Goods ki Qeemat (PKR)', value: businessGoods, setter: setBusinessGoods, placeholder: 'e.g. 100000' },
            { label: 'Baaki Milna Wala Qarz (PKR)', value: receivables, setter: setReceivables, placeholder: 'e.g. 50000' },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                {field.label}
              </label>
              <input type="number" value={field.value} onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder} className={inputClass} />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={calculate}
            disabled={!silverRate}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
          >
            <Calculator size={18} /> Zakat Calculate Karein
          </motion.button>
          <button onClick={reset}
            className="px-5 py-3.5 border border-gray-200 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all">
            Reset
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`rounded-2xl p-6 ${result.eligible ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {[
                  { label: 'Total Daulat', value: `PKR ${result.totalWealth.toLocaleString()}`, color: 'text-gray-800' },
                  { label: 'Nisab Threshold', value: `PKR ${Math.round(result.nisabAmount).toLocaleString()}`, color: 'text-gray-800' },
                  { label: 'Zakat Wajib', value: `PKR ${Math.round(result.zakatDue).toLocaleString()}`, color: result.eligible ? 'text-emerald-700' : 'text-amber-700' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {result.eligible ? (
                <>
                  <p className="text-emerald-700 font-bold text-sm mb-4">
                    ✅ Aap par Zakat farz hai. Aapki calculated Zakat: PKR {Math.round(result.zakatDue).toLocaleString()}
                  </p>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onDonateNow && onDonateNow(Math.round(result.zakatDue))}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100"
                  >
                    <Heart size={18} fill="currentColor" />
                    PKR {Math.round(result.zakatDue).toLocaleString()} Abhi Donate Karein
                  </motion.button>
                </>
              ) : (
                <p className="text-amber-700 font-bold text-sm">
                  ℹ️ Aapki daulat Nisab se kam hai. Abhi Zakat farz nahi hai.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ── Main UserDashboard ─────────────────────────────────── */

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationAPI.getUserDonations();
      setDonations(response.data);
      const total = response.data.reduce((sum, d) => sum + d.amount, 0);
      setStats({ total, count: response.data.length });
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Donations load nahi ho sake', { style: { borderRadius: '12px' } });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (donation) => {
    generateReceipt(donation, user.name);
    toast.success('Receipt download ho rahi hai...', { style: { fontWeight: 600, borderRadius: '12px' } });
  };

  const handleDonateNow = (amount) => {
    navigate('/campaigns', { state: { zakatAmount: amount } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="text-emerald-600" size={52} />
        </motion.div>
        <p className="text-emerald-800 font-bold mt-4 italic">Aapka portal prepare ho raha hai...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Donations', value: stats.count, icon: History, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Total Amount', value: `PKR ${stats.total.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Account Status', value: 'Active ✓', icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-1">
              Assalam-o-Alaikum 👋
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              {user?.name?.split(' ')[0] || 'Bhai'} ka{' '}
              <span className="text-emerald-600">Dashboard</span>
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/campaigns')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
          >
            <Plus size={18} />
            New Donation
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`bg-white rounded-3xl p-6 shadow-sm border ${stat.border} flex items-center space-x-5 hover:shadow-lg transition-all`}
            >
              <div className={`${stat.bg} p-4 rounded-2xl flex-shrink-0`}>
                <stat.icon className={stat.color} size={28} />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">{stat.label}</h3>
                <p className={`text-2xl font-black ${stat.color === 'text-emerald-600' ? 'text-emerald-700' : 'text-gray-800'}`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Donation History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50"
        >
          <div className="px-6 sm:px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-3">
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <TrendingUp className="text-emerald-600" size={20} />
              </div>
              Donation History
            </h2>
            {donations.length > 0 && (
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {donations.length} transactions
              </span>
            )}
          </div>

          {donations.length === 0 ? (
            <div className="p-10 sm:p-20 text-center">
              <div className="bg-emerald-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-5">
                <History className="text-emerald-300" size={40} />
              </div>
              <p className="text-gray-800 font-black text-lg sm:text-xl mb-2">Abhi koi donation nahi</p>
              <p className="text-gray-400 font-medium mb-6">Campaigns mein contribute karein aur farq dalein!</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/campaigns')}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-emerald-200"
              >
                <Heart size={16} fill="currentColor" />
                Pehli Donation Karein
              </motion.button>
            </div>
          ) : (
            <>
              {/* Mobile card view */}
              <div className="block sm:hidden divide-y divide-gray-50">
                {donations.map((donation, idx) => (
                  <motion.div
                    key={donation._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="p-4 hover:bg-emerald-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-black text-emerald-700 text-base">PKR {donation.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">#{donation.transactionId}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                        donation.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {donation.status === 'Verified' ? <CheckCircle size={11} /> : <Clock size={11} />}
                        {donation.status === 'Verified' ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{donation.type}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(donation.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownloadReceipt(donation)}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                        title="PDF Receipt Download Karein"
                      >
                        <Download size={15} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Desktop table view */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                      <th className="px-6 lg:px-8 py-5 text-left">Date</th>
                      <th className="px-6 lg:px-8 py-5 text-left">Transaction ID</th>
                      <th className="px-6 lg:px-8 py-5 text-left">Type</th>
                      <th className="px-6 lg:px-8 py-5 text-left">Amount</th>
                      <th className="px-6 lg:px-8 py-5 text-left">Status</th>
                      <th className="px-6 lg:px-8 py-5 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {donations.map((donation, idx) => (
                      <motion.tr
                        key={donation._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        className="hover:bg-emerald-50/30 transition-colors group"
                      >
                        <td className="px-6 lg:px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-700">
                          {new Date(donation.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 lg:px-8 py-5 whitespace-nowrap text-sm text-gray-400 font-mono">
                          #{donation.transactionId}
                        </td>
                        <td className="px-6 lg:px-8 py-5 whitespace-nowrap">
                          <span className="text-xs font-black text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
                            {donation.type}
                          </span>
                        </td>
                        <td className="px-6 lg:px-8 py-5 whitespace-nowrap text-sm font-black text-emerald-700">
                          PKR {donation.amount.toLocaleString()}
                        </td>
                        <td className="px-6 lg:px-8 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                            donation.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                          }`}>
                            {donation.status === 'Verified' ? <CheckCircle size={13} /> : <Clock size={13} />}
                            {donation.status === 'Verified' ? 'Verified ✓' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 lg:px-8 py-5 whitespace-nowrap text-right">
                          <motion.button
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownloadReceipt(donation)}
                            className="p-2.5 bg-white border border-gray-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                            title="PDF Receipt Download Karein"
                          >
                            <Download size={17} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>

        {/* Zakat Calculator */}
        <ZakatCalculator onDonateNow={handleDonateNow} />

      </div>
    </div>
  );
};

export default UserDashboard;
