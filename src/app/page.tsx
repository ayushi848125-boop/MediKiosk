'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import { speakText } from '@/lib/speech';
import {
  UserCheck,
  Stethoscope,
  Mic,
  ShieldAlert,
  Sparkles,
  Languages,
  FileText,
  ArrowRight,
  Building2,
  CheckCircle2,
  HeartPulse,
  Activity,
  Search,
  Volume2,
  Clock,
  RefreshCw,
  Heart,
} from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const res = await fetch(`/api/doctor/suggestions?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSearchError(data.error || 'No patient record found matching that ID or Phone Number.');
      } else {
        setSearchResult(data);
      }
    } catch (err) {
      setSearchError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      {/* Official OPD Hospital Header Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl border border-indigo-900 relative overflow-hidden">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-800/60 border border-indigo-600/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>National Health Services &bull; Digital OPD Intake System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              MediKiosk Clinical Intake <br />
              <span className="text-cyan-400">Better history. Faster consultations.</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Official digital reception and clinical history acquisition kiosk for hospital OPDs. Enables voice-enabled multilingual intake for elderly and rural users, coupled with structured physician summaries.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ABDM FHIR R4 Ready
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multilingual Speech Recognition
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AYUSH Mode Assessment
              </span>
            </div>
          </div>
        </div>

        {/* Portal Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Portal A: Patient Kiosk */}
          <div className="bg-white border-2 border-slate-200 hover:border-teal-600 rounded-3xl p-8 shadow-md flex flex-col justify-between transition-all group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mic className="w-7 h-7 stroke-[2.2]" />
                </div>
                <span className="bg-teal-100 text-teal-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Portal A — Patient Kiosk
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Patient Intake Kiosk</h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Touchscreen and voice-enabled reception kiosk for low-literacy, elderly, and rural patients. Supports English, Hindi, and Kannada audio guidance.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Mandatory basic details registration & consent</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Adaptive AI interview (Min 10 complaint-specific questions)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Prescription & lab report OCR extraction timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>AYUSH Dashavidha Pariksha assessment support</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/patient"
                className="w-full h-14 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 text-base shadow-sm transition-colors"
              >
                <span>Launch Patient Kiosk</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Portal B: Doctor Workspace */}
          <div className="bg-white border-2 border-slate-200 hover:border-indigo-600 rounded-3xl p-8 shadow-md flex flex-col justify-between transition-all group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-7 h-7 stroke-[2.2]" />
                </div>
                <span className="bg-indigo-100 text-indigo-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Portal B — Clinician Desk
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Doctor OPD Workspace</h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Authenticated clinical portal for attending physicians. Presents structured AI intake summaries, source traceability tags, and red-flag emergency triage alerts.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-800 shrink-0" />
                  <span>Structured intake summary cards with source tags</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-800 shrink-0" />
                  <span>Red-flag safety triage indicators for acute symptoms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-800 shrink-0" />
                  <span>Doctor Suggestion dispatch & follow-up scheduler</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-800 shrink-0" />
                  <span>Permanent server-side record deletion with audit log</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/doctor"
                className="w-full h-14 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 text-base shadow-sm transition-colors"
              >
                <span>Enter Doctor Portal</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* DOCTORS' SUGGESTION LOOKUP SECTION */}
        <div id="doctor-suggestions" className="bg-white border-2 border-indigo-200 rounded-3xl p-8 shadow-lg max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6 text-indigo-800" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Doctors' Suggestion & Prescription Portal</h2>
                <p className="text-xs text-slate-600 font-medium">
                  View medical advice, prescribed formulations, and follow-up instructions sent directly by your attending OPD doctor.
                </p>
              </div>
            </div>
            <span className="bg-indigo-100 text-indigo-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-indigo-300">
              Dispatched Advice Only
            </span>
          </div>

          <form onSubmit={handleSearchSuggestion} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="text"
                required
                placeholder="Enter Patient Name, Registered Phone Number, or Patient ID (e.g. MK-2026-000109)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-13 pl-12 pr-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold focus:border-indigo-900 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-13 px-8 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm shrink-0"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isLoading ? 'Searching...' : "Search Doctor's Advice"}</span>
            </button>
          </form>

          {searchError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl text-xs font-bold text-center">
              {searchError}
            </div>
          )}

          {searchResult && (
            <div className="animate-fade-in pt-2">
              {!searchResult.hasSuggestion ? (
                <div className="bg-amber-50 border border-amber-300 p-6 rounded-3xl text-center space-y-2 text-amber-950">
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-900">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base">Intake Under Review for {searchResult.patient?.fullName} ({searchResult.patient?.patientId})</h3>
                  <p className="text-xs text-amber-900/80 max-w-md mx-auto font-medium">
                    {searchResult.message}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
                  {/* Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-white">{searchResult.patient.fullName}</h3>
                        <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                          {searchResult.patient.age} Yrs &bull; {searchResult.patient.gender}
                        </span>
                        <span className="font-mono text-xs text-cyan-400">{searchResult.patient.patientId}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Department: {searchResult.patient.department} | Status: Dispatched to Patient</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const textToSpeak = `Doctor prescription for ${searchResult.patient.fullName}. Treatment Advice: ${searchResult.suggestion.suggestion}. Lifestyle instructions: ${searchResult.suggestion.instructions || 'None'}. Follow up date: ${searchResult.suggestion.followUpDate || 'None'}`;
                        speakText(textToSpeak, 'en');
                      }}
                      className="h-10 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 border border-teal-500"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Listen Advice Aloud 🔊</span>
                    </button>
                  </div>

                  {/* Advice Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Medical Problem & Doctor Treatment Advice */}
                    <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl space-y-2">
                      <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400 block">
                        Doctor Medical Advice & Prescribed Treatment
                      </span>
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed whitespace-pre-line">
                        {searchResult.suggestion.suggestion}
                      </p>
                    </div>

                    {/* Card 2: Lifestyle & Dietary Instructions */}
                    <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl space-y-2">
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block">
                        Dietary & Lifestyle Instructions
                      </span>
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed whitespace-pre-line">
                        {searchResult.suggestion.instructions || 'No specific lifestyle restrictions recorded by doctor.'}
                      </p>
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Follow-up Date: <strong className="text-white">{searchResult.suggestion.followUpDate || 'As needed'}</strong></span>
                    <span>Dispatched: <strong className="text-white">{new Date(searchResult.suggestion.sentAt).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Standards & Security Badges Bar */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-extrabold text-slate-900 text-base">DPDP Act 2023</div>
            <div className="text-xs text-slate-500">Data Privacy Compliant</div>
          </div>

          <div className="space-y-1 border-l border-slate-200">
            <div className="font-extrabold text-slate-900 text-base">ABDM Integrated</div>
            <div className="text-xs text-slate-500">FHIR R4 Schema Ready</div>
          </div>

          <div className="space-y-1 border-l border-slate-200">
            <div className="font-extrabold text-slate-900 text-base">Multilingual ASR</div>
            <div className="text-xs text-slate-500">EN / Hindi / Kannada</div>
          </div>

          <div className="space-y-1 border-l border-slate-200">
            <div className="font-extrabold text-slate-900 text-base">Triage Red-Flags</div>
            <div className="text-xs text-slate-500">Safety Alert Engine</div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-600 font-medium">
        MediKiosk AI Clinical Intake Platform &bull; Professional OPD System Standard
      </footer>
    </div>
  );
}
