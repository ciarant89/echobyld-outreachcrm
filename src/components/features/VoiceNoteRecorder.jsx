import { Mic, Square, Save } from 'lucide-react'
import { useVoiceNote } from '../../hooks/useVoiceNote'
import Button from '../ui/Button'

export default function VoiceNoteRecorder({ onSave }) {
  const { isRecording, transcript, isSupported, startRecording, stopRecording, clearTranscript } = useVoiceNote()

  const handleSave = () => {
    if (!transcript.trim()) return
    onSave({
      type: 'voice_note',
      title: 'Voice note',
      body: transcript,
      occurred_at: new Date().toISOString(),
      owner: 'Ciaran',
    })
    clearTranscript()
  }

  if (!isSupported) {
    return (
      <div style={{
        background: '#FFF3E0',
        border: '1px solid #FFB74D',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 16,
      }}>
        <p style={{ fontSize: 12, color: '#7A3800', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
          Voice notes require Chrome or Safari with microphone access enabled.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: '#0D1410',
      border: '1px solid #33533D',
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#ADCCB7',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 12,
        fontFamily: 'Poppins, sans-serif',
      }}>
        Voice Note
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? 'recording-pulse' : ''}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: isRecording ? '#7F0000' : '#33533D',
            border: `2px solid ${isRecording ? '#EF9A9A' : '#60866C'}`,
            color: '#fff',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isRecording ? <Square size={18} /> : <Mic size={18} />}
        </button>

        <div style={{ flex: 1 }}>
          {isRecording && (
            <div style={{
              fontSize: 11,
              color: '#EF4444',
              fontWeight: 700,
              marginBottom: 6,
              fontFamily: 'Poppins, sans-serif',
            }}>
              ● Recording…
            </div>
          )}
          {transcript ? (
            <div style={{
              fontSize: 13,
              color: '#ADCCB7',
              lineHeight: 1.6,
              background: '#1A2B1F',
              borderRadius: 6,
              padding: '8px 10px',
              fontFamily: 'Poppins, sans-serif',
            }}>
              {transcript}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
              {isRecording ? 'Speak now…' : 'Tap mic to record a voice note'}
            </div>
          )}
        </div>

        {transcript && !isRecording && (
          <Button variant="secondary" size="sm" onClick={handleSave}>
            <Save size={13} /> Save
          </Button>
        )}
      </div>
    </div>
  )
}
