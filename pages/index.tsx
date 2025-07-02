import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Eingabe: ${input}`)
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
          <Image src="/logo.png" alt="Logo" width={150} height={150} />
        </div>

        {/* Begrüßungstext */}
        <div style={styles.textBox}>
          <h1>Hi, ich bin nexquip.</h1>
          <p>
            Ich helfe dir bei allen Themen rund um die Maschinen von Grenzland Baugeräte.
            <br />
            Sag mir einfach, wobei ich dir helfen kann!
          </p>
        </div>

        {/* Eingabeformular */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Beschreibe dein Problem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Senden</button>
        </form>

        {/* QR-Code Hinweis */}
        <div style={styles.qrSection}>
          <p>
            Oder scanne den QR-Code einer Maschine ein, um direkte Hilfe zu dieser Maschine zu erhalten.
          </p>
          <div style={styles.qrPlaceholder}>📷 QR-Scanner hier</div>
        </div>
      </main>
    </>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center' as const,
    fontFamily: 'Arial, sans-serif',
  },
  logoBox: {
    marginBottom: '2rem',
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
    width: '100%',
    height: '200px',
    background: '#f3f3f3',
    borderRadius: '10px',
    lineHeight: '200px',
    color: '#aaa',
  },
}
