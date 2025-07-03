import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FiHome, FiFolder, FiTool, FiInfo } from 'react-icons/fi'

export default function ChatPage() {
  const router = useRouter()
  const initialQuestion = router.query.q as string
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const hasAskedRef = useRef(false)

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = useCallback(async (text?: string) => {
    const userText = text ?? input.trim()
    if (!userText || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: userText }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })
      const data = await res.json()
      const reply = data.reply ?? 'Keine Antwort erhalten.'
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    } catch (err: unknown) {
      console.error('Fehler bei der Anfrage:', err)
      setMessages((prev) => [...prev, { role: 'assistant', text: '❌ Fehler bei der KI-Anfrage.' }])
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  useEffect(() => {
    if (initialQuestion && !hasAskedRef.current) {
      hasAskedRef.current = true
      handleSubmit(initialQuestion)
    }
  }, [initialQuestion, handleSubmit])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const styles = {
    container: {
      backgroundImage: 'url("/bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 1rem 2rem',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    headerMenu: {
      width: '100%',
      position: 'sticky' as const,
      top: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-start',
      gap: '1.5rem',
      padding: '1rem',
      backgroundColor: 'rgba(30,30,30,0.8)',
      color: '#14532d',
      fontSize: '1.25rem',
    },
    logoBox: {
      margin: '1.5rem auto 2rem',
      textAlign: 'center' as const,
    },
    logoBackground: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '12px',
      display: 'inline-block',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
    },
    chatBubble: (isUser: boolean) => ({
      backgroundColor: isUser ? '#d0ebff' : '#ffffff',
      color: '#1e293b',
      textAlign: isUser ? 'right' as const : 'left' as const,
      alignSelf: isUser ? 'flex-end' as const : 'flex-start' as const,
      padding: '1rem',
      borderRadius: '12px',
      margin: '0.5rem 0',
      maxWidth: '90%',
      boxShadow: '0 0 5px rgba(0,0,0,0.05)',
      whiteSpace: 'pre-wrap' as const,
    }),
    inputBox: {
      marginTop: '1rem',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      resize: 'none' as const,
      fontFamily: 'inherit',
      fontSize: '1rem',
      outline: 'none',
      color: '#1e293b',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
      fontSize: '1rem',
    },
  }

  return (
    <div style={styles.container}>
      {/* Header-Menü */}
      <div style={styles.headerMenu}>
        <FiHome />
        <FiFolder />
        <FiTool />
        <FiInfo />
      </div>

      {/* Logo */}
      <div style={styles.logoBox}>
        <div style={styles.logoBackground}>
          <img src="/logo1.png" alt="nexquip Logo" style={{ maxHeight: '80px' }} />
        </div>
      </div>

      {/* Chat-Verlauf */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={styles.chatBubble(msg.role === 'user')}>
            <strong>{msg.role === 'user' ? 'Du' : 'nexquip'}:</strong> {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ fontStyle: 'italic', color: '#888', marginTop: '0.5rem' }}>
            <span className="animate-pulse">nexquip denkt …</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Eingabe */}
      <div style={styles.inputBox}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Deine Frage …"
          rows={2}
          style={styles.textarea}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={loading || input.trim() === ''}
          style={{ ...styles.button, opacity: loading || input.trim() === '' ? 0.6 : 1 }}
        >
          Absenden
        </button>
      </div>
    </div>
  )
}
