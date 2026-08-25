import { Role, User } from '@/types';

export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 100,
  ADMIN: 90,
  MODERATOR: 70,
  AMBASSADOR: 50,
  TEACHER: 40,
  STUDENT_PAID: 20,
  STUDENT_FREE: 10,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

export function isStaff(role?: Role): boolean {
  if (!role) return false;
  return ['OWNER', 'ADMIN', 'MODERATOR'].includes(role);
}

export function isAmbassador(role?: Role): boolean {
  if (!role) return false;
  return role === 'AMBASSADOR' || isStaff(role);
}

export function isTeacher(role?: Role): boolean {
  if (!role) return false;
  return role === 'TEACHER' || isStaff(role);
}

export function isGoldenMember(user?: User | null): boolean {
  if (!user) return false;
  return user.role === 'STUDENT_PAID' || isStaff(user.role) || user.role === 'AMBASSADOR' || user.role === 'TEACHER';
}

export function canAccessFullExams(user?: User | null): boolean {
  return isGoldenMember(user);
}

export function canModerate(role?: Role): boolean {
  if (!role) return false;
  return ['OWNER', 'ADMIN', 'MODERATOR'].includes(role);
}

export function canEditUserRoles(role?: Role): boolean {
  if (!role) return false;
  return role === 'OWNER' || role === 'ADMIN';
}

export function getHubTitle(role?: Role, name?: string, locale: string = 'ar'): string {
  const cleanName = name || (locale === 'ar' ? 'طالب جزائري' : 'Étudiant');
  
  if (role === 'TEACHER') {
    if (locale === 'ar') return `منصة الأستاذ الأكاديمية - ${cleanName}`;
    if (locale === 'fr') return `Espace Enseignant Universitaire - ${cleanName}`;
    return `Teacher Academic Hub - ${cleanName}`;
  }

  if (role === 'AMBASSADOR') {
    if (locale === 'ar') return `لوحة السفير المعتمد - ${cleanName}`;
    if (locale === 'fr') return `Espace Ambassadeur Officiel - ${cleanName}`;
    return `Ambassador Academic Hub - ${cleanName}`;
  }

  if (role === 'OWNER' || role === 'ADMIN') {
    if (locale === 'ar') return `لوحة الإدارة والحوكمة - ${cleanName}`;
    if (locale === 'fr') return `Panneau d'Administration SaaS - ${cleanName}`;
    return `Governance & Admin Hub - ${cleanName}`;
  }

  if (locale === 'ar') return `فضاء الطالب الأكاديمي - ${cleanName}`;
  if (locale === 'fr') return `Espace Étudiant Universitaire - ${cleanName}`;
  return `Student Academic Hub - ${cleanName}`;
}

