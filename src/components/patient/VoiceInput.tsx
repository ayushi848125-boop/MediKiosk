'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RefreshCw, CheckCircle2, Volume2 } from 'lucide-react';
import { Language } from '@/types';
import { speakText } from '@/lib/speech';
import { TRANSLATIONS } from '@/lib/translations';

interface VoiceInputProps {
  language: Language;
  onVoiceResult: (transcription: string) => void;
  promptText?: string;
}

export default function VoiceInput({ language, onVoiceResult, promptText }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;

        const langMap: Record<Language, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          kn: 'kn-IN',
        };
        recog.lang = langMap[language] || 'en-IN';

        recog.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recog.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          setErrorMsg(
            language === 'hi'
              ? 'आवाज स्पष्ट नहीं सुनाई दी। कृपया पुनः माइक दबाएं और बोलें।'
              : language === 'kn'
              ? 'ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಒತ್ತಿ ಮತ್ತೆ ಮಾತನಾಡಿ.'
              : 'Could not detect clear speech. Please tap the mic and try speaking again.'
          );
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, [language]);

  const toggleListening = () => {
    setErrorMsg('');
    if (!recognition) {
      // Demo speech simulation fallback for browsers without Web Speech STT support
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setTranscript(
          language === 'hi'
            ? 'छाती में 2 दिन से बहुत दर्द हो रहा है'
            : language === 'kn'
            ? '2 ದಿನಗಳಿಂದ ಎದೆ ನೋವು ತೀವ್ರವಾಗಿದೆ'
            : 'Chest pain for 2 days worsening on walking'
        );
      }, 2500);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onVoiceResult(transcript.trim());
      setTranscript('');
    }
  };

  const handleReset = () => {
    setTranscript('');
    setErrorMsg('');
  };

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 text-center space-y-4 shadow-sm">
      {promptText && (
        <div className="flex items-center justify-center gap-2 text-slate-800 font-bold text-base">
          <span>{promptText}</span>
          <button
            type="button"
            onClick={() => speakText(promptText, language)}
            className="p-2 bg-slate-200 text-slate-800 rounded-full hover:bg-slate-300 transition-colors"
            title="Listen to audio prompt"
          >
            <Volume2 className="w-4 h-4 text-teal-700" />
          </button>
        </div>
      )}

      {/* Large Kiosk Touch Microphone Button */}
      <button
        type="button"
        onClick={toggleListening}
        className={`w-28 h-28 mx-auto rounded-full flex flex-col items-center justify-center gap-1 shadow-md transition-all transform active:scale-95 border-4 ${
          isListening
            ? 'bg-rose-600 border-rose-700 text-white animate-pulse scale-105'
            : 'bg-teal-700 hover:bg-teal-800 border-teal-800 text-white'
        }`}
      >
        {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        <span className="text-[11px] font-extrabold uppercase tracking-wider">{isListening ? t.stopSpeaking : t.tapToSpeak}</span>
      </button>

      <p className="text-xs font-semibold text-slate-600">
        {isListening ? t.listeningState : t.tapMicInstruction}
      </p>

      {errorMsg && <p className="text-xs text-rose-700 font-bold">{errorMsg}</p>}

      {/* Transcription Confirmation Preview */}
      {transcript && (
        <div className="mt-4 max-w-lg mx-auto bg-white border border-slate-300 rounded-2xl p-4 shadow-sm text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">{t.iHeard}</span>
            <button
              type="button"
              onClick={() => speakText(transcript, language)}
              className="text-teal-700 hover:text-teal-900 text-xs font-extrabold flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" /> {t.listenAudio}
            </button>
          </div>
          <p className="text-slate-900 font-semibold text-base italic">"{transcript}"</p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-xs transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {t.tryAgain}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-5 py-2 bg-teal-700 text-white font-extrabold rounded-xl hover:bg-teal-800 text-xs shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> {t.useThis}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
