import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Flame, ShieldAlert, Zap, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import LiveDataPulse from './LiveDataPulse'

const MOCK_DATA = [
  { month: 'Jan', usage: 4000, baseline: 4200 },
  { month: 'Feb', usage: 3800, baseline: 4100 },
  { month: 'Mar', usage: 3900, baseline: 4050 },
  { month: 'Apr', usage: 3400, baseline: 4000 },
  { month: 'May', usage: 3100, baseline: 3950 },
  { month: 'Jun', usage: 2800, baseline: 3900 },
]

const StatCard = ({ title, value, unit, change, type = 'neutral', icon: Icon }) => {
  const colors = {
    positive: 'text-primary bg-primary/10',
    negative: 'text-destructive bg-destructive/10',
    neutral: 'text-text-muted bg-white/5'
  }
  return (
    <div className="glass-panel p-6 relative overflow-hidden group">
      <LiveDataPulse count={3} />
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg ${colors[type]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
         <span className="text-4xl font-display font-bold text-white">{value}</span>
         {unit && <span className="text-text-muted font-medium">{unit}</span>}
      </div>
      {change && (
         <div className="mt-4 flex items-center gap-1.5 text-sm">
            <span className={`font-bold ${change.startsWith('+') ? 'text-destructive' : 'text-primary'}`}>{change}</span>
            <span className="text-text-muted">vs last month</span>
         </div>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background-surface/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-glass-panel">
        <p className="text-white font-bold mb-2">{label}</p>
        <p className="text-primary text-sm font-semibold">Actual: {payload[0].value} kWh</p>
        <p className="text-text-muted text-sm font-medium">Baseline: {payload[1].value} kWh</p>
      </div>
    );
  }
  return null;
}

const DashboardAnalytics = () => {
  return (
    <div className="space-y-6">
       {/* High Level Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Total Energy" value="2,800" unit="kWh" change="-9.6%" type="positive" icon={Zap} />
          <StatCard title="Carbon Yield" value="1.2" unit="Tons" change="-12%" type="positive" icon={Flame} />
          <StatCard title="Eco Score" value="A-" change="Stable" type="neutral" icon={Activity} />
          <StatCard title="Est. Liability" value="$420" unit="/mo" change="-$80" type="positive" icon={ShieldAlert} />
       </div>

       {/* Chart & Insights Row */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-xl font-bold text-white tracking-tight">Energy Consumption vs Baseline</h2>
                   <p className="text-sm text-text-muted mt-1">AI predictive modeling applied to historical data.</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> LIVE
                </div>
             </div>
             
             <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A0A0A0" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#A0A0A0" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#A0A0A0', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#A0A0A0', fontSize: 12}} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="baseline" stroke="#A0A0A0" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorBaseline)" />
                    <Area type="monotone" dataKey="usage" stroke="#00E676" strokeWidth={3} fill="url(#colorUsage)" activeDot={{ r: 6, fill: '#00E676', strokeWidth: 0, style: { filter: 'drop-shadow(0 0 8px #00E676)' } }} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="glass-panel p-6 flex flex-col h-full">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg"><Activity className="w-5 h-5 text-accent" /></div>
                <h3 className="text-lg font-bold text-white">AI Intel Feed</h3>
             </div>
             
             <div className="flex-1 space-y-4">
                {[
                   { title: 'Threshold Warning', desc: 'Predicting 15% spike next week due to HVAC load.', type: 'warn' },
                   { title: 'Optimization Found', desc: 'Switching zone 2 to LED saves $45/mo. ROI 4 months.', type: 'success' },
                   { title: 'Policy Update', desc: 'New state microgrid tax break applies to your sector.', type: 'info' }
                ].map((insight, i) => (
                   <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} 
                      className={`p-4 rounded-xl border-l-[3px] bg-background border-white/5 
                         ${insight.type === 'warn' ? 'border-l-accent' : insight.type === 'success' ? 'border-l-primary' : 'border-l-blue-500'}`}
                   >
                      <h4 className="text-white text-sm font-bold mb-1">{insight.title}</h4>
                      <p className="text-text-muted text-xs leading-relaxed">{insight.desc}</p>
                   </motion.div>
                ))}
             </div>

             <button className="mt-6 w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-white transition-colors flex items-center justify-center gap-2 group">
                Full Diagnostic <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
             </button>
          </div>

       </div>
    </div>
  )
}

export default DashboardAnalytics
