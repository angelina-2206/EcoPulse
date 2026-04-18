import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, CheckCircle2, FileText, Cpu, Search, Lock, ShieldCheck, FileCheck, Landmark, BarChart3, Fingerprint, RefreshCw, Layers } from 'lucide-react'

const DocumentAutomation = () => {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle, uploading, scanning, complete
  const [result, setResult] = useState(null)

  const handleUpload = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setStatus('uploading')
      
      // Simulate pipeline
      setTimeout(() => setStatus('scanning'), 1000)
      setTimeout(() => {
         setResult({
           usage: '4,102',
           unit: 'kWh',
           cost: '492.24',
           period: 'Oct 2024',
           tax: '42.10',
           anomalies: 'Industrial peak detected on Oct 14th. AI suggests shifting heavy loads to off-peak slots to reduce utility tariffs.'
         })
         setStatus('complete')
      }, 3500)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Upload Zone */}
      <div className={`glass-panel border-2 ${status === 'idle' ? 'border-dashed border-slate-200 hover:border-accent' : 'border-slate-100'} p-20 text-center relative overflow-hidden transition-all bg-white rounded-3xl`}>
         
         <AnimatePresence mode="wait">
            {status === 'idle' && (
               <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <div className="w-24 h-24 bg-primary/5 rounded-3xl border border-primary/10 flex items-center justify-center mx-auto mb-10 shadow-sm transition-transform hover:scale-105">
                     <UploadCloud className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-primary mb-4 tracking-tight">Smart Data Ingestion</h3>
                  <p className="text-slate-400 max-w-sm mx-auto mb-12 text-sm font-medium leading-relaxed">Securely upload utility invoices and operational logs for automated AI analysis and carbon inventory mapping.</p>
                  
                  <input type="file" id="doc-upload" className="hidden" accept=".pdf,image/*" onChange={handleUpload} />
                  <label htmlFor="doc-upload" className="btn-glow inline-flex cursor-pointer items-center gap-3 h-14 px-10 rounded-2xl shadow-xl shadow-primary/10">
                     <FileText className="w-5 h-5" />
                     <span className="text-sm uppercase tracking-widest font-black">Upload Documentation</span>
                  </label>
                  <div className="mt-10 flex items-center justify-center gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <Lock className="w-3.5 h-3.5" /> 256-Bit Encryption
                     </div>
                     <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <Fingerprint className="w-3.5 h-3.5" /> OCR Verified
                     </div>
                  </div>
               </motion.div>
            )}

            {(status === 'uploading' || status === 'scanning') && (
               <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
                  <div className="relative w-28 h-28 mx-auto mb-10">
                     <div className="absolute inset-0 border-4 border-primary/5 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-4 bg-primary/5 rounded-full flex items-center justify-center">
                        <Cpu className="w-10 h-10 text-primary opacity-40" />
                     </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-primary mb-3">
                     {status === 'uploading' ? 'Syncing Data Stream' : 'Extracting Intelligence'}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                     <RefreshCw className="w-3.5 h-3.5 text-accent animate-spin" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file?.name}</span>
                  </div>
               </motion.div>
            )}

            {status === 'complete' && (
               <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
                  <div className="w-24 h-24 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/10">
                     <FileCheck className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-primary mb-3">Analysis Complete</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 inline-block px-5 py-2 rounded-xl border border-slate-100 mb-10">{file?.name}</div>
                  <button onClick={() => { setFile(null); setStatus('idle'); setResult(null); }} className="block mx-auto text-[10px] font-black text-accent hover:text-primary transition-all uppercase tracking-[0.3em] group">
                     New Upload <div className="h-0.5 bg-accent w-0 group-hover:w-full transition-all"></div>
                  </button>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Results Matrix */}
      <AnimatePresence>
         {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="glass-panel p-12 bg-white border border-slate-100 mt-12 shadow-2xl rounded-3xl relative overflow-hidden">
               <div className="absolute right-0 top-0 p-10 opacity-[0.03]">
                  <Layers className="w-64 h-64 text-primary" />
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 pb-10 mb-12 gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <BarChart3 className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-display font-bold text-primary tracking-tight">Extracted Operational Data</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit Log Reference: #82941-X</p>
                     </div>
                  </div>
                  <div className="px-5 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Snapshot 2026</div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                  {[
                     { label: "Billed Demand", value: result.usage, sub: "kWh", icon: Zap },
                     { label: "Net Cost", value: `$${result.cost}`, sub: "USD", icon: DollarSign },
                     { label: "Billing Period", value: result.period, sub: "Verified", icon: FileText },
                     { label: "Estimated Tax", value: `$${result.tax}`, sub: "USD", icon: ShieldCheck }
                  ].map((item, i) => (
                     <div key={i} className="bg-white border border-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-6">
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                           <item.icon className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-3xl font-display font-black text-primary leading-none">{item.value}</p>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-3">{item.sub}</p>
                     </div>
                  ))}
                  
                  <div className="lg:col-span-4 mt-8 bg-primary p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-primary/20">
                     <div className="absolute right-0 top-0 h-full w-1/4 bg-white/5 skew-x-12 translate-x-1/2"></div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                           <Sparkles className="w-5 h-5 text-accent" />
                           <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">AI-Driven Anomaly Detection</p>
                        </div>
                        <p className="text-lg font-medium text-white leading-relaxed max-w-4xl">{result.anomalies}</p>
                     </div>
                  </div>
               </div>

               <div className="mt-14 pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-4 relative z-10">
                  <button className="h-14 px-10 rounded-2xl border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Reject Extraction</button>
                  <button className="btn-glow px-12 h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10">
                     Sync to Enterprise Dashboard
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  )
}

export default DocumentAutomation
