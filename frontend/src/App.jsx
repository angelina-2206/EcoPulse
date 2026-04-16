import React from 'react'
import { AnimatePresence } from 'framer-motion'
import useStore from './store/useStore'
import LandingPage from './pages/LandingPage'
import MainApp from './pages/MainApp'

function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated)

  return (
    <div className="bg-background text-text-main min-h-screen selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <LandingPage key="landing" />
        ) : (
          <MainApp key="main" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
