import { Wilaya, Institution, Faculty, Specialty, AcademicYear, ModuleItem, ExamItem, User, AmbassadorProfile, Post, Locale } from '@/types';

export const WILAYAS: Wilaya[] = [
  { code: 1, nameAr: 'أدرار', nameFr: 'Adrar', nameEn: 'Adrar', region: 'SOUTH' },
  { code: 2, nameAr: 'الشلف', nameFr: 'Chlef', nameEn: 'Chlef', region: 'WEST' },
  { code: 5, nameAr: 'باتنة', nameFr: 'Batna', nameEn: 'Batna', region: 'EAST' },
  { code: 6, nameAr: 'بجاية', nameFr: 'Béjaïa', nameEn: 'Bejaia', region: 'CENTER' },
  { code: 7, nameAr: 'بسكرة', nameFr: 'Biskra', nameEn: 'Biskra', region: 'SOUTH' },
  { code: 9, nameAr: 'البليدة', nameFr: 'Blida', nameEn: 'Blida', region: 'CENTER' },
  { code: 13, nameAr: 'تلمسان', nameFr: 'Tlemcen', nameEn: 'Tlemcen', region: 'WEST' },
  { code: 15, nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou', nameEn: 'Tizi Ouzou', region: 'CENTER' },
  { code: 16, nameAr: 'الجزائر العاصمة', nameFr: 'Alger', nameEn: 'Algiers', region: 'CENTER' },
  { code: 19, nameAr: 'سطيف', nameFr: 'Sétif', nameEn: 'Setif', region: 'EAST' },
  { code: 23, nameAr: 'عنابة', nameFr: 'Annaba', nameEn: 'Annaba', region: 'EAST' },
  { code: 25, nameAr: 'قسنطينة', nameFr: 'Constantine', nameEn: 'Constantine', region: 'EAST' },
  { code: 27, nameAr: 'مستغانم', nameFr: 'Mostaganem', nameEn: 'Mostaganem', region: 'WEST' },
  { code: 30, nameAr: 'ورقلة', nameFr: 'Ouargla', nameEn: 'Ouargla', region: 'SOUTH' },
  { code: 31, nameAr: 'وهران', nameFr: 'Oran', nameEn: 'Oran', region: 'WEST' },
  { code: 35, nameAr: 'بومرداس', nameFr: 'Boumerdès', nameEn: 'Boumerdes', region: 'CENTER' },
  { code: 47, nameAr: 'غرداية', nameFr: 'Ghardaïa', nameEn: 'Ghardaia', region: 'SOUTH' },
];

export const INSTITUTIONS: Institution[] = [
  // Universities
  {
    id: 'inst-usthb',
    nameAr: 'جامعة العلوم والتكنولوجيا هواري بومدين (USTHB - باب الزوار)',
    nameFr: 'Université des Sciences et de la Technologie Houari Boumediene (USTHB)',
    type: 'UNIVERSITY',
    wilayaCode: 16,
    logoUrl: '/logos/usthb.png',
  },
  {
    id: 'inst-alger1',
    nameAr: 'جامعة الجزائر 1 - بن يوسف بن خدة (كلية الطب والعلوم)',
    nameFr: "Université d'Alger 1 - Benyoucef Benkhedda (Médecine & Sciences)",
    type: 'UNIVERSITY',
    wilayaCode: 16,
    logoUrl: '/logos/alger1.png',
  },
  {
    id: 'inst-usto',
    nameAr: 'جامعة العلوم والتكنولوجيا وهران - محمد بوضياف (USTO-MB)',
    nameFr: 'Université des Sciences et de la Technologie d\'Oran - Mohamed Boudiaf (USTO)',
    type: 'UNIVERSITY',
    wilayaCode: 31,
    logoUrl: '/logos/usto.png',
  },
  {
    id: 'inst-mentouri',
    nameAr: 'جامعة الإخوة منتوري - قسنطينة 1 (Mentouri)',
    nameFr: 'Université Frères Mentouri - Constantine 1',
    type: 'UNIVERSITY',
    wilayaCode: 25,
    logoUrl: '/logos/mentouri.png',
  },
  {
    id: 'inst-setif1',
    nameAr: 'جامعة فرحات عباس - سطيف 1',
    nameFr: 'Université Ferhat Abbas - Sétif 1',
    type: 'UNIVERSITY',
    wilayaCode: 19,
    logoUrl: '/logos/setif1.png',
  },
  {
    id: 'inst-annaba',
    nameAr: 'جامعة باجي مختار - عنابة (UBMA)',
    nameFr: 'Université Badji Mokhtar - Annaba',
    type: 'UNIVERSITY',
    wilayaCode: 23,
    logoUrl: '/logos/annaba.png',
  },
  {
    id: 'inst-tlemcen',
    nameAr: 'جامعة أبو بكر بلقايد - تلمسان',
    nameFr: 'Université Abou Bekr Belkaïd - Tlemcen',
    type: 'UNIVERSITY',
    wilayaCode: 13,
    logoUrl: '/logos/tlemcen.png',
  },
  {
    id: 'inst-tizi',
    nameAr: 'جامعة مولود معمري - تيزي وزو (UMMTO)',
    nameFr: 'Université Mouloud Mammeri - Tizi Ouzou',
    type: 'UNIVERSITY',
    wilayaCode: 15,
    logoUrl: '/logos/ummto.png',
  },
  // High School General Track (BAC National)
  {
    id: 'inst-bac-national',
    nameAr: 'التعليم الثانوي الوطني - شهادة البكالوريا (BAC)',
    nameFr: 'Enseignement Secondaire National - Baccalauréat Algérien (BAC)',
    type: 'HIGH_SCHOOL',
    wilayaCode: 16,
  },
];

export const FACULTIES: Faculty[] = [
  // USTHB
  { id: 'fac-usthb-info', nameAr: 'كلية الإعلام الآلي', nameFr: "Faculté d'Informatique", institutionId: 'inst-usthb' },
  { id: 'fac-usthb-st', nameAr: 'كلية العلوم والتكنولوجيا والهندسة', nameFr: 'Faculté des Sciences et Technologies (ST)', institutionId: 'inst-usthb' },
  { id: 'fac-usthb-sm', nameAr: 'كلية علوم المادة (فيزياء وكيمياء)', nameFr: 'Faculté des Sciences de la Matière (SM)', institutionId: 'inst-usthb' },
  // Alger 1 (Medical)
  { id: 'fac-med-alger', nameAr: 'كلية الطب والصيدلة وطب الأسنان', nameFr: 'Faculté de Médecine et Pharmacie', institutionId: 'inst-alger1' },
  // USTO
  { id: 'fac-usto-info', nameAr: 'كلية الرياضيات والإعلام الآلي', nameFr: 'Faculté de Mathématiques et Informatique', institutionId: 'inst-usto' },
  // Mentouri Constantine
  { id: 'fac-mentouri-sciences', nameAr: 'كلية العلوم الدقيقة والإعلام الآلي', nameFr: 'Faculté des Sciences Exactes et Informatique', institutionId: 'inst-mentouri' },
  // BAC National
  { id: 'fac-bac-branches', nameAr: 'شعب البكالوريا الوطنية', nameFr: 'Filières Officielles du Baccalauréat', institutionId: 'inst-bac-national' },
];

export const SPECIALTIES: Specialty[] = [
  // University Info
  { id: 'spec-mi-tc', nameAr: 'جذع مشترك رياضيات وإعلام آلي (MI)', nameFr: 'Tronc Commun Mathématiques & Informatique (MI)', trackType: 'UNIVERSITY_LMD', facultyId: 'fac-usthb-info' },
  { id: 'spec-info-l2l3', nameAr: 'إعلام آلي عام (ISIL / SI)', nameFr: 'Licence Informatique Générale (ISIL / SI)', trackType: 'UNIVERSITY_LMD', facultyId: 'fac-usthb-info' },
  // University ST
  { id: 'spec-st-tc', nameAr: 'جذع مشترك علوم وتكنولوجيا (ST)', nameFr: 'Tronc Commun Sciences & Technologies (ST)', trackType: 'UNIVERSITY_LMD', facultyId: 'fac-usthb-st' },
  { id: 'spec-genie-civil', nameAr: 'هندسة مدنية وبناء', nameFr: 'Génie Civil & Construction', trackType: 'UNIVERSITY_LMD', facultyId: 'fac-usthb-st' },
  // Medical
  { id: 'spec-medecine', nameAr: 'دكتور في الطب البشري', nameFr: 'Doctorat en Médecine Générale', trackType: 'MEDICAL', facultyId: 'fac-med-alger' },
  { id: 'spec-pharmacie', nameAr: 'دكتور في الصيدلة', nameFr: 'Doctorat en Pharmacie', trackType: 'MEDICAL', facultyId: 'fac-med-alger' },
  // USTO Info
  { id: 'spec-usto-mi', nameAr: 'جذع مشترك MI - وهران', nameFr: 'Tronc Commun MI - USTO Oran', trackType: 'UNIVERSITY_LMD', facultyId: 'fac-usto-info' },
  // Constantine Info
  { id: 'spec-mentouri-mi', nameAr: 'جذع مشترك MI - قسنطينة', nameFr: 'Tronc Commun MI - Constantine', trackType: 'UNIVERSITY_LMD', facultyId: 'fac-mentouri-sciences' },
  // BAC Streams
  { id: 'spec-bac-scientifique', nameAr: 'شعبة علوم تجريبية (3AS)', nameFr: 'Sciences Expérimentales (3AS BAC)', trackType: 'BAC', facultyId: 'fac-bac-branches' },
  { id: 'spec-bac-math', nameAr: 'شعبة رياضيات (3AS Math)', nameFr: 'Mathématiques (3AS BAC)', trackType: 'BAC', facultyId: 'fac-bac-branches' },
  { id: 'spec-bac-technique', nameAr: 'شعبة تقني رياضي (هندسة)', nameFr: 'Technique Mathématique (3AS BAC)', trackType: 'BAC', facultyId: 'fac-bac-branches' },
  { id: 'spec-bac-gestion', nameAr: 'شعبة تسيير واقتصاد', nameFr: 'Gestion et Économie (3AS BAC)', trackType: 'BAC', facultyId: 'fac-bac-branches' },
];

export const ACADEMIC_YEARS: AcademicYear[] = [
  // MI TC (L1)
  { id: 'year-mi-s1', nameAr: 'السنة الأولى L1 - السداسي الأول (S1)', nameFr: 'Première Année L1 - Semestre 1 (S1)', semester: 'S1', specialtyId: 'spec-mi-tc' },
  { id: 'year-mi-s2', nameAr: 'السنة الأولى L1 - السداسي الثاني (S2)', nameFr: 'Première Année L1 - Semestre 2 (S2)', semester: 'S2', specialtyId: 'spec-mi-tc' },
  // Info L2
  { id: 'year-info-l2-s3', nameAr: 'السنة الثانية L2 - السداسي الثالث (S3)', nameFr: 'Deuxième Année L2 - Semestre 3 (S3)', semester: 'S3', specialtyId: 'spec-info-l2l3' },
  { id: 'year-info-l2-s4', nameAr: 'السنة الثانية L2 - السداسي الرابع (S4)', nameFr: 'Deuxième Année L2 - Semestre 4 (S4)', semester: 'S4', specialtyId: 'spec-info-l2l3' },
  // ST TC (L1)
  { id: 'year-st-s1', nameAr: 'السنة الأولى L1 ST - السداسي الأول (S1)', nameFr: 'Première Année ST - Semestre 1 (S1)', semester: 'S1', specialtyId: 'spec-st-tc' },
  // Medecine 1ere annee
  { id: 'year-med-1', nameAr: 'السنة الأولى طب بشري (1ère Année)', nameFr: '1ère Année Médecine (Cycle Préclinique)', semester: 'Annual', specialtyId: 'spec-medecine' },
  // BAC Scientifique
  { id: 'year-bac-sci-full', nameAr: 'السنة الثالثة ثانوي (3AS - البكالوريا)', nameFr: '3ème Année Secondaire - Session BAC', semester: 'Annual', specialtyId: 'spec-bac-scientifique' },
  // BAC Math
  { id: 'year-bac-math-full', nameAr: 'السنة الثالثة ثانوي رياضيات (3AS Math)', nameFr: '3ème Année Mathématiques - Session BAC', semester: 'Annual', specialtyId: 'spec-bac-math' },
];

export const MODULES: ModuleItem[] = [
  // L1 MI S1
  { id: 'mod-analyse1', nameAr: 'تحليل رياضي 1 (Analyse 1)', nameFr: 'Analyse Mathématique 1', code: 'MATH101', coefficient: 4, academicYearId: 'year-mi-s1', examsCount: 8 },
  { id: 'mod-algebre1', nameAr: 'جبر 1 (Algèbre 1)', nameFr: 'Algèbre Linéaire 1', code: 'MATH102', coefficient: 3, academicYearId: 'year-mi-s1', examsCount: 6 },
  { id: 'mod-algo1', nameAr: 'خوارزميات وهياكل بيانات 1 (ALSD 1)', nameFr: 'Algorithmique & Structures de Données 1', code: 'INFO101', coefficient: 4, academicYearId: 'year-mi-s1', examsCount: 9 },
  { id: 'mod-arch1', nameAr: 'بنية الآلة 1 (Structure Machine 1)', nameFr: 'Structure Machine 1 (Archi)', code: 'INFO102', coefficient: 3, academicYearId: 'year-mi-s1', examsCount: 5 },
  { id: 'mod-phys1', nameAr: 'فيزياء 1 - ميكانيك النقطة', nameFr: 'Physique 1 (Mécanique du Point)', code: 'PHYS101', coefficient: 2, academicYearId: 'year-mi-s1', examsCount: 4 },
  
  // L2 Info S3
  { id: 'mod-algo3', nameAr: 'خوارزميات متقدمة (ALSD 3)', nameFr: 'Algorithmique Avancée & Arbres', code: 'INFO201', coefficient: 4, academicYearId: 'year-info-l2-s3', examsCount: 7 },
  { id: 'mod-poo', nameAr: 'البرمجة كائنية التوجه (POO Java/C++)', nameFr: 'Programmation Orientée Objet (POO)', code: 'INFO202', coefficient: 3, academicYearId: 'year-info-l2-s3', examsCount: 6 },
  { id: 'mod-bd', nameAr: 'قواعد البيانات (BDD SQL)', nameFr: 'Bases de Données Relationnelles', code: 'INFO203', coefficient: 3, academicYearId: 'year-info-l2-s3', examsCount: 8 },
  { id: 'mod-si', nameAr: 'أنظمة المعلومات (Systèmes d\'Information)', nameFr: 'Systèmes d\'Information & Modélisation', code: 'INFO204', coefficient: 2, academicYearId: 'year-info-l2-s3', examsCount: 4 },

  // L1 ST S1
  { id: 'mod-st-math1', nameAr: 'رياضيات 1 (Mathématiques 1)', nameFr: 'Mathématiques Appliquées 1 (ST)', code: 'ST-M1', coefficient: 3, academicYearId: 'year-st-s1', examsCount: 5 },
  { id: 'mod-st-phys1', nameAr: 'فيزياء 1 (Physique 1)', nameFr: 'Physique 1 (Mécanique Générale)', code: 'ST-P1', coefficient: 3, academicYearId: 'year-st-s1', examsCount: 5 },
  { id: 'mod-st-chim1', nameAr: 'كيمياء 1 - بنية المادة', nameFr: 'Chimie 1 (Structure de la Matière)', code: 'ST-C1', coefficient: 3, academicYearId: 'year-st-s1', examsCount: 6 },

  // Medecine 1ere
  { id: 'mod-med-anat', nameAr: 'تشريح عام وتطبيقي (Anatomie)', nameFr: 'Anatomie Générale & Topographique', code: 'MED-ANAT', coefficient: 4, academicYearId: 'year-med-1', examsCount: 12 },
  { id: 'mod-med-histo', nameAr: 'علم الأنسجة والأجنة (Histologie)', nameFr: 'Histologie & Embryologie Médicale', code: 'MED-HIST', coefficient: 3, academicYearId: 'year-med-1', examsCount: 8 },
  { id: 'mod-med-physio', nameAr: 'علم وظائف الأعضاء (Physiologie)', nameFr: 'Physiologie Générale & Systémique', code: 'MED-PHYS', coefficient: 3, academicYearId: 'year-med-1', examsCount: 9 },

  // BAC Scientifique
  { id: 'mod-bac-math', nameAr: 'الرياضيات - بكالوريا علوم تجريبية', nameFr: 'Mathématiques BAC Sciences Exp.', code: 'BAC-MATH', coefficient: 5, academicYearId: 'year-bac-sci-full', examsCount: 15 },
  { id: 'mod-bac-sciences', nameAr: 'علوم الطبيعة والحياة - بكالوريا', nameFr: 'Sciences de la Nature & de la Vie', code: 'BAC-SNV', coefficient: 6, academicYearId: 'year-bac-sci-full', examsCount: 18 },
  { id: 'mod-bac-physique', nameAr: 'العلوم الفيزيائية - بكالوريا', nameFr: 'Physique-Chimie BAC', code: 'BAC-PHYS', coefficient: 5, academicYearId: 'year-bac-sci-full', examsCount: 16 },
  { id: 'mod-bac-arabe', nameAr: 'اللغة العربية وآدابها - بكالوريا', nameFr: 'Langue & Littérature Arabes BAC', code: 'BAC-AR', coefficient: 2, academicYearId: 'year-bac-sci-full', examsCount: 10 },
];

export const EXAMS: ExamItem[] = [
  // Analyse 1 Exams
  {
    id: 'exam-ana-2024-final',
    title: 'Examen Final Semestriel - Analyse 1 (Session Normale)',
    year: 2024,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/usthb_analyse1_2024_final.pdf',
    solutionUrl: '/exams/usthb_analyse1_2024_final_corrige.pdf',
    isFreeSample: true,
    downloadsCount: 1420,
    moduleId: 'mod-analyse1',
    moduleName: 'Analyse 1',
    authorName: 'Dr. Brahimi & Équipe USTHB',
    createdAt: '2024-02-15',
  },
  {
    id: 'exam-ana-2024-emd1',
    title: 'EMD 1 / Interrogation Écrite - Suites et Fonctions',
    year: 2024,
    termType: 'MIDTERM_EMD',
    fileUrl: '/exams/usthb_analyse1_2024_emd1.pdf',
    solutionUrl: '/exams/usthb_analyse1_2024_emd1_corrige.pdf',
    isFreeSample: true,
    downloadsCount: 980,
    moduleId: 'mod-analyse1',
    moduleName: 'Analyse 1',
    authorName: 'Ambassadeur USTHB',
    createdAt: '2023-11-20',
  },
  {
    id: 'exam-ana-2023-rat',
    title: 'Examen de Rattrapage - Analyse 1 (Session 2023)',
    year: 2023,
    termType: 'RATTRAPAGE',
    fileUrl: '/exams/usthb_analyse1_2023_rat.pdf',
    solutionUrl: '/exams/usthb_analyse1_2023_rat_corrige.pdf',
    isFreeSample: false, // Paid only
    downloadsCount: 620,
    moduleId: 'mod-analyse1',
    moduleName: 'Analyse 1',
    authorName: 'Dr. Brahimi',
    createdAt: '2023-06-18',
  },
  {
    id: 'exam-ana-2022-final',
    title: 'Sujet d\'Examen de Synthèse + Corrigé Barème Détaillé',
    year: 2022,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/usthb_analyse1_2022_final.pdf',
    solutionUrl: '/exams/usthb_analyse1_2022_final_corrige.pdf',
    isFreeSample: false, // Paid only
    downloadsCount: 1150,
    moduleId: 'mod-analyse1',
    moduleName: 'Analyse 1',
    authorName: 'Équipe Pédagogique DZ Prime',
    createdAt: '2022-02-10',
  },

  // Algo 1 Exams
  {
    id: 'exam-algo-2024-final',
    title: 'Examen Final ALSD 1 (Pointeurs, Récursivité, Tableaux)',
    year: 2024,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/usthb_algo1_2024_final.pdf',
    solutionUrl: '/exams/usthb_algo1_2024_final_corrige.pdf',
    isFreeSample: true,
    downloadsCount: 2310,
    moduleId: 'mod-algo1',
    moduleName: 'Algorithmique 1',
    authorName: 'Pr. Meziane',
    createdAt: '2024-02-18',
  },
  {
    id: 'exam-algo-2024-tp',
    title: 'Test Pratique Machine C/Pascal + Algorithmes Tri',
    year: 2024,
    termType: 'MIDTERM_EMD',
    fileUrl: '/exams/usthb_algo1_2024_tp.pdf',
    solutionUrl: '/exams/usthb_algo1_2024_tp_corrige.pdf',
    isFreeSample: true,
    downloadsCount: 1540,
    moduleId: 'mod-algo1',
    moduleName: 'Algorithmique 1',
    authorName: 'Ambassadeur Informatique',
    createdAt: '2024-01-10',
  },
  {
    id: 'exam-algo-2023-full',
    title: 'Archive Complète 10 Ans d\'Examens Corrigés ALSD',
    year: 2023,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/usthb_algo1_archive_gold.pdf',
    solutionUrl: '/exams/usthb_algo1_archive_gold_solutions.pdf',
    isFreeSample: false, // Paid only
    downloadsCount: 3890,
    moduleId: 'mod-algo1',
    moduleName: 'Algorithmique 1',
    authorName: 'Club Informatique DZ Prime',
    createdAt: '2023-09-01',
  },

  // BAC Math Exams
  {
    id: 'exam-bac-math-2024',
    title: 'BAC Blanc National 2024 - Mathématiques (Sujet + Corrigé Barème)',
    year: 2024,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/bac_math_2024_blanc.pdf',
    solutionUrl: '/exams/bac_math_2024_blanc_corrige.pdf',
    isFreeSample: true,
    downloadsCount: 5400,
    moduleId: 'mod-bac-math',
    moduleName: 'Mathématiques BAC',
    authorName: 'Collectif National des Enseignants',
    createdAt: '2024-05-15',
  },
  {
    id: 'exam-bac-math-2023-sujet1',
    title: 'BAC Officiel 2023 - Sujet 1 (Fonctions & Nombres Complexes)',
    year: 2023,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/bac_math_2023_officiel.pdf',
    solutionUrl: '/exams/bac_math_2023_officiel_corrige.pdf',
    isFreeSample: true,
    downloadsCount: 8200,
    moduleId: 'mod-bac-math',
    moduleName: 'Mathématiques BAC',
    authorName: 'ONEC Algérie',
    createdAt: '2023-06-25',
  },
  {
    id: 'exam-bac-math-gold-pack',
    title: 'Pack Gold Excellence: 50 Sujets Types BAC Résolus Pas à Pas',
    year: 2024,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/bac_math_gold_pack_2024.pdf',
    solutionUrl: '/exams/bac_math_gold_pack_2024_corrige.pdf',
    isFreeSample: false, // Paid only
    downloadsCount: 4200,
    moduleId: 'mod-bac-math',
    moduleName: 'Mathématiques BAC',
    authorName: 'Élite DZ Prime',
    createdAt: '2024-03-01',
  },

  // Anatomie Medecine
  {
    id: 'exam-med-anat-2024',
    title: 'QCM & Cas Cliniques d\'Anatomie - Membre Supérieur & Thorax',
    year: 2024,
    termType: 'MIDTERM_EMD',
    fileUrl: '/exams/alger1_anat_2024_emd1.pdf',
    solutionUrl: '/exams/alger1_anat_2024_emd1_corrige.pdf',
    isFreeSample: true,
    downloadsCount: 1890,
    moduleId: 'mod-med-anat',
    moduleName: 'Anatomie',
    authorName: 'Faculté de Médecine Ben Aknoun',
    createdAt: '2024-01-22',
  },
  {
    id: 'exam-med-anat-gold',
    title: 'Annales Officielles Corrigées de Médecine Alger 1 (2015-2024)',
    year: 2024,
    termType: 'FINAL_SEMESTRIAL',
    fileUrl: '/exams/alger1_med_annales_gold.pdf',
    solutionUrl: '/exams/alger1_med_annales_gold_corrige.pdf',
    isFreeSample: false, // Paid only
    downloadsCount: 2980,
    moduleId: 'mod-med-anat',
    moduleName: 'Anatomie',
    authorName: 'Pôle Médical DZ Prime',
    createdAt: '2024-02-01',
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@dzprime.academy',
    name: 'Riad Benmhidi',
    role: 'OWNER',
    phone: '+213 555 12 34 56',
    wilayaCode: 16,
    wilayaName: 'Alger',
    institutionId: 'inst-usthb',
    institutionName: 'USTHB Bab Ezzouar',
    studentCardId: 'DZ-OWN-16-0001',
    isVerified: true,
    createdAt: '2023-01-01',
  },
  {
    id: 'user-ambassador',
    email: 'ambassador.alger@dzprime.academy',
    name: 'Alaa Eddine',
    role: 'AMBASSADOR',
    phone: '+213 661 23 45 67',
    wilayaCode: 16,
    wilayaName: 'Alger',
    institutionId: 'inst-usthb',
    institutionName: 'Université USTHB',
    specialty: 'Informatique (MI L2)',
    academicYear: 'Master 1',
    studentCardId: 'DZ-AMB-16-0789',
    isVerified: true,
    createdAt: '2023-09-10',
  },
  {
    id: 'user-teacher',
    email: 'teacher.math@dzprime.academy',
    name: 'Pr. Abdelrahim Kadri',
    role: 'TEACHER',
    phone: '+213 770 98 76 54',
    wilayaCode: 19,
    wilayaName: 'Sétif',
    institutionId: 'inst-setif1',
    institutionName: 'Université Ferhat Abbas Sétif 1',
    studentCardId: 'DZ-TCH-19-0142',
    isVerified: true,
    createdAt: '2023-05-12',
  },
  {
    id: 'user-student-gold',
    email: 'student.gold@dzprime.academy',
    name: 'Ines Haddad',
    role: 'STUDENT_PAID',
    phone: '+213 550 44 33 22',
    wilayaCode: 31,
    wilayaName: 'Oran',
    institutionId: 'inst-usto',
    institutionName: 'Université USTO-MB Oran',
    specialty: 'Tronc Commun MI L2',
    academicYear: 'L2 S3',
    studentCardId: 'DZ-GLD-31-8841',
    isVerified: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'user-student-free',
    email: 'student.free@dzprime.academy',
    name: 'Yacine Belalem',
    role: 'STUDENT_FREE',
    phone: '+213 699 11 22 33',
    wilayaCode: 16,
    wilayaName: 'Alger',
    institutionId: 'inst-usthb',
    institutionName: 'Université USTHB',
    specialty: 'Tronc Commun MI',
    academicYear: 'L1 S1',
    studentCardId: 'DZ-STU-16-4412',
    isVerified: false,
    createdAt: '2024-02-01',
  },
];

export const AMBASSADORS: AmbassadorProfile[] = [
  {
    id: 'amb-1',
    userId: 'user-ambassador',
    user: DEMO_USERS[1],
    wilayaCode: 16,
    wilayaNameAr: 'الجزائر العاصمة',
    institutionId: 'inst-usthb',
    institutionNameAr: 'جامعة العلوم والتكنولوجيا USTHB',
    bioAr: 'سفير منصة DZ Prime Academy بجامعة باب الزوار. مسؤول عن تنظيم الفعاليات، حصص المراجعة ونشر مواضيع الامتحانات وحلولها لطلبة الإعلام الآلي والرياضيات.',
    bioFr: "Ambassadeur officiel DZ Prime à l'USTHB Bab Ezzouar. Coordination des sessions de révision et partage des annales corrigées en Math & Informatique.",
    ratingAverage: 4.95,
    ratingsCount: 148,
    isVerified: true,
    upcomingSessionsCount: 3,
    totalTipsShared: 42,
  },
  {
    id: 'amb-2',
    userId: 'user-amb-oran',
    user: {
      id: 'user-amb-oran',
      email: 'ambassador.oran@dzprime.academy',
      name: 'Mohamed Boualem',
      role: 'AMBASSADOR',
      wilayaCode: 31,
      wilayaName: 'Oran',
      institutionId: 'inst-usto',
      institutionName: 'Université USTO-MB',
      studentCardId: 'DZ-AMB-31-0321',
      isVerified: true,
      createdAt: '2023-10-01',
    },
    wilayaCode: 31,
    wilayaNameAr: 'وهران',
    institutionId: 'inst-usto',
    institutionNameAr: 'جامعة العلوم والتكنولوجيا وهران (USTO)',
    bioAr: 'سفير المنصة لولاية وهران وجامعة إيسطو. دعم مستمر لطلبة الهندسة والعلوم الدقيقة.',
    bioFr: "Ambassadeur DZ Prime pour la wilaya d'Oran et l'université USTO. Soutien académique continu en Sciences et Ingénierie.",
    ratingAverage: 4.88,
    ratingsCount: 94,
    isVerified: true,
    upcomingSessionsCount: 2,
    totalTipsShared: 29,
  },
  {
    id: 'amb-3',
    userId: 'user-amb-constantine',
    user: {
      id: 'user-amb-constantine',
      email: 'ambassador.constantine@dzprime.academy',
      name: 'Sara Cherif',
      role: 'AMBASSADOR',
      wilayaCode: 25,
      wilayaName: 'Constantine',
      institutionId: 'inst-mentouri',
      institutionName: 'Université Frères Mentouri',
      studentCardId: 'DZ-AMB-25-0552',
      isVerified: true,
      createdAt: '2023-10-15',
    },
    wilayaCode: 25,
    wilayaNameAr: 'قسنطينة',
    institutionId: 'inst-mentouri',
    institutionNameAr: 'جامعة الإخوة منتوري قسنطينة 1',
    bioAr: 'سفيرة الشرق الجزائري - قسنطينة. توجيه الطلبة الجدد، تنظيم نوادي علمية وحلقات دراسية.',
    bioFr: "Ambassadrice de l'Est Algérien à Constantine 1. Orientation des nouveaux étudiants et organisation de groupes d'étude.",
    ratingAverage: 4.92,
    ratingsCount: 112,
    isVerified: true,
    upcomingSessionsCount: 4,
    totalTipsShared: 37,
  }
];

export const RECENT_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'حصة مراجعة شاملة وحضورية في مادة التحليل 1 (Analyse 1) قبل امتحانات السداسي الأول',
    content: 'يسر سفارة منصة DZ Prime بجامعة USTHB الإعلان عن تنظيم ورشة مراجعة حضورية مكثفة تشمل حل 4 مواضيع امتحانات سابقة مع شرح أفكار الدوال، المتتاليات والاستمرار. المكان: قاعة المحاضرات C - باب الزوار.',
    type: 'SESSION_SCHEDULE',
    wilayaCode: 16,
    wilayaName: 'الجزائر العاصمة',
    institutionId: 'inst-usthb',
    institutionName: 'جامعة USTHB',
    eventDate: '2026-08-25T10:00:00Z',
    isOnline: false,
    location: 'قاعة المحاضرات C - كلية الرياضيات (USTHB)',
    isApproved: true,
    authorId: 'user-ambassador',
    authorName: 'Alaa Eddine (Ambassadeur USTHB)',
    authorRole: 'AMBASSADOR',
    createdAt: '2026-08-14',
  },
  {
    id: 'post-2',
    title: 'نصائح ذهبية لطلبة البكالوريا: كيف تنظم وقتك في شهر ما قبل الدخول المدرسي؟',
    content: 'خطوات منهجية وضعها أوائل البكالوريا في الجزائر: 1. تثبيت الأساسيات في الرياضيات والمكتسبات القبلية، 2. مراجعة مصطلحات وشخصيات التاريخ والجغرافيا بذكاء، 3. عدم الضغط النفسي وتحديد هدف معدل الامتياز.',
    type: 'STUDY_TIP',
    wilayaCode: 16,
    wilayaName: 'الجزائر العاصمة',
    isOnline: true,
    isApproved: true,
    authorId: 'user-admin',
    authorName: 'Conseil National DZ Prime',
    authorRole: 'OWNER',
    createdAt: '2026-08-13',
  },
  {
    id: 'post-3',
    title: 'لايف مباشر عبر زووم: حل مسائل المصفوفات والفضاءات الشعاعية (Algèbre 1)',
    content: 'جلسة تدريبية تفاعلية ومجانية لجميع طلبة L1 MI و L1 ST مع الأستاذ قادري وسفراء المنصة. رابط الزووم متاح في قسم الأحداث بالمنصة.',
    type: 'EVENT',
    wilayaCode: 19,
    wilayaName: 'سطيف',
    eventDate: '2026-08-28T20:00:00Z',
    isOnline: true,
    meetUrl: 'https://meet.dzprime.academy/live-algebra-1',
    isApproved: true,
    authorId: 'user-teacher',
    authorName: 'Pr. Abdelrahim Kadri',
    authorRole: 'TEACHER',
    createdAt: '2026-08-12',
  },
];

// Helper functions for dynamic language selection
export function getLocalizedItemName(
  item: { nameAr: string; nameFr: string; nameEn?: string },
  locale: Locale
): string {
  if (locale === 'fr') return item.nameFr || item.nameAr;
  if (locale === 'en') return item.nameEn || item.nameFr || item.nameAr;
  return item.nameAr;
}

export function getLocalizedWilayaName(wilaya: Wilaya, locale: Locale): string {
  if (locale === 'fr') return wilaya.nameFr;
  if (locale === 'en') return wilaya.nameEn;
  return wilaya.nameAr;
}

export function getLocalizedAmbassadorBio(amb: AmbassadorProfile, locale: Locale): string {
  if (locale === 'fr') return amb.bioFr || amb.bioAr || '';
  if (locale === 'en') return amb.bioFr || amb.bioAr || '';
  return amb.bioAr || amb.bioFr || '';
}
