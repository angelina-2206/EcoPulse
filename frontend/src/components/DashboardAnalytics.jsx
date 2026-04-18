import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Flame, ShieldAlert, Zap, ArrowUpRight, Loader2, Gauge, ClipboardList, Target, TrendingUp, Sparkles, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { carbonService, recommendService } from '../services/api'

const MOCK_HISTORICAL = [
  { month: 'JAN', usage: 4000, baseline: 4200 },
  { month: 'FEB', usage: 3800, baseline: 4100 },
  { month: 'MAR', usage: 3900, baseline: 4050 },
  { month: 'APR', usage: 3400, baseline: 4000 },
  { month: 'MAY', usage: 3100, baseline: 3950 },
  { month: 'JUN', usage: 2800, baseline: 3900 },
]

const StatCard = ({ title, value, unit, change, type = 'neutral', icon: Icon, loading }) => {
  return (
    <div className="glass-panel p-6 border border-slate-200 bg-white hover:border-accent/40 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
           <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
         {loading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
         ) : (
            <>
               <span className="text-4xl font-display font-bold text-primary tracking-tight">{value}</span>
               {unit && <span className="text-slate-400 font-bold text-xs uppercase ml-1">{unit}</span>}
            </>
         )}
      </div>
      {change && !loading && (
         <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-rose-500' : 'text-emerald-500'}`}>{change} vs Target</span>
            <ArrowUpRight className="w-3 h-3 text-slate-300" />
         </div>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 p-5 shadow-2xl rounded-xl">
        <p className="text-primary font-bold text-[10px] mb-3 tracking-[0.2em] uppercase">{label} METRICS</p>
        <div className="space-y-2">
          <p className="text-slate-700 text-sm flex justify-between gap-6"><span>Operational:</span> <span className="font-bold text-primary">{payload[0].value} kWh</span></p>
          <p className="text-slate-400 text-sm flex justify-between gap-6"><span>Goal Variance:</span> <span className="font-bold">{payload[1].value} kWh</span></p>
        </div>
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
        setStats({ carbon: '1,240', energy: '2,800', savings: '420', rating: 'A-' })
      }
      setLoading(false)
    }
    fetchData()
  }, [business])

  return (
    <div className="space-y-8">
       {/* Executive Status Banner */}
       <div className="bg-primary text-white p-10 rounded-2xl flex flex-col lg:flex-row items-center justify-between overflow-hidden relative shadow-2xl shadow-primary/20">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-1/4"></div>
          <div className="absolute left-0 bottom-0 h-full w-1/4 bg-white/5 -skew-x-12 -translate-x-1/4"></div>
          
          <div className="relative z-10 text-center lg:text-left">
             <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 flex items-center gap-2">
                   <Sparkles className="w-3.5 h-3.5 text-accent" />
                   <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">Strategic Intelligence v4</span>
                </div>
             </div>
             <h2 className="text-4xl font-display font-bold tracking-tight">Enterprise Performance Review</h2>
             <p className="text-emerald-100/60 mt-2 text-lg max-w-xl font-medium">
                Our AI engine has identified significant opportunities for cost recovery and carbon abatement across your facilities.
             </p>
          </div>
          <div className="relative z-10 flex flex-col items-center lg:items-end mt-8 lg:mt-0 px-8 py-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm min-w-[220px]">
             <div className="text-5xl font-display font-extrabold text-white mb-2">{stats.rating}</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Efficiency Rating</div>
             <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-accent" />
             </div>
          </div>
       </div>

       {/* High Level Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Metric Consumption" value={stats.energy} unit="kWh" change="-9.6%" icon={Zap} loading={loading} />
          <StatCard title="Carbon Footprint" value={stats.carbon} unit="MT CO2e" change="-12.1%" icon={Flame} loading={loading} />
          <StatCard title="Industry Percentile" value="84th" change="Top Performance" icon={TrendingUp} loading={loading} />
          <StatCard title="Cost Savings" value={`$${stats.savings}`} change="Identified" icon={BarChart3} loading={loading} />
       </div>

       {/* Chart & Insights Row */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 glass-panel p-10 bg-white">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-2xl font-display font-bold text-primary tracking-tight">Consumption Trends</h2>
                   <p className="text-sm text-slate-400 mt-1 font-medium">Monitoring operational draw against enterprise efficiency goals.</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.15em]">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full"></div> Actual Usage
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em]">
                      <div className="w-2.5 h-2.5 border-2 border-slate-200 border-dashed rounded-full"></div> Target Goal
                   </div>
                </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_HISTORICAL} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#064E3B" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#064E3B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="baseline" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="6 6" fill="transparent" />
                    <Area type="monotone" dataKey="usage" stroke="#064E3B" strokeWidth={3} fill="url(#usageGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="glass-panel p-10 flex flex-col bg-white">
             <div className="flex items-center gap-3 mb-12 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                   <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-display font-bold text-primary tracking-tight">Strategic Insights</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Awaiting Action</p>
                </div>
             </div>
             
             <div className="flex-1 space-y-6">
                { (recommendations.length > 0 ? recommendations : [
                   { title: 'Thermal Optimization', description: 'AI identifies potential for 4% energy reduction through dynamic HVAC calibration.' },
                   { title: 'Asset Modernization', description: 'ROI projection of 14 months for Tier-4 industrial lighting upgrade.' },
                   { title: 'Peak Draw Mitigation', description: 'Schedule load-heavy processes to off-peak slots to reduce utility tariffs.' }
                ]).map((rec, i) => (
                   <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
                      className="p-6 border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-accent/40 transition-all cursor-pointer group rounded-xl"
                   >
                      <h4 className="text-primary text-sm font-bold mb-2 flex items-center justify-between uppercase tracking-wider">
                         {rec.title}
                         <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-accent transition-colors" />
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">{rec.description}</p>
                   </motion.div>
                )) }
             </div>

             <button className="btn-glow mt-10 w-full h-14 text-sm uppercase tracking-widest shadow-xl shadow-primary/20">
                Execute All Recommendations
             </button>
          </div>

       </div>
    </div>
  )
}

export default DashboardAnalytics
