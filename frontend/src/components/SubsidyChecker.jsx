import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ShieldCheck, DollarSign, Building, Leaf, FileCheck, ArrowRight, ClipboardCheck, Sparkles, Globe, Filter } from 'lucide-react'

const SubsidyChecker = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setResults([
        {
          name: "Global Industrial Efficiency Fund",
          agency: "International Sustainability Consortium",
          amount: "Up to $150,000",
          match: 94,
          category: "Infrastructure Retrofitting",
          desc: "Flexible capital allocation designed to offset the cost of implementing high-efficiency IoT and AI frameworks in manufacturing environments."
        },
        {
          name: "Renewable ESG Offset Program",
          agency: "Renewable Capital Alliance",
          amount: "2.8% Fixed APR",
          match: 82,
          category: "Sustainability Financing",
          desc: "Tiered credit facility for enterprises committed to achieving specified carbon abatement milestones within 24 months."
        }
      ])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
       {/* Form Section */}
       <div className="xl:col-span-5 glass-panel p-10 h-fit bg-white border border-slate-100 shadow-xl rounded-3xl">
          <div className="flex items-center gap-5 mb-12 pb-6 border-b border-slate-50">
             <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white group">
                <Search className="w-7 h-7" />
             </div>
             <div>
                <h2 className="text-2xl font-bold font-display tracking-tight text-primary">Incentive Finder</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Capital Optimization Hub</p>
             </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-8">
             <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Enterprise Sector</label>
               <input type="text" defaultValue="Global Manufacturing" className="input-fancy" />
             </div>
             <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Annual Operations CapEx</label>
               <select className="input-fancy">
                  <option>Tier 1: &lt; $5M USD</option>
                  <option>Tier 2: $5M - $50M USD</option>
                  <option>Tier 3: &gt; $50M USD</option>
               </select>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Region</label>
                  <input type="text" defaultValue="North America" className="input-fancy" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">ESG Target</label>
                  <input type="text" defaultValue="Decarbonization" className="input-fancy" />
                </div>
             </div>
             <button type="submit" disabled={loading} className="btn-glow w-full h-14 mt-10 shadow-lg shadow-primary/20 flex items-center justify-center gap-4 text-sm uppercase tracking-widest">
                {loading ? (
                   <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Scanning Marketplaces...</span>
                   </>
                ) : (
                   <>
                      <span>Analyze Opportunities</span>
                      <ArrowRight className="w-4 h-4" />
                   </>
                )}
             </button>
          </form>
       </div>

       {/* Results Section */}
       <div className="xl:col-span-7 space-y-10">
          {!results ? (
             <div className="h-full min-h-[500px] border-2 border-slate-100 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-16 bg-white shadow-inner">
                <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-3xl mb-8">
                   <Filter className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-display font-bold text-primary mb-4 tracking-tight">System Ready</h3>
                <p className="text-slate-400 text-sm max-w-sm leading-relaxed font-medium">Input your enterprise operational parameters to identify matching carbon-reduction incentives and capital grants from global ESG registries.</p>
             </div>
          ) : (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                   <h3 className="text-xl font-display font-bold text-primary flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-accent" /> Matched ESG Capital
                   </h3>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{results.length} Opportunities Identified</span>
                </div>
                
                {results.map((sub, i) => (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} 
                      className="glass-panel p-10 bg-white border border-slate-100 hover:border-accent shadow-xl shadow-slate-200/40 transition-all group rounded-3xl"
                   >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                         <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                               <div className="px-3 py-1 bg-accent/10 rounded-full border border-accent/10">
                                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">{sub.category}</span>
                               </div>
                               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                               <div className="flex items-center gap-1.5">
                                  <Globe className="w-3.5 h-3.5 text-slate-300" />
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub.agency}</span>
                               </div>
                            </div>
                            <h4 className="text-3xl font-display font-black text-primary leading-[1.1] mb-4">{sub.name}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium border-l-4 border-slate-50 pl-6 py-2 italic">{sub.desc}</p>
                         </div>
                         <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            {sub.match}% Index
                         </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-50 gap-6">
                         <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary"><DollarSign className="w-6 h-6" /></div>
                            <div>
                               <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Available Allocation</span>
                               <span className="text-2xl font-display font-black text-primary">{sub.amount}</span>
                            </div>
                         </div>
                         <button className="h-14 px-10 rounded-2xl bg-white border-2 border-primary text-primary text-xs font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center gap-3 shadow-lg shadow-primary/5">
                            Apply via Portal <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                   </motion.div>
                ))}
             </motion.div>
          )}
       </div>
    </div>
  )
}

export default SubsidyChecker
