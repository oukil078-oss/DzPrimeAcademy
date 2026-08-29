'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  Video,
  Clock,
  Calendar,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Award,
  Download,
  Trash2,
  Send,
  FileText,
  Check,
  Shield,
  Star,
  DollarSign,
  TrendingUp,
  MapPin,
  Flame,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Radio,
  Layers,
  ChevronLeft,
  ChevronRight,
  Hand,
  X,
  Play,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore, useTeacherStore } from '@/lib/store';
import {
  TEACHERS,
  DAWARAT_PACKS,
  AMBASSADORS,
  WILAYAS,
  TEACHER_LIVE_SESSIONS,
  SAMPLE_BAC_ATTENDEES,
} from '@/lib/initial-data';
import { ModuleResource, TeacherLiveSession, TeacherRosterStudent, SessionAmbassador, SessionAttendee } from '@/types';

export const TeacherDashboard: React.FC = () => {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const { resources, roster, addResource, deleteResource, updateAttendance } = useTeacherStore();

  const [activeTab, setActiveTab] = useState<'COURSES' | 'SESSIONS' | 'SCHEDULE' | 'ROSTER' | 'DRIVE'>('COURSES');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');
  const [sessionsList, setSessionsList] = useState<TeacherLiveSession[]>(TEACHER_LIVE_SESSIONS);
  const [rosterSearch, setRosterSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deep Session Details & Attendees Modal State
  const [inspectingSession, setInspectingSession] = useState<TeacherLiveSession | null>(null);
  const [sessionAttendeeSearch, setSessionAttendeeSearch] = useState('');

  // New Session Form State (Supports Multiple Ambassadors across universities)
  const [newSessionModule, setNewSessionModule] = useState('mod-bac-math');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('2026-09-02');
  const [newSessionTime, setNewSessionTime] = useState('18:00 - 19:30');
  const [selectedAmbassadorIds, setSelectedAmbassadorIds] = useState<string[]>(['amb-1', 'amb-2']);

  // Resource Upload Form State
  const [resModuleId, setResModuleId] = useState('mod-bac-math');
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'PDF_SERIES' | 'SOLUTION_KEY' | 'MINDMAP' | 'RECORDING'>('PDF_SERIES');
  const [resFileSize, setResFileSize] = useState('3.2 MB');

  // Find active teacher profile or fallback
  const currentTeacher =
    TEACHERS.find((tch) => tch.name.includes(currentUser?.name || '') || tch.id === 'tch-kadri') ||
    TEACHERS[0];

  // Find all assigned modules for this teacher
  const assignedModules = DAWARAT_PACKS.flatMap((pack) =>
    pack.modules
      .filter((m) => m.teacherId === currentTeacher.id || currentTeacher.assignedModuleIds.includes(m.id))
      .map((m) => ({ ...m, packTitle: pack.titleAr, packCategory: pack.category }))
  );

  const totalStudentsEnrolled = assignedModules.reduce((sum, m) => sum + m.enrolledCount, 0);
  const totalCompletedHours = 48; // Verified pedagogical hours
  const totalSessionsConducted = sessionsList.filter((s) => s.status === 'COMPLETED').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Sessions
  const filteredSessions = selectedModuleFilter === 'ALL'
    ? sessionsList
    : sessionsList.filter((s) => s.moduleId === selectedModuleFilter);

  // Filtered Roster
  const filteredRoster = roster.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      r.institution.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      r.wilayaName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      r.moduleName.toLowerCase().includes(rosterSearch.toLowerCase());
    return matchesSearch;
  });

  // Handle Multi-Ambassador Toggle for Scheduling
  const handleToggleAmbassador = (ambId: string) => {
    if (selectedAmbassadorIds.includes(ambId)) {
      if (selectedAmbassadorIds.length === 1) {
        showToast(locale === 'ar' ? 'يجب اختيار سفير واحد على الأقل للتنسيق' : 'Select at least one ambassador');
        return;
      }
      setSelectedAmbassadorIds(selectedAmbassadorIds.filter((id) => id !== ambId));
    } else {
      setSelectedAmbassadorIds([...selectedAmbassadorIds, ambId]);
    }
  };

  // Handle Create New Session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) {
      showToast(locale === 'ar' ? 'يرجى إدخال عنوان الحصة المباشرة' : 'Please enter session title');
      return;
    }

    const targetModule = assignedModules.find((m) => m.id === newSessionModule) || assignedModules[0];
    
    // Resolve chosen ambassadors
    const chosenAmbassadors: SessionAmbassador[] = selectedAmbassadorIds.map((id) => {
      const ambProfile = AMBASSADORS.find((a) => a.id === id) || AMBASSADORS[0];
      return {
        id: ambProfile.id,
        name: ambProfile.user?.name || 'سفير معتمد',
        wilayaCode: ambProfile.wilayaCode,
        wilayaName: ambProfile.wilayaNameAr,
        institution: ambProfile.institutionNameAr,
        roleTitle: ambProfile.wilayaCode === 16 ? 'المشرف التقني وإدارة البث' : 'منسق الطلبة والجامعات الإقليمية',
        avatar: '🌟',
      };
    });

    const leadAmbassador = chosenAmbassadors[0];
    const roomId = `room-${newSessionModule}`;

    const newSess: TeacherLiveSession = {
      id: `sess-${Date.now()}`,
      roomId,
      moduleId: newSessionModule,
      moduleName: targetModule ? targetModule.nameAr : 'المقياس',
      courseTitle: targetModule ? targetModule.packTitle : 'دورة التحضير 2026',
      sessionNumber: sessionsList.filter((s) => s.moduleId === newSessionModule).length + 1,
      title: newSessionTitle.trim(),
      date: newSessionDate,
      timeSlot: newSessionTime,
      durationMinutes: 90,
      ambassadorId: leadAmbassador.id,
      ambassadorName: leadAmbassador.name,
      ambassadorWilayaCode: leadAmbassador.wilayaCode,
      ambassadorWilayaName: leadAmbassador.wilayaName,
      ambassadorAvatar: '🌟',
      ambassadors: chosenAmbassadors,
      attendees: SAMPLE_BAC_ATTENDEES,
      enrolledStudentsCount: targetModule ? targetModule.enrolledCount : 180,
      joinedStudentsCount: 0,
      replayViewsCount: 0,
      questionsCount: 0,
      meetUrl: `/room/${roomId}`,
      status: 'SCHEDULED',
      handoutPdfUrl: '/exams/samples/bac_math_serie1_2026.pdf',
      handoutTitle: 'سلسلة تمارين ومطبوعة الحصة.pdf',
    };

    setSessionsList([newSess, ...sessionsList]);
    setNewSessionTitle('');
    setSelectedModuleFilter(newSessionModule);
    setActiveTab('SESSIONS');
    showToast(
      locale === 'ar'
        ? 'تمت جدولة الحصة وتعيين السفراء بنجاح! 🎥'
        : 'Session scheduled with coordinating ambassadors! 🎥'
    );
  };

  // Handle Attendance Update for a Student in Inspected Session
  const handleUpdateSessionStudentAttendance = (studentId: string, newStatus: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
    if (!inspectingSession) return;

    const updatedAttendees = (inspectingSession.attendees || []).map((att) =>
      att.id === studentId ? { ...att, status: newStatus } : att
    );

    const updatedSession = { ...inspectingSession, attendees: updatedAttendees };
    setInspectingSession(updatedSession);

    // Also update in main sessions list
    setSessionsList((prev) =>
      prev.map((s) => (s.id === inspectingSession.id ? updatedSession : s))
    );

    showToast(
      locale === 'ar'
        ? 'تم تحديث حالة حضور الطالب بنجاح ✓'
        : 'Student attendance updated ✓'
    );
  };

  // Handle Resource Upload
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) {
      showToast(locale === 'ar' ? 'يرجى إدخال عنوان الملف أو السلسلة' : 'Please enter resource title');
      return;
    }

    const targetModule = assignedModules.find((m) => m.id === resModuleId) || assignedModules[0];
    const newRes: ModuleResource = {
      id: `res-${Date.now()}`,
      moduleId: resModuleId,
      moduleName: targetModule ? targetModule.nameAr : 'المقياس',
      title: resTitle.trim(),
      fileType: resType,
      fileUrl: '/exams/samples/bac_math_serie1_2026.pdf',
      fileSize: resFileSize,
      uploadedBy: currentTeacher.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadCount: 0,
    };

    addResource(newRes);
    setResTitle('');
    showToast(
      locale === 'ar'
        ? 'تم رفع السلسلة ونشرها للطلبة بنجاح! 📄'
        : 'Resource published to students successfully! 📄'
    );
  };

  return (
    <div className="w-full space-y-8 font-arabic select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 1. TEACHER HERO STRIP ================= */}
      <div className="relative rounded-[3rem] p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-[#0B1120] to-[#0A0E1A] text-white border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Instructor Bio & Credentials */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-gold-500/30 to-amber-500/10 border-2 border-gold-500/60 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shrink-0">
              {currentTeacher.avatar}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-black border border-gold-500/30">
                  👨‍🏫 {locale === 'ar' ? 'فضاء الأستاذ والمحاضر المعتمد' : 'Official Faculty Portal'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  ✓ {locale === 'ar' ? 'أستاذ مبرز معتمد' : 'Accredited Senior Professor'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight truncate">
                {currentTeacher.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {currentTeacher.titleAr} • {currentTeacher.institution}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('SCHEDULE')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{locale === 'ar' ? 'جدولة حصة مباشرة جديدة' : 'Schedule Masterclass'}</span>
            </button>

            <button
              onClick={() => setActiveTab('DRIVE')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-gold-400" />
              <span>{locale === 'ar' ? 'رفع سلسلة / حلول' : 'Upload Handout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. TEACHER KPI METRIC CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Metric 1: Assigned Modules */}
        <div className="p-5 rounded-[2rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
              {locale === 'ar' ? 'المقاييس المسندة' : 'Assigned Courses'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {assignedModules.length} <span className="text-xs font-sans text-slate-400">{locale === 'ar' ? 'مقررات' : 'Courses'}</span>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
            {totalCompletedHours}h {locale === 'ar' ? 'ساعات تدريس' : 'Total Hours'}
          </p>
        </div>

        {/* Metric 2: Live Masterclasses */}
        <div className="p-5 rounded-[2rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
              {locale === 'ar' ? 'الحصص المباشرة' : 'Live Sessions'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {sessionsList.length} <span className="text-xs font-sans text-slate-400">{locale === 'ar' ? 'حصة' : 'Sessions'}</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            {totalSessionsConducted} {locale === 'ar' ? 'أنجزت بنجاح' : 'Completed'}
          </p>
        </div>

        {/* Metric 3: Active Students */}
        <div className="p-5 rounded-[2rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
              {locale === 'ar' ? 'الطلبة المسجلون' : 'Active Students'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {totalStudentsEnrolled}
          </div>
          <p className="text-[11px] text-sky-600 dark:text-sky-400 font-bold">
            58 {locale === 'ar' ? 'ولاية ممثلة' : 'Wilayas'}
          </p>
        </div>

        {/* Metric 4: Satisfaction */}
        <div className="p-5 rounded-[2rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
              {locale === 'ar' ? 'تقييم الطلبة' : 'Rating Score'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white flex items-center gap-1">
            4.92 <span className="text-xs font-sans text-amber-500">★</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            142 {locale === 'ar' ? 'تقييم إيجابي' : 'Reviews'}
          </p>
        </div>

        {/* Metric 5: Masterclass Honorarium */}
        <div className="p-5 rounded-[2rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-md space-y-2 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
              {locale === 'ar' ? 'الأتعاب والاشتراكات' : 'Faculty Share'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            320,000 <span className="text-xs font-sans font-bold">DZD</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {locale === 'ar' ? 'سداد مؤكد عبر CCP' : 'Direct Payout'}
          </p>
        </div>
      </div>

      {/* ================= 3. NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 overflow-x-auto">
        {/* Tab 1: Courses */}
        <button
          onClick={() => setActiveTab('COURSES')}
          className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'COURSES'
              ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{locale === 'ar' ? 'المقاييس والمقررات (Courses)' : 'Assigned Courses'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
            {assignedModules.length}
          </span>
        </button>

        {/* Tab 2: Live Sessions Log */}
        <button
          onClick={() => setActiveTab('SESSIONS')}
          className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'SESSIONS'
              ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{locale === 'ar' ? 'سجل الحصص والسفراء المشرفين' : 'Sessions & Ambassadors'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
            {filteredSessions.length}
          </span>
        </button>

        {/* Tab 3: Schedule New */}
        <button
          onClick={() => setActiveTab('SCHEDULE')}
          className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'SCHEDULE'
              ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{locale === 'ar' ? 'جدولة حصة جديدة (Scheduler)' : 'Schedule Session'}</span>
        </button>

        {/* Tab 4: Student Attendance Roster */}
        <button
          onClick={() => setActiveTab('ROSTER')}
          className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'ROSTER'
              ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{locale === 'ar' ? 'قائمة الطلبة والتقييم (Roster)' : 'Student Roster'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
            {roster.length}
          </span>
        </button>

        {/* Tab 5: Drive / Handouts */}
        <button
          onClick={() => setActiveTab('DRIVE')}
          className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'DRIVE'
              ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{locale === 'ar' ? 'بنك السلاسل والملفات (Drive)' : 'Study Drive'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
            {resources.length}
          </span>
        </button>
      </div>

      {/* ================= 4. TAB 1: ASSIGNED COURSES (HIERARCHICAL DRILL-DOWN) ================= */}
      {activeTab === 'COURSES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'المقاييس والمقررات المسندة إليك' : 'Your Assigned Courses & Curricula'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {locale === 'ar'
                  ? 'انقر على أي مقياس لعرض حصصه المباشرة، الطلبة الحاضرين، والسفراء المنسقين'
                  : 'Click any course to inspect its sessions, attendees, and assigned ambassadors'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
                {locale === 'ar' ? 'تصفية سريعة:' : 'Filter:'}
              </span>
              <select
                value={selectedModuleFilter}
                onChange={(e) => setSelectedModuleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              >
                <option value="ALL">{locale === 'ar' ? 'جميع المقاييس' : 'All Courses'}</option>
                {assignedModules.map((m) => (
                  <option key={m.id} value={m.id}>{m.nameAr}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedModules.map((mod) => {
              const sessionsCount = sessionsList.filter((s) => s.moduleId === mod.id).length;
              const completedCount = sessionsList.filter((s) => s.moduleId === mod.id && s.status === 'COMPLETED').length;
              const progressPct = sessionsCount > 0 ? Math.round((completedCount / sessionsCount) * 100) : 75;

              return (
                <div
                  key={mod.id}
                  className="p-6 rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-lg flex flex-col justify-between space-y-6 hover:border-gold-500/50 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold">
                        {mod.packCategory}
                      </span>
                      <span className="text-xs font-bold text-slate-400 dark:text-gray-400 font-mono">
                        {mod.hoursCount}h Total
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-gold-500 transition-colors">
                        {mod.nameAr}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        {mod.packTitle}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-gray-300">
                        <span>{locale === 'ar' ? 'الحصص المنجزة' : 'Progress'}</span>
                        <span>{completedCount}/{sessionsCount > 0 ? sessionsCount : mod.sessionsCount} ({progressPct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-500 to-amber-500 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Students & Schedule Pill */}
                    <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-600 dark:text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-sky-500" />
                        <span>{mod.enrolledCount} {locale === 'ar' ? 'طالب مسجل' : 'Students'}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono">{mod.scheduleDaysAr}</span>
                    </div>
                  </div>

                  {/* Hierarchical Drill-Down Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 dark:border-navy-800/80 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedModuleFilter(mod.id);
                        setActiveTab('SESSIONS');
                      }}
                      className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 dark:bg-gold-500 hover:opacity-90 text-white dark:text-navy-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>{locale === 'ar' ? 'عرض حصص المقياس' : 'View Sessions'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setNewSessionModule(mod.id);
                        setActiveTab('SCHEDULE');
                      }}
                      className="p-3 rounded-2xl bg-slate-100 dark:bg-navy-850 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-gray-300 transition-all cursor-pointer"
                      title={locale === 'ar' ? 'جدولة حصة جديدة لهذا المقياس' : 'Schedule session'}
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 5. TAB 2: LIVE MASTERCLASSES & AMBASSADORS LOG ================= */}
      {activeTab === 'SESSIONS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'سجل الحصص المباشرة وتنسيق السفراء' : 'Masterclass Sessions & Ambassadors'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {locale === 'ar'
                  ? 'متابعة تفاصيل كل حصة: السفراء المشرفون عبر الجامعات، نسبة الحضور، ورابط القاعة المباشرة'
                  : 'Track each live session, co-hosting ambassadors across institutions, and student attendance'}
              </p>
            </div>

            {/* Module Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
              <button
                onClick={() => setSelectedModuleFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedModuleFilter === 'ALL'
                    ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 font-black'
                    : 'text-slate-600 dark:text-gray-400 hover:text-white'
                }`}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </button>
              {assignedModules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModuleFilter(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedModuleFilter === m.id
                      ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 font-black'
                      : 'text-slate-600 dark:text-gray-400 hover:text-white'
                  }`}
                >
                  {m.nameAr}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.map((sess) => {
              const attendancePercent = sess.enrolledStudentsCount > 0
                ? Math.round((sess.joinedStudentsCount / sess.enrolledStudentsCount) * 100)
                : 0;

              return (
                <div
                  key={sess.id}
                  className={`p-6 rounded-[2.5rem] bg-white dark:bg-[#0D1424] border transition-all space-y-6 shadow-lg ${
                    sess.status === 'LIVE_NOW'
                      ? 'border-red-500 shadow-red-500/10 ring-2 ring-red-500/20'
                      : 'border-slate-200/80 dark:border-navy-800/80 hover:border-gold-500/50'
                  }`}
                >
                  {/* Session Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-navy-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                            sess.status === 'LIVE_NOW'
                              ? 'bg-red-500 text-white animate-pulse'
                              : sess.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                          }`}
                        >
                          {sess.status === 'LIVE_NOW' && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                          {sess.status === 'LIVE_NOW'
                            ? (locale === 'ar' ? 'مباشر الآن (LIVE)' : 'LIVE NOW')
                            : sess.status === 'COMPLETED'
                            ? (locale === 'ar' ? 'مكتملة ومسجلة' : 'Completed')
                            : (locale === 'ar' ? 'مجدولة قادمة' : 'Scheduled')}
                        </span>

                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-gray-400">
                          {sess.moduleName} • {sess.courseTitle}
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white pt-1">
                        {sess.title}
                      </h4>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Inspect Joined Students Modal Button */}
                      <button
                        onClick={() => setInspectingSession(sess)}
                        className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-navy-700 transition-all cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-sky-500" />
                        <span>{locale === 'ar' ? 'تفاصيل الحصة والطلبة الحاضرين' : 'Inspect Attendees'}</span>
                      </button>

                      {/* In-App Live Masterclass Room Link */}
                      <Link
                        href={`/${locale}/room/${sess.roomId || 'room-math-kadri'}`}
                        className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-md transition-all ${
                          sess.status === 'LIVE_NOW'
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce'
                            : 'bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 hover:opacity-90'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>{sess.status === 'LIVE_NOW' ? (locale === 'ar' ? 'دخول قاعة البث المباشر' : 'Join Live Stream') : (locale === 'ar' ? 'فتح قاعة المحاضرة' : 'Open Live Room')}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Multi-Ambassadors & Attendance Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Multi-Ambassadors Box */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/60 dark:border-navy-750 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {locale === 'ar' ? 'السفراء المشرفون عبر الجامعات' : 'Coordinating Hosts'}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-500 font-bold">
                          {sess.ambassadors ? sess.ambassadors.length : 1} {locale === 'ar' ? 'سفراء' : 'Hosts'}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5">
                        {(sess.ambassadors || [
                          {
                            id: sess.ambassadorId,
                            name: sess.ambassadorName,
                            wilayaCode: sess.ambassadorWilayaCode,
                            wilayaName: sess.ambassadorWilayaName,
                            institution: 'سفير معتمد',
                            avatar: sess.ambassadorAvatar,
                          }
                        ]).slice(0, 2).map((amb) => (
                          <div key={amb.id} className="flex items-center gap-2">
                            <span className="text-sm">{amb.avatar || '🌟'}</span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white text-[11px] truncate">{amb.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">ولاية {amb.wilayaName} ({amb.wilayaCode})</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attendance Stats */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/60 dark:border-navy-750 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{locale === 'ar' ? 'نسبة الحضور المباشر' : 'Live Attendance'}</span>
                      <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {sess.joinedStudentsCount} / {sess.enrolledStudentsCount} ({attendancePercent}%)
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">{locale === 'ar' ? 'طلبة حاضرون في القاعة' : 'Present in session'}</p>
                    </div>

                    {/* Date & Time */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/60 dark:border-navy-750 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{locale === 'ar' ? 'التوقيت والمدة' : 'Date & Duration'}</span>
                      <div className="text-xs font-black font-mono text-slate-900 dark:text-white">
                        {sess.date} • {sess.timeSlot}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">{sess.durationMinutes} min ({locale === 'ar' ? 'ساعة ونصف' : '1h 30m'})</p>
                    </div>

                    {/* Replays & Questions */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/60 dark:border-navy-750 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{locale === 'ar' ? 'المشاهدات والتفاعل' : 'Replay & Files'}</span>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                        <span>👁️ {sess.replayViewsCount} Replays</span>
                        <span>💬 {sess.questionsCount} Q&A</span>
                      </div>
                      <p className="text-[10px] text-gold-600 dark:text-gold-400 truncate">{sess.handoutTitle || 'سلسلة الحصة.pdf'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 6. TAB 3: SCHEDULE MASTERCLASS WITH MULTI-AMBASSADORS ================= */}
      {activeTab === 'SCHEDULE' && (
        <div className="p-6 sm:p-10 rounded-[3rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'جدولة حصة مباشرة وتعيين السفراء المنسقين' : 'Schedule New Live Masterclass'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              {locale === 'ar'
                ? 'حدد المقياس، التوقيت، وعين سفيراً أو أكثر من مختلف الجامعات لإدارة القاعة واستقبال الأسئلة'
                : 'Select course, schedule time, and assign multiple coordinating ambassadors across universities'}
            </p>
          </div>

          <form onSubmit={handleCreateSession} className="space-y-6">
            {/* Target Module */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                {locale === 'ar' ? 'المقياس والمقرر المستهدف *' : 'Target Course & Module *'}
              </label>
              <select
                value={newSessionModule}
                onChange={(e) => setNewSessionModule(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-bold text-slate-900 dark:text-white focus:border-gold-500 focus:outline-none"
              >
                {assignedModules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nameAr} ({m.packTitle})
                  </option>
                ))}
              </select>
            </div>

            {/* Session Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                {locale === 'ar' ? 'عنوان الحصة ومحور الدرس *' : 'Session Topic & Title *'}
              </label>
              <input
                type="text"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder={locale === 'ar' ? 'مثال: 08. حل مسائل المتتاليات والمجاميع المعقدة لشهادة البكالوريا 2026' : 'e.g. Masterclass 08: Calculus & Matrices'}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-bold text-slate-900 dark:text-white focus:border-gold-500 focus:outline-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {locale === 'ar' ? 'تاريخ الحصة *' : 'Session Date *'}
                </label>
                <input
                  type="date"
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-mono font-bold text-slate-900 dark:text-white focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {locale === 'ar' ? 'التوقيت والمدة *' : 'Time Slot *'}
                </label>
                <input
                  type="text"
                  value={newSessionTime}
                  onChange={(e) => setNewSessionTime(e.target.value)}
                  placeholder="18:00 - 19:30"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-mono font-bold text-slate-900 dark:text-white focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Multi-Ambassador Selection Box */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {locale === 'ar' ? 'تعيين السفراء المنسقين عبر مختلف الجامعات والثانويات *' : 'Assign Coordinating Ambassadors *'}
                </label>
                <span className="text-[11px] font-mono text-gold-500 font-bold">
                  {selectedAmbassadorIds.length} {locale === 'ar' ? 'سفراء محددين' : 'Selected'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750">
                {AMBASSADORS.map((amb) => {
                  const isChecked = selectedAmbassadorIds.includes(amb.id);
                  return (
                    <div
                      key={amb.id}
                      onClick={() => handleToggleAmbassador(amb.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isChecked
                          ? 'bg-gold-500/10 border-gold-500 dark:bg-gold-500/20'
                          : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-750 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{amb.id === 'amb-1' ? '🌟' : '👨‍💼'}</span>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {amb.user?.name || 'سفير معتمد'}
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                            ولاية {amb.wilayaNameAr} ({amb.wilayaCode}) • {amb.institutionNameAr}
                          </p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isChecked ? 'bg-gold-500 text-navy-950 font-black' : 'border border-slate-300 dark:border-navy-700'
                      }`}>
                        {isChecked && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-sm shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{locale === 'ar' ? 'تأكيد الجدولة وتعيين السفراء' : 'Confirm Masterclass Schedule'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ================= 7. TAB 4: OVERALL STUDENT ROSTER ================= */}
      {activeTab === 'ROSTER' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'قائمة الطلبة المسجلين وتقييم الحضور' : 'Student Enrollment Roster'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {locale === 'ar'
                  ? 'متابعة مواظبة الطلبة، ولاياتهم، وتأكيد الحضور لكل مقياس مسند'
                  : 'Track student attendance rate, wilayas, and mark status'}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder={locale === 'ar' ? 'بحث بالاسم أو الولاية...' : 'Search student or wilaya...'}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-navy-850/80 text-slate-500 dark:text-gray-400 font-bold border-b border-slate-200/60 dark:border-navy-750">
                <tr>
                  <th className="p-4 sm:p-5">{locale === 'ar' ? 'الطالب' : 'Student'}</th>
                  <th className="p-4 sm:p-5">{locale === 'ar' ? 'الولاية والمؤسسة' : 'Wilaya & Institution'}</th>
                  <th className="p-4 sm:p-5">{locale === 'ar' ? 'المقياس' : 'Course'}</th>
                  <th className="p-4 sm:p-5">{locale === 'ar' ? 'نسبة المواظبة' : 'Attendance Rate'}</th>
                  <th className="p-4 sm:p-5">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="p-4 sm:p-5 text-center">{locale === 'ar' ? 'إجراء' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                {filteredRoster.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-850/40 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-black shrink-0">
                          {st.avatar || '👨‍🎓'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white">{st.studentName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">انضم: {st.enrolledAt}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 sm:p-5">
                      <p className="font-bold text-slate-900 dark:text-white">ولاية {st.wilayaName} ({st.wilayaCode})</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">{st.institution}</p>
                    </td>

                    <td className="p-4 sm:p-5 font-bold text-slate-800 dark:text-gray-200">
                      {st.moduleName}
                    </td>

                    <td className="p-4 sm:p-5 font-mono font-bold">
                      <span className={st.attendanceRate >= 90 ? 'text-emerald-500' : 'text-amber-500'}>
                        {st.attendanceRate}%
                      </span>
                    </td>

                    <td className="p-4 sm:p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-black ${
                          st.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : st.status === 'EXCUSED'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {st.status === 'ACTIVE' ? 'حاضر منتظم' : st.status === 'EXCUSED' ? 'غياب مبرر' : 'غائب'}
                      </span>
                    </td>

                    <td className="p-4 sm:p-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            updateAttendance(st.id, 'ACTIVE');
                            showToast(locale === 'ar' ? 'تم تسجيل الطالب كحاضر منتظم ✓' : 'Marked active');
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] transition-all cursor-pointer"
                        >
                          حاضر
                        </button>
                        <button
                          onClick={() => {
                            updateAttendance(st.id, 'ABSENT');
                            showToast(locale === 'ar' ? 'تم تسجيل الطالب كغائب ⚠️' : 'Marked absent');
                          }}
                          className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-[10px] transition-all cursor-pointer"
                        >
                          غائب
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 8. TAB 5: STUDY DRIVE & UPLOAD ================= */}
      {activeTab === 'DRIVE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Uploader Form */}
          <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-lg space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'رفع سلسلة أو ملخص جديد' : 'Upload Course Material'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {locale === 'ar' ? 'إتاحة ملفات PDF للطلبة فوراً' : 'Publish files to student study drive'}
              </p>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {locale === 'ar' ? 'المقياس المستهدف *' : 'Target Course *'}
                </label>
                <select
                  value={resModuleId}
                  onChange={(e) => setResModuleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  {assignedModules.map((m) => (
                    <option key={m.id} value={m.id}>{m.nameAr}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {locale === 'ar' ? 'عنوان السلسلة أو الملف *' : 'Resource Title *'}
                </label>
                <input
                  type="text"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder={locale === 'ar' ? 'مثال: سلسلة تمارين 03: الدوال اللوغاريتمية' : 'e.g. Exercise Series 03'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {locale === 'ar' ? 'نوع الملف *' : 'Resource Type *'}
                </label>
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="PDF_SERIES">{locale === 'ar' ? 'سلسلة تمارين (PDF Series)' : 'PDF Series'}</option>
                  <option value="SOLUTION_KEY">{locale === 'ar' ? 'حل نموذجي مفصل (Solution Key)' : 'Solution Key'}</option>
                  <option value="MINDMAP">{locale === 'ar' ? 'خريطة ذهنية وملخص (Mindmap)' : 'Mindmap'}</option>
                  <option value="RECORDING">{locale === 'ar' ? 'تسجيل حصة (Recording Link)' : 'Recording Link'}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-gold-500 hover:opacity-90 text-white dark:text-navy-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{locale === 'ar' ? 'نشر الملف في Study Drive' : 'Publish Resource'}</span>
              </button>
            </form>
          </div>

          {/* Uploaded Resources List */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'الملفات المنشورة عبر المنصة' : 'Published Materials'} ({resources.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-gold-500/50 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-mono text-[10px] font-bold">
                        {res.fileType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{res.fileSize}</span>
                    </div>

                    <h5 className="font-black text-xs text-slate-900 dark:text-white leading-snug">
                      {res.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">
                      {res.moduleName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800/60 text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">📥 {res.downloadCount} تنزيل</span>
                    <button
                      onClick={() => {
                        deleteResource(res.id);
                        showToast(locale === 'ar' ? 'تم حذف الملف بنجاح' : 'File deleted');
                      }}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 9. DEEP SESSION DETAILS & ATTENDEES INSPECTOR MODAL ================= */}
      <AnimatePresence>
        {inspectingSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-navy-750 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 bg-slate-50 dark:bg-navy-900/90 border-b border-slate-200/80 dark:border-navy-750 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-400 font-black text-xs">
                      الحصة #{inspectingSession.sessionNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-gray-400">
                      {inspectingSession.moduleName}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {inspectingSession.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                    📅 {inspectingSession.date} • ⏰ {inspectingSession.timeSlot} • ⏳ {inspectingSession.durationMinutes} min
                  </p>
                </div>

                <button
                  onClick={() => setInspectingSession(null)}
                  className="p-2.5 rounded-2xl bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* 1. Multi-Ambassadors Coordination Across Universities */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gold-500" />
                      <span>{locale === 'ar' ? 'السفراء المشرفون والمنسقون عبر مختلف الجامعات' : 'Coordinating Ambassadors Across Universities'}</span>
                    </h4>
                    <span className="text-xs font-mono text-gold-500 font-bold">
                      {inspectingSession.ambassadors?.length || 1} {locale === 'ar' ? 'سفراء معتمدين' : 'Hosts'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(inspectingSession.ambassadors || [
                      {
                        id: inspectingSession.ambassadorId,
                        name: inspectingSession.ambassadorName,
                        wilayaCode: inspectingSession.ambassadorWilayaCode,
                        wilayaName: inspectingSession.ambassadorWilayaName,
                        institution: 'سفير معتمد',
                        roleTitle: 'منسق عام',
                        avatar: inspectingSession.ambassadorAvatar,
                      }
                    ]).map((amb) => (
                      <div
                        key={amb.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200/80 dark:border-navy-750 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-500 flex items-center justify-center text-lg shrink-0">
                          {amb.avatar || '🌟'}
                        </div>
                        <div className="min-w-0">
                          <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-[9px] font-black uppercase">
                            {amb.roleTitle || 'سفير معتمد'}
                          </span>
                          <h5 className="font-black text-xs text-slate-900 dark:text-white truncate mt-0.5">{amb.name}</h5>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                            ولاية {amb.wilayaName} ({amb.wilayaCode}) • {amb.institution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Joined Students Attendees Roster */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-500" />
                        <span>{locale === 'ar' ? 'قائمة الطلبة الحاضرين لهذه الحصة' : 'Joined Students Roster'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        {inspectingSession.joinedStudentsCount} {locale === 'ar' ? 'طالب حضروا البث المباشر والتفاعل' : 'Students attended'}
                      </p>
                    </div>

                    <div className="relative w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={sessionAttendeeSearch}
                        onChange={(e) => setSessionAttendeeSearch(e.target.value)}
                        placeholder={locale === 'ar' ? 'بحث في قائمة الحضور...' : 'Search attendees...'}
                        className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {(inspectingSession.attendees || SAMPLE_BAC_ATTENDEES)
                      .filter((att) =>
                        att.studentName.toLowerCase().includes(sessionAttendeeSearch.toLowerCase()) ||
                        att.wilayaName.toLowerCase().includes(sessionAttendeeSearch.toLowerCase()) ||
                        att.institution.toLowerCase().includes(sessionAttendeeSearch.toLowerCase())
                      )
                      .map((att) => (
                        <div
                          key={att.id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/80 border border-slate-200/80 dark:border-navy-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-sm shrink-0 font-black">
                              {att.avatar || '👨‍🎓'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="font-black text-xs text-slate-900 dark:text-white truncate">
                                  {att.studentName}
                                </h5>
                                {att.handRaised && <span className="text-xs" title="طلب الكلمة">✋</span>}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                                ولاية {att.wilayaName} ({att.wilayaCode}) • {att.institution}
                              </p>
                              {att.notes && (
                                <p className="text-[9px] text-gold-600 dark:text-gold-400 font-bold mt-0.5">
                                  📝 {att.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                att.status === 'PRESENT'
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : att.status === 'EXCUSED'
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  : 'bg-red-500/20 text-red-600 dark:text-red-400'
                              }`}
                            >
                              {att.status === 'PRESENT' ? 'حاضر ✓' : att.status === 'EXCUSED' ? 'معذور' : 'غائب'}
                            </span>

                            {/* Status change buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateSessionStudentAttendance(att.id, 'PRESENT')}
                                className={`px-2 py-1 rounded-lg text-[9px] font-bold ${
                                  att.status === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-navy-750 text-slate-600 dark:text-gray-300'
                                }`}
                              >
                                حاضر
                              </button>
                              <button
                                onClick={() => handleUpdateSessionStudentAttendance(att.id, 'ABSENT')}
                                className={`px-2 py-1 rounded-lg text-[9px] font-bold ${
                                  att.status === 'ABSENT' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-navy-750 text-slate-600 dark:text-gray-300'
                                }`}
                              >
                                غائب
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 dark:bg-navy-900 border-t border-slate-200/80 dark:border-navy-750 flex items-center justify-between gap-3">
                <Link
                  href={`/${locale}/room/${inspectingSession.roomId || 'room-math-kadri'}`}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'دخول قاعة البث التفاعلية الآن' : 'Enter Live Classroom'}</span>
                </Link>

                <button
                  onClick={() => setInspectingSession(null)}
                  className="px-5 py-3 rounded-2xl bg-slate-200 dark:bg-navy-800 text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-300 dark:hover:bg-navy-750 transition-all"
                >
                  {locale === 'ar' ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
