import React, { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'

function App() {
  // state for CV data
  const [cvData, setCvData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  })

  // state for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false)

  // load data from LocalStorage 
  useEffect(() => {
    const savedData = localStorage.getItem('cvData')
    if (savedData) {
      setCvData(JSON.parse(savedData))
    }

    // load d a r k m o d e preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      setIsDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  // toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    
    if (newMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newData = { ...cvData, [name]: value }
    setCvData(newData)
    localStorage.setItem('cvData', JSON.stringify(newData))
  }

  const clearData = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setCvData({
        fullName: '',
        email: '',
        phone: '',
        summary: '',
        experience: '',
        education: '',
        skills: ''
      })
      localStorage.removeItem('cvData')
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    
    let y = 20
    
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text(cvData.fullName || 'Your Name', 105, y, { align: 'center' })
    
    y += 10
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`${cvData.email} | ${cvData.phone}`, 105, y, { align: 'center' })
    
    y += 15
    
    if (cvData.summary) {
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('PROFESSIONAL SUMMARY', 20, y)
      y += 7
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const summaryLines = doc.splitTextToSize(cvData.summary, 170)
      doc.text(summaryLines, 20, y)
      y += summaryLines.length * 5 + 10
    }
    
    if (cvData.experience) {
      if (y > 250) {
        doc.addPage()
        y = 20
      }
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('WORK EXPERIENCE', 20, y)
      y += 7
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const expLines = doc.splitTextToSize(cvData.experience, 170)
      doc.text(expLines, 20, y)
      y += expLines.length * 5 + 10
    }
    
    if (cvData.education) {
      if (y > 250) {
        doc.addPage()
        y = 20
      }
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('EDUCATION', 20, y)
      y += 7
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const eduLines = doc.splitTextToSize(cvData.education, 170)
      doc.text(eduLines, 20, y)
      y += eduLines.length * 5 + 10
    }
    
    if (cvData.skills) {
      if (y > 250) {
        doc.addPage()
        y = 20
      }
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('SKILLS', 20, y)
      y += 7
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const skillsLines = doc.splitTextToSize(cvData.skills, 170)
      doc.text(skillsLines, 20, y)
    }
    
    const fileName = cvData.fullName 
      ? `CV_${cvData.fullName.replace(/\s+/g, '_')}.pdf`
      : 'CV_Resume.pdf'
    doc.save(fileName)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>CV Builder prototype by rbbieee</h1>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p className="privacy-notice">
          Your data stays in your browser. This app dont store or transmit anything
        </p>
      </header>

      <div className="container">
        <div className="form-section">
          <h2>Personal Information</h2>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={cvData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={cvData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={cvData.phone}
              onChange={handleChange}
              placeholder="+62 812 3456 7890"
            />
          </div>

          <h2>Professional Summary</h2>
          <div className="form-group">
            <textarea
              name="summary"
              value={cvData.summary}
              onChange={handleChange}
              placeholder="Brief overview of your professional background..."
              rows="4"
            />
          </div>

          <h2>Work Experience</h2>
          <div className="form-group">
            <textarea
              name="experience"
              value={cvData.experience}
              onChange={handleChange}
              placeholder="Company Name - Position (Year - Year)
- Achievement 1
- Achievement 2"
              rows="6"
            />
          </div>

          <h2>Education</h2>
          <div className="form-group">
            <textarea
              name="education"
              value={cvData.education}
              onChange={handleChange}
              placeholder="University Name - Degree (Year)"
              rows="3"
            />
          </div>

          <h2>Skills</h2>
          <div className="form-group">
            <textarea
              name="skills"
              value={cvData.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js, etc."
              rows="3"
            />
          </div>

          <div className="button-group">
            <button onClick={exportPDF} className="btn-primary">
              Download PDF
            </button>
            <button onClick={clearData} className="btn-danger">
              Clear All Data
            </button>
          </div>
        </div>

        <div className="preview-section">
          <h2>Preview</h2>
          <div className="cv-preview">
            <h1>{cvData.fullName || 'Your Name'}</h1>
            <p>{cvData.email} | {cvData.phone}</p>
            
            {cvData.summary && (
              <>
                <h3>Professional Summary</h3>
                <p>{cvData.summary}</p>
              </>
            )}
            
            {cvData.experience && (
              <>
                <h3>Work Experience</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{cvData.experience}</p>
              </>
            )}
            
            {cvData.education && (
              <>
                <h3>Education</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{cvData.education}</p>
              </>
            )}
            
            {cvData.skills && (
              <>
                <h3>Skills</h3>
                <p>{cvData.skills}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App