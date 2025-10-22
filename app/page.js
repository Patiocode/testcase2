'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getCookie, setCookie } from '../lib/cookies'

// Dynamically import heavy components for better performance
const EscapeRoom = dynamic(() => import('../components/EscapeRoom'), {
  loading: () => <p className="text-center p-8">Loading Escape Room...</p>,
  ssr: false
})

const CourtRoom = dynamic(() => import('../components/CourtRoom'), {
  loading: () => <p className="text-center p-8">Loading Court Room...</p>,
  ssr: false
})

const CodeGenerator = dynamic(() => import('../components/CodeGenerator'), {
  loading: () => <p className="text-center p-8">Loading Code Generator...</p>,
  ssr: false
})

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [darkMode, setDarkMode] = useState(false)

  // Load saved preferences on component mount
  useEffect(() => {
    const savedTab = getCookie('activeTab') || 'home'
    const savedTheme = getCookie('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    
    setActiveTab(savedTab)
    setDarkMode(savedTheme === 'dark')
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCookie('activeTab', tab, 7)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    const theme = newDarkMode ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    setCookie('theme', theme, 30)
  }

  const tabs = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'escape-room', name: 'Escape Room' },
    { id: 'coding-races', name: 'Coding Races' },
    { id: 'court-room', name: 'Court Room' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="text-lg font-bold">20963798</div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-link hover:text-blue-600 transition-colors ${
                activeTab === tab.id ? 'tab-active' : ''
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center">
          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="tab-content active">
            <h1 className="text-3xl font-bold mb-8 text-center">HTML5 Code Generator</h1>
            <CodeGenerator />
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="tab-content active">
            <h1 className="text-3xl font-bold mb-8 text-center">About</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Patrick Daglas</h2>
              <p className="mb-4"><strong>Student Number:</strong> 20963798</p>
              <h3 className="text-xl font-semibold mb-4">How to Use This Website</h3>
              <p>This application provides various coding challenges and tools to help improve your programming skills.</p>
            </div>
          </div>
        )}

        {/* Escape Room Tab */}
        {activeTab === 'escape-room' && (
          <div className="tab-content active">
            <EscapeRoom />
          </div>
        )}

        {/* Coding Races Tab */}
        {activeTab === 'coding-races' && (
          <div className="tab-content active">
            <h1 className="text-3xl font-bold mb-8 text-center">Coding Races</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-center">This section is under development.</p>
            </div>
          </div>
        )}

        {/* Court Room Tab */}
        {activeTab === 'court-room' && (
          <div className="tab-content active">
            <CourtRoom />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer py-6 px-6 text-center">
        <p>&copy; {new Date().getFullYear()} Patrick Daglas, 20963798, {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  )
}