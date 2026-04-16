import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import useStore from './store/useStore'
import LandingPage from './pages/LandingPage'
import MainApp from './pages/MainApp'

function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <div className="bg-background text-text-main min-h-screen selection:bg-primary/30">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          ) : (
            <MainApp />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
