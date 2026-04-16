import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, Zap, DollarSign, Award, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

const MOCK_CHART_DATA = [
  { month: 'Jan', efficiency: 70 },
  { month: 'Feb', efficiency: 72 },
  { month: 'Mar', efficiency: 71 },
  { month: 'Apr', efficiency: 76 },
  { month: 'May', efficiency: 81 },
  { month: 'Jun', efficiency: 84 },
]

const StatCard = ({ label, value, icon: Icon, colorClass, borderClass, trend, delay }) => (
  <motion.div 
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5, delay }}
     className={`glass-card border-t-2 ${borderClass} group relative overflow-hidden`}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass} opacity-10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-4xl font-extrabold mt-2 text-white font-mono">{value}</h3>
        {trend && (
          <p className="text-xs font-semibold mt-4 flex items-center gap-1 text-emerald-400 bg-emerald-500/10 w-fit px-2 py-1 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-2xl ${colorClass} shadow-lg shadow-black/20`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl shadow-black/50">
        <p className="text-slate-400 text-xs font-bold uppercase">{label}</p>
        <p className="text-emerald-400 text-lg font-bold mt-1">{payload[0].value} pts</p>
      </div>
    );
  }
  return null;
}

const Dashboard = ({ business }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Efficiency Score" 
          value="84" 
          icon={Award} 
          colorClass="bg-gradient-to-br from-emerald-400 to-emerald-600"
          borderClass="border-t-emerald-500"
          trend="+5% vs Last Mo."
          delay={0.1}
        />
        <StatCard 
          label="Monthly Load" 
          value={`${business.monthly_energy_usage}k`} 
          icon={Zap} 
          colorClass="bg-gradient-to-br from-blue-400 to-blue-600"
          borderClass="border-t-blue-500"
          delay={0.2}
        />
        <StatCard 
          label="Estimated Save" 
          value="$1.2k" 
          icon={DollarSign} 
          colorClass="bg-gradient-to-br from-amber-400 to-amber-600"
          borderClass="border-t-amber-500"
          trend="Actionable Now"
          delay={0.3}
        />
        <StatCard 
          label="Sustainability" 
          value="A-" 
          icon={Award} 
          colorClass="bg-gradient-to-br from-purple-400 to-purple-600"
          borderClass="border-t-purple-500"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-card space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
               <h3 className="text-2xl font-bold text-white tracking-tight">Efficiency Graph</h3>
               <p className="text-slate-400 text-sm mt-1">AI calculated baseline vs theoretical limits</p>
            </div>
            <div className="hidden sm:flex gap-3">
              <span className="badge badge-green flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Live</span>
            </div>
          </div>
          <div className="w-full pt-4 flex-1 min-h-[350px]" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} domain={[60, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#10B981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorEfficiency)" 
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#10B981', style: { filter: 'drop-shadow(0px 0px 8px rgba(16,185,129,0.8))' } }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.6 }}
           className="glass-card space-y-6 flex flex-col"
        >
          <h3 className="text-2xl font-bold text-white tracking-tight">Pulse Insights</h3>
          <p className="text-slate-400 text-sm -mt-4">Real-time anomalies detected via AI</p>

          <div className="space-y-4 flex-1 mt-2">
            {[
              { title: 'Peak Usage Alert', detail: 'Spike between 2pm-4pm', color: 'border-blue-500', bg: 'bg-blue-500/10' },
              { title: 'Phantom Load', detail: 'High standby energy at night', color: 'border-amber-500', bg: 'bg-amber-500/10' },
              { title: 'Goal Projection', detail: 'Tracking to hit Q4 20% cut', color: 'border-emerald-500', bg: 'bg-emerald-500/10' }
            ].map((insight, i) => (
              <div key={i} className={`p-4 rounded-xl border-l-[3px] ${insight.color} ${insight.bg} backdrop-blur-sm transition-transform hover:translate-x-1`}>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{insight.title}</p>
                <p className="text-sm font-semibold text-white mt-1.5">{insight.detail}</p>
              </div>
            ))}
          </div>
          
          <button className="w-full btn-secondary mt-auto py-3.5 flex items-center justify-center gap-2 group">
             Generate PDF Report
             <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
