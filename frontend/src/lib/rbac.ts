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

export type AdminRoleType =
  | 'SUPER_ADMIN'
  | 'HR_MANAGER'
  | 'HR_EMPLOYEE'
  | 'FINANCE'
  | 'ADMIN'
  | 'MODERATOR';

export function getUserHierarchyLevel(user?: { role: Role; adminRole?: string | null } | null): number {
  if (!user) return 0;
  if (user.role === 'OWNER' || user.adminRole === 'SUPER_ADMIN') return 100;
  if (user.adminRole === 'HR_MANAGER') return 85;
  if (user.adminRole === 'HR_EMPLOYEE') return 75;
  if (user.adminRole === 'FINANCE') return 65;
  if (user.role === 'ADMIN') return 65;
  if (user.role === 'MODERATOR' || user.adminRole === 'MODERATOR') return 60;
  if (user.role === 'AMBASSADOR') return 50;
  if (user.role === 'TEACHER') return 40;
  if (user.role === 'STUDENT_PAID') return 20;
  return 10; // STUDENT_FREE
}

export function isSuperAdmin(user?: { role: Role; adminRole?: string | null } | null): boolean {
  if (!user) return false;
  return user.role === 'OWNER' || user.adminRole === 'SUPER_ADMIN';
}

export function isHRManager(user?: { role: Role; adminRole?: string | null } | null): boolean {
  if (!user) return false;
  return isSuperAdmin(user) || user.adminRole === 'HR_MANAGER';
}

export function isHRPerson(user?: { role: Role; adminRole?: string | null } | null): boolean {
  if (!user) return false;
  return isSuperAdmin(user) || user.adminRole === 'HR_MANAGER' || user.adminRole === 'HR_EMPLOYEE';
}

export function canManageUser(
  actor?: { id: string; role: Role; adminRole?: string | null } | null,
  target?: { id: string; role: Role; adminRole?: string | null } | null
): boolean {
  if (!actor || !target) return false;
  if (actor.id === target.id) return false; // Cannot delete self

  const actorLevel = getUserHierarchyLevel(actor);
  const targetLevel = getUserHierarchyLevel(target);

  // Super Admin can manage anyone
  if (actorLevel === 100) return true;

  // HR Manager can manage anyone with level < 85 (HR Employees, Finance, Other admins, Ambassadors, Teachers, Students)
  if (actorLevel >= 85) {
    return targetLevel < 85;
  }

  // HR Employees can manage Teachers, Ambassadors, and Students (Levels <= 50)
  if (actorLevel >= 75) {
    return targetLevel <= 50;
  }

  return false;
}

export function canAddTeachersAndStudents(actor?: { role: Role; adminRole?: string | null } | null): boolean {
  return isHRPerson(actor);
}

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

export function getDashboardPath(role: Role, locale: string): string {
  if (isStaff(role)) return `/${locale}/admin`;
  if (role === 'TEACHER') return `/${locale}/teacher`;
  if (role === 'AMBASSADOR') return `/${locale}/ambassador`;
  return `/${locale}/student`;
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

