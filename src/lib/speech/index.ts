import { Language } from '@/types';

/**
 * Text-to-Speech Utility with Accent Matching for English, Hindi, and Kannada
 */
export function speakText(text: string, lang: Language = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Map language codes to BCP 47 tags
  const langMap: Record<Language, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
  };

  const targetLang = langMap[lang] || 'en-IN';
  utterance.lang = targetLang;
  utterance.rate = 0.88; // Slower, clearer pace for elderly / kiosk accessibility

  // Accent Voice Selection
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice =
    voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLang.toLowerCase())) ||
    voices.find(v => v.lang.toLowerCase().includes(lang === 'hi' ? 'hi' : lang === 'kn' ? 'kn' : 'en'));

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stops ongoing speech playback
 */
export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
