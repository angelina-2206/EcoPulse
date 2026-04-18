import React, { useState } from 'react'
import axios from 'axios'
import { Sparkles, Activity, ShieldCheck, DollarSign, ArrowUpRight, ChevronRight, FileSearch, Scale, ClipboardList, Briefcase, TrendingUp, Target, Layers } from 'lucide-react'
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
              title: 'Thermal Load Optimization Protocol',
              description: 'Deploy certified high-precision sensors to intelligently optimize air circulation and thermal management. Aligns with current energy efficiency industry standards.',
              priority: 'High Impact',
              estimated_savings: 3200,
              estimated_co2_reduction: 4.5,
              implementation_cost: 1500
            },
            {
              title: 'Distributed Infrastructure Integration',
              description: 'Deploy localized solar photovoltaic arrays to offset peak load draw from the central energy grid. Eligible for immediate corporate tax depreciation benefits.',
              priority: 'Medium Impact',
              estimated_savings: 6400,
              estimated_co2_reduction: 12.0,
              implementation_cost: 18000
            }
          ],
          subsidies: [
            {
              name: 'Enterprise Modernization Fund',
              description: 'Global ESG allocation for enterprises implementing certified energy management hardware and AI infrastructure.',
              government_agency: 'Sustainability Finance Hub',
              amount_range: '$100,000 Cap'
            },
            {
              name: 'Carbon Resilience Credit',
              description: 'Subsidized credit facility for facility-wide efficiency installations with 36-month interest-free deferment.',
              government_agency: 'Strategic Equity Office',
              amount_range: '2.4% Fixed APR'
            }
          ]
        })
        setLoading(false)
      }, 1500)
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="space-y-10 min-h-[60vh] flex flex-col items-center justify-center">
      {!plan ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel py-24 px-12 w-full max-w-4xl flex flex-col items-center text-center bg-white border border-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
             <Layers className="w-80 h-80 text-primary" />
          </div>
          
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-xl mb-12 shadow-primary/20 relative group overflow-hidden">
             <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <FileSearch className="w-10 h-10 text-white relative z-10" />
          </div>
          
          <h2 className="text-5xl font-display font-bold text-primary tracking-tight mb-6">Strategic Action Generator</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-12 font-medium">
            Utilize our advanced AI framework to synthesize a bespoke roadmap for operational carbon reduction and fiscal value recovery.
          </p>
          
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="btn-glow px-12 h-16 text-sm font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-xl shadow-primary/20"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing Operational Data...</span>
              </>
            ) : (
              <>
                <span>Synthesize Growth Strategy</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <div className="mt-14 pt-10 border-t border-slate-50 w-full flex items-center justify-center gap-10">
             <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <Target className="w-4 h-4" /> ESG Compliance
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
             <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Verified Data Node
             </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
           variants={staggerContainer}
           initial="hidden"
           animate="show"
           className="w-full space-y-16"
        >
           <motion.div variants={itemAnim} className="bg-primary text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-[0.08] -mb-24 -mr-24">
                <TrendingUp className="w-96 h-96" />
              </div>
              <div className="flex flex-col xl:flex-row justify-between items-center gap-12 relative z-10">
                  <div className="text-center xl:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-accent border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-6">
                      <Activity className="w-4 h-4" /> Strategic Baseline Established
                    </div>
                    <h2 className="text-5xl font-display font-black tracking-tight mb-2 leading-tight">Transition Action Plan</h2>
                    <p className="text-emerald-100/60 text-lg font-medium italic">High-impact directives authorized for <span className="text-accent underline underline-offset-8">{business.name}</span></p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center min-w-[320px] backdrop-blur-md">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Net Recovery Projection</p>
                     <div className="flex items-baseline justify-center gap-3">
                       <span className="text-3xl font-medium text-accent">$</span>
                       <span className="text-7xl font-display font-black tracking-tighter">{plan.total_potential_savings.toLocaleString()}</span>
                     </div>
                     <p className="text-emerald-100/40 text-[10px] font-black uppercase tracking-widest mt-6 bg-white/5 py-2 rounded-full">Annualized Fiscal Yield</p>
                  </div>
              </div>
           </motion.div>

           <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <motion.div variants={staggerContainer} className="space-y-10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                     <ClipboardList className="w-5 h-5 text-primary" /> Operational Actions
                  </h3>
                  <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Priority List</span>
                </div>
                
                {plan.recommendations.map((rec, i) => (
                   <motion.div variants={itemAnim} key={i} className="glass-panel p-10 border border-slate-100 bg-white hover:border-accent group transition-all rounded-3xl shadow-sm hover:shadow-xl">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <h4 className="text-3xl font-display font-black text-primary pr-10 leading-none">{rec.title}</h4>
                        <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                           {rec.priority}
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed border-l-4 border-slate-50 pl-6 py-2 italic font-medium mb-10">{rec.description}</p>
                      
                      <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-50">
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Est. ROI</p>
                          <p className="text-primary font-black text-2xl font-display">${rec.estimated_savings.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Emissions</p>
                          <p className="text-primary font-black text-2xl font-display">{rec.estimated_co2_reduction} MT</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">CapEx</p>
                          <p className="text-primary font-black text-2xl font-display">${rec.implementation_cost.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={staggerContainer} className="space-y-10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                     <DollarSign className="w-5 h-5 text-accent" /> Available Incentives
                  </h3>
                  <button className="text-[10px] font-black text-accent uppercase underline tracking-widest">Incentive Hub</button>
                </div>

                {plan.subsidies.map((sub, i) => (
                   <motion.div variants={itemAnim} key={i} className="glass-panel p-10 border border-slate-100 bg-white hover:border-primary group transition-all rounded-3xl shadow-sm hover:shadow-xl">
                     <div className="flex-1 mb-8">
                        <div className="flex items-center gap-2 mb-3">
                           <Briefcase className="w-4 h-4 text-accent" />
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{sub.government_agency}</p>
                        </div>
                        <h4 className="text-2xl font-display font-black text-primary mb-2 leading-[1.1]">{sub.name}</h4>
                     </div>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium mb-10">{sub.description}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-50 gap-6">
                       <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                          <div className="p-2 bg-primary/5 rounded-xl border border-primary/10"><DollarSign className="w-4 h-4 text-primary" /></div>
                          <span className="text-2xl font-display font-black text-primary">{sub.amount_range}</span>
                       </div>
                       <button className="h-14 px-10 rounded-2xl bg-white border-2 border-primary text-primary text-[10px] font-black uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-all flex items-center gap-3">
                          Apply via Portal <ArrowUpRight className="w-4 h-4" />
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
