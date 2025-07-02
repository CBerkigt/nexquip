import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [input, setInput] = useState('')
  const router = useRouter()

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim()) return
  router.push(`/chat?q=${encodeURIComponent(input)}`)
}


  return (
    <>
      <Head>
        <title>nexquip</title>
        <meta name="description" content="nexquip Support Startscreen" />
      </Head>

      <main style={styles.container}>
        {/* Logo */}
        <div style={styles.logoBox}>
  <div style={styles.logoBackground}>
    <Image
      src="/logo1.png"
      alt="Logo"
      width={399}
      height={153}
      style={{ height: 'auto', maxWidth: '100%' }}
    />
  </div>
</div>

        {/* Begrüßungstext */}
        <div style={styles.textBox}>
          <h1 style={{ color: '#f9f9f9', textShadow: '0 0 4px rgba(0,0,0,0.4)' }}>Hi, ich bin nexquip!</h1>
<p style={{ color: '#f9f9f9' , textShadow: '0 0 4px rgba(0,0,0,0.4)'}}>
  Ich helfe dir bei allem rund um die Maschinen von Grenzland-Baugeräte.
</p>
        </div>

        {/* Eingabeformular */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Wobei kann ich dir helfen?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Senden</button>
        </form>

        {/* QR-Code Hinweis */}
        <div style={styles.qrSection}>
         <p style={{ color: '#f9f9f9', textShadow: '0 0 4px rgba(0,0,0,0.4)' }}>
  Oder scanne den QR-Code einer Maschine ein, um direkte Hilfe zu dieser Maschine zu erhalten.
</p>

          {/* Klickbarer QR-Code-Platzhalter */}
          <div style={styles.qrPlaceholder} onClick={() => alert('QR-Scanner öffnen (später)')}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=scan"
              alt="QR-Code Platzhalter"
              style={{ marginBottom: '0.5rem' }}
            />
            <div style={{ color: '#555' }}>QR-Code scannen</div>
          </div>
        </div>
      </main>
    </>
  )
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
    padding: '2rem',
    textAlign: 'center' as const,
    fontFamily: 'Arial, sans-serif',
  },
  logoBox: {
    marginBottom: '2rem',
  },
  logoBackground: {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '12px',
  display: 'inline-block',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
},

  textBox: {
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    padding: '0.8rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  qrSection: {
    marginTop: '2rem',
    color: '#444',
  },
  qrPlaceholder: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#f3f3f3',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'inline-block',
  },
}
