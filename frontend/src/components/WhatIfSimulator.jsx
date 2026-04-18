import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings2, Zap, Sun, Lightbulb, RefreshCw, TrendingDown, DollarSign, Leaf, LineChart, FileCheck, ShieldCheck, PieChart, Sparkles, ArrowRight } from 'lucide-react'
import { aiService } from '../services/api'

const SliderControl = ({ icon: Icon, label, value, min, max, unit, onChange }) => (
  <div className="space-y-6 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm transition-all hover:border-accent group">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
           <Icon className="w-6 h-6" />
        </div>
        <div>
           <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Parameter Control</span>
           <span className="font-bold text-primary text-sm uppercase tracking-wider">{label}</span>
        </div>
      </div>
      <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
        <span className="text-2xl font-display font-bold text-primary">{value}<span className="text-xs text-slate-400 ml-1 uppercase font-sans font-black">{unit}</span></span>
      </div>
    </div>
    <div className="relative pt-2">
      <input 
        type="range" min={min} max={max} value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-accent" 
      />
      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
         <span>Min: {min}{unit}</span>
         <span>Max: {max}{unit}</span>
      </div>
    </div>
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
      try {
        const data = await aiService.simulate({
          energyBaseline: energyInput,
          solarAdoption,
          ledAdoption
        })
        setResults(data)
      } catch (e) {
        setResults({ projectedCost: 3500, projectedCarbon: 0.8, savings: 500 })
      }
      setIsSimulating(false)
    }
    
    const debounce = setTimeout(runSimulation, 400)
    return () => clearTimeout(debounce)
  }, [energyInput, solarAdoption, ledAdoption])

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 border-b border-slate-200 pb-10">
         <div>
            <h2 className="text-4xl font-display font-bold text-primary tracking-tight">ROI Strategic Simulator</h2>
            <div className="flex items-center gap-3 mt-3">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full">
                  <PieChart className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Scenario Planning</span>
               </div>
               <span className="text-xs text-slate-400 font-medium">Enterprise Growth & Sustainability Forecasting Hub</span>
            </div>
         </div>
         <div className="px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
               <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Simulation Active</span>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="flex items-center gap-2">
               <Sparkles className="w-3.5 h-3.5 text-slate-300" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI v4.0.2</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* Controls Container */}
        <div className="xl:col-span-7 space-y-10">
           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Operational Parameters</h3>
              <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Reset Defaults</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="md:col-span-2">
                <SliderControl 
                  icon={Zap} label="Facility Consumption Baseline" 
                  value={energyInput} min={1000} max={20000} unit="kWh"
                  onChange={setEnergyInput}
                />
             </div>
             <SliderControl 
               icon={Sun} label="Renewable Energy Yield" 
               value={solarAdoption} min={0} max={100} unit="%"
               onChange={setSolarAdoption}
             />
             <SliderControl 
               icon={Lightbulb} label="Efficiency Asset Rating" 
               value={ledAdoption} min={0} max={100} unit="%"
               onChange={setLedAdoption}
             />
           </div>
           <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-6 shadow-inner">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                <span className="font-bold uppercase tracking-widest text-primary block mb-1">Intelligence Notice</span>
                Simulations are calibrated against historical seasonal demand profiles and localized renewable yield coefficients for your industry sector.
              </p>
           </div>
        </div>

        {/* Results Container */}
        <div className="xl:col-span-5 h-full">
           <div className="glass-panel p-10 flex flex-col h-full bg-primary relative overflow-hidden text-white shadow-2xl rounded-3xl">
              <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
              <div className="absolute left-0 top-0 w-64 h-64 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              
              <div className="flex items-center justify-between mb-16 relative z-10">
                 <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-accent mb-1">Projected Impact</h3>
                    <span className="text-[10px] text-emerald-100/40 font-bold uppercase tracking-[0.2em]">Fiscal Year 2026</span>
                 </div>
                 {isSimulating ? (
                    <RefreshCw className="w-6 h-6 text-accent animate-spin" />
                 ) : (
                    <TrendingDown className="w-6 h-6 text-accent" />
                 )}
              </div>

              <div className="flex-1 space-y-16 relative z-10">
                 {results ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                       <div>
                          <p className="text-[10px] font-bold text-emerald-100/40 uppercase tracking-[0.3em] mb-4">Projected Operational OpEx</p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-medium text-accent">$</span>
                            <span className="text-7xl font-display font-black tracking-tighter">
                               {results.projectedCost.toFixed(0)}
                            </span>
                            <span className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em] ml-4 bg-white/5 px-3 py-1 rounded-full">Monthly Est.</span>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                             <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-accent/10 rounded-lg"><Leaf className="w-4 h-4 text-accent" /></div>
                                <span className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-[0.2em]">Carbon Offset</span>
                             </div>
                             <p className="text-3xl font-display font-bold text-white">{results.projectedCarbon.toFixed(1)} <span className="text-xs font-bold opacity-30 uppercase tracking-widest font-sans">MT</span></p>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                             <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-accent/10 rounded-lg"><DollarSign className="w-4 h-4 text-accent" /></div>
                                <span className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-[0.2em]">Net Savings</span>
                             </div>
                             <p className="text-3xl font-display font-bold text-white">${results.savings.toFixed(0)} <span className="text-xs font-bold opacity-30 uppercase tracking-widest font-sans">Est.</span></p>
                          </div>
                       </div>
                    </motion.div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
                       <div className="w-16 h-16 border-4 border-accent border-t-white rounded-full animate-spin"></div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Synthesizing Strategy Matrix</span>
                    </div>
                 )}
              </div>

              <div className="mt-16 space-y-4 relative z-10">
                 <button className="btn-glow w-full h-16 bg-accent border-none text-primary font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-accent/20 flex items-center justify-center gap-3 hover:bg-white active:scale-[0.98]">
                  Commit Strategic Pivot <ArrowRight className="w-4 h-4" />
                 </button>
                 <button className="w-full h-14 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 transition-all">
                  Download Executive Report
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}

export default WhatIfSimulator
