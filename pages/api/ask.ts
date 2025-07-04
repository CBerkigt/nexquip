import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY ist nicht gesetzt. Bitte in .env.local eintragen.')
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2',
  },
})


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const userInput = req.body.message
  if (!userInput) return res.status(400).json({ error: 'Keine Eingabe erhalten.' })

  console.log('🟡 Benutzerfrage empfangen:', userInput)

  try {
    // 1. Bestehenden Assistant verwenden oder hier festlegen
    const assistant_id = 'asst_8EIO37m4WurwPVsutEEMOUq1' // Lege vorher einen Assistant über die OpenAI-Konsole an!

    // 2. Thread erstellen
    const thread = await openai.beta.threads.create()

    // 3. Nachricht anhängen
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userInput,
    })

    // 4. Run starten
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id,
    })

    console.log('▶️ Run gestartet:', run.id)

    // 5. Auf Fertigstellung warten
    let runStatus = run
    while (runStatus.status !== 'completed' && runStatus.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(run.id, {
  thread_id: thread.id,
})

      console.log('⏳ Run-Status:', runStatus.status)
      if (runStatus.status === 'failed') {
  console.error('❌ Run fehlgeschlagen:', JSON.stringify(runStatus, null, 2))

}
    }

    // 6. Antwort abrufen
    const messages = await openai.beta.threads.messages.list(thread.id)
    const last = messages.data.reverse().find((msg) =>
      msg.role === 'assistant' && msg.content[0]?.type === 'text'
    )

    const reply = last?.content[0]?.type === 'text'
      ? last.content[0].text.value
      : 'Keine Antwort erhalten.'

    console.log('✅ Assistent-Antwort:', reply)

    res.status(200).json({ reply })
  } catch (err: unknown) {
  if (err instanceof Error) {
    console.error('❌ Fehler bei KI-Anfrage:', err.message)
  } else {
    console.error('❌ Unbekannter Fehler:', err)
  }
  res.status(500).json({ error: 'Fehler bei der KI-Verarbeitung' })
}

}
