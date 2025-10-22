'use client'
import { useState, useEffect, useRef } from 'react'

export default function CourtRoom() {
  const [stage, setStage] = useState('work') // 'work' or 'court'
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [messages, setMessages] = useState([])
  const [bossMessages, setBossMessages] = useState([])
  const [familyMessages, setFamilyMessages] = useState([])
  const [currentFine, setCurrentFine] = useState(null)
  const timerRef = useRef(null)

  // Predefined issues that can appear
  const possibleIssues = [
    { id: 1, type: 'accessibility', description: 'Fix alt text in image 1', consequence: 'Disability Act', fine: 5000 },
    { id: 2, type: 'security', description: 'Fix input validation', consequence: 'Laws of Tort', fine: 10000 },
    { id: 3, type: 'functionality', description: 'Fix user login', consequence: 'Bankruptcy', fine: 50000 },
    { id: 4, type: 'security', description: 'Fix secure database', consequence: 'Laws of Tort', fine: 15000 },
    { id: 5, type: 'design', description: 'Change title color to Red', consequence: 'Design Standards', fine: 2000 }
  ]

  // Boss messages
  const bossMessageQueue = [
    "Are you done with sprint 1?",
    "The client is asking for updates",
    "We need to deploy by Friday",
    "Why are there so many bugs?",
    "The stakeholders are getting impatient"
  ]

  // Family messages
  const familyMessageQueue = [
    "Can you pick up the kids after work?",
    "Don&apos;t forget about dinner plans",
    "When will you be home?",
    "The kids have a school event tomorrow",
    "We need to talk about our vacation plans"
  ]

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning) return

    // Boss messages every 20-30 seconds
    if (timer % 25 === 0 && timer > 0) {
      const randomBossMessage = bossMessageQueue[Math.floor(Math.random() * bossMessageQueue.length)]
      setBossMessages(prev => [...prev, {
        id: Date.now(),
        text: randomBossMessage,
        timestamp: timer
      }])
    }

    // Family messages every 30-40 seconds
    if (timer % 35 === 0 && timer > 0) {
      const randomFamilyMessage = familyMessageQueue[Math.floor(Math.random() * familyMessageQueue.length)]
      setFamilyMessages(prev => [...prev, {
        id: Date.now(),
        text: randomFamilyMessage,
        timestamp: timer
      }])
    }

    // New issues appear randomly
    if (timer % 45 === 0 && timer > 0) {
      const randomIssue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)]
      setMessages(prev => [...prev, {
        ...randomIssue,
        timestamp: timer,
        urgent: false,
        veryUrgent: false
      }])
    }

    // Check for urgent issues (2 minutes after initial warning)
    messages.forEach(message => {
      if (!message.urgent && timer - message.timestamp >= 120) {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, urgent: true, description: `URGENT: ${msg.description}` } : msg
        ))
      }

      // Check for very urgent issues (2 more minutes after urgent)
      if (message.urgent && !message.veryUrgent && timer - message.timestamp >= 240) {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, veryUrgent: true, description: `VERY URGENT: ${msg.description.replace('URGENT: ', '')}` } : msg
        ))
        // Go to court room
        setStage('court')
        setCurrentFine({
          issue: message.description.replace('VERY URGENT: ', '').replace('URGENT: ', ''),
          consequence: message.consequence,
          fine: message.fine
        })
        setIsRunning(false)
      }
    })

  }, [timer, isRunning, messages, bossMessageQueue, familyMessageQueue, possibleIssues])

  const startTimer = () => {
    setTimer(0)
    setIsRunning(true)
    setMessages([])
    setBossMessages([])
    setFamilyMessages([])
    setStage('work')
    setCurrentFine(null)
  }

  const fixIssue = (issueId) => {
    setMessages(prev => prev.filter(msg => msg.id !== issueId))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetGame = () => {
    setIsRunning(false)
    setTimer(0)
    setMessages([])
    setBossMessages([])
    setFamilyMessages([])
    setStage('work')
    setCurrentFine(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Court Room Challenge</h1>
            <div className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">
              {formatTime(timer)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {stage === 'work' && (
          <div className="space-y-6">
            {/* Timer Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Set Your Timer</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => startTimer(5)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Start 5-Minute Session
                </button>
                <button
                  onClick={() => startTimer(10)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Start 10-Minute Session
                </button>
                <button
                  onClick={() => startTimer(15)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Start 15-Minute Session
                </button>
                {isRunning && (
                  <button
                    onClick={() => setIsRunning(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Pause
                  </button>
                )}
              </div>
            </div>

            {/* Work Environment with Background Image */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Your Work Desk</h2>
              <div 
                className="relative rounded-lg p-4 min-h-64 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/work-desk.jpg)' }}
              >
                <div className="bg-black bg-opacity-50 rounded-lg p-4 min-h-64">
                  <p className="text-white text-center py-16">
                    {isRunning ? 'Debugging in progress... Fix issues as they appear!' : 'Start the timer to begin debugging'}
                  </p>
                  
                  {/* Messages Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Issues to Fix */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-white">Issues to Fix</h3>
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`p-3 rounded border ${
                            message.veryUrgent 
                              ? 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700'
                              : message.urgent
                              ? 'bg-orange-100 border-orange-300 dark:bg-orange-900 dark:border-orange-700'
                              : 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span>{message.description}</span>
                            <button
                              onClick={() => fixIssue(message.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                            >
                              Fix
                            </button>
                          </div>
                          {message.veryUrgent && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                              ⚠️ Court case imminent!
                            </p>
                          )}
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <p className="text-gray-300 text-center py-4">
                          No current issues
                        </p>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg text-white">Boss Messages</h3>
                        {bossMessages.slice(-3).map(msg => (
                          <div key={msg.id} className="p-3 bg-blue-100 dark:bg-blue-900 rounded border border-blue-300 dark:border-blue-700 mb-2">
                            <p className="text-sm">👨‍💼 {msg.text}</p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg text-white">Family Messages</h3>
                        {familyMessages.slice(-3).map(msg => (
                          <div key={msg.id} className="p-3 bg-green-100 dark:bg-green-900 rounded border border-green-300 dark:border-green-700 mb-2">
                            <p className="text-sm">🏠 {msg.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 'court' && currentFine && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div 
              className="bg-cover bg-center rounded-lg p-6 border border-red-300 dark:border-red-700"
              style={{ backgroundImage: 'url(/images/court-room.jpg)' }}
            >
              <div className="bg-black bg-opacity-70 rounded-lg p-6">
                <div className="text-6xl mb-4">⚖️</div>
                <h2 className="text-3xl font-bold text-red-400 mb-4">COURT ROOM</h2>
                
                <div className="space-y-4 mb-6">
                  <p className="text-xl text-white">You have been found guilty of negligence!</p>
                  <div className="bg-white dark:bg-gray-700 rounded p-4 max-w-md mx-auto">
                    <p><strong>Issue:</strong> {currentFine.issue}</p>
                    <p><strong>Violation:</strong> {currentFine.consequence}</p>
                    <p><strong>Fine:</strong> ${currentFine.fine.toLocaleString()}</p>
                  </div>
                  {currentFine.consequence === 'Bankruptcy' && (
                    <p className="text-red-400 font-semibold">
                      Your company has been declared bankrupt! No one can use your app and you won&apos;t get paid.
                    </p>
                  )}
                  {currentFine.consequence === 'Laws of Tort' && (
                    <p className="text-red-400 font-semibold">
                      You were hacked and knew about the vulnerability but didn&apos;t fix it!
                    </p>
                  )}
                  {currentFine.consequence === 'Disability Act' && (
                    <p className="text-red-400 font-semibold">
                      You violated accessibility standards and discriminated against users with disabilities!
                    </p>
                  )}
                </div>

                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">How to Play</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Set a timer and start debugging</li>
            <li>Fix issues as they appear to avoid consequences</li>
            <li>You&apos;ll receive messages from your boss and family</li>
            <li>If you ignore an issue for 2 minutes, it becomes urgent</li>
            <li>If you ignore an urgent issue for 2 more minutes, you go to court</li>
            <li>Different issues have different legal consequences</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
