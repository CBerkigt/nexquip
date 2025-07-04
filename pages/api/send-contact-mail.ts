// pages/api/send-contact.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ContactRequestBody {
  phone: string;
  chatHistory: ChatMessage[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' })
  }

  const { phone, chatHistory } = req.body as ContactRequestBody

  if (!phone || !chatHistory || !Array.isArray(chatHistory)) {
    return res.status(400).json({ error: 'Fehlende oder ungültige Daten' })
  }

  const formattedHistory = chatHistory
    .map((msg) => `${msg.role === 'user' ? '👤' : '🤖'}: ${msg.text}`)
    .join('\n')

  // ⛳ SMTP-Konfiguration (bitte anpassen)
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // TLS wird explizit aktiviert
    auth: {
      user: 'christian.berkigt@eyefidelity.it',        // <-- Ersetze mit deiner Mailadresse
      pass: 'AKF.uth-qda.ntq6ajz', // <-- ggf. App-Passwort verwenden
    },
    tls: {
      ciphers: 'SSLv3',
    },
  })

  const mailOptions = {
    from: 'christian.berkigt@eyefidelity.it',
    to: 'christian.berkigt@eyefidelity.it',
    subject: '📩 Kontaktanfrage aus nexquip KI',
    text: `Ein Nutzer möchte kontaktiert werden.

📞 Telefonnummer: ${phone}

💬 Chatverlauf:
${formattedHistory}
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('❌ Fehler beim Mailversand:', error)
    res.status(500).json({ error: 'Fehler beim Mailversand' })
  }
}
