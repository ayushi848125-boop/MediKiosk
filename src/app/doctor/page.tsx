'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import {
  Stethoscope,
  Search,
  Filter,
  Trash2,
  Eye,
  AlertTriangle,
  Send,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  User,
  Heart,
  Lock,
  Edit3,
  Building2,
  Info,
  Download,
  ExternalLink,
  FileUp,
  Image as ImageIcon,
  Presentation,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export default function DoctorPortal() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Patient List & Filter State
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Awaiting Doctor Review' | 'Doctor Suggestion Available' | 'AYUSH' | 'REDFLAG' | 'NEEDS_ASSISTANCE'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Patient Workspace Detail State
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [parsedSummary, setParsedSummary] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'standard' | 'ayush'>('standard');

  // Doctor Suggestion Form State
  const [suggestionText, setSuggestionText] = useState('');
  const [instructionsText, setInstructionsText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Delete Confirmation Modal State
  const [patientToDelete, setPatientToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Document Preview Modal & Upload State
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const getFileMeta = (fileName: string) => {
    const ext = fileName ? fileName.split('.').pop()?.toLowerCase() || '' : '';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      return { ext: ext.toUpperCase(), label: 'IMAGE', color: 'bg-blue-100 text-blue-900 border-blue-200', isImage: true };
    }
    if (ext === 'pdf') {
      return { ext: 'PDF', label: 'PDF DOCUMENT', color: 'bg-rose-100 text-rose-900 border-rose-200', isPdf: true };
    }
    if (['pptx', 'ppt'].includes(ext)) {
      return { ext: ext.toUpperCase(), label: 'POWERPOINT SLIDES', color: 'bg-amber-100 text-amber-950 border-amber-300', isPpt: true };
    }
    if (['docx', 'doc'].includes(ext)) {
      return { ext: ext.toUpperCase(), label: 'WORD DOCUMENT', color: 'bg-indigo-100 text-indigo-900 border-indigo-200', isDoc: true };
    }
    return { ext: ext.toUpperCase() || 'FILE', label: 'ATTACHED FILE', color: 'bg-slate-100 text-slate-800 border-slate-200' };
  };

  const handleDoctorFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatient) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', selectedPatient.id);

    try {
      setIsUploadingDoc(true);
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // Fetch updated patient record
        const updatedRes = await fetch(`/api/patients/${selectedPatient.id}`);
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setSelectedPatient(updatedData.data);
        }
        fetchPatients();
      } else {
        alert(data.error || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Doctor file upload error:', err);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Check Session on Mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        setIsAuthenticated(true);
        fetchPatients();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchPatients();
      } else {
        setLoginError(data.error || 'Invalid passcode credentials');
      }
    } catch (err) {
      setLoginError('Server authentication error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  // Short Polling Real-Time Refresh for Nurse Assistance Alerts (3s interval)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchPatients();
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveAssistance = async (patientId: string, action: 'assisted_in_person' | 'completed') => {
    try {
      const res = await fetch('/api/clinical/resolve-assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, action }),
      });

      const data = await res.json();
      if (data.success) {
        fetchPatients();
        if (selectedPatient && selectedPatient.id === patientId) {
          setSelectedPatient(null);
        }
      }
    } catch (err) {
      console.error('Error resolving assistance:', err);
    }
  };

  const handleOpenPatient = (patient: any) => {
    setSelectedPatient(patient);
    setActiveModalTab('standard');
    if (patient.summaries && patient.summaries.length > 0) {
      try {
        setParsedSummary(JSON.parse(patient.summaries[0].summaryJson));
      } catch (e) {
        setParsedSummary(null);
      }
    } else {
      setParsedSummary(null);
    }

    if (patient.suggestions && patient.suggestions.length > 0) {
      const latest = patient.suggestions[patient.suggestions.length - 1];
      setSuggestionText(latest.suggestion || '');
      setInstructionsText(latest.instructions || '');
      setFollowUpDate(latest.followUpDate || '');
    } else {
      setSuggestionText('');
      setInstructionsText('');
      setFollowUpDate('');
    }
  };

  const handleSendSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !suggestionText.trim()) return;

    try {
      const res = await fetch('/api/doctor/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          suggestion: suggestionText,
          instructions: instructionsText,
          followUpDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Doctor suggestion successfully dispatched to patient portal.');
        fetchPatients();
        setSelectedPatient(null);
      }
    } catch (err) {
      console.error('Error sending suggestion:', err);
    }
  };

  // Permanent Server Deletion
  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/patients/${patientToDelete.id}`, {
        method: 'DELETE',
        headers: { 'x-doctor-auth': 'true' },
      });

      const data = await res.json();
      if (data.success) {
        setPatients(prev => prev.filter(p => p.id !== patientToDelete.id));
        if (selectedPatient && selectedPatient.id === patientToDelete.id) {
          setSelectedPatient(null);
        }
        setPatientToDelete(null);
      } else {
        alert(data.error || 'Failed to delete patient record');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Patient Queue
  const filteredPatients = patients.filter(p => {
    const matchesQuery =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);

    if (!matchesQuery) return false;

    if (activeFilter === 'AYUSH') return p.ayushMode;
    if (activeFilter === 'REDFLAG') return p.redFlags && p.redFlags.length > 0;
    if (activeFilter !== 'ALL') return p.status === activeFilter;

    return true;
  });

  // 1. DOCTOR LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-sm">
                <Lock className="w-7 h-7 text-sky-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Doctor Portal Sign In</h2>
              <p className="text-xs text-slate-500 font-semibold">Authorized Attending OPD Clinician Access</p>
            </div>

            {loginError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-bold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Physician Passcode</label>
                <input
                  type="password"
                  required
                  placeholder="Enter Security Passcode"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full h-13 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-slate-900 hover:bg-slate-950 text-white font-extrabold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2 text-base"
              >
                <Stethoscope className="w-5 h-5" />
                <span>Authenticate & Access OPD Queue</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN CLINICIAN WORKSPACE DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border border-slate-200 rounded-3xl p-5 hidden md:flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">Dr. OPD Attending</div>
                <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Active Shift
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  activeFilter === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>All Patients</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${activeFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {patients.length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('Awaiting Doctor Review')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  activeFilter === 'Awaiting Doctor Review' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Pending Review</span>
                <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {patients.filter(p => p.status === 'Awaiting Doctor Review').length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('AYUSH')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  activeFilter === 'AYUSH' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>AYUSH Patients</span>
                <span className="bg-amber-200 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {patients.filter(p => p.ayushMode).length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('NEEDS_ASSISTANCE')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  activeFilter === 'NEEDS_ASSISTANCE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" /> Nurse Queue
                </span>
                <span className="bg-amber-200 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black">
                  {patients.filter(p => p.status === 'NEEDS_ASSISTANCE').length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('REDFLAG')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  activeFilter === 'REDFLAG' ? 'bg-rose-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Red Flags
                </span>
                <span className="bg-rose-100 text-rose-900 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {patients.filter(p => p.redFlags && p.redFlags.length > 0).length}
                </span>
              </button>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200"
          >
            <Lock className="w-4 h-4 text-slate-600" /> Sign Out
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          {/* Search & Quick Filters Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search patient name, phone, ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs font-extrabold">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  activeFilter === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                All ({patients.length})
              </button>
              <button
                onClick={() => setActiveFilter('NEEDS_ASSISTANCE')}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  activeFilter === 'NEEDS_ASSISTANCE' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                }`}
              >
                Nurse Queue ({patients.filter(p => p.status === 'NEEDS_ASSISTANCE').length})
              </button>
              <button
                onClick={() => setActiveFilter('Awaiting Doctor Review')}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  activeFilter === 'Awaiting Doctor Review' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveFilter('AYUSH')}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  activeFilter === 'AYUSH' ? 'bg-amber-800 text-white border-amber-800' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                AYUSH
              </button>
              <button
                onClick={() => setActiveFilter('REDFLAG')}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  activeFilter === 'REDFLAG' ? 'bg-rose-700 text-white border-rose-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Red Flags
              </button>
            </div>
          </div>

          {/* OPD Queue List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-extrabold text-xl text-slate-900">Official OPD Queue</h2>
              <span className="text-xs text-slate-500 font-bold">{filteredPatients.length} Active Records</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredPatients.map(patient => {
                const hasRedFlags = patient.redFlags && patient.redFlags.length > 0;
                return (
                  <div
                    key={patient.id}
                    className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors ${
                      hasRedFlags ? 'bg-rose-50/50 border-l-4 border-l-rose-600' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-extrabold text-lg text-slate-900">{patient.fullName}</span>
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                          {patient.age} Yrs &bull; {patient.gender}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{patient.patientId}</span>

                        {patient.isRecurring && (
                          <span className="bg-indigo-100 text-indigo-950 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-indigo-300 shadow-2xs">
                            <Clock className="w-3 h-3 text-indigo-700" /> 🔁 Recurring ({patient.pastVisitsCount} Past Visits)
                          </span>
                        )}

                        {patient.ayushMode && (
                          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                            <Heart className="w-3 h-3 text-amber-700 fill-amber-500" /> AYUSH OPD
                          </span>
                        )}

                        {patient.status === 'NEEDS_ASSISTANCE' && (
                          <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-amber-600 animate-pulse">
                            <Heart className="w-3 h-3 fill-slate-950 text-slate-950" /> 🆘 NURSE HELP NEEDED
                          </span>
                        )}

                        {hasRedFlags && (
                          <span className="bg-rose-700 text-white text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> RED FLAG
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-slate-800">
                        Complaint:{' '}
                        <span className="font-normal text-slate-600">
                          {patient.summaries[0] ? JSON.parse(patient.summaries[0].summaryJson).patientOverview.chiefComplaint : 'OPD Intake'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                        <span>Time: {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>Status: <strong className={patient.status === 'NEEDS_ASSISTANCE' ? 'text-amber-700 font-black' : 'text-slate-900'}>{patient.status}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                      {patient.status === 'NEEDS_ASSISTANCE' && (
                        <button
                          onClick={() => handleResolveAssistance(patient.id, 'assisted_in_person')}
                          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          ✓ Mark Resolved
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenPatient(patient)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Open Record
                      </button>

                      {/* Permanent Server Delete Button */}
                      <button
                        onClick={() => setPatientToDelete(patient)}
                        className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        title="Delete patient permanently from database"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredPatients.length === 0 && (
                <div className="p-12 text-center text-slate-400 font-medium">
                  No matching patient records found in OPD queue.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* PATIENT DETAIL WORKSPACE MODAL */}
      {selectedPatient && parsedSummary && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900">{selectedPatient.fullName}</h2>
                  <span className="bg-slate-100 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-full border border-slate-200">
                    {selectedPatient.age} Yrs &bull; {selectedPatient.gender}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{selectedPatient.patientId}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Phone: {selectedPatient.phone} | Address: {selectedPatient.address}</p>
              </div>

              <button onClick={() => setSelectedPatient(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Red Flag Alert Banner */}
            {parsedSummary.redFlags && parsedSummary.redFlags.length > 0 && (
              <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>URGENT CLINICAL RED-FLAG SAFETY ALERT</span>
                </div>
                {parsedSummary.redFlags.map((flag: any, idx: number) => (
                  <p key={idx} className="text-xs font-semibold text-rose-950 pl-7">
                    &bull; {flag.category}: {flag.message}
                  </p>
                ))}
              </div>
            )}

            {/* Modal Workspace View Switcher Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveModalTab('standard')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  activeModalTab === 'standard'
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Standard Clinical Summary</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('ayush')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  activeModalTab === 'ayush'
                    ? 'bg-amber-900 text-white shadow-md ring-2 ring-amber-700/30'
                    : 'bg-amber-100/90 text-amber-950 border border-amber-300 hover:bg-amber-200'
                }`}
              >
                <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>AYUSH & Ayurvedic Approach</span>
                <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full ml-1 uppercase">Active</span>
              </button>
            </div>

            {/* Source Traceability Legend Bar */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap gap-2 text-xs font-bold">
              <span className="text-slate-500 uppercase tracking-wider">Source Traceability:</span>
              <span className="bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full border border-teal-200">[Patient Reported]</span>
              <span className="bg-cyan-100 text-cyan-900 px-2.5 py-0.5 rounded-full border border-cyan-200">[Document Extracted]</span>
              <span className="bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full border border-indigo-200">[AI Organized]</span>
              <span className="bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">[AYUSH Protocol]</span>
            </div>

            {/* CONDITIONAL TAB CONTENT */}
            {activeModalTab === 'standard' ? (
              /* Standard Summary Cards Grid */
              <div className="space-y-6">
                {/* AI TRIAGE RISK SCORE & URGENCY CARD */}
                {parsedSummary.triageRisk && (
                  <div className={`p-6 rounded-3xl border-2 space-y-4 shadow-sm ${
                    parsedSummary.triageRisk.level === 'CRITICAL' || parsedSummary.triageRisk.level === 'HIGH'
                      ? 'bg-rose-50/80 border-rose-300'
                      : parsedSummary.triageRisk.level === 'MODERATE'
                      ? 'bg-amber-50/80 border-amber-300'
                      : 'bg-emerald-50/80 border-emerald-300'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-3 border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm text-white ${
                          parsedSummary.triageRisk.level === 'CRITICAL' || parsedSummary.triageRisk.level === 'HIGH'
                            ? 'bg-rose-700'
                            : parsedSummary.triageRisk.level === 'MODERATE'
                            ? 'bg-amber-600'
                            : 'bg-emerald-600'
                        }`}>
                          {parsedSummary.triageRisk.score}%
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-base">AI Clinical Triage Risk Score</span>
                            <span className={`text-xs font-black px-3 py-0.5 rounded-full uppercase ${
                              parsedSummary.triageRisk.level === 'CRITICAL'
                                ? 'bg-rose-700 text-white'
                                : parsedSummary.triageRisk.level === 'HIGH'
                                ? 'bg-rose-600 text-white'
                                : parsedSummary.triageRisk.level === 'MODERATE'
                                ? 'bg-amber-200 text-amber-950 border border-amber-400'
                                : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            }`}>
                              {parsedSummary.triageRisk.level} RISK ({parsedSummary.triageRisk.score}%)
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-700 mt-0.5">
                            Recommended Action: <strong className="text-slate-900">{parsedSummary.triageRisk.urgency}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Visual Score Bar */}
                      <div className="w-full sm:w-48 space-y-1">
                        <div className="flex justify-between text-[10px] font-extrabold text-slate-600 uppercase">
                          <span>Acuity Meter</span>
                          <span>{parsedSummary.triageRisk.score} / 100</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              parsedSummary.triageRisk.level === 'CRITICAL' || parsedSummary.triageRisk.level === 'HIGH'
                                ? 'bg-rose-600'
                                : parsedSummary.triageRisk.level === 'MODERATE'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${parsedSummary.triageRisk.score}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Key Risk Drivers */}
                    <div className="space-y-1 text-xs">
                      <span className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Key Risk Drivers & Factors:</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {parsedSummary.triageRisk.keyRiskFactors.map((factor: string, idx: number) => (
                          <span key={idx} className="bg-white/90 text-slate-900 border border-slate-300 font-bold px-3 py-1 rounded-xl shadow-2xs">
                            &bull; {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI SYNTHESIZED CLINICAL DESCRIPTION CARD */}
                <div className="bg-indigo-50/70 border border-indigo-200 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
                    <span className="font-extrabold text-indigo-950 text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-700" />
                      AI Synthesized Clinical Description (Voice & Touch Analysis)
                    </span>
                    <span className="bg-indigo-200 text-indigo-950 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      AI Generated
                    </span>
                  </div>
                  <p className="text-xs text-indigo-950 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-indigo-200 shadow-2xs">
                    {parsedSummary.aiClinicalDescription || parsedSummary.historyOfPresentIllness}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: HPI */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-sm">History of Present Illness</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded-full">[AI Organized]</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{parsedSummary.historyOfPresentIllness}</p>
                </div>

                {/* Card 2: Associated Symptoms */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-sm">Associated Symptoms</span>
                    <span className="text-[10px] bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-full">[Patient Reported]</span>
                  </div>
                  <ul className="text-xs text-slate-700 list-disc pl-5 space-y-1 font-medium">
                    {parsedSummary.associatedSymptoms.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Card 3: Medications & Allergies */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-sm">Current Medications & Allergies</span>
                    <span className="text-[10px] bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-full">[Patient Reported]</span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1 font-medium">
                    <div><strong>Meds:</strong> {parsedSummary.currentMedications.join(', ')}</div>
                    <div><strong>Allergies:</strong> {parsedSummary.allergies.join(', ')}</div>
                  </div>
                </div>

                {/* Card 4: Attached Medical Documents & Prescriptions Gallery */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 col-span-1 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-600" />
                        Uploaded Medical Documents & Prescriptions ({selectedPatient.documents?.length || 0})
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        Visible, openable, and downloadable in any format (JPG, PNG, PDF, PPTX, DOCX, etc.)
                      </span>
                    </div>

                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5">
                      <FileUp className="w-3.5 h-3.5" />
                      <span>{isUploadingDoc ? 'Uploading...' : 'Attach File'}</span>
                      <input type="file" accept="image/*,application/pdf,.pptx,.ppt,.docx,.doc,.txt,.csv,.xlsx,.xls" onChange={handleDoctorFileUpload} className="hidden" />
                    </label>
                  </div>

                  {selectedPatient.documents && selectedPatient.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPatient.documents.map((doc: any, i: number) => {
                        const meta = getFileMeta(doc.fileName);
                        return (
                          <div key={doc.id || i} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm hover:border-slate-400 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-extrabold text-xs text-slate-700 shrink-0">
                                  {meta.ext}
                                </div>
                                <div className="truncate">
                                  <div className="font-extrabold text-xs text-slate-900 truncate" title={doc.fileName}>{doc.fileName}</div>
                                  <div className="text-[10px] text-slate-500 font-semibold">
                                    {new Date(doc.createdAt).toLocaleDateString()} &bull; <span className="uppercase">{doc.fileType}</span>
                                  </div>
                                </div>
                              </div>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${meta.color} shrink-0`}>
                                {meta.ext}
                              </span>
                            </div>

                            {doc.ocrText && (
                              <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2 italic">
                                "{doc.ocrText}"
                              </p>
                            )}

                            {/* 3 Explicit Document Actions */}
                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
                              {/* 1. View / Preview Modal */}
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                title="Preview document inside portal viewer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>

                              {/* 2. Open in New Browser Tab */}
                              <a
                                href={doc.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1"
                                title="Open original file in new browser tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open</span>
                              </a>

                              {/* 3. Direct Download File */}
                              <a
                                href={`/api/documents/download?file=${encodeURIComponent(doc.filePath)}&name=${encodeURIComponent(doc.fileName)}`}
                                download={doc.fileName}
                                className="py-1.5 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                title="Download exact raw file to your computer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 font-medium text-xs border border-dashed border-slate-200 rounded-xl">
                      No prescription or diagnostic documents attached yet. Click "Attach File" above to upload JPG, PNG, PDF, or PPTX files.
                    </div>
                  )}
                </div>

                {/* Card 5: Recurring Patient Past Visits History (Same Mobile Number) */}
                {selectedPatient.isRecurring && selectedPatient.pastVisitsSummary && selectedPatient.pastVisitsSummary.length > 0 && (
                  <div className="bg-indigo-50/90 border-2 border-indigo-200 p-5 rounded-2xl space-y-4 col-span-1 md:col-span-2 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-indigo-200 pb-3">
                      <div>
                        <span className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-700" />
                          Recurring Patient — Summarized Past Visit History ({selectedPatient.pastVisitsCount} Past Visits)
                        </span>
                        <span className="text-[11px] text-indigo-800 font-semibold block">
                          Matched by Registered Mobile Number: <strong className="text-indigo-950">{selectedPatient.phone}</strong>
                        </span>
                      </div>
                      <span className="bg-indigo-200 text-indigo-950 text-xs font-black px-3 py-1 rounded-full uppercase border border-indigo-300">
                        Same Mobile History
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedPatient.pastVisitsSummary.map((past: any, idx: number) => (
                        <div key={past.id || idx} className="bg-white border border-indigo-200 p-4 rounded-xl space-y-2 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">
                                Past Visit: {new Date(past.visitDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="font-mono text-[11px] text-slate-500">({past.patientId})</span>
                            </div>

                            {past.riskScore && (
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                past.riskLevel === 'CRITICAL' || past.riskLevel === 'HIGH'
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : past.riskLevel === 'MODERATE'
                                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                              }`}>
                                Past Acuity: {past.riskScore}% {past.riskLevel}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-extrabold text-slate-600 uppercase text-[10px] block">Past Chief Complaint:</span>
                              <p className="font-bold text-slate-900 mt-0.5">{past.chiefComplaint}</p>
                            </div>

                            <div>
                              <span className="font-extrabold text-slate-600 uppercase text-[10px] block">Past Doctor Prescribed Advice:</span>
                              <p className="font-semibold text-slate-800 mt-0.5 italic">
                                {past.doctorAdvice ? `"${past.doctorAdvice}"` : 'No prior prescription recorded'}
                              </p>
                            </div>
                          </div>

                          {past.hpiSnippet && (
                            <div className="pt-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2 font-medium">
                              <strong>Past HPI Summary:</strong> {past.hpiSnippet}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card 6: AYUSH Quick Summary Card with Tab Switcher */}
                {parsedSummary.ayushAssessment && (
                  <div className="bg-amber-50/80 border border-amber-300 p-5 rounded-2xl space-y-3 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
                        <Heart className="w-4 h-4 text-amber-700 fill-amber-500" /> AYUSH Dashavidha Pariksha Assessment
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveModalTab('ayush')}
                        className="text-xs bg-amber-900 hover:bg-amber-950 text-white font-extrabold px-3 py-1.5 rounded-xl shadow-sm transition-colors flex items-center gap-1"
                      >
                        <span>Open Ayurvedic Approach</span> &rarr;
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-amber-950 font-medium">
                      <div><strong>Prakriti / Vikriti:</strong> {parsedSummary.ayushAssessment.prakriti}</div>
                      <div><strong>Agni (Digestive Fire):</strong> {parsedSummary.ayushAssessment.agni}</div>
                      <div><strong>Koshtha (Bowels):</strong> {parsedSummary.ayushAssessment.koshtha}</div>
                      <div><strong>Sattva (Psyche):</strong> {parsedSummary.ayushAssessment.sattva}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
              /* AYUSH & AYURVEDIC APPROACH FULL WORKSPACE */
              <div className="space-y-6">
                {parsedSummary.ayushAssessment ? (
                  <>
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-6 rounded-3xl space-y-2 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <Heart className="w-4 h-4 fill-amber-400 text-amber-400" /> AYUSH Clinical Protocol & Ayurvedic Approach
                        </span>
                        <span className="bg-amber-800/80 text-amber-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-700">
                          Dashavidha Pariksha
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-amber-100">Ayurvedic Clinical Protocol for {selectedPatient.fullName}</h3>
                      <p className="text-xs text-amber-200 font-medium">
                        Comprehensive evaluation of metabolic constitution (Prakriti), doshic vitiation (Vikriti), digestive fire (Agni), tissue strength (Sara), classical formulations, and dietary guidelines (Pathya/Apathya).
                      </p>
                    </div>

                    {/* Section 1: Dashavidha Pariksha Clinical Parameters Grid */}
                    <div className="bg-amber-50/70 border border-amber-300 p-6 rounded-3xl space-y-4">
                      <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-2 border-b border-amber-200 pb-2">
                        <span>1. Dashavidha & Ashtavidha Clinical Assessment Matrix</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-amber-950">
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-amber-800 uppercase block font-black">Prakriti (Baseline Constitution)</span>
                          <span className="text-slate-900">{parsedSummary.ayushAssessment.prakriti || 'Pitta-Vata Sama Prakriti'}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-amber-800 uppercase block font-black">Vikriti (Vitiation State)</span>
                          <span className="text-slate-900">{parsedSummary.ayushAssessment.vikriti || 'Moderate Agnimandya Vitiation'}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-amber-800 uppercase block font-black">Agni (Digestive Fire)</span>
                          <span className="text-slate-900">{parsedSummary.ayushAssessment.agni || 'Mandagni / Vishamagni'}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-amber-800 uppercase block font-black">Koshtha (Bowel Nature)</span>
                          <span className="text-slate-900">{parsedSummary.ayushAssessment.koshtha || 'Madhyama Koshtha'}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-amber-800 uppercase block font-black">Sattva (Psyche & Resilience)</span>
                          <span className="text-slate-900">{parsedSummary.ayushAssessment.sattva || 'Pravara Sattva'}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-amber-800 uppercase block font-black">Ahara & Vyayama Shakti</span>
                          <span className="text-slate-900">{parsedSummary.ayushAssessment.aharaShakti || 'Moderate Digestive Strength'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Tridosha Vitiation Analysis */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2">
                      <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                        2. Tridosha Vitiation & Srotas Analysis
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {parsedSummary.ayushAssessment.doshicAnalysis || 'Tridosha Samya Maintenance with mild Vata-Pitta Agnimandya imbalance.'}
                      </p>
                    </div>

                    {/* Section 3: Classical Ayurvedic Formulations (Aushadhi Chikitsa) */}
                    <div className="bg-amber-50/50 border border-amber-200 p-6 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <h4 className="font-extrabold text-sm text-amber-950">
                          3. Classical Ayurvedic Formulations & Herbal Protocol
                        </h4>
                        <span className="text-[10px] text-amber-800 font-extrabold">Aushadhi Chikitsa</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(parsedSummary.ayushAssessment.formulations || []).map((f: any, idx: number) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2 shadow-sm">
                            <div className="flex items-start justify-between">
                              <span className="font-black text-amber-950 text-xs">{f.name}</span>
                              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">{f.dosage}</span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium"><strong>Indication:</strong> {f.indication}</p>
                            <p className="text-[10px] text-amber-900/80 font-mono"><strong>Dravyaguna:</strong> {f.dravyaguna}</p>
                            <button
                              type="button"
                              onClick={() => {
                                const addLine = `${f.name} (${f.dosage}) - ${f.indication}`;
                                setSuggestionText(prev => prev ? `${prev}\n${addLine}` : addLine);
                              }}
                              className="w-full mt-2 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-extrabold rounded-xl border border-amber-300 transition-colors flex items-center justify-center gap-1"
                            >
                              <span>+ Add to Doctor's Advice Plan</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 4: Pathya & Apathya Guidelines */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pathya */}
                      <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl space-y-2">
                        <span className="font-extrabold text-emerald-950 text-xs uppercase block border-b border-emerald-200 pb-1">
                          Pathya Ahara & Vihara (Recommended Regimen)
                        </span>
                        <ul className="text-xs text-emerald-950 space-y-1.5 font-medium list-disc pl-4">
                          {(parsedSummary.ayushAssessment.pathya || []).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Apathya */}
                      <div className="bg-rose-50/70 border border-rose-200 p-5 rounded-2xl space-y-2">
                        <span className="font-extrabold text-rose-950 text-xs uppercase block border-b border-rose-200 pb-1">
                          Apathya (Foods & Habits to Avoid)
                        </span>
                        <ul className="text-xs text-rose-950 space-y-1.5 font-medium list-disc pl-4">
                          {(parsedSummary.ayushAssessment.apathya || []).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Section 5: Herb-Drug Safety & Integration Notes */}
                    <div className="bg-slate-100 border border-slate-300 p-4 rounded-2xl space-y-1 text-xs text-slate-800 font-medium">
                      <span className="font-extrabold text-slate-900 block">Integrative Herb-Drug Safety Protocol:</span>
                      <p>{parsedSummary.ayushAssessment.herbDrugSafety}</p>
                    </div>
                  </>
                ) : (
                  <div className="p-8 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl text-center font-bold text-xs">
                    AYUSH assessment details are active for this patient record.
                  </div>
                )}
              </div>
            )}

            {/* AI Non-Diagnostic Disclaimer Banner */}
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 text-[11px] font-semibold text-slate-600 italic text-center">
              {parsedSummary.disclaimer}
            </div>

            {/* DOCTOR'S SUGGESTION FORM */}
            <form onSubmit={handleSendSuggestion} className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-slate-800" />
                <span>Doctor's Clinical Suggestion & Plan</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Doctor Advice / Treatment Plan *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter medical advice, investigations, or medication instructions..."
                  value={suggestionText}
                  onChange={e => setSuggestionText(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Lifestyle Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Low salt diet, 30 min daily walking"
                    value={instructionsText}
                    onChange={e => setInstructionsText(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="h-12 px-6 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Doctor's Suggestion to Patient Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERMANENT DELETE CONFIRMATION MODAL */}
      {patientToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Delete Patient Record Permanently?</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                This action invokes a server deletion to permanently remove{' '}
                <strong className="text-slate-900">{patientToDelete.fullName}</strong> ({patientToDelete.patientId}) and all attached clinical
                summaries, uploaded files, and session records from the database.
              </p>
              <p className="text-xs font-bold text-rose-700">This action cannot be undone.</p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 h-12 bg-rose-700 hover:bg-rose-800 text-white font-extrabold rounded-xl text-xs shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* IN-APP DOCUMENT PREVIEW & DOWNLOAD MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-950/80 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                  {getFileMeta(previewDoc.fileName).ext}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 truncate max-w-md" title={previewDoc.fileName}>
                    {previewDoc.fileName}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                    <span>Uploaded: {new Date(previewDoc.createdAt).toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span className="uppercase">{previewDoc.fileType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Tab</span>
                </a>

                <a
                  href={`/api/documents/download?file=${encodeURIComponent(previewDoc.filePath)}&name=${encodeURIComponent(previewDoc.fileName)}`}
                  download={previewDoc.fileName}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[350px]">
              {getFileMeta(previewDoc.fileName).isImage ? (
                <div className="space-y-4 text-center w-full">
                  <img
                    src={previewDoc.filePath}
                    alt={previewDoc.fileName}
                    className="max-h-[60vh] max-w-full mx-auto object-contain rounded-xl shadow-md border border-slate-200"
                  />
                  <p className="text-xs text-slate-500 font-semibold">High resolution image prescription scan</p>
                </div>
              ) : getFileMeta(previewDoc.fileName).isPdf ? (
                <iframe
                  src={previewDoc.filePath}
                  className="w-full h-[60vh] rounded-xl border border-slate-300 shadow-sm"
                  title={previewDoc.fileName}
                />
              ) : (
                <div className="text-center space-y-4 max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-950 mx-auto flex items-center justify-center font-black text-xl">
                    {getFileMeta(previewDoc.fileName).ext}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-slate-900">{previewDoc.fileName}</h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      {getFileMeta(previewDoc.fileName).label} File Format
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    This file format ({getFileMeta(previewDoc.fileName).ext}) is saved safely on the server and is available for viewing and direct downloading.
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <a
                      href={previewDoc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open File in Browser</span>
                    </a>
                    <a
                      href={`/api/documents/download?file=${encodeURIComponent(previewDoc.filePath)}&name=${encodeURIComponent(previewDoc.fileName)}`}
                      download={previewDoc.fileName}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* OCR Summary & Text Notes */}
            {previewDoc.ocrText && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-xs text-slate-900 block">OCR Extracted Text & Notes:</span>
                <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {previewDoc.ocrText}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
