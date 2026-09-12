'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, User, ShieldCheck, HeartPulse, Volume2, VolumeX, Eye, Building2 } from 'lucide-react';
import { Language } from '@/types';

interface HeaderProps {
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export default function Header({ currentLanguage = 'en', onLanguageChange }: HeaderProps) {
  const pathname = usePathname();

  const isPatient = pathname.startsWith('/patient');
  const isDoctor = pathname.startsWith('/doctor');

  // Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState<'sm' | 'base' | 'lg'>('base');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Toggle High Contrast Class on Body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Adjust Font Scale Class on Body
  useEffect(() => {
    document.body.classList.remove('text-scale-sm', 'text-scale-base', 'text-scale-lg');
    document.body.classList.add(`text-scale-${fontScale}`);
  }, [fontScale]);

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      {/* 1. Health Services Identity Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-200 font-bold">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>National Health Services &bull; Clinical Digital Health Network</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400 font-medium">Ayushman Bharat Digital Mission (ABDM) Integrated</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="text-teal-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Official OPD Clinical Kiosk
          </span>
        </div>
      </div>

      {/* 2. Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* LEFT: Health Department Identity */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm border border-slate-800">
            <HeartPulse className="w-6 h-6 text-sky-400 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">MediKiosk OPD</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Clinical Intake Platform</p>
          </div>
        </Link>

        {/* CENTER: MediKiosk OPD Branding & Navigation */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl text-slate-900 tracking-tight">MediKiosk</span>
            <span className="bg-sky-100 text-sky-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-sky-200">
              OPD Clinical Portal
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Link
              href="/patient"
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                isPatient ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Patient Kiosk
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/doctor"
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                isDoctor ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Doctor Workspace
            </Link>
          </div>
        </div>

        {/* RIGHT: Professional Accessibility & Language Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Selector Buttons */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => onLanguageChange && onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentLanguage === 'en' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange && onLanguageChange('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentLanguage === 'hi' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange && onLanguageChange('kn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentLanguage === 'kn' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* High Contrast Toggle Button */}
          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-slate-950 border-yellow-500 ring-2 ring-yellow-400'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-4 h-4 text-slate-800" />
            <span className="hidden lg:inline">{highContrast ? 'Contrast ON' : 'Contrast'}</span>
          </button>

          {/* Text Size Scale Controls */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setFontScale('sm')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                fontScale === 'sm' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600'
              }`}
              title="Small Text Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontScale('base')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                fontScale === 'base' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600'
              }`}
              title="Standard Text Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontScale('lg')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                fontScale === 'lg' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600'
              }`}
              title="Large Text Size"
            >
              A+
            </button>
          </div>

          {/* Audio Guidance Toggle Button */}
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              audioEnabled
                ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title="Toggle Audio Voice Guidance"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-teal-700" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
