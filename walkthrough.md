# Implementation Walkthrough: Public Profiles, 1:1 VIP Admin Badge, and HR Governance Hierarchy

## 1. Executive Summary

We have implemented an end-to-end public profile and dynamic QR code system, redesigned the VIP Admin and Employee card to match the user's reference image 1:1, and established a complete hierarchical governance system for HR and Admin management.

---

## 2. Key Features Implemented

### A. 1:1 VIP Admin & Employee Membership Badge
- **Front Face**:
  - Obsidian-black luxury finish with stardust micro-glitter textures.
  - Three sweeping satin wave ribbons (Vector SVG) matching the reference image: Rich Gold gradient, Pure White Satin ribbon, and Accent Gold ribbon.
  - Top-right emblem: [DZ PRIME ACADEMY](file:///c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/src/components/shared/DzPrimeLogo.tsx).
  - Center-right: Gold-bordered rectangular slot displaying card identifier.
  - Bottom-left plaque: **عضو رسمي / OFFICIAL MEMBER** gold plaque with beveled gradient.
- **Back Face**:
  - Mirroring satin ribbons along the left border.
  - Upper center split: DZ Prime Academy emblem on the left, vertical gold divider, and square gold-bordered QR code box on the right.
  - Bottom split section:
    - **MEMBER NAME / اسم العضو** with user icon and holder's name.
    - **MEMBER ROLE / الصفة** with shield icon and specific job title (e.g. *Chargée des Ressources Humaines*).
  - Bottom disclaimer in Arabic matching the image:
    > • هذه البطاقة ملك حصري لمنصة Dz PRIME ACADEMY وهي غير قابلة للتحويل •
- **Preserved Standard Cards**: Students, teachers, and ambassadors continue to use the classic gold DZ Prime Academy cards as requested.
- **Interactive 3D Flip & Export**: Click to flip card in 3D; one-click export as high-res PNG or standard CR80 print-ready PDF.

---

### B. Public Profile System (`/[locale]/profile/[id]`)
- Accessible by scanning any card's QR code or navigating to `http://localhost:3000/ar/profile/<studentCardId>`.
- Supports resolution by both internal User ID (`cuid`) and human-readable Card ID (`DZ-OWN-16-0001`, `DZ-TCH-16-6834`, `DZ-STU-16-6216`).
- **Universal Header**:
  - Avatar, verified badge, card ID, Wilaya, institution, and customizable personal **Bio**.
  - Direct contact channels: **WhatsApp** (opens `wa.me` chat), **Telegram** (`t.me`), **LinkedIn**, **Facebook**, **Instagram**, **YouTube**, **Personal Website**, **Phone Call**, and **Email**.
- **Role-Specific Views**:
  - **Teachers**: Teaching hours, student count, pedagogical rating, published modules & courses (with lesson counts and pricing), **Dawarat** (live masterclasses & workshops with dates and platforms), and exam preparation packs.
  - **Students**: Academic track (LMD / Medicine / etc.), specialty, academic year, and card verification status.
  - **Admins & Employees**: Exact role / job title (e.g., *Chargée des Ressources Humaines*), central department (*Direction des Ressources Humaines*, *Direction Financière*, etc.), governance level, and official DZ Prime Academy verification seal.
  - **Ambassadors**: Wilaya representation, approved promo code, ratings, and referral statistics.

---

### C. HR Governance & Strict Role Hierarchy
- Configured in [rbac.ts](file:///c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/src/lib/rbac.ts):
  $$\text{Super Admin (100)} > \text{HR Manager (85)} > \text{HR Employee (75)} > \text{Finance \& Other Admins (65)} > \text{Ambassadors (50)} > \text{Teachers (40)} > \text{Students (20/10)}$$
- **Admin & Staff Management** ([StaffTab.tsx](file:///c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/src/components/admin/StaffTab.tsx)):
  - Staff listing with hierarchy level badges, custom job titles, and contact information.
  - Super Admin and HR Manager can add new admins/employees with custom email, password, role, and job title (e.g. *Chargée des Ressources Humaines*).
  - Deletion of admins/employees enforces `canManageUser`: actors can only delete or edit staff members strictly inferior in hierarchy.
- **Student Management** ([StudentsTab.tsx](file:///c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/src/components/admin/StudentsTab.tsx)):
  - "+ إضافة طالب جديد" modal to register new students with custom or auto-generated passwords, track, and specialty.
  - Trash button with confirmation modal calling `DELETE /api/students/[id]`.
  - Direct link button to view the student's public profile.
- **Teacher & Ambassador Management** ([FacultyPayrollTab.tsx](file:///c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/src/components/admin/FacultyPayrollTab.tsx) and [AmbassadorsTab.tsx](file:///c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/src/components/admin/AmbassadorsTab.tsx)):
  - Both tabs feature delete buttons and direct links to public profiles.
  - API routes enforce `canManageUser` so HR personnel and Super Admins have permission to manage and remove teachers and ambassadors.

---

### D. User Settings & Bio/Social Media Editor
- Updated [SettingsModal.tsx](file:///c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/src/components/settings/SettingsModal.tsx) and `PUT /api/account`:
  - Any logged-in user can update their **Job Title / Specialization**, **Bio**, and social channels (**WhatsApp**, **Telegram**, **LinkedIn**, **Facebook**, **Instagram**, **YouTube**, **Website**).
  - Saved fields immediately reflect on their public profile and digital card.

---

## 3. Verification & Testing

| Test Item | Target URL / Command | Result |
| :--- | :--- | :--- |
| **Owner Profile API** | `GET /api/profile/DZ-OWN-16-0001` | `200 OK` — Full user data returned |
| **Teacher Profile API** | `GET /api/profile/DZ-TCH-16-6834` | `200 OK` — Teacher courses, dawarat, packs returned |
| **Student Profile API** | `GET /api/profile/DZ-STU-16-6216` | `200 OK` — Student academic info returned |
| **Public Profile Route** | `GET /ar/profile/DZ-OWN-16-0001` | `200 OK` — Server rendered HTML complete |
| **Admin Dashboard** | `GET /ar/admin` | `200 OK` — Server rendered HTML complete |
| **Membership Card View** | `GET /ar/card` | `200 OK` — Server rendered HTML complete |
| **Local Dev Server** | `http://localhost:3000` | Active and running on background task `task-155` |
