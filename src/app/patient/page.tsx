'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import VoiceInput from '@/components/patient/VoiceInput';
import { speakText } from '@/lib/speech';
import { Language, PatientRegistration, ClinicalAnswerRecord } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  User,
  ShieldCheck,
  Activity,
  Heart,
  Sparkles,
  Camera,
  RefreshCw,
  Clock,
  ChevronRight,
  Info,
  Building2,
  Stethoscope,
  Search,
  X,
} from 'lucide-react';

export default function PatientKiosk() {
  const [step, setStep] = useState<'language' | 'demographics' | 'consent' | 'interview' | 'documents' | 'review' | 'submitted' | 'suggestion'>('language');

  // Form State
  const [language, setLanguage] = useState<Language>('en');
  const [formData, setFormData] = useState<PatientRegistration>({
    fullName: '',
    age: 35,
    gender: 'Male',
    height: 170,
    phone: '',
    email: '',
    address: '',
    preferredLanguage: 'en',
    abhaId: '',
    emergencyContact: '',
    department: 'General OPD',
    ayushMode: true,
  });

  const [validationError, setValidationError] = useState('');
  const [patientDbRecord, setPatientDbRecord] = useState<any>(null);

  // Interview Engine State
  const [answeredRecords, setAnsweredRecords] = useState<ClinicalAnswerRecord[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);

  // Document Upload State
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Doctor Suggestion State
  const [doctorSuggestion, setDoctorSuggestion] = useState<any>(null);

  // In-Kiosk Doctor Advice Lookup State
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Feature 1 & 2: Confidence Scoring & Nurse Escalation State
  const [consecutiveLowConfidence, setConsecutiveLowConfidence] = useState(0);
  const [fieldRetries, setFieldRetries] = useState<Record<string, number>>({});
  const [isAssistanceOverlayOpen, setIsAssistanceOverlayOpen] = useState(false);
  const [assistanceReason, setAssistanceReason] = useState<'manual_request' | 'low_confidence_loop'>('manual_request');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Auto-polling for doctor suggestions when patient is on submitted confirmation screen
  useEffect(() => {
    if (step !== 'submitted' || !patientDbRecord) return;
    const interval = setInterval(async () => {
      try {
        const queryVal = patientDbRecord.patientId || patientDbRecord.phone || patientDbRecord.fullName;
        const res = await fetch(`/api/doctor/suggestions?query=${encodeURIComponent(queryVal)}`);
        const data = await res.json();
        if (data.success && data.hasSuggestion && data.suggestion) {
          setDoctorSuggestion(data.suggestion);
          setStep('suggestion');
          speakText(`${t.suggestionTitle}. ${t.prescribedPlan} ${data.suggestion.suggestion}`, language);
        }
      } catch (e) {
        console.error('Auto-check suggestion error:', e);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [step, patientDbRecord, language]);

  // Lookup Doctor Suggestion by Name, Phone, or Patient ID
  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setIsLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const res = await fetch(`/api/doctor/suggestions?query=${encodeURIComponent(lookupQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setLookupResult(data);
        if (data.hasSuggestion && data.suggestion) {
          speakText(
            `${t.suggestionTitle}. ${t.prescribedPlan} ${data.suggestion.suggestion}. ${
              data.suggestion.instructions ? t.instructionsLabel + ' ' + data.suggestion.instructions : ''
            }`,
            language
          );
        }
      } else {
        setLookupError(data.error || 'No record found matching your query.');
      }
    } catch (err) {
      setLookupError('Network error while looking up doctor suggestions.');
    } finally {
      setIsLookupLoading(false);
    }
  };

  // Escalation Trigger (Manual or Automatic)
  const triggerEscalation = async (reason: 'manual_request' | 'low_confidence_loop') => {
    setAssistanceReason(reason);
    setIsAssistanceOverlayOpen(true);

    const reassuranceText =
      language === 'hi'
        ? 'एक स्वास्थ्य कर्मी शीघ्र ही आपकी सहायता के लिए आ रहे हैं। कृपया कियोस्क पर ही प्रतीक्षा करें।'
        : language === 'kn'
        ? 'ಸಿಬ್ಬಂದಿ ಶೀಘ್ರದಲ್ಲೇ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಬರುತ್ತಾರೆ. ದಯವಿಟ್ಟು ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ಕಾಯ್ದುಕೊಳ್ಳಿ.'
        : 'A staff member will come to help you shortly. Please remain seated at the kiosk.';

    speakText(reassuranceText, language);

    if (patientDbRecord?.id) {
      try {
        await fetch('/api/clinical/escalate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId: patientDbRecord.id,
            reason,
            stuckStep: step,
            currentQuestionText: currentQuestion?.questionText?.[language] || 'Patient Intake',
          }),
        });
      } catch (err) {
        console.error('Escalation API call error:', err);
      }
    }
  };

  // Language Selector Switcher
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setFormData(prev => ({ ...prev, preferredLanguage: lang }));
    setStep('demographics');

    const prompt =
      lang === 'hi'
        ? 'कृपया अपनी बुनियादी जानकारी भरें।'
        : lang === 'kn'
        ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.'
        : 'Please complete your basic information to proceed.';

    speakText(prompt, lang);
  };

  // Mandatory Validation Guard
  const handleDemographicsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setValidationError(
        language === 'hi'
          ? 'आगे बढ़ने से पहले कृपया अपना सही नाम दर्ज करें।'
          : language === 'kn'
          ? 'ಮುಂದುವರಿಯುವ ಮೊದಲು ದಯವಿಟ್ಟು ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.'
          : 'Please enter a valid Full Name before continuing.'
      );
      return;
    }
    if (!formData.age || Number(formData.age) <= 0) {
      setValidationError(
        language === 'hi'
          ? 'कृपया अपनी सही आयु दर्ज करें।'
          : language === 'kn'
          ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ.'
          : 'Please enter a valid Age.'
      );
      return;
    }
    if (!formData.address.trim() || formData.address.trim().length < 3) {
      setValidationError(
        language === 'hi'
          ? 'कृपया अपना पूरा पता दर्ज करें।'
          : language === 'kn'
          ? 'ದಯವಿಟ್ಟು ಪೂರ್ಣ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.'
          : 'Please enter a valid Address.'
      );
      return;
    }

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setValidationError(data.error || 'Failed to save patient information. Please try again.');
        return;
      }

      setPatientDbRecord(data.data);
      setStep('consent');
      speakText(t.consentDesc, language);
    } catch (err) {
      setValidationError('Network error. Please try again.');
    }
  };

  // Consent Accepted -> Start Interview
  const handleAcceptConsent = async () => {
    setStep('interview');
    fetchNextQuestion([]);
  };

  // Fetch Next Question from AI Engine
  const fetchNextQuestion = async (history: ClinicalAnswerRecord[], lastAnswerObj: any = null) => {
    try {
      const answeredIds = history.map(h => h.questionId);
      const complaint = history.find(h => h.category === 'complaint')?.answerText || '';

      const res = await fetch('/api/clinical/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answeredIds,
          lastAnswer: lastAnswerObj,
          complaint,
          ayushMode: formData.ayushMode,
          language,
          consecutiveLowConfidence,
          fieldRetries,
          patientId: patientDbRecord?.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.autoEscalate) {
          triggerEscalation('low_confidence_loop');
          return;
        }

        if (data.consecutiveLowConfidence !== undefined) {
          setConsecutiveLowConfidence(data.consecutiveLowConfidence);
        }
        if (data.fieldRetries) {
          setFieldRetries(data.fieldRetries);
        }

        if (data.isComplete || !data.question) {
          setIsInterviewComplete(true);
          setStep('documents');
          speakText(t.uploadDesc, language);
        } else {
          setCurrentQuestion(data.question);
          setQuestionCount(data.currentCount);
          const qText = data.question.questionText[language] || data.question.questionText.en;
          speakText(qText, language);
        }
      }
    } catch (err) {
      console.error('Error fetching question:', err);
    }
  };

  // Record Answer
  const handleAnswerQuestion = (answerText: string, inputMethod: 'voice' | 'touch') => {
    if (!currentQuestion) return;

    const newRecord: ClinicalAnswerRecord = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.questionText[language] || currentQuestion.questionText.en,
      answerText,
      inputMethod,
      category: currentQuestion.category,
      language,
    };

    const updated = [...answeredRecords, newRecord];
    setAnsweredRecords(updated);

    const lastAnswerObj = {
      questionId: currentQuestion.id,
      answerText,
      inputMethod,
    };

    fetchNextQuestion(updated, lastAnswerObj);
  };

  // Document File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !patientDbRecord) return;
    const file = e.target.files[0];

    setIsUploading(true);
    const body = new FormData();
    body.append('file', file);
    body.append('patientId', patientDbRecord.id);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (data.success) {
        setUploadedDocs(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Final History Intake
  const handleSubmitCompleteHistory = async () => {
    if (!patientDbRecord) return;

    try {
      const res = await fetch('/api/clinical/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientDbRecord.id,
          answers: answeredRecords,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep('submitted');
        speakText(t.submittedDesc, language);
      }
    } catch (err) {
      console.error('Final submission error:', err);
    }
  };

  // Check for Doctor's Suggestion
  const handleCheckDoctorSuggestion = async () => {
    if (!patientDbRecord) return;
    try {
      const res = await fetch(`/api/patients/${patientDbRecord.id}`);
      const data = await res.json();
      if (data.success && data.data.suggestions && data.data.suggestions.length > 0) {
        const latest = data.data.suggestions[data.data.suggestions.length - 1];
        setDoctorSuggestion(latest);
        setStep('suggestion');
        speakText(`${t.suggestionTitle}. ${t.prescribedPlan} ${latest.suggestion}`, language);
      } else {
        alert(
          language === 'hi'
            ? 'डॉक्टर अभी आपके रिकॉर्ड की समीक्षा कर रहे हैं। कृपया कुछ समय बाद पुनः प्रयास करें।'
            : language === 'kn'
            ? 'ವೈದ್ಯರು ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.'
            : 'Doctor is currently reviewing your medical intake. Please check back shortly.'
        );
      }
    } catch (err) {
      console.error('Check suggestion error:', err);
    }
  };

  // Active step mapping
  const getActiveStepNumber = () => {
    if (step === 'language' || step === 'demographics') return 1;
    if (step === 'consent') return 2;
    if (step === 'interview') return 3;
    return 4; // documents, review, submitted, suggestion
  };

  const activeStepNum = getActiveStepNumber();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header currentLanguage={language} onLanguageChange={selectLanguage} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Main OPD Intake Title & Subtitle */}
        <div className="text-center space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{t.opdKioskSystem}</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.pageTitle}</h1>
          <p className="text-sm text-slate-600 font-medium">{t.pageSubtitle}</p>
        </div>

        {/* OPD Registration Progress Steps Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Workflow</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLookupOpen(true)}
                className="h-9 px-4 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 border border-indigo-800"
              >
                <Stethoscope className="w-4 h-4 text-sky-300" />
                <span>{language === 'hi' ? 'डॉक्टर सलाह खोजें' : language === 'kn' ? 'ವೈದ್ಯರ ಸಲಹೆ ಹುಡುಕಿ' : 'My Doctor Advice'}</span>
              </button>

              <button
                type="button"
                onClick={() => triggerEscalation('manual_request')}
                className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 border border-amber-600 ring-2 ring-amber-400/20"
              >
                <Heart className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>{language === 'hi' ? 'सहायता चाहिए' : language === 'kn' ? 'ಸಹಾಯ ಬೇಕೇ' : 'Need Assistance'}</span>
              </button>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5 hidden sm:flex">
                <Volume2 className="w-3.5 h-3.5 text-teal-700" /> {t.audioGuidance} ({language.toUpperCase()})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className={`p-3 rounded-xl border text-xs font-extrabold transition-all ${activeStepNum >= 1 ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              <div className="text-[10px] opacity-75 uppercase">01</div>
              <div className="truncate">{t.step1Title}</div>
            </div>

            <div className={`p-3 rounded-xl border text-xs font-extrabold transition-all ${activeStepNum >= 2 ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              <div className="text-[10px] opacity-75 uppercase">02</div>
              <div className="truncate">{t.step2Title}</div>
            </div>

            <div className={`p-3 rounded-xl border text-xs font-extrabold transition-all ${activeStepNum >= 3 ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              <div className="text-[10px] opacity-75 uppercase">03</div>
              <div className="truncate">{t.step3Title}</div>
            </div>

            <div className={`p-3 rounded-xl border text-xs font-extrabold transition-all ${activeStepNum >= 4 ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              <div className="text-[10px] opacity-75 uppercase">04</div>
              <div className="truncate">{t.step4Title}</div>
            </div>
          </div>
        </div>

        {/* STEP 1A: LANGUAGE SELECTION SCREEN */}
        {step === 'language' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-8 animate-fade-in">
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Select Language / भाषा चुनें / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</h2>
              <p className="text-slate-600 text-sm">Touch your preferred language to begin OPD registration.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => selectLanguage('en')}
                className="h-32 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-2xl rounded-2xl shadow-md border border-slate-800 flex flex-col items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <span>English</span>
                <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-slate-300">Select</span>
              </button>

              <button
                type="button"
                onClick={() => selectLanguage('hi')}
                className="h-32 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold text-2xl rounded-2xl shadow-md border border-indigo-800 flex flex-col items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <span>हिंदी (Hindi)</span>
                <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-slate-300">चयन करें</span>
              </button>

              <button
                type="button"
                onClick={() => selectLanguage('kn')}
                className="h-32 bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-2xl rounded-2xl shadow-md border border-teal-700 flex flex-col items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <span>ಕನ್ನಡ (Kannada)</span>
                <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-slate-300">ಆಯ್ಕೆ ಮಾಡಿ</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1B: MANDATORY PATIENT REGISTRATION FORM */}
        {step === 'demographics' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{t.step1Heading}</h2>
                <p className="text-slate-600 text-sm mt-1">{t.step1Desc}</p>
              </div>
              <button
                type="button"
                onClick={() => speakText(t.step1Desc, language)}
                className="p-3 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Listen Instructions"
              >
                <Volume2 className="w-5 h-5 text-teal-700" />
              </button>
            </div>

            {validationError && (
              <div className="bg-rose-50 border border-rose-300 text-rose-900 p-4 rounded-xl flex items-center gap-3 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleDemographicsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    {t.fullNameLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.fullNamePlaceholder}
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-13 text-base px-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    {t.ageLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full h-13 text-base px-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    {t.genderLabel} <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full h-13 text-base px-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
                  >
                    <option value="Male">{t.genderMale}</option>
                    <option value="Female">{t.genderFemale}</option>
                    <option value="Other">{t.genderOther}</option>
                    <option value="Prefer not to say">{t.genderPreferNot}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    {t.phoneLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-13 text-base px-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    {t.emailLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-13 text-base px-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    {t.addressLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.addressPlaceholder}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-13 text-base px-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* BOTTOM NAVIGATION ACTIONS */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('language')}
                  className="h-13 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl border border-slate-300 flex items-center gap-2 text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.backBtn}</span>
                </button>

                <button
                  type="submit"
                  className="h-13 px-8 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-base rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  <span>{t.saveContinueBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: CONSENT SCREEN */}
        {step === 'consent' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t.consentHeading}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{t.consentDesc}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-center max-w-md mx-auto">
              <button
                type="button"
                onClick={() => speakText(t.consentDesc, language)}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-800 font-extrabold rounded-xl text-xs flex items-center gap-2 hover:bg-slate-100 shadow-sm"
              >
                <Volume2 className="w-4 h-4 text-teal-700" /> {t.listenAudioBtn}
              </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('demographics')}
                className="h-13 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl border border-slate-300 flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptConsent}
                className="h-13 px-8 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-base rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.agreeBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ADAPTIVE AI CLINICAL INTERVIEW */}
        {step === 'interview' && currentQuestion && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8 animate-fade-in">
            {/* Question Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="bg-slate-100 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full border border-slate-200">
                  {t.questionTag.replace('{count}', String(questionCount))}
                </span>
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">{currentQuestion.category}</span>
              </div>

              <button
                type="button"
                onClick={() => speakText(currentQuestion.questionText[language] || currentQuestion.questionText.en, language)}
                className="p-3 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Listen Question"
              >
                <Volume2 className="w-5 h-5 text-teal-700" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {currentQuestion.questionText[language] || currentQuestion.questionText.en}
            </h2>

            {/* OPTION A: VOICE MICROPHONE INPUT */}
            <VoiceInput
              language={language}
              onVoiceResult={transcript => handleAnswerQuestion(transcript, 'voice')}
            />

            {/* OPTION B: TOUCH SELECTION CHIPS */}
            {currentQuestion.options && currentQuestion.options.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center">{t.orSelectTouch}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options.map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswerQuestion(opt.value, 'touch')}
                      className="h-16 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-900 rounded-2xl text-left font-bold text-slate-900 text-base flex items-center justify-between shadow-sm transition-all transform active:scale-95"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-5 h-5 text-slate-700" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4A: MEDICAL DOCUMENT UPLOAD (OCR) */}
        {step === 'documents' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t.uploadHeading}</h2>
              <p className="text-slate-600 text-sm">{t.uploadDesc}</p>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                <Camera className="w-7 h-7" />
              </div>
              <label className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-base rounded-2xl shadow-sm transition-all">
                <Upload className="w-5 h-5" />
                <span>{isUploading ? t.ocrExtracting : t.uploadBtnText}</span>
                <input type="file" accept="image/*,application/pdf,.pptx,.ppt,.docx,.doc,.txt,.csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
              </label>
              <p className="text-xs text-slate-500 font-semibold">Supports photos (JPG, PNG), PDFs, presentations (PPTX, PPT), documents (DOCX), and text files.</p>
            </div>

            {uploadedDocs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">OCR Extracted Documents</h3>
                <div className="space-y-3">
                  {uploadedDocs.map((doc, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{doc.document.fileName}</div>
                        <div className="text-slate-500 mt-0.5">
                          Type: <strong className="uppercase">{doc.extraction.documentType}</strong> | Confidence: {(doc.extraction.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full">{t.ocrComplete}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="h-13 px-8 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-base rounded-xl flex items-center gap-2 shadow-sm"
              >
                <span>{t.reviewHistoryBtn}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4B: FINAL REVIEW BEFORE SUBMISSION */}
        {step === 'review' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center">{t.reviewHeading}</h2>

            <div className="space-y-6 divide-y divide-slate-100">
              <div className="pt-2">
                <h3 className="font-extrabold text-slate-900 text-base mb-1">{t.step1Title}</h3>
                <p className="text-slate-700 text-sm">
                  <strong>{formData.fullName}</strong>, {formData.age} Yrs ({formData.gender}) &bull; Phone: {formData.phone}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{formData.address}</p>
              </div>

              <div className="pt-4">
                <h3 className="font-extrabold text-slate-900 text-base mb-3">Clinical Answers ({answeredRecords.length} Recorded)</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {answeredRecords.map((ans, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-500">Q: {ans.questionText}</div>
                      <div className="font-extrabold text-slate-900 text-sm">A: {ans.answerText}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('documents')}
                className="h-13 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl border border-slate-300 flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitCompleteHistory}
                className="h-13 px-8 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-base rounded-xl flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.confirmSubmitBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUBMITTED CONFIRMATION */}
        {step === 'submitted' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-black text-slate-900">{t.submittedTitle}</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">{t.submittedDesc}</p>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={handleCheckDoctorSuggestion}
                className="h-14 px-8 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-base rounded-2xl flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-5 h-5" /> {t.checkSuggestionBtn}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: DOCTOR'S SUGGESTION VIEW */}
        {step === 'suggestion' && doctorSuggestion && (
          <div className="bg-white rounded-3xl p-8 border border-slate-300 shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-slate-900">{t.suggestionTitle}</h2>
              <button
                type="button"
                onClick={() =>
                  speakText(
                    `${t.suggestionTitle}. ${t.prescribedPlan} ${doctorSuggestion.suggestion}. ${
                      doctorSuggestion.instructions ? t.instructionsLabel + ' ' + doctorSuggestion.instructions : ''
                    }`,
                    language
                  )
                }
                className="px-4 py-2 bg-slate-100 text-slate-900 font-extrabold rounded-xl text-xs flex items-center gap-2 hover:bg-slate-200 border border-slate-300"
              >
                <Volume2 className="w-4 h-4 text-teal-700" /> {t.listenAudio}
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-slate-900">
              <div>
                <span className="text-xs font-extrabold text-slate-500 uppercase">{t.prescribedPlan}</span>
                <p className="text-lg font-bold mt-1">{doctorSuggestion.suggestion}</p>
              </div>

              {doctorSuggestion.instructions && (
                <div>
                  <span className="text-xs font-extrabold text-slate-500 uppercase">{t.instructionsLabel}</span>
                  <p className="text-sm font-medium mt-1 whitespace-pre-line">{doctorSuggestion.instructions}</p>
                </div>
              )}

              {doctorSuggestion.followUpDate && (
                <div className="bg-white p-3 rounded-xl border border-slate-300 inline-block text-xs font-bold">
                  {t.followUpLabel} {doctorSuggestion.followUpDate}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* NURSE ASSISTANCE / ESCALATION CALM HANDOFF OVERLAY */}
      {isAssistanceOverlayOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl border border-amber-300">
            <div className="w-20 h-20 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-10 h-10 text-amber-700 fill-amber-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="bg-amber-100 text-amber-950 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase border border-amber-300 inline-block">
                {assistanceReason === 'manual_request' ? 'Nurse Assistance Requested' : 'Assistance Triggered'}
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-snug">
                {language === 'hi'
                  ? 'एक स्वास्थ्य कर्मी शीघ्र ही आपकी सहायता के लिए आ रहे हैं।'
                  : language === 'kn'
                  ? 'ಸಿಬ್ಬಂದಿ ಶೀಘ್ರದಲ್ಲೇ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಬರುತ್ತಾರೆ.'
                  : 'A staff member will come to help you shortly.'}
              </h2>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                {language === 'hi'
                  ? 'आपकी सभी जानकारी सुरक्षित रूप से सहेज ली गई है। कृपया कियोस्क पर ही आराम से प्रतीक्षा करें।'
                  : language === 'kn'
                  ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ಕಾಯ್ದುಕೊಳ್ಳಿ.'
                  : 'Your responses have been saved safely. Please remain seated comfortably at the kiosk.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700">
              Status: <strong className="text-amber-700 uppercase font-extrabold">Nurse Alerted & Active in Queue</strong>
            </div>
          </div>
        </div>
      )}
      {/* IN-KIOSK DOCTOR ADVICE LOOKUP MODAL */}
      {isLookupOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5 text-indigo-800" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {language === 'hi' ? 'डॉक्टर की सलाह और पर्चा देखें' : language === 'kn' ? 'ವೈದ್ಯರ ಸಲಹೆ ಮತ್ತು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್' : "Doctor's Advice & Prescription"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {language === 'hi' ? 'अपना नाम, फोन नंबर या पेशेंट ID दर्ज करें' : language === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ರೋಗಿಯ ID ನಮೂದಿಸಿ' : 'Search by Patient Name, Phone Number, or Patient ID'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLookupOpen(false);
                  setLookupResult(null);
                  setLookupError('');
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleLookupSubmit} className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                <input
                  type="text"
                  required
                  placeholder={
                    language === 'hi'
                      ? 'मरीज़ का नाम, फोन नंबर या Patient ID दर्ज करें...'
                      : language === 'kn'
                      ? 'ರೋಗಿಯ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ರೋಗಿಯ ID ನಮೂದಿಸಿ...'
                      : 'Enter Patient Name, Phone Number, or Patient ID...'
                  }
                  value={lookupQuery}
                  onChange={e => setLookupQuery(e.target.value)}
                  className="w-full h-13 pl-12 pr-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold focus:border-indigo-900 focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLookupLoading}
                className="w-full h-13 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isLookupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>
                  {isLookupLoading
                    ? language === 'hi' ? 'खोज रहे हैं...' : language === 'kn' ? 'ಹುಡುಕಲಾಗುತ್ತಿದೆ...' : 'Searching...'
                    : language === 'hi' ? 'सलाह खोजें' : language === 'kn' ? 'ಸಲಹೆ ಹುಡುಕಿ' : "Search Doctor's Advice"}
                </span>
              </button>
            </form>

            {lookupError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl text-xs font-bold text-center">
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                {!lookupResult.hasSuggestion ? (
                  <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl text-center space-y-2 text-amber-950">
                    <Clock className="w-6 h-6 text-amber-800 mx-auto" />
                    <h4 className="font-extrabold text-sm">
                      {lookupResult.patient?.fullName} ({lookupResult.patient?.patientId})
                    </h4>
                    <p className="text-xs font-semibold text-amber-900">{lookupResult.message}</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-300 p-6 rounded-2xl space-y-4 text-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="font-black text-lg text-slate-900">{lookupResult.patient?.fullName}</h4>
                        <p className="text-xs text-slate-500 font-semibold">
                          ID: {lookupResult.patient?.patientId} &bull; Phone: {lookupResult.patient?.phone}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          speakText(
                            `${t.suggestionTitle}. Doctor Advice: ${lookupResult.suggestion.suggestion}. ${
                              lookupResult.suggestion.instructions ? 'Instructions: ' + lookupResult.suggestion.instructions : ''
                            }`,
                            language
                          )
                        }
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Volume2 className="w-4 h-4 text-sky-400" />
                        <span>Listen 🔊</span>
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-extrabold text-slate-500 uppercase block mb-1">Doctor Advice / Treatment Plan</span>
                        <p className="text-base font-extrabold text-slate-900 bg-white p-3.5 rounded-xl border border-slate-200">
                          {lookupResult.suggestion.suggestion}
                        </p>
                      </div>

                      {lookupResult.suggestion.instructions && (
                        <div>
                          <span className="font-extrabold text-slate-500 uppercase block mb-1">Lifestyle & Dietary Instructions</span>
                          <p className="font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-line">
                            {lookupResult.suggestion.instructions}
                          </p>
                        </div>
                      )}

                      {lookupResult.suggestion.followUpDate && (
                        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl inline-block font-extrabold text-indigo-950">
                          Follow-up Date: {lookupResult.suggestion.followUpDate}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
