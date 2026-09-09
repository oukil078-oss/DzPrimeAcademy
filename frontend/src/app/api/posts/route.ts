import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { Post, PostComment } from '@/types';

// Persistent in-memory post storage initialized with high-quality academic posts & video masterclasses
let localPosts: Post[] = [
  {
    id: 'post-video-1',
    title: 'مراجعة شاملة في الفيزياء — حركة القذائف والسقوط الشاقولي (BAC 2026)',
    content: 'أعزائي طلبة البكالوريا في شعب الرياضيات، العلوم التجريبية والتقني رياضي: إليكم هذا الشرح المصور المفصل لأهم أفكار وفخاخ وحدة الميكانيك مع التطبيقات النموذجية.',
    type: 'STUDY_TIP',
    wilayaCode: 16,
    wilayaName: 'الجزائر العاصمة',
    institutionName: 'DZ Prime Academy Studio',
    isOnline: true,
    isApproved: true,
    authorId: 'prof-mansouri',
    authorName: 'الأستاذ عبد النور منصوري',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    authorRole: 'TEACHER',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    linkUrl: 'https://dzprime.academy/ar/modules',
    isPrivate: false,
    likesCount: 142,
    likedBy: [],
    comments: [
      {
        id: 'c-1',
        postId: 'post-video-1',
        authorId: 'student-amine',
        authorName: 'أمين بلحاج (طالب بكالوريا)',
        authorRole: 'STUDENT_PAID',
        content: 'بارك الله فيك أستاذ، شرح في القمة ووضح لي الكثير من التساؤلات!',
        createdAt: '2026-09-08T10:30:00Z',
      },
    ],
    createdAt: '2026-09-08T09:15:00Z',
  },
  {
    id: 'post-ambassador-1',
    title: 'لقاء توجيهي مباشر لسفراء وطلبة وهران — التحضير للامتحانات والنوادي العلمية',
    content: 'مرحباً بجميع طلبة الغرب الجزائري! نعلن عن اللقاء التوجيهي المفتوح لجامعة وهران 1 وأحمد بن بلة، لمناقشة آليات الاستفادة من بنك الامتحانات المصححة وحصص الدعم.',
    type: 'EVENT',
    wilayaCode: 31,
    wilayaName: 'وهران',
    institutionName: 'جامعة وهران 1 أحمد بن بلة',
    isOnline: true,
    meetUrl: 'https://meet.google.com/dzp-oran-2026',
    isApproved: true,
    authorId: 'ambassador-oran',
    authorName: 'سفيان بلعروسي (سفير وهران)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorRole: 'AMBASSADOR',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    linkUrl: 'https://dzprime.academy/ar/ambassadors',
    isPrivate: false,
    likesCount: 88,
    likedBy: [],
    comments: [],
    createdAt: '2026-09-07T14:20:00Z',
  },
  {
    id: 'post-private-1',
    title: 'ملخص القوانين الحصري وحلول التمارين النموذجية (خاص بالمشتركين)',
    content: 'هذا المحتوى والملفات المرفقة مخصصة حصرياً لأعضاء منصة DZ Prime Academy المسجلين. يرجى الاطلاع على وثيقة الـ PDF وحل الواجب قبل الحصة التفاعلية القادمة.',
    type: 'STUDY_TIP',
    wilayaCode: 25,
    wilayaName: 'قسنطينة',
    institutionName: 'جامعة قسنطينة 1 منتوري',
    isOnline: true,
    isApproved: true,
    authorId: 'prof-bouzid',
    authorName: 'د. يوسف بوزيد',
    authorRole: 'TEACHER',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    linkUrl: 'https://dzprime.academy/ar/courses',
    isPrivate: true,
    likesCount: 65,
    likedBy: [],
    comments: [],
    createdAt: '2026-09-06T18:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get('authorId');
  const type = searchParams.get('type');
  const mediaType = searchParams.get('mediaType'); // 'video' | 'image'
  const wilayaCode = searchParams.get('wilayaCode');

  // Check if caller is authenticated
  const currentUser = await getUserFromRequest(request);
  const isSignedIn = Boolean(currentUser);

  let results = [...localPosts];

  // If visitor is not signed in, show only PUBLIC posts
  if (!isSignedIn) {
    results = results.filter((p) => !p.isPrivate);
  }

  // Filter by author
  if (authorId) {
    results = results.filter((p) => p.authorId === authorId);
  }

  // Filter by type
  if (type && type !== 'ALL') {
    results = results.filter((p) => p.type === type);
  }

  // Filter by media
  if (mediaType === 'video') {
    results = results.filter((p) => Boolean(p.videoUrl));
  } else if (mediaType === 'image') {
    results = results.filter((p) => Boolean(p.imageUrl));
  }

  // Filter by wilaya
  if (wilayaCode) {
    results = results.filter((p) => p.wilayaCode === Number(wilayaCode));
  }

  return NextResponse.json({
    success: true,
    posts: results,
    total: results.length,
    isAuthenticated: isSignedIn,
  });
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول لنشر المقالات ومقاطع الفيديو' }, { status: 401 });
  }

  // Allowed roles: TEACHER, AMBASSADOR, OWNER, ADMIN, MODERATOR
  const allowedRoles = ['TEACHER', 'AMBASSADOR', 'OWNER', 'ADMIN', 'MODERATOR'];
  if (!allowedRoles.includes(currentUser.role)) {
    return NextResponse.json(
      { error: 'النشر محصور حصرياً بالأساتذة، السفراء والطاقم الإداري' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      content,
      type = 'STUDY_TIP',
      videoUrl,
      imageUrl,
      linkUrl,
      isPrivate = false,
      wilayaCode,
      wilayaName,
      institutionName,
      location,
      meetUrl,
      isOnline,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'عنوان المنشور والمحتوى كلاهما مطلوب' },
        { status: 400 }
      );
    }

    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: String(title).trim(),
      content: String(content).trim(),
      type: type || 'STUDY_TIP',
      wilayaCode: wilayaCode ? Number(wilayaCode) : currentUser.wilayaCode || 16,
      wilayaName: wilayaName || currentUser.wilayaName || 'الجزائر العاصمة',
      institutionName: institutionName || currentUser.institutionName || 'DZ Prime Academy',
      isOnline: Boolean(isOnline || meetUrl || videoUrl),
      location: location || null,
      meetUrl: meetUrl || null,
      isApproved: true,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || undefined,
      authorRole: currentUser.role,
      videoUrl: videoUrl ? String(videoUrl).trim() : undefined,
      imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
      linkUrl: linkUrl ? String(linkUrl).trim() : undefined,
      isPrivate: Boolean(isPrivate),
      likesCount: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    localPosts = [newPost, ...localPosts];

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'تم نشر المحتوى بنجاح ✓',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'فشل في إنشاء المنشور' },
      { status: 400 }
    );
  }
}
