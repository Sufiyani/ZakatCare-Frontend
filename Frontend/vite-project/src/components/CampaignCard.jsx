import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Target, TrendingUp, Heart, Flame } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();

  const progressPercentage = Math.min(
    (campaign.raisedAmount / campaign.goalAmount) * 100,
    100
  );

  const daysLeft = Math.ceil(
    (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const isHot = progressPercentage >= 60;
  const isAlmostFull = progressPercentage >= 85;

  const progressColor = isAlmostFull
    ? 'from-amber-500 to-red-500'
    : 'from-emerald-500 to-emerald-600';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-[2rem] shadow-lg shadow-emerald-900/5 overflow-hidden border border-emerald-50 flex flex-col h-full group hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-100 transition-shadow duration-300"
    >
      {/* Top accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${progressColor}`} />

      <div className="p-7 flex flex-col flex-grow">
        {/* Title row */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <h3 className="text-lg font-black text-gray-800 leading-tight group-hover:text-emerald-700 transition-colors">
            {campaign.title}
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            {isHot && (
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 uppercase">
                <Flame size={10} /> Hot
              </span>
            )}
            <div className={`p-2 rounded-xl ${isAlmostFull ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <Heart
                size={16}
                className={isAlmostFull ? 'text-red-500' : 'text-emerald-600'}
                fill={progressPercentage > 50 ? 'currentColor' : 'none'}
              />
            </div>
          </div>
        </div>

        <p className="text-gray-500 mb-6 line-clamp-3 text-sm font-medium leading-relaxed flex-grow">
          {campaign.description}
        </p>

        <div className="space-y-5 mt-auto">
          {/* Raised / Goal row */}
          <div className="grid grid-cols-2 gap-4 pb-5 border-b border-gray-50">
            <div>
              <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                <TrendingUp size={11} className="text-emerald-500" /> Raised
              </span>
              <span className="text-emerald-700 font-black text-sm">
                PKR {campaign.raisedAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                <Target size={11} /> Goal
              </span>
              <span className="text-gray-800 font-black text-sm">
                PKR {campaign.goalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                isAlmostFull ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {progressPercentage.toFixed(1)}% Funded
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                <Calendar size={13} className="text-emerald-500" />
                {daysLeft > 0 ? `${daysLeft} din baaki` : 'Campaign Khatam'}
              </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${progressColor} rounded-full relative`}
              >
                <div className="absolute inset-0 animate-shimmer rounded-full" />
              </motion.div>
            </div>
          </div>

          {/* Donate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/donate/${campaign._id}`)}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 group-hover:shadow-emerald-200 btn-glow"
          >
            <Heart size={16} fill="currentColor" />
            Donate Karein
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-emerald-200"
            >
              →
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
