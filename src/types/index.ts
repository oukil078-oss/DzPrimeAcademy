export type Role =
  | 'OWNER'
  | 'ADMIN'
  | 'AGENT_TECHNIQUE'
  | 'MODERATOR'
  | 'AMBASSADOR'
  | 'TEACHER'
  | 'STUDENT_FREE'
  | 'STUDENT_PAID';

export type Region = 'WEST' | 'EAST' | 'CENTER' | 'SOUTH';

export type InstitutionType = 'UNIVERSITY' | 'HIGH_SCHOOL';

export type TrackType = 'BAC' | 'UNIVERSITY_LMD' | 'MEDICAL';

export type ExamType = 'MIDTERM_EMD' | 'FINAL_SEMESTRIAL' | 'RATTRAPAGE';

export type PostType = 'EVENT' | 'STUDY_TIP' | 'SESSION_SCHEDULE' | 'ANNOUNCEMENT';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export type Locale = 'ar' | 'fr' | 'en';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  phone?: string;
  wilayaCode?: number;
  wilayaName?: string;
  institutionId?: string;
  institutionName?: string;
  track?: TrackType;
  specialty?: string;
  academicYear?: string;
  studentCardId?: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface Wilaya {
  code: number;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  region: Region;
}

export interface Institution {
  id: string;
  nameAr: string;
  nameFr: string;
  type: InstitutionType;
  wilayaCode: number;
  logoUrl?: string;
  wilayaNameAr?: string;
}

export interface Faculty {
  id: string;
  nameAr: string;
  nameFr: string;
  institutionId: string;
}

export interface Specialty {
  id: string;
  nameAr: string;
  nameFr: string;
  trackType: TrackType;
  facultyId: string;
}

export interface AcademicYear {
  id: string;
  nameAr: string;
  nameFr: string;
  semester?: string;
  specialtyId: string;
}

export interface ModuleItem {
  id: string;
  nameAr: string;
  nameFr: string;
  code: string;
  coefficient: number;
  academicYearId: string;
  examsCount?: number;
}

export interface ExamItem {
  id: string;
  title: string;
  year: number;
  termType: ExamType;
  fileUrl: string;
  solutionUrl?: string;
  isFreeSample: boolean;
  downloadsCount: number;
  moduleId: string;
  moduleName?: string;
  authorName?: string;
  createdAt: string;
}

export interface AmbassadorProfile {
  id: string;
  userId: string;
  user: User;
  wilayaCode: number;
  wilayaNameAr: string;
  institutionId: string;
  institutionNameAr: string;
  bioAr?: string;
  bioFr?: string;
  ratingAverage: number;
  ratingsCount: number;
  isVerified: boolean;
  upcomingSessionsCount: number;
  totalTipsShared: number;
}

export interface Rating {
  id: string;
  score: number;
  comment?: string;
  ambassadorId: string;
  studentName: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  wilayaCode?: number;
  wilayaName?: string;
  institutionId?: string;
  institutionName?: string;
  eventDate?: string;
  isOnline: boolean;
  meetUrl?: string;
  location?: string;
  isApproved: boolean;
  authorId: string;
  authorName: string;
  authorRole: Role;
  createdAt: string;
}

// Bot Decision-Tree Types
export type BotStep =
  | 'TRACK'
  | 'WILAYA_OR_UNIV'
  | 'FACULTY_OR_STREAM'
  | 'SPECIALTY'
  | 'YEAR_SEMESTER'
  | 'MODULE'
  | 'EXAMS';

export interface BotSelectionState {
  track?: TrackType;
  wilayaCode?: number;
  wilayaName?: string;
  institutionId?: string;
  institutionName?: string;
  facultyId?: string;
  facultyName?: string;
  specialtyId?: string;
  specialtyName?: string;
  academicYearId?: string;
  academicYearName?: string;
  moduleId?: string;
  moduleName?: string;
}

// Digital Membership Card
export interface MembershipCardData {
  cardId: string;
  holderName: string;
  holderNameAr?: string;
  role: Role;
  roleTitleAr: string;
  roleTitleFr: string;
  roleTitleEn: string;
  institutionName: string;
  wilayaCode: number;
  wilayaName: string;
  issueDate: string;
  expiryDate: string;
  isVerified: boolean;
  qrPayload: string;
  phone?: string;
  email?: string;
}

// Card Verification
export interface CardVerificationResult {
  isValid: boolean;
  card: MembershipCardData | null;
  message: string;
}

// ==========================================
// DAWARAT & LIVE PREPARATION PACKS TYPES
// ==========================================

export type DawaaraCategory =
  | 'BAC_SCIENCE'
  | 'BAC_MATH'
  | 'BAC_LANGUAGES'
  | 'BAC_LITERATURE'
  | 'UNIVERSITY_LMD'
  | 'MEDICAL';

export type PaymentMethod = 'BARIDIMOB' | 'EDAHABIA' | 'AMBASSADOR_CASH';

export interface TeacherProfile {
  id: string;
  name: string;
  titleAr: string;
  titleFr: string;
  specialty: string;
  avatar: string;
  experienceYears: number;
  institution: string;
  bioAr: string;
  bioFr: string;
  assignedModuleIds: string[];
}

export interface DawaaraModule {
  id: string;
  packId: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  code: string;
  coefficient: number;
  shortDescriptionAr: string;
  shortDescriptionFr: string;
  shortDescriptionEn: string;
  syllabusAr: string[];
  syllabusFr: string[];
  individualPrice: number;     // e.g. 3500 DZD (bought separately)
  packDiscountPrice: number;   // e.g. 2000 DZD (value within pack bundle)
  hoursCount: number;          // Total live session hours
  sessionsCount: number;       // Number of live workshops
  scheduleDaysAr: string;      // e.g. "الجمعة والسبت 18:00 - 20:00"
  scheduleDaysFr: string;      // e.g. "Ven & Sam 18h00 - 20h00"
  teacherId: string;           // Assigned teacher
  teacherName: string;
  teacherTitle: string;
  teacherAvatar: string;
  meetUrl?: string;            // Google Meet / Class link
  enrolledCount: number;
}

export interface DawaaraPack {
  id: string;
  slug: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  category: DawaaraCategory;
  track: TrackType;
  targetAudienceAr: string;
  targetAudienceFr: string;
  badgeAr: string;
  badgeFr: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  originalTotalPrice: number;  // Sum of individual modules (e.g. 11,500 DZD)
  packPrice: number;           // Reduced bundle price (e.g. 6,500 DZD)
  vipDiscountPrice: number;    // Special price for Gold Card holders (e.g. 5,000 DZD)
  totalHours: number;
  totalSessions: number;
  startDate: string;
  endDate: string;
  isLiveNow: boolean;
  isPopular?: boolean;
  ambassadorId: string;        // Assigned promoting ambassador
  ambassadorName: string;
  ambassadorWilayaCode: number;
  ambassadorWilayaName: string;
  referralCode: string;        // e.g. "USTHB16" or "BAC2026"
  modules: DawaaraModule[];
  createdAt: string;
}

export interface PackEnrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  packId?: string;
  packTitle?: string;
  moduleIds: string[];         // If individual modules selected
  totalPaid: number;
  paymentMethod: PaymentMethod;
  referralCodeUsed?: string;
  ambassadorDiscountApplied: number;
  status: 'CONFIRMED' | 'PENDING_VERIFICATION';
  receiptUrl?: string;
  createdAt: string;
}

export interface ModuleResource {
  id: string;
  moduleId: string;
  moduleName: string;
  title: string;
  fileType: 'PDF_SERIES' | 'SOLUTION_KEY' | 'MINDMAP' | 'RECORDING';
  fileUrl: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
}

export interface TeacherRosterStudent {
  id: string;
  studentName: string;
  avatar?: string;
  wilayaCode: number;
  wilayaName: string;
  institution: string;
  moduleId: string;
  moduleName: string;
  enrolledAt: string;
  attendanceRate: number; // e.g. 95
  lastAttendedSession: string;
  status: 'ACTIVE' | 'EXCUSED' | 'ABSENT';
}

export interface AmbassadorSaleRecord {
  id: string;
  studentName: string;
  packTitle: string;
  promoCode: string;
  commissionAmount: number; // e.g. 590 DZD
  date: string;
  status: 'PAID' | 'PENDING_PAYOUT';
}

export interface SessionAmbassador {
  id: string;
  name: string;
  avatar?: string;
  wilayaCode: number;
  wilayaName: string;
  institution: string;
  roleTitle?: string; // e.g. "مشرف تقني وقاعة USTHB", "منسق الأسئلة والحضور"
  phone?: string;
}

export interface SessionAttendee {
  id: string;
  studentName: string;
  avatar?: string;
  wilayaCode: number;
  wilayaName: string;
  institution: string; // e.g. "ثانوية الرياضيات القبة" or "USTHB Faculté Informatique"
  specialty: string;
  joinedAt: string;
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED';
  notes?: string;
  handRaised?: boolean;
  audioActive?: boolean;
}

export interface TeacherLiveSession {
  id: string;
  roomId?: string; // e.g. "room-math-kadri"
  moduleId: string;
  moduleName: string;
  courseTitle: string;
  sessionNumber: number;
  title: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  ambassadorId: string;
  ambassadorName: string;
  ambassadorWilayaCode: number;
  ambassadorWilayaName: string;
  ambassadorAvatar?: string;
  ambassadors?: SessionAmbassador[]; // Support multiple co-hosting ambassadors across universities
  attendees?: SessionAttendee[]; // Full roster of joined students
  enrolledStudentsCount: number;
  joinedStudentsCount: number;
  replayViewsCount: number;
  questionsCount: number;
  meetUrl: string;
  status: 'LIVE_NOW' | 'COMPLETED' | 'SCHEDULED';
  handoutPdfUrl?: string;
  handoutTitle?: string;
  recordingUrl?: string;
}



