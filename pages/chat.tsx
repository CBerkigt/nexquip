
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useRef } from 'react'

export default function ChatPage() {
  const router = useRouter()
  const initialQuestion = router.query.q as string
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

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

const hasAskedRef = useRef(false)
useEffect(() => {
  if (initialQuestion && !hasAskedRef.current) {
    hasAskedRef.current = true
    handleSubmit(initialQuestion)
  }
}, [initialQuestion, handleSubmit])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7f9] text-[#333] font-sans p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-[#2a2e35] mb-6">nexquip Chat</h1>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl max-w-[90%] whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-[#d0ebff] self-end ml-auto'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <strong>{msg.role === 'user' ? 'Du' : 'nexquip'}:</strong> {msg.text}
          </div>
        ))}

        {loading && (
          <div className="italic text-gray-500">
            <span className="animate-pulse">nexquip denkt …</span>
          </div>
        )}

        <div className="mt-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Deine Frage …"
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || input.trim() === ''}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Absenden
          </button>
        </div>
      </div>
    </main>
  )
}
