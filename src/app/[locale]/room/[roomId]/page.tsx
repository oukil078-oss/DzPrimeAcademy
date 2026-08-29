'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Hand,
  MessageSquare,
  Users,
  FileText,
  Settings,
  PhoneOff,
  Sparkles,
  Maximize,
  CheckCircle2,
  ExternalLink,
  Shield,
  Award,
  Download,
  Search,
  Check,
  X,
  Volume2,
  Radio,
  Send,
  Smile,
  ChevronLeft,
  ChevronRight,
  Layers,
  MonitorPlay,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { TEACHER_LIVE_SESSIONS, AMBASSADORS } from '@/lib/initial-data';
import { SessionAttendee, SessionAmbassador } from '@/types';

interface PageProps {
  params: Promise<{
    locale: string;
    roomId: string;
  }>;
}

export default function LiveRoomPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'SPEAKER' | 'PRESENTATION' | 'GRID'>('SPEAKER');
  const [activeSideTab, setActiveSideTab] = useState<'ATTENDEES' | 'AMBASSADORS' | 'CHAT' | 'HANDOUTS'>('ATTENDEES');

  // Search in attendees
  const [attendeeSearch, setAttendeeSearch] = useState('');
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; role: string; text: string; time: string; avatar: string }>>([
    {
      id: 'msg-1',
      sender: 'علاء الدين (Alaa Eddine)',
      role: 'AMBASSADOR',
      text: 'مرحباً بجميع الطلبة من مختلف الولايات! القاعة مفتوحة وسلسلة التمارين رقم 06 متاحة في خانة الملفات 📄',
      time: '17:58',
      avatar: '🌟',
    },
    {
      id: 'msg-2',
      sender: 'Pr. Abdelrahim Kadri',
      role: 'TEACHER',
      text: 'السلام عليكم ورحمة الله، سنبدأ بمراجعة الاحتمالات الشرطية ثم ننتقل إلى حل تمرين البكالوريا التجريبية.',
      time: '18:00',
      avatar: '👨‍🏫',
    },
    {
      id: 'msg-3',
      sender: 'أنيس حاج صحراوي (Anis)',
      role: 'STUDENT',
      text: 'أستاذ من فضلك هل سنعالج شجرة الاحتمالات ذات الثلاثة فروع؟',
      time: '18:04',
      avatar: '👨‍🎓',
    },
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Find the target session or fallback to first live session
  const currentSession =
    TEACHER_LIVE_SESSIONS.find((s) => s.roomId === resolvedParams.roomId || s.id === resolvedParams.roomId) ||
    TEACHER_LIVE_SESSIONS.find((s) => s.status === 'LIVE_NOW') ||
    TEACHER_LIVE_SESSIONS[0];

  const [attendeesList, setAttendeesList] = useState<SessionAttendee[]>(
    currentSession?.attendees || []
  );

  const ambassadorsList: SessionAmbassador[] = currentSession?.ambassadors || [
    {
      id: 'amb-1',
      name: 'علاء الدين (Alaa Eddine)',
      wilayaCode: 16,
      wilayaName: 'الجزائر العاصمة',
      institution: 'جامعة USTHB باب الزوار',
      roleTitle: 'منسق عام ومشرف القاعة',
      avatar: '🌟',
    },
    {
      id: 'amb-2',
      name: 'سامي بوزيد (Sami Bouzid)',
      wilayaCode: 31,
      wilayaName: 'وهران',
      institution: 'جامعة USTO وهران',
      roleTitle: 'منسق طلبة الغرب ونوادي الرياضيات',
      avatar: '👨‍💼',
    },
  ];

  // Toggle student attendance status
  const handleToggleAttendance = (attId: string, newStatus: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
    setAttendeesList((prev) =>
      prev.map((att) => (att.id === attId ? { ...att, status: newStatus } : att))
    );
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentUser?.name || (locale === 'ar' ? 'أنت (حاضر)' : 'You (Attendee)'),
      role: currentUser?.role || 'STUDENT',
      text: newChatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: currentUser?.role === 'TEACHER' ? '👨‍🏫' : '👨‍🎓',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewChatText('');
  };

  // Filter attendees
  const filteredAttendees = attendeesList.filter((att) =>
    att.studentName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    att.wilayaName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    att.institution.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  const presentCount = attendeesList.filter((a) => a.status === 'PRESENT').length;

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-arabic select-none overflow-hidden">
      {/* ================= 1. TOP HEADER BAR ================= */}
      <header className="h-16 border-b border-navy-800 bg-[#0B1120]/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/${currentUser?.role === 'TEACHER' ? 'teacher' : 'student'}`}
            className="p-2 rounded-xl bg-navy-850 hover:bg-navy-800 text-gray-300 hover:text-white border border-navy-750 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {currentUser?.role === 'TEACHER'
                ? locale === 'ar'
                  ? 'لوحة الأستاذ'
                  : 'Teacher Studio'
                : locale === 'ar'
                ? 'لوحة الطالب'
                : 'Student Hub'}
            </span>
          </Link>

          <div className="h-6 w-px bg-navy-800 hidden sm:block" />

          {/* Session Title & Live Badge */}
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-[11px] font-black flex items-center gap-1.5 border border-red-500/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              LIVE
            </span>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-[200px] sm:max-w-md">
                {currentSession?.title}
              </h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">
                {currentSession?.moduleName} • {currentSession?.courseTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Recording indicator */}
          {isRecording && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-850 border border-navy-750 text-[11px] font-mono text-gray-300">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>REC 01:14:22</span>
            </div>
          )}

          {/* Fallback Google Meet Link */}
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all"
            title="Open an external Google Meet session room"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'فتح في Google Meet' : 'Open in Meet'}</span>
          </a>

          {/* Layout Mode Toggles */}
          <div className="flex items-center bg-navy-900 border border-navy-750 rounded-xl p-0.5">
            <button
              onClick={() => setLayoutMode('SPEAKER')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                layoutMode === 'SPEAKER' ? 'bg-gold-500 text-navy-950 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'المحاضر' : 'Speaker'}
            </button>
            <button
              onClick={() => setLayoutMode('PRESENTATION')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                layoutMode === 'PRESENTATION' ? 'bg-gold-500 text-navy-950 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'العرض' : 'Slides'}
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN BODY (STAGE + SIDEBAR) ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left / Center: Video Presentation Stage */}
        <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 relative overflow-hidden bg-[#070B14]">
          {/* Main Stage Screen */}
          <div className="flex-1 relative rounded-3xl bg-[#0D1424] border border-navy-800 shadow-2xl overflow-hidden flex items-center justify-center">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-950 via-[#0A1020] to-navy-900 opacity-90" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Video / Slide Content */}
            {layoutMode === 'PRESENTATION' ? (
              /* Presentation Slide Mode */
              <div className="relative z-10 w-full h-full p-4 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <div className="flex items-center gap-2">
                    <MonitorPlay className="w-5 h-5 text-gold-500" />
                    <span className="font-black text-sm text-white">
                      {locale === 'ar' ? 'عرض السلسلة والمطبوعة التفاعلية' : 'Masterclass Live Handout Stream'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">Slide 14 / 32 • BAC 2026</span>
                </div>

                <div className="my-auto text-center space-y-4 max-w-2xl mx-auto py-8">
                  <div className="p-6 rounded-2xl bg-navy-900/90 border border-navy-750 shadow-inner text-left font-mono text-xs sm:text-sm text-sky-300 leading-relaxed">
                    <p className="text-gold-400 font-bold mb-2"># المسألة 06: دراسة الاحتمال الشرطي والمتغير العشوائي</p>
                    <p className="text-gray-300">P(A ∩ B) = P(A) × P(B/A) = (3/8) × (2/7) = 3/28</p>
                    <p className="text-gray-300 mt-2">E(X) = ∑ [xi × P(X = xi)] = 2.45 (الأمل الرياضياتي)</p>
                    <p className="text-emerald-400 mt-2">✓ قانون الاحتمال محقق لأن مجموع الاحتمالات = 1.00</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {locale === 'ar'
                      ? 'الأستاذ يشرح حالياً طريقة ملء شجرة الاحتمالات وحساب التباين والانحراف المعياري'
                      : 'Professor is live annotating the probability tree and standard deviation.'}
                  </p>
                </div>

                {/* Floating Instructor PiP */}
                <div className="w-44 h-28 rounded-2xl bg-navy-950 border-2 border-gold-500/60 shadow-2xl overflow-hidden self-end relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="w-full h-full flex flex-col items-center justify-center text-4xl bg-navy-900">
                    👨‍🏫
                  </div>
                  <div className="absolute bottom-1.5 left-2 right-2 z-20 flex items-center justify-between text-[10px] font-bold text-white">
                    <span className="truncate">Pr. Kadri</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                </div>
              </div>
            ) : (
              /* Speaker Full Stage Mode */
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
                {/* Presenter Avatar & Live Wave */}
                <div className="relative">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-gold-500/20 to-amber-500/10 border-4 border-gold-500/50 flex items-center justify-center text-6xl sm:text-7xl shadow-2xl relative">
                    👨‍🏫
                    {/* Animated Pulsing Sound Rings */}
                    <div className="absolute -inset-3 rounded-full border-2 border-gold-500/30 animate-ping pointer-events-none" />
                    <div className="absolute -inset-6 rounded-full border border-gold-500/15 animate-pulse pointer-events-none" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-navy-950 text-[11px] font-black flex items-center gap-1 shadow-lg">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>SPEAKING</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Pr. Abdelrahim Kadri
                  </h3>
                  <p className="text-xs sm:text-sm text-gold-400 font-bold">
                    {locale === 'ar' ? 'أستاذ مبرز في الرياضيات والتحليل الرياضي' : 'Senior Mathematics & Calculus Professor'}
                  </p>
                </div>

                {/* Co-Hosting Ambassadors Mini Cards */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 max-w-xl">
                  {ambassadorsList.map((amb) => (
                    <div
                      key={amb.id}
                      className="px-3 py-1.5 rounded-xl bg-navy-900/90 border border-navy-750 flex items-center gap-2 text-xs shadow-md"
                    >
                      <span className="text-sm">{amb.avatar || '🌟'}</span>
                      <div className="text-left font-sans">
                        <p className="font-black text-white text-[11px]">{amb.name}</p>
                        <p className="text-[9px] text-gray-400">ولاية {amb.wilayaName} ({amb.wilayaCode})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="pt-4 flex items-center justify-between gap-2 max-w-3xl mx-auto w-full z-20">
            <div className="flex items-center gap-2">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 sm:px-4 sm:py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                  isMicOn
                    ? 'bg-navy-800 hover:bg-navy-750 text-white border border-navy-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMicOn ? (locale === 'ar' ? 'كتم الصوت' : 'Mute') : (locale === 'ar' ? 'تشغيل المايك' : 'Unmute')}</span>
              </button>

              {/* Video Toggle */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 sm:px-4 sm:py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                  isVideoOn
                    ? 'bg-navy-800 hover:bg-navy-750 text-white border border-navy-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isVideoOn ? <Video className="w-4 h-4 text-sky-400" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isVideoOn ? (locale === 'ar' ? 'إيقاف الكاميرا' : 'Stop Video') : (locale === 'ar' ? 'تشغيل الكاميرا' : 'Start Video')}</span>
              </button>
            </div>

            {/* Middle Controls */}
            <div className="flex items-center gap-2">
              {/* Screen share */}
              <button
                onClick={() => {
                  setIsScreenSharing(!isScreenSharing);
                  setLayoutMode(isScreenSharing ? 'SPEAKER' : 'PRESENTATION');
                }}
                className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                  isScreenSharing
                    ? 'bg-emerald-500 text-navy-950'
                    : 'bg-navy-800 hover:bg-navy-750 text-white border border-navy-700'
                }`}
                title="مشاركة الشاشة أو المطبوعة"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline">{locale === 'ar' ? 'مشاركة الشاشة' : 'Share Screen'}</span>
              </button>

              {/* Raise Hand */}
              <button
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                  isHandRaised
                    ? 'bg-amber-500 text-navy-950 animate-bounce'
                    : 'bg-navy-800 hover:bg-navy-750 text-white border border-navy-700'
                }`}
                title="طلب الكلمة وطرح سؤال"
              >
                <Hand className="w-4 h-4" />
                <span className="hidden md:inline">{locale === 'ar' ? 'رفع اليد ✋' : 'Raise Hand'}</span>
              </button>
            </div>

            {/* End / Leave Room */}
            <Link
              href={`/${locale}/${currentUser?.role === 'TEACHER' ? 'teacher' : 'student'}`}
              className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span className="hidden sm:inline">
                {currentUser?.role === 'TEACHER'
                  ? locale === 'ar'
                    ? 'إنهاء البث والمغادرة'
                    : 'End Stream'
                  : locale === 'ar'
                  ? 'مغادرة القاعة'
                  : 'Leave Room'}
              </span>
            </Link>
          </div>
        </div>

        {/* ================= 3. RIGHT SIDEBAR (ATTENDEES / AMBASSADORS / CHAT / FILES) ================= */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-r border-navy-800 bg-[#0B1120] flex flex-col shrink-0">
          {/* Tab Navigation */}
          <div className="grid grid-cols-4 p-2 gap-1 bg-navy-950/80 border-b border-navy-800 text-xs">
            <button
              onClick={() => setActiveSideTab('ATTENDEES')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                activeSideTab === 'ATTENDEES'
                  ? 'bg-gold-500 text-navy-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px]">{locale === 'ar' ? 'الطلبة' : 'Students'} ({presentCount})</span>
            </button>

            <button
              onClick={() => setActiveSideTab('AMBASSADORS')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                activeSideTab === 'AMBASSADORS'
                  ? 'bg-gold-500 text-navy-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[10px]">{locale === 'ar' ? 'السفراء' : 'Hosts'} ({ambassadorsList.length})</span>
            </button>

            <button
              onClick={() => setActiveSideTab('CHAT')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                activeSideTab === 'CHAT'
                  ? 'bg-gold-500 text-navy-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[10px]">{locale === 'ar' ? 'الشات' : 'Chat'}</span>
            </button>

            <button
              onClick={() => setActiveSideTab('HANDOUTS')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                activeSideTab === 'HANDOUTS'
                  ? 'bg-gold-500 text-navy-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[10px]">{locale === 'ar' ? 'الملفات' : 'Files'}</span>
            </button>
          </div>

          {/* ================= TAB 1: ATTENDEES ROSTER ================= */}
          {activeSideTab === 'ATTENDEES' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="mb-3 space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                    placeholder={locale === 'ar' ? 'بحث بالاسم أو الولاية أو الثانوية...' : 'Search student or wilaya...'}
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-navy-900 border border-navy-750 text-xs text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 font-mono">
                  <span>{presentCount} حاضرين بالقاعة الآن</span>
                  <span>{attendeesList.length} مسجلين</span>
                </div>
              </div>

              {/* Attendees List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {filteredAttendees.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-2xl bg-navy-900/90 border border-navy-750/70 hover:border-navy-600 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-navy-800 flex items-center justify-center text-base shrink-0">
                          {att.avatar || '👨‍🎓'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-white truncate">{att.studentName}</h4>
                            {att.handRaised && <span className="text-sm animate-bounce" title="طالب يطلب الكلمة">✋</span>}
                          </div>
                          <p className="text-[10px] text-gold-400/90 font-mono">ولاية {att.wilayaName} ({att.wilayaCode})</p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                          att.status === 'PRESENT'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : att.status === 'EXCUSED'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {att.status === 'PRESENT' ? 'حاضر ✓' : att.status === 'EXCUSED' ? 'معذور' : 'غائب'}
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-400 border-t border-navy-800 pt-1.5 flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{att.institution}</span>
                      <span className="font-mono text-gray-500">{att.joinedAt}</span>
                    </div>

                    {/* Teacher status toggle buttons */}
                    {currentUser?.role === 'TEACHER' && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleToggleAttendance(att.id, 'PRESENT')}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            att.status === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-navy-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          حاضر
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(att.id, 'ABSENT')}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            att.status === 'ABSENT' ? 'bg-red-600 text-white' : 'bg-navy-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          غائب
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(att.id, 'EXCUSED')}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            att.status === 'EXCUSED' ? 'bg-amber-600 text-white' : 'bg-navy-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          معذور
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 2: MULTI-AMBASSADORS ================= */}
          {activeSideTab === 'AMBASSADORS' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-xs space-y-1">
                <p className="font-black text-gold-400">
                  {locale === 'ar' ? '🛡️ تنسيق الحصة بين الجامعات والثانويات' : 'Multi-University Coordinating Hosts'}
                </p>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {locale === 'ar'
                    ? 'يتم تنظيم هذه الحصة بالشراكة بين سفراء المنصة المعتمدين لضمان الرد على الأسئلة وإدارة القاعة.'
                    : 'Coordinated between accredited ambassadors across universities to manage student inquiries.'}
                </p>
              </div>

              {ambassadorsList.map((amb) => (
                <div
                  key={amb.id}
                  className="p-4 rounded-2xl bg-navy-900 border border-navy-750 space-y-3 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center text-xl shrink-0">
                      {amb.avatar || '🌟'}
                    </div>
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-bold uppercase">
                        {amb.roleTitle || 'سفير معتمد'}
                      </span>
                      <h4 className="font-black text-sm text-white truncate mt-1">{amb.name}</h4>
                      <p className="text-[11px] text-gray-400">ولاية {amb.wilayaName} ({amb.wilayaCode})</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-gray-300">
                    🏛️ {amb.institution}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= TAB 3: LIVE CHAT STREAM ================= */}
          {activeSideTab === 'CHAT' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-2xl bg-navy-900 border border-navy-750/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span>{msg.avatar}</span>
                        <span className="font-bold text-white">{msg.sender}</span>
                        {msg.role === 'TEACHER' && (
                          <span className="px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-400 font-bold text-[9px]">أستاذ</span>
                        )}
                        {msg.role === 'AMBASSADOR' && (
                          <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-bold text-[9px]">سفير</span>
                        )}
                      </div>
                      <span className="text-gray-500 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed font-sans">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  placeholder={locale === 'ar' ? 'اطرح سؤالك أو شارك برأيك...' : 'Type a question...'}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-750 text-xs text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB 4: HANDOUTS & FILES ================= */}
          {activeSideTab === 'HANDOUTS' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="p-4 rounded-2xl bg-navy-900 border border-navy-750 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-lg shrink-0">
                    📄
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {currentSession?.handoutTitle || 'سلسلة تمارين ومطبوعة الحصة.pdf'}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">3.8 MB • PDF عالي الجودة</p>
                  </div>
                </div>

                <a
                  href={currentSession?.handoutPdfUrl || '/exams/samples/bac_math_serie1_2026.pdf'}
                  download
                  className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs flex items-center justify-center gap-2 shadow transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'تحميل مطبوعة وسلسلة الحصة' : 'Download Session Handout'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
