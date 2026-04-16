import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, CheckCircle2, FileText, Cpu, Search } from 'lucide-react'

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
           cost: '$492.24',
           period: 'Oct 2024',
           tax: '$42.10',
           anomalies: 'Peak load detected on Oct 14th'
         })
         setStatus('complete')
      }, 3500)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Upload Zone */}
      <div className={`glass-panel border-2 ${status === 'idle' ? 'border-dashed border-white/20 hover:border-primary/50' : 'border-white/10'} p-12 text-center relative overflow-hidden transition-colors`}>
         
         <AnimatePresence mode="wait">
            {status === 'idle' && (
               <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <div className="w-20 h-20 bg-background-layered rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-glass-panel">
                     <UploadCloud className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-display">Neural Document Parsing</h3>
                  <p className="text-text-muted max-w-sm mx-auto mb-8">Securely upload utility invoices. Our OCR model extracts metrics, costs, and anomalies automatically.</p>
                  
                  <input type="file" id="doc-upload" className="hidden" accept=".pdf,image/*" onChange={handleUpload} />
                  <label htmlFor="doc-upload" className="btn-glow inline-flex cursor-pointer">
                     Select File to Scan
                  </label>
               </motion.div>
            )}

            {(status === 'uploading' || status === 'scanning') && (
               <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                     <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
                     <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                     <Cpu className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                     {status === 'uploading' ? 'Encrypting & Uploading...' : 'Running OCR Models...'}
                  </h3>
                  <p className="text-text-muted text-sm font-mono">{file?.name}</p>
               </motion.div>
            )}

            {status === 'complete' && (
               <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-6 shadow-glow-primary">
                     <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-display">Extraction Matrix Complete</h3>
                  <p className="text-text-muted text-sm font-mono bg-white/5 inline-block px-3 py-1 rounded-md border border-white/10">{file?.name}</p>
                  <button onClick={() => { setFile(null); setStatus('idle'); setResult(null); }} className="block mx-auto mt-6 text-sm text-text-muted hover:text-white underline">Scan another document</button>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Results Matrix */}
      {result && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
               <FileText className="w-5 h-5 text-accent" />
               <h3 className="text-lg font-bold text-white font-display">Structured Telemetry</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
               {[
                  { label: "Billed Usage", value: result.usage, sub: result.unit, border: 'border-l-primary' },
                  { label: "Total Liability", value: result.cost, sub: "USD", border: 'border-l-blue-500' },
                  { label: "Billing Cycle", value: result.period, sub: "Verified", border: 'border-l-accent' },
                  { label: "Tax & Fees", value: result.tax, sub: "USD", border: 'border-l-white/20' }
               ].map((item, i) => (
                  <div key={i} className={`bg-background-layered border py-4 px-5 rounded-xl border-t-white/5 border-r-white/5 border-b-white/5 border-l-4 ${item.border}`}>
                     <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{item.label}</p>
                     <p className="text-2xl font-black text-white font-display mt-1">{item.value} <span className="text-xs font-medium text-text-muted tracking-normal">{item.sub}</span></p>
                  </div>
               ))}
               
               <div className="col-span-2 bg-accent/5 border border-accent/20 py-4 px-5 rounded-xl">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">AI Observation</p>
                  <p className="text-sm font-semibold text-white mt-2">{result.anomalies}</p>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
               <button className="btn-glow px-8 h-12 flex items-center gap-2">
                  Push Data to Baseline <Search className="w-4 h-4 ml-2" />
               </button>
            </div>
         </motion.div>
      )}
    </div>
  )
}

export default DocumentAutomation
