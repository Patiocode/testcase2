'use client'
import { useState, useEffect } from 'react'

export default function CodeGenerator() {
  const [title, setTitle] = useState('Hello!')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [content, setContent] = useState('Type here.')
  const [customJS, setCustomJS] = useState(`document.addEventListener('DOMContentLoaded', function() {\n    console.log('Page loaded successfully!');\n});`)
  const [generatedCode, setGeneratedCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedCodes, setSavedCodes] = useState([])

  useEffect(() => {
    // Load saved values from localStorage
    if (typeof window !== 'undefined') {
      const savedTitle = localStorage.getItem('pageTitle')
      const savedContent = localStorage.getItem('pageContent')
      const savedJS = localStorage.getItem('customJS')
      
      if (savedTitle) setTitle(savedTitle)
      if (savedContent) setContent(savedContent)
      if (savedJS) setCustomJS(savedJS)
    }
    
    generateCode()
    loadSavedCodes()
  }, [])

  const generateCode = () => {
    const code = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: ${bgColor};
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <p>${content.replace(/\n/g, '<br>')}</p>
        <button onclick="alert('This button works!')">Click Me</button>
    </div>
    
    <script>
        ${customJS}
    </script>
</body>
</html>`
    
    setGeneratedCode(code)
    return code
  }

  const saveToDatabase = async () => {
    setSaving(true)
    try {
      const code = generateCode() 
      
      const response = await fetch('/api/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || 'Untitled Code',
          htmlCode: code,
          cssCode: null,
          jsCode: customJS,
          type: 'website'
        }),
      })
      
      if (response.ok) {
        const savedCode = await response.json()
        alert('Code saved successfully to database!')
        loadSavedCodes() // Refresh the list
      } else {
        const error = await response.json()
        alert('Failed to save code: ' + error.error)
      }
    } catch (error) {
      console.error('Error saving code:', error)
      alert('Error saving code to database')
    } finally {
      setSaving(false)
    }
  }

  const loadSavedCodes = async () => {
    try {
      const response = await fetch('/api/codes')
      if (response.ok) {
        const codes = await response.json()
        setSavedCodes(codes)
      }
    } catch (error) {
      console.error('Error loading saved codes:', error)
    }
  }

  const deleteCode = async (id) => {
    if (confirm('Are you sure you want to delete this code?')) {
      try {
        const response = await fetch(`/api/codes/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          alert('Code deleted successfully!')
          loadSavedCodes() 
        } else {
          alert('Failed to delete code')
        }
      } catch (error) {
        console.error('Error deleting code:', error)
        alert('Error deleting code')
      }
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      alert('Code copied to clipboard!')
    } catch (err) {
      alert('Failed to copy code: ' + err)
    }
  }

  const downloadCode = () => {
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
    const blob = new Blob([generatedCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGenerate = () => {
    generateCode()
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('pageTitle', title)
      localStorage.setItem('pageContent', content)
      localStorage.setItem('customJS', customJS)
    }
  }

  return (
    <>
      {/* Generated Code Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Generated Code</h2>
        <div className="code-output p-4 rounded-lg overflow-auto max-h-96 mb-4">
          <pre className="whitespace-pre-wrap">{generatedCode}</pre>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={copyCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Copy Code
          </button>
          <button 
            onClick={downloadCode}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Download HTML File
          </button>
          <button 
            onClick={saveToDatabase} 
            disabled={saving || !generatedCode}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
          >
            {saving ? 'Saving...' : 'Save to Database'}
          </button>
        </div>
      </section>

      {/* Website Generator Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Website Generator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Background Color</label>
            <input 
              type="color" 
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full p-1 border rounded h-10 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4" 
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Custom JavaScript</label>
          <textarea 
            value={customJS}
            onChange={(e) => setCustomJS(e.target.value)}
            rows="3" 
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Generate Code
          </button>
          <button 
            onClick={() => {
              handleGenerate()
              downloadCode()
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Generate & Download
          </button>
        </div>
      </section>

      {/* Saved Codes Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Saved Codes</h2>
        <div className="space-y-4">
          {savedCodes.length === 0 ? (
            <p className="text-gray-500">No saved codes yet.</p>
          ) : (
            savedCodes.map((code) => (
              <div key={code.id} className="p-4 border rounded dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{code.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(code.createdAt).toLocaleDateString()} • {code.type}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteCode(code.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => {
                    setGeneratedCode(code.htmlCode)
                    alert('Code loaded! Scroll up to view.')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mt-2"
                >
                  Load Code
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}
