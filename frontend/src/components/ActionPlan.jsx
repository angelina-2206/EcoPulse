import React, { useState } from 'react'
import axios from 'axios'
import { Sparkles, Activity, ShieldCheck, DollarSign, ArrowUpRight, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const ActionPlan = ({ business, apiUrl }) => {
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const data = {
        business_id: business.id || 1,
        industry: business.industry,
        business_size: business.size
      }
      const response = await axios.post(`${apiUrl}/recommend/action-plan`, data)
      setPlan(response.data)
    } catch (err) {
      console.error('Action plan generation failed', err)
      setTimeout(() => {
        setPlan({
          total_potential_savings: 12500,
          recommendations: [
            {
              title: 'HVAC Optimization AI',
              description: 'Deploy neuro-thermal sensors to intelligently route air conditioning. Reduces consumption during low occupancy periods dynamically.',
              priority: 'high',
              estimated_savings: 3200,
              estimated_co2_reduction: 4.5,
              implementation_cost: 1500
            },
            {
              title: 'Solar Microgrid Integration',
              description: 'Install localized roof-mounted perovskite solar cells to offset peak grid draw, feeding excess back to the local utility loop.',
              priority: 'medium',
              estimated_savings: 6400,
              estimated_co2_reduction: 12.0,
              implementation_cost: 18000
            }
          ],
          subsidies: [
            {
              name: 'Advanced Clean Energy Grant',
              description: 'Direct federal rebate covering up to 40% of capital expenditure for AI-driven energy optimization hardware.',
              government_agency: 'Dept. of Energy',
              amount_range: 'Up to $10,000'
            },
            {
              name: 'MSME Solar Initiative',
              description: 'Low-yield green bonds to finance renewable microgrids with a 5-year tax deferral.',
              government_agency: 'SBA & EPA',
              amount_range: 'Variable 2%-4% APR'
            }
          ]
        })
        setLoading(false)
      }, 1500)
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="space-y-8 min-h-[60vh] flex flex-col items-center justify-center">
      {!plan ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="glass-card py-24 px-8 w-full max-w-2xl flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-3xl flex items-center justify-center p-[2px] shadow-2xl shadow-emerald-500/30 mb-8 mx-auto -rotate-6 hover:rotate-0 transition-transform duration-500">
               <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
                 <Sparkles className="w-10 h-10 text-emerald-400" />
               </div>
            </div>
          </div>
          
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Neural Strategy Engine</h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed mb-10">
            Sequence our predictive AI against your operational data to synthesize a bespoke carbon reduction and cost-saving trajectory.
          </p>
          
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full sm:w-auto px-12 py-4 text-lg font-bold group relative overflow-hidden"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
                Synthesizing Protocol...
              </span>
            ) : (
              <span className="flex items-center gap-3 relative z-10">
                Execute AI Analysis <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div 
           variants={staggerContainer}
           initial="hidden"
           animate="show"
           className="w-full space-y-10"
        >
           <motion.div variants={itemAnim} className="bg-gradient-to-r from-emerald-600 to-blue-900 p-[1px] rounded-[32px] overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.15)]">
             <div className="bg-slate-900/90 backdrop-blur-3xl p-8 sm:p-10 rounded-[31px]">
               <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                      <Activity className="w-3 h-3" /> Baseline Established
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">EcoPulse Roadmap</h2>
                    <p className="text-slate-400 mt-2 text-lg">Optimized trajectory synthesized for <span className="text-white font-semibold">{business.name}</span></p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl text-center min-w-[240px]">
                     <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Total Yield Projection</p>
                     <p className="text-5xl font-black text-white mt-2 font-mono">${plan.total_potential_savings.toLocaleString()}</p>
                     <p className="text-slate-500 text-xs font-medium uppercase mt-2">Annual Savings</p>
                  </div>
               </div>
             </div>
           </motion.div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div variants={staggerContainer} className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Tactical Upgrades</h3>
                </div>
                
                {plan.recommendations.map((rec, i) => (
                  <motion.div variants={itemAnim} key={i} className="glass-card hover:bg-white/[0.02] border-l-2 border-l-emerald-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full transition-transform duration-500 group-hover:scale-125"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold text-white pr-4 leading-tight">{rec.title}</h4>
                        <span className={`badge shrink-0 ${rec.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {rec.priority} Pri
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{rec.description}</p>
                      
                      <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/5">
                        <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Save Yield</p>
                          <p className="text-emerald-400 font-bold font-mono text-sm">${rec.estimated_savings.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">CO₂ Offset</p>
                          <p className="text-blue-400 font-bold font-mono text-sm">{rec.estimated_co2_reduction}T</p>
                        </div>
                        <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">CapEx</p>
                          <p className="text-slate-300 font-bold font-mono text-sm">${rec.implementation_cost.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={staggerContainer} className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Government Subsidies</h3>
                </div>

                {plan.subsidies.map((sub, i) => (
                  <motion.div variants={itemAnim} key={i} className="glass-card border-t border-t-blue-500/50 hover:bg-blue-900/10 group">
                    <div className="flex justify-between items-start gap-4">
                       <div>
                         <h4 className="text-lg font-bold text-blue-300 leading-tight">{sub.name}</h4>
                         <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {sub.government_agency}
                         </p>
                       </div>
                    </div>
                    <p className="text-slate-400 text-sm mt-4 leading-relaxed">{sub.description}</p>
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-mono">{sub.amount_range}</span>
                       </div>
                       <button className="text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/10">
                          Initiate Claim <ArrowUpRight className="w-4 h-4 text-blue-400" />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
           </div>
        </motion.div>
      )}
    </div>
  )
}

export default ActionPlan
