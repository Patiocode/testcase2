'use client'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'

export default function Header({ activeTab, onTabChange, tabs }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
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
              onClick={() => onTabChange(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center">
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabs={tabs}
      />
    </>
  )
}