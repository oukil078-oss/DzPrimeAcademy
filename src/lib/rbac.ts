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
