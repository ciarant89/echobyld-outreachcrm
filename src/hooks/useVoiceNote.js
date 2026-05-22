import { useState, useRef } from 'react'

export function useVoiceNote() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported] = useState(
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  )
  const recRef = useRef(null)

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.lang = 'en-IE'
    r.onresult = (e) => {
      const text = Array.from(e.results).map(x => x[0].transcript).join('')
      setTranscript(text)
    }
    r.onerror = () => setIsRecording(false)
    r.start()
    recRef.current = r
    setIsRecording(true)
  }

  const stopRecording = () => {
    recRef.current?.stop()
    setIsRecording(false)
  }

  const clearTranscript = () => setTranscript('')

  return { isRecording, transcript, isSupported, startRecording, stopRecording, clearTranscript }
}
