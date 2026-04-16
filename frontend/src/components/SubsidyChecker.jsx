import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ShieldCheck, DollarSign, Building, Leaf } from 'lucide-react'

const SubsidyChecker = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setResults([
         {
            name: "MSME Green Tech Grant",
            agency: "Dept. of Energy",
            amount: "Up to $10,000",
            match: 94,
            desc: "Direct federal rebate covering up to 40% of capital expenditure for AI-driven energy optimization hardware."
         },
         {
            name: "Solar Microgrid Initiative",
            agency: "EPA",
            amount: "Variable 2%-4% APR",
            match: 82,
            desc: "Low-yield green bonds to finance renewable microgrids with a 5-year tax deferral."
         }
      ])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
       {/* Form Section */}
       <div className="lg:col-span-5 glass-panel p-6 h-fit bg-gradient-to-b from-background-surface to-background">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
             <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30"><Search className="w-5 h-5 text-accent" /></div>
             <h2 className="text-xl font-bold font-display tracking-tight text-white">Find Subsidies</h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Business Classification</label>
               <input type="text" defaultValue="Manufacturing" className="input-fancy" />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Annual Revenue Cap</label>
               <input type="text" defaultValue="< $1,000,000" className="input-fancy" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">State/Region</label>
                  <input type="text" defaultValue="CA" className="input-fancy" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Primary Goal</label>
                  <input type="text" defaultValue="Solar/LED" className="input-fancy" />
                </div>
             </div>
             <button type="submit" disabled={loading} className="w-full btn-glow mt-6 h-12">
                {loading ? 'Scanning Databases...' : 'Match Subsidies'}
             </button>
          </form>
       </div>

       {/* Results Section */}
       <div className="lg:col-span-7 space-y-6">
          {!results ? (
             <div className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-background-layered/50">
                <ShieldCheck className="w-16 h-16 text-white/20 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No active queries</h3>
                <p className="text-text-muted text-sm max-w-sm">Enter your organizational parameters to cross-reference global and local governmental subsidy databases.</p>
             </div>
          ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-primary" /> Eligible Schemes Found
                </h3>
                {results.map((sub, i) => (
                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} key={i} 
                      className="glass-panel p-6 border-l-[3px] border-l-primary group glass-panel-hover"
                   >
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            <h4 className="text-xl font-bold font-display text-white">{sub.name}</h4>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{sub.agency}</p>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-lg">{sub.match}% Match</span>
                         </div>
                      </div>
                      <p className="text-text-muted text-sm leading-relaxed my-4">{sub.desc}</p>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                         <div className="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <DollarSign className="w-4 h-4 text-primary" /> {sub.amount}
                         </div>
                         <button className="text-primary hover:text-white text-sm font-bold transition-colors">Apply Now →</button>
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
