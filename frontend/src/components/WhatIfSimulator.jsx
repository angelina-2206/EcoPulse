import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings2, Zap, Sun, Lightbulb, RefreshCw, TrendingDown, DollarSign, Leaf } from 'lucide-react'
import { aiService } from '../services/api'

const SliderControl = ({ icon: Icon, label, value, min, max, unit, onChange, colorClass }) => (
  <div className="space-y-4 bg-background-layered border border-white/5 p-6 rounded-2xl group hover:border-white/10 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${colorClass} shadow-lg shadow-black/20`}><Icon className="w-5 h-5 text-white" /></div>
        <span className="font-bold text-white tracking-tight">{label}</span>
      </div>
      <div className="bg-background px-3 py-1 rounded-lg border border-white/5">
        <span className="text-xl font-black font-display text-white">{value}<span className="text-xs text-text-muted ml-0.5 uppercase tracking-tighter">{unit}</span></span>
      </div>
    </div>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-primary h-2 bg-white/5 rounded-lg appearance-none cursor-pointer" 
    />
  </div>
)

const WhatIfSimulator = () => {
  const [energyInput, setEnergyInput] = useState(4000)
  const [solarAdoption, setSolarAdoption] = useState(0)
  const [ledAdoption, setLedAdoption] = useState(0)
  
  const [results, setResults] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    const runSimulation = async () => {
      setIsSimulating(true)
      const data = await aiService.simulate({
        energyBaseline: energyInput,
        solarAdoption,
        ledAdoption
      })
      setResults(data)
      setIsSimulating(false)
    }
    
    const debounce = setTimeout(runSimulation, 600)
    return () => clearTimeout(debounce)
  }, [energyInput, solarAdoption, ledAdoption])

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div>
            <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase ">Strategic Simulator</h2>
            <p className="text-text-muted mt-2 text-lg max-w-xl font-light">Synthesize operational blueprints and forecast financial ROI using predictive neural modeling.</p>
         </div>
         <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest hidden md:flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> Real-Time Calibration
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Container */}
        <div className="lg:col-span-12 xl:col-span-7 glass-panel p-8 space-y-6">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30"><Settings2 className="w-5 h-5 text-accent" /></div>
              <h3 className="text-xl font-bold text-white tracking-tight">Operation Variables</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
                <SliderControl 
                  icon={Zap} label="Monthly Energy Load" 
                  value={energyInput} min={1000} max={20000} unit="kWh"
                  onChange={setEnergyInput} colorClass="bg-blue-600" 
                />
             </div>
             <SliderControl 
               icon={Sun} label="Solar Array Factor" 
               value={solarAdoption} min={0} max={100} unit="%"
               onChange={setSolarAdoption} colorClass="bg-amber-500" 
             />
             <SliderControl 
               icon={Lightbulb} label="Smart LED Coverage" 
               value={ledAdoption} min={0} max={100} unit="%"
               onChange={setLedAdoption} colorClass="bg-primary" 
             />
           </div>
        </div>

        {/* Results Container */}
        <div className="lg:col-span-12 xl:col-span-5">
           <div className="glass-panel p-8 h-full flex flex-col relative overflow-hidden group bg-gradient-to-b from-background-surface to-background border-t-2 border-t-primary/20">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-bold text-white tracking-tight">Projected Yield</h3>
                 {isSimulating && <RefreshCw className="w-5 h-5 text-primary animate-spin" />}
              </div>

              <div className="flex-1 space-y-10">
                 {results ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                       <div className="relative">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Adjusted Utility Liability</p>
                          <p className="text-6xl font-display font-black text-white mt-1 flex items-baseline gap-1">
                             <span className="text-3xl text-primary font-medium">$</span>
                             {results.projectedCost.toFixed(0)}
                             <span className="text-sm font-medium text-text-muted uppercase tracking-normal ml-2">/ month</span>
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-background-layered border border-white/5 rounded-2xl p-5 group-hover:border-white/10 transition-colors">
                             <div className="flex items-center gap-2 mb-3">
                                <Leaf className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Carbon Gen</span>
                             </div>
                             <p className="text-3xl font-black font-display text-white">{results.projectedCarbon.toFixed(1)} <span className="text-sm font-medium text-text-muted">T</span></p>
                          </div>
                          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50"></div>
                             <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Savings</span>
                             </div>
                             <p className="text-3xl font-black font-display text-primary">${results.savings.toFixed(0)}</p>
                          </div>
                       </div>
                    </motion.div>
                 ) : (
                    <div className="flex-1 flex items-center justify-center py-20">
                       <LoaderPulse />
                    </div>
                 )}
              </div>

              <div className="mt-12 space-y-4">
                 <button className="w-full btn-glow py-4 text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,230,118,0.2)]">Commit to Strategy</button>
                 <button className="w-full h-14 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all">Download PDF Scenario</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}

const LoaderPulse = () => (
  <div className="flex gap-2 items-center">
     {[0, 1, 2].map(i => (
        <motion.div
           key={i}
           animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
           transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
           className="w-3 h-3 bg-primary rounded-full shadow-glow-primary"
        />
     ))}
  </div>
)

export default WhatIfSimulator
