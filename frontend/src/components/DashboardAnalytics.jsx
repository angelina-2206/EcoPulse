import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Flame, ShieldAlert, Zap, ArrowUpRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import LiveDataPulse from './LiveDataPulse'
import { carbonService, recommendService } from '../services/api'

const MOCK_HISTORICAL = [
  { month: 'Jan', usage: 4000, baseline: 4200 },
  { month: 'Feb', usage: 3800, baseline: 4100 },
  { month: 'Mar', usage: 3900, baseline: 4050 },
  { month: 'Apr', usage: 3400, baseline: 4000 },
  { month: 'May', usage: 3100, baseline: 3950 },
  { month: 'Jun', usage: 2800, baseline: 3900 },
]

const StatCard = ({ title, value, unit, change, type = 'neutral', icon: Icon, loading }) => {
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
         {loading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
         ) : (
            <>
               <span className="text-4xl font-display font-bold text-white tracking-tight">{value}</span>
               {unit && <span className="text-text-muted font-medium text-sm">{unit}</span>}
            </>
         )}
      </div>
      {change && !loading && (
         <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className={`font-bold ${change.startsWith('+') ? 'text-destructive' : 'text-primary'}`}>{change}</span>
            <span className="text-text-muted">vs last cycle</span>
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

const DashboardAnalytics = ({ business }) => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ carbon: '0', energy: '0', savings: '0', rating: '...' })
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const busId = business.id || 1;
        // Fetch action plan & carbon summary
        const [planRes, carbonRes] = await Promise.all([
          recommendService.getActionPlan(busId),
          carbonService.getDetailed(busId)
        ])

        setStats({
          carbon: carbonRes.data.current_footprint.total_annual_emissions.toFixed(1),
          energy: business.monthly_energy_usage.toLocaleString(),
          savings: planRes.data.total_potential_savings.toLocaleString(),
          rating: carbonRes.data.analysis.rating || 'A'
        })
        setRecommendations(planRes.data.recommendations.slice(0, 3))
      } catch (err) {
        console.error('Fetch error:', err)
        // Fallback to mock visuals on error
        setStats({ carbon: '1.2', energy: '2,800', savings: '420', rating: 'A-' })
      }
      setLoading(false)
    }

    fetchData()
  }, [business])

  return (
    <div className="space-y-6">
       {/* High Level Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Monthly Energy" value={stats.energy} unit="kWh" change="-9.6%" type="positive" icon={Zap} loading={loading} />
          <StatCard title="Annual Carbon" value={stats.carbon} unit="Tons" change="-12%" type="positive" icon={Flame} loading={loading} />
          <StatCard title="Sustain Score" value={stats.rating} change="Optimizing" type="neutral" icon={Activity} loading={loading} />
          <StatCard title="Poten. Savings" value={`$${stats.savings}`} unit="/yr" change="Ready" type="positive" icon={ShieldAlert} loading={loading} />
       </div>

       {/* Chart & Insights Row */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 glass-panel p-8 flex flex-col min-h-[450px]">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-xl font-bold text-white tracking-tight">Consumption Matrix</h2>
                   <p className="text-sm text-text-muted mt-1 font-light">Neural forecasting applied to historical utility baseline.</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold flex items-center gap-2 tracking-widest uppercase">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Analyzing Live
                </div>
             </div>
             
             <div className="flex-1 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_HISTORICAL} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

          <div className="glass-panel p-8 flex flex-col">
             <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <div className="p-2 bg-accent/20 rounded-xl border border-accent/30"><Activity className="w-5 h-5 text-accent" /></div>
                <div>
                   <h3 className="text-lg font-bold text-white tracking-tight">AI Strategy Feed</h3>
                   <p className="text-xs text-text-muted mt-0.5 uppercase font-bold tracking-widest">Decision Support</p>
                </div>
             </div>
             
             <div className="flex-1 space-y-4">
                {recommendations.length > 0 ? recommendations.map((rec, i) => (
                   <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} 
                      className="p-4 rounded-xl border-l-[3px] bg-background-layered border-white/5 border-l-primary hover:bg-white/5 transition-colors cursor-pointer group"
                   >
                      <h4 className="text-white text-sm font-bold mb-1 flex items-center justify-between">
                         {rec.title}
                         <ArrowUpRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-text-muted text-xs leading-relaxed line-clamp-2">{rec.description}</p>
                   </motion.div>
                )) : (
                   [
                      { title: 'HVAC Threshold Warning', desc: 'Predicted 15% spike due to grid congestion.', type: 'warn' },
                      { title: 'Optimization Opportunity', desc: 'LED retrofitting identified for Zone B.', type: 'success' },
                      { title: 'Tax Policy Update', desc: 'Federal MSME rebate available for solar caps.', type: 'info' }
                   ].map((insight, i) => (
                      <div key={i} className="p-4 rounded-xl border-l-[3px] bg-background-layered border-white/5 border-l-accent opacity-50">
                         <h4 className="text-white text-sm font-bold mb-1">{insight.title}</h4>
                         <p className="text-text-muted text-xs leading-relaxed">{insight.desc}</p>
                      </div>
                   ))
                )}
             </div>

             <button className="mt-8 w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-xs font-black text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-xl">
                Execute Blueprint <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
             </button>
          </div>

       </div>
    </div>
  )
}

export default DashboardAnalytics
