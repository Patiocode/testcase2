'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

// Simple icon components using emojis and text
const PlayIcon = () => <span>▶️</span>
const PauseIcon = () => <span>⏸️</span>
const ResetIcon = () => <span>🔄</span>
const CheckIcon = () => <span>✅</span>

export default function EscapeRoom() {
  const [stage, setStage] = useState(0)
  const [timeSeconds, setTimeSeconds] = useState(300)
  const [initialTime, setInitialTime] = useState(300)
  const [timerRunning, setTimerRunning] = useState(false)
  const [manualTime, setManualTime] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)

  // Stage 1: Format Code
  const [formattedCode, setFormattedCode] = useState('')
  const correctFormatted = 'function greet(name) {\n  return "Hello, " + name;\n}'

  // Stage 2: Debug Code
  const [bugClicked, setBugClicked] = useState(false)

  // Stage 3: Generate numbers
  const [numberCode, setNumberCode] = useState('')

  // Stage 4: Data conversion
  const [conversionCode, setConversionCode] = useState('')

  // Output display
  const [output, setOutput] = useState('Game started!')

  useEffect(() => {
    let interval
    if (timerRunning && timeSeconds > 0) {
      interval = setInterval(() => setTimeSeconds(t => t - 1), 1000)
    } else if (timeSeconds === 0) {
      setTimerRunning(false)
      setFeedback('⏰ Time&apos;s up! Game Over!')
    }
    return () => clearInterval(interval)
  }, [timerRunning, timeSeconds])

  const setCustomTime = () => {
    const timeInSeconds = manualTime * 60
    setTimeSeconds(timeInSeconds)
    setInitialTime(timeInSeconds)
    setTimerRunning(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addScore = (points) => {
    setScore(prev => prev + points)
  }

  const checkStage1 = () => {
    const userCode = formattedCode.trim().replace(/\s+/g, ' ').replace(/\{\s/g, '{').replace(/\s\}/g, '}').replace(/;\s/g, ';')
    const correctCode = correctFormatted.trim().replace(/\s+/g, ' ').replace(/\{\s/g, '{').replace(/\s\}/g, '}').replace(/;\s/g, ';')
    
    if (userCode === correctCode) {
      setFeedback('✓ Code formatted correctly! +1 point')
      addScore(1)
      setOutput('Formatted code accepted!')
      setTimeout(() => {
        setStage(1)
        setFeedback('')
        setFormattedCode('')
        setOutput('')
      }, 1500)
    } else {
      setFeedback('✗ Code format is incorrect. Check spacing and structure!')
      setOutput('Format error detected')
    }
  }

  const checkStage2 = () => {
    if (bugClicked) {
      setFeedback('✓ Bug found! +1 point - Missing semicolon was the issue!')
      addScore(1)
      setOutput('Bug fixed: Added missing semicolon')
      setTimeout(() => {
        setStage(2)
        setFeedback('')
        setBugClicked(false)
        setOutput('')
      }, 1500)
    }
  }

  const checkStage3 = () => {
    try {
      const fn = new Function('return (' + numberCode + ')()')
      const result = fn()
      if (Array.isArray(result) && result.length === 1000 && result[0] === 0 && result[999] === 999) {
        setFeedback('✓ Perfect! +2 points')
        addScore(2)
        setOutput(`Generated array: [${result.slice(0, 5).join(', ')}, ..., ${result.slice(-3).join(', ')}] (1000 items)`)
        setTimeout(() => {
          setStage(3)
          setFeedback('')
          setNumberCode('')
          setOutput('')
        }, 1500)
      } else {
        setFeedback('✗ Check your output - should generate array from 0 to 999')
        setOutput('Invalid array generated')
      }
    } catch (e) {
      setFeedback('✗ Code error: ' + e.message)
      setOutput('Error: ' + e.message)
    }
  }

  const checkStage4 = () => {
    try {
      const fn = new Function('return (' + conversionCode + ')()')
      const result = fn()
      
      const expectedData = {
        name: 'John',
        age: 30,
        email: 'john@example.com'
      }
      
      if (JSON.stringify(result) === JSON.stringify(expectedData)) {
        setFeedback('✓ Data conversion complete! +2 points')
        addScore(2)
        setOutput(JSON.stringify(result, null, 2))
        setTimeout(() => {
          setStage(4)
          setTimerRunning(false)
        }, 1500)
      } else {
        setFeedback('✗ Data conversion incorrect.')
        setOutput(JSON.stringify(result, null, 2))
      }
    } catch (e) {
      setFeedback('✗ Code error: ' + e.message)
      setOutput('Error: ' + e.message)
    }
  }

  const resetGame = () => {
    setStage(0)
    setTimeSeconds(300)
    setInitialTime(300)
    setTimerRunning(false)
    setFeedback('')
    setFormattedCode('')
    setBugClicked(false)
    setNumberCode('')
    setConversionCode('')
    setScore(0)
    setOutput('Game started!')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header with SVG Icon */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* SVG Image */}
              <div className="w-10 h-10 relative">
                <Image 
                  src="/escaperoom.svg" 
                  alt="Escape Room" 
                  width={280}
                  height={160}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Escape Room Challenge</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">
                {formatTime(timeSeconds)}
              </div>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">Score: {score}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Timer Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Set Your Timer</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                {timerRunning ? <PauseIcon /> : <PlayIcon />}
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                <ResetIcon />
                Reset
              </button>
            </div>

            {/* Manual Time Setting */}
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                value={manualTime}
                onChange={(e) => setManualTime(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded w-20 border border-gray-300 dark:border-gray-600"
                placeholder="Minutes"
              />
              <span className="text-gray-600 dark:text-gray-300 text-sm">minutes</span>
              <button
                onClick={setCustomTime}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Set Time
              </button>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {stage < 4 ? `Stage ${stage + 1}/4` : 'Escape Complete!'}
            </h2>

            {/* Stage 0: Format Code */}
            {stage === 0 && (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Fix the code formatting. Rewrite it with proper indentation and structure:
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 text-gray-800 dark:text-yellow-300 text-sm font-mono border border-gray-300 dark:border-gray-600">
                  function greet(name){'{'}return &quot;Hello, &quot; + name;{'}'}
                </div>
                <textarea
                  value={formattedCode}
                  onChange={(e) => setFormattedCode(e.target.value)}
                  placeholder="Write the formatted code here..."
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-green-400 p-4 rounded mb-4 font-mono border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={checkStage1}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon />
                  Check Answer
                </button>
              </div>
            )}

            {/* Stage 1: Debug Code */}
            {stage === 1 && (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Find and click the BUG to fix the code:</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 text-gray-800 dark:text-green-400 font-mono border border-gray-300 dark:border-gray-600">
                  <div>let x = 5</div>
                  <div>console.log(x)</div>
                </div>
                <div className="relative bg-gray-200 dark:bg-gray-900 h-48 rounded border-2 border-dashed border-gray-400 dark:border-gray-600 mb-4 overflow-hidden flex items-center justify-center">
                  <div className="text-gray-500 dark:text-gray-400">Click to find the bug...</div>
                  <button
                    onClick={() => {
                      setBugClicked(true)
                      checkStage2()
                    }}
                    className="absolute w-12 h-12 bg-red-500 rounded-full hover:bg-red-600 animate-pulse transition-colors"
                    title="Click the bug!"
                    style={{ top: '40%', left: '60%' }}
                  />
                </div>
              </div>
            )}

            {/* Stage 2: Generate Numbers */}
            {stage === 2 && (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Write a function that generates an array of numbers from 0 to 999:
                </p>
                <textarea
                  value={numberCode}
                  onChange={(e) => setNumberCode(e.target.value)}
                  placeholder="Example: () => Array.from({length: 1000}, (_, i) => i)"
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-green-400 p-4 rounded mb-4 font-mono border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={checkStage3}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon />
                  Check Answer
                </button>
              </div>
            )}

            {/* Stage 3: Data Conversion */}
            {stage === 3 && (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Convert CSV data to JSON. The input is: &quot;John,30,john@example.com&quot;
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Expected output: {'{'}name: &apos;John&apos;, age: 30, email: &apos;john@example.com&apos;{'}'}
                </p>
                <textarea
                  value={conversionCode}
                  onChange={(e) => setConversionCode(e.target.value)}
                  placeholder="Write a function that converts the CSV to JSON..."
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-green-400 p-4 rounded mb-4 font-mono border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={checkStage4}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon />
                  Check Answer
                </button>
              </div>
            )}

            {/* Stage 4: Complete */}
            {stage === 4 && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Escape Successful!</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">Time taken: {formatTime(initialTime - timeSeconds)}</p>
                <p className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold mb-4">Final Score: {score}/6</p>
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className={`mt-4 p-4 rounded text-center font-bold border ${
                  feedback.includes('✓')
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
                }`}
              >
                {feedback}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📤 Output</h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 h-96 overflow-y-auto border border-gray-300 dark:border-gray-600">
              <pre className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre-wrap break-words">
                {output || 'Output will appear here...'}
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How to Play</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Set a timer and start the escape room challenge</li>
            <li>Complete each coding stage to progress to the next one</li>
            <li><strong>Stage 1:</strong> Fix code formatting and indentation</li>
            <li><strong>Stage 2:</strong> Find and click the bug in the code</li>
            <li><strong>Stage 3:</strong> Generate an array of numbers from 0 to 999</li>
            <li><strong>Stage 4:</strong> Convert CSV data to JSON format</li>
            <li>Complete all stages before time runs out to escape!</li>
            <li>Earn points for each completed stage (max 6 points)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
