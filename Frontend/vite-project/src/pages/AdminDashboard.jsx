import { useState, useEffect } from 'react';
import { donationAPI, campaignAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  LayoutDashboard,
  HandHeart,
  Megaphone,
  PlusCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Loader2,
  TrendingUp,
  AlertCircle,
  Shield,
  RefreshCw,
} from 'lucide-react';

const toastOpts = { style: { fontWeight: 600, borderRadius: '12px' } };

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    verifiedAmount: 0,
    pendingAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    deadline: '',
  });
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [donationsRes, campaignsRes, statsRes] = await Promise.all([
        donationAPI.getAllDonations(),
        campaignAPI.getAllAdmin(),
        donationAPI.getStats(),
      ]);
      setDonations(donationsRes.data || []);
      setCampaigns(campaignsRes.data || []);
      setStats(statsRes.data || { totalDonations: 0, totalAmount: 0, verifiedAmount: 0, pendingAmount: 0 });
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error('Data sync fail ho gaya.', toastOpts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    const toastId = toast.loading('Status update ho raha hai...', toastOpts);
    try {
      await donationAPI.updateStatus(donationId, newStatus);
      toast.success('Donation Verify ho gayi! ✓', { id: toastId, ...toastOpts });
      fetchData(true);
    } catch {
      toast.error('Update fail ho gayi', { id: toastId, ...toastOpts });
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Campaign save ho rahi hai...', toastOpts);
    try {
      if (editingCampaign) {
        await campaignAPI.update(editingCampaign._id, campaignForm);
        setEditingCampaign(null);
        toast.success('Campaign update ho gayi! ✓', { id: toastId, ...toastOpts });
      } else {
        await campaignAPI.create(campaignForm);
        toast.success('Campaign launch ho gayi! 🚀', { id: toastId, ...toastOpts });
      }
      setCampaignForm({ title: '', description: '', goalAmount: '', deadline: '' });
      fetchData(true);
    } catch {
      toast.error('Save fail ho gayi', { id: toastId, ...toastOpts });
    }
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      deadline: new Date(campaign.deadline).toISOString().split('T')[0],
    });
    setActiveTab('campaigns');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Kya aap waqai ye campaign delete karna chahte hain?')) return;
    const toastId = toast.loading('Delete ho rahi hai...', toastOpts);
    try {
      await campaignAPI.delete(id);
      toast.success('Campaign delete ho gayi', { id: toastId, ...toastOpts });
      fetchData(true);
    } catch {
      toast.error('Delete fail ho gayi', { id: toastId, ...toastOpts });
    }
  };

  const handleCancelEdit = () => {
    setEditingCampaign(null);
    setCampaignForm({ title: '', description: '', goalAmount: '', deadline: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="text-emerald-600" size={52} />
        </motion.div>
        <p className="text-emerald-800 font-bold tracking-widest uppercase text-sm mt-4">
          Admin Portal Load Ho Raha Hai...
        </p>
      </div>
    );
  }

  const statsConfig = [
    { label: 'Total Donations', val: stats?.totalDonations || 0, icon: HandHeart, color: 'emerald' },
    { label: 'Total Revenue', val: `PKR ${(stats?.totalAmount || 0).toLocaleString()}`, icon: TrendingUp, color: 'blue' },
    { label: 'Verified Funds', val: `PKR ${(stats?.verifiedAmount || 0).toLocaleString()}`, icon: CheckCircle2, color: 'green' },
    { label: 'Pending', val: `PKR ${(stats?.pendingAmount || 0).toLocaleString()}`, icon: AlertCircle, color: 'amber' },
  ];

  const tabConfig = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'donations', icon: HandHeart, label: 'Donations' },
    { id: 'campaigns', icon: Megaphone, label: 'Campaigns' },
  ];

  const inputClass =
    'w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-300';

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-8 px-4 sm:px-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <Shield className="text-emerald-600" size={20} />
              </div>
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                ZakatCare
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              Admin <span className="text-emerald-600">Portal</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1 text-sm sm:text-base">Zakat, Donations aur Campaigns manage karein</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-emerald-600 hover:border-emerald-300 transition-all shadow-sm flex-shrink-0"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </motion.button>

            {/* Tab switcher */}
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              {tabConfig.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'text-gray-400 hover:text-emerald-600'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── OVERVIEW ─────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsConfig.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-all"
                    >
                      <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                        <s.icon size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-xl font-black text-gray-800">{s.val}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50">
                  <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                      <TrendingUp className="text-emerald-500" size={20} />
                      Recent Activity
                    </h2>
                    <button
                      onClick={() => setActiveTab('donations')}
                      className="text-emerald-600 font-bold text-sm hover:text-emerald-700 hover:underline transition-all"
                    >
                      Sab Dekhein →
                    </button>
                  </div>
                {donations.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 font-medium">
                    Abhi koi donations nahi hain
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                          <th className="px-8 py-4">Donor</th>
                          <th className="px-8 py-4">Amount</th>
                          <th className="px-8 py-4">Type</th>
                          <th className="px-8 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {donations.slice(0, 7).map((d, idx) => (
                          <motion.tr
                            key={d._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            className="hover:bg-emerald-50/30 transition-colors"
                          >
                            <td className="px-8 py-4 font-bold text-gray-700">{d.user?.name || 'Unknown'}</td>
                            <td className="px-8 py-4 font-black text-emerald-700">PKR {d.amount.toLocaleString()}</td>
                            <td className="px-8 py-4 text-sm text-gray-500 font-semibold">{d.type}</td>
                            <td className="px-8 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                                d.status === 'Verified'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {d.status === 'Verified' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                {d.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                </div>
              </div>
            )}

            {/* ── DONATIONS ─────────────────────────────────── */}
            {activeTab === 'donations' && (
              <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-50">
                <div className="px-8 py-6 bg-emerald-700 text-white flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Transaction Ledger</h2>
                    <p className="text-emerald-100 text-sm font-medium mt-0.5">
                      {donations.length} total donations — Verify aur monitor karein
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-2xl px-4 py-2 text-sm font-black">
                    {donations.filter(d => d.status === 'Pending').length} Pending
                  </div>
                </div>

                {donations.length === 0 ? (
                  <div className="py-20 text-center text-gray-400 font-medium">
                    Abhi koi donations nahi hain
                  </div>
                ) : (
                  <>
                    {/* Mobile card view */}
                    <div className="block sm:hidden divide-y divide-gray-50">
                      {donations.map((d, idx) => (
                        <motion.div
                          key={d._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="p-4 hover:bg-gray-50/60 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-black text-gray-800 text-sm">{d.user?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-400">{d.user?.email || ''}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              d.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {d.status === 'Verified' ? <CheckCircle2 size={9} /> : <Clock size={9} />}
                              {d.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-emerald-700 text-sm">PKR {d.amount.toLocaleString()}</span>
                              <span className="text-xs font-black text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">{d.type}</span>
                            </div>
                            {d.status === 'Pending' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusUpdate(d._id, 'Verified')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1"
                              >
                                <CheckCircle2 size={11} />
                                Verify
                              </motion.button>
                            )}
                            {d.status === 'Verified' && (
                              <span className="text-emerald-600 text-xs font-bold">✓ Done</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {/* Desktop table view */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                          <tr>
                            <th className="px-6 lg:px-8 py-5">Date</th>
                            <th className="px-6 lg:px-8 py-5">Donor Info</th>
                            <th className="px-6 lg:px-8 py-5">Amount</th>
                            <th className="px-6 lg:px-8 py-5">Type</th>
                            <th className="px-6 lg:px-8 py-5">Method</th>
                            <th className="px-6 lg:px-8 py-5">Status</th>
                            <th className="px-6 lg:px-8 py-5">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {donations.map((d, idx) => (
                            <motion.tr
                              key={d._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              className="hover:bg-gray-50/60 transition-colors"
                            >
                              <td className="px-6 lg:px-8 py-5 text-xs font-semibold text-gray-500 whitespace-nowrap">
                                {new Date(d.createdAt).toLocaleDateString('en-GB')}
                              </td>
                              <td className="px-6 lg:px-8 py-5">
                                <p className="font-black text-gray-800 text-sm">{d.user?.name || 'N/A'}</p>
                                <p className="text-xs text-gray-400">{d.user?.email || ''}</p>
                              </td>
                              <td className="px-6 lg:px-8 py-5 font-black text-emerald-700 whitespace-nowrap">
                                PKR {d.amount.toLocaleString()}
                              </td>
                              <td className="px-6 lg:px-8 py-5">
                                <span className="text-xs font-black text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                                  {d.type}
                                </span>
                              </td>
                              <td className="px-6 lg:px-8 py-5 text-xs font-semibold text-gray-500 whitespace-nowrap">
                                {d.paymentMethod}
                              </td>
                              <td className="px-6 lg:px-8 py-5">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                                  d.status === 'Verified'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {d.status === 'Verified' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                  {d.status}
                                </span>
                              </td>
                              <td className="px-6 lg:px-8 py-5">
                                {d.status === 'Pending' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStatusUpdate(d._id, 'Verified')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-100 transition-all flex items-center gap-1.5 whitespace-nowrap"
                                  >
                                    <CheckCircle2 size={13} />
                                    Verify Karein
                                  </motion.button>
                                )}
                                {d.status === 'Verified' && (
                                  <span className="text-emerald-600 text-xs font-bold">✓ Verified</span>
                                )}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── CAMPAIGNS ─────────────────────────────────── */}
            {activeTab === 'campaigns' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Form */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-50 sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-2xl ${editingCampaign ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {editingCampaign ? <Edit3 size={22} /> : <PlusCircle size={22} />}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-gray-800">
                          {editingCampaign ? 'Campaign Update Karein' : 'Naya Campaign'}
                        </h2>
                        <p className="text-gray-400 text-xs font-semibold mt-0.5">
                          {editingCampaign ? `Editing: ${editingCampaign.title}` : 'Hamare nayi campaign banayein'}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCampaignSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                        <input
                          type="text"
                          value={campaignForm.title}
                          onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                          required
                          className={inputClass}
                          placeholder="e.g., Karachi Flood Relief 2026"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                          value={campaignForm.description}
                          onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                          required
                          rows="4"
                          className={inputClass}
                          placeholder="Is campaign ki details..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Goal (PKR)</label>
                          <input
                            type="number"
                            value={campaignForm.goalAmount}
                            onChange={(e) => setCampaignForm({ ...campaignForm, goalAmount: e.target.value })}
                            required
                            className={inputClass}
                            placeholder="e.g. 500000"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Deadline</label>
                          <input
                            type="date"
                            value={campaignForm.deadline}
                            onChange={(e) => setCampaignForm({ ...campaignForm, deadline: e.target.value })}
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all"
                        >
                          {editingCampaign ? 'Changes Save Karein' : '🚀 Campaign Launch Karein'}
                        </motion.button>
                        {editingCampaign && (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-5 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Campaign List */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-800">
                      Active Campaigns
                      <span className="ml-2 text-sm font-bold text-emerald-600">({campaigns.length})</span>
                    </h3>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-emerald-200">
                      <Megaphone className="text-emerald-200 mx-auto mb-4" size={48} />
                      <p className="text-gray-400 font-semibold">Abhi koi campaign nahi hai</p>
                    </div>
                  ) : (
                    campaigns.map((c, idx) => {
                      const progress = Math.min((c.raisedAmount / c.goalAmount) * 100, 100);
                      return (
                        <motion.div
                          layout
                          key={c._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          whileHover={{ y: -3 }}
                          className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-4 gap-3">
                            <div className="flex-1">
                              <h4 className="text-base font-black text-gray-800 group-hover:text-emerald-600 transition-colors">
                                {c.title}
                              </h4>
                              <p className="text-gray-400 text-sm mt-1.5 line-clamp-2 font-medium">
                                {c.description}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditCampaign(c)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                              >
                                <Edit3 size={17} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteCampaign(c._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <Trash2 size={17} />
                              </motion.button>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs font-black mb-1.5">
                              <span className="text-emerald-600">{progress.toFixed(1)}% Funded</span>
                              <span className="text-gray-400">
                                PKR {c.raisedAmount.toLocaleString()} / {c.goalAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50 text-xs">
                            <div>
                              <span className="font-black text-gray-400 uppercase tracking-widest block mb-0.5">Goal</span>
                              <span className="font-black text-gray-700">PKR {c.goalAmount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="font-black text-gray-400 uppercase tracking-widest block mb-0.5">Raised</span>
                              <span className="font-black text-emerald-600">PKR {c.raisedAmount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="font-black text-gray-400 uppercase tracking-widest block mb-0.5">Deadline</span>
                              <span className="font-black text-gray-700">
                                {new Date(c.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
