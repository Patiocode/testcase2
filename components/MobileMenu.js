'use client'
import { useEffect } from 'react'

export default function MobileMenu({ isOpen, onClose, activeTab, onTabChange, tabs }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="mobile-menu open fixed top-0 left-0 h-full w-64 bg-gray-100 dark:bg-gray-800 p-6 shadow-lg z-20">
      <div className="flex justify-between items-center mb-8">
        <div className="text-lg font-bold">20963798</div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col space-y-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`text-left hover:text-blue-600 transition-colors ${
              activeTab === tab.id ? 'tab-active' : ''
            }`}
            onClick={() => {
              onTabChange(tab.id)
              onClose()
            }}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )
}