export type FieldInfo = {
  field: string;
  icon: string;
  studyNext: string;
  suggestedDegrees: string[];
  exampleCareers: string[];
};

export const matricFieldInfo: Record<string, FieldInfo> = {
  'Pre-Medical': {
    field: 'Pre-Medical',
    icon: 'HeartPulse',
    studyNext: 'Take FSc Pre-Medical (Biology, Chemistry, Physics) in intermediate, then appear for MDCAT to pursue MBBS, BDS, Pharm-D, or DPT.',
    suggestedDegrees: ['MBBS (Bachelor of Medicine)', 'BDS (Dentistry)', 'Pharm-D (Pharmacy)', 'DPT (Doctor of Physical Therapy)', 'BS Nursing'],
    exampleCareers: ['Medical Doctor', 'Dentist', 'Pharmacist', 'Physical Therapist', 'Surgeon'],
  },
  'Pre-Engineering': {
    field: 'Pre-Engineering',
    icon: 'Cog',
    studyNext: 'Take FSc Pre-Engineering (Math, Physics, Chemistry) in intermediate, then appear for ECAT to pursue engineering degrees.',
    suggestedDegrees: ['BS Civil Engineering', 'BS Mechanical Engineering', 'BS Electrical Engineering', 'BS Chemical Engineering'],
    exampleCareers: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Chemical Engineer'],
  },
  'ICS/Computer Science': {
    field: 'ICS/Computer Science',
    icon: 'Laptop',
    studyNext: 'Take ICS (Computer Science, Math, Physics/Stats) in intermediate, then pursue a BS in Computer Science, Software Engineering, or IT.',
    suggestedDegrees: ['BS Computer Science', 'BS Software Engineering', 'BS Information Technology', 'BS Data Science'],
    exampleCareers: ['Software Engineer', 'Web Developer', 'Data Analyst', 'IT Specialist'],
  },
  'Commerce': {
    field: 'Commerce',
    icon: 'Calculator',
    studyNext: 'Take I.Com (Commerce, Economics, Accounting) in intermediate, then pursue B.Com, ACCA, BS Accounting & Finance, or BBA.',
    suggestedDegrees: ['B.Com (Bachelor of Commerce)', 'BS Accounting & Finance', 'BBA (Bachelor of Business Administration)', 'ACCA'],
    exampleCareers: ['Chartered Accountant', 'Financial Analyst', 'Business Manager', 'Auditor'],
  },
  'Arts/Humanities': {
    field: 'Arts/Humanities',
    icon: 'Palette',
    studyNext: 'Take FA (Humanities, Languages, Social Studies) in intermediate, then pursue BA, BS Psychology, BS English, BS Mass Communication, or BFA.',
    suggestedDegrees: ['BA English', 'BS Psychology', 'BS Mass Communication', 'BFA (Fine Arts)', 'BS Political Science'],
    exampleCareers: ['Teacher', 'Journalist', 'Psychologist', 'Graphic Designer', 'Civil Servant'],
  },
  'Technical & Vocational': {
    field: 'Technical & Vocational',
    icon: 'Wrench',
    studyNext: 'Enroll in a DAE (Diploma of Associate Engineer) or technical vocational course in electrical, mechanical, civil, or IT technology.',
    suggestedDegrees: ['DAE Electrical', 'DAE Mechanical', 'DAE Civil', 'BS Technology (Electrical/Mechanical)'],
    exampleCareers: ['Electrical Technician', 'Mechanical Technician', 'Auto Mechanic', 'Field Service Engineer'],
  },
};

export const intermediateFieldInfo: Record<string, FieldInfo> = {
  'Computer Science': {
    field: 'Computer Science',
    icon: 'Laptop',
    studyNext: 'Pursue a BS in Computer Science (4 years). Focus on algorithms, data structures, operating systems, and databases. Build projects and do internships.',
    suggestedDegrees: ['BS Computer Science', 'BS Information Technology', 'BS Cyber Security'],
    exampleCareers: ['Software Engineer', 'Systems Architect', 'DevOps Engineer', 'Security Analyst'],
  },
  'AI & Data Science': {
    field: 'AI & Data Science',
    icon: 'Brain',
    studyNext: 'Pursue a BS in Data Science, AI, or Statistics. Learn Python, machine learning, deep learning, and work on real datasets and research projects.',
    suggestedDegrees: ['BS Data Science', 'BS Artificial Intelligence', 'BS Statistics', 'MS Data Science'],
    exampleCareers: ['AI Engineer', 'Data Scientist', 'ML Researcher', 'Data Analyst'],
  },
  'Software Engineering': {
    field: 'Software Engineering',
    icon: 'Code2',
    studyNext: 'Pursue a BS in Software Engineering. Focus on software architecture, agile methodologies, testing, and full-stack development. Build a strong portfolio.',
    suggestedDegrees: ['BS Software Engineering', 'BS Computer Science', 'BS Computer Engineering'],
    exampleCareers: ['Software Engineer', 'Full-Stack Developer', 'App Developer', 'Technical Lead'],
  },
  'Medicine': {
    field: 'Medicine',
    icon: 'HeartPulse',
    studyNext: 'Appear for MDCAT and pursue MBBS or BDS (5 years + house job). Alternatives include Pharm-D, DPT, BS Nursing, or BS Biotechnology.',
    suggestedDegrees: ['MBBS (Bachelor of Medicine)', 'BDS (Dentistry)', 'Pharm-D', 'DPT (Doctor of Physical Therapy)', 'BS Biotechnology'],
    exampleCareers: ['Medical Doctor', 'Surgeon', 'Dentist', 'Pharmacist', 'Medical Researcher'],
  },
  'Business & Finance': {
    field: 'Business & Finance',
    icon: 'TrendingUp',
    studyNext: 'Pursue a BBA, BS Accounting & Finance, or B.Com. Consider professional certifications like ACCA, CFA, or CA alongside your degree.',
    suggestedDegrees: ['BBA (Bachelor of Business Administration)', 'BS Accounting & Finance', 'BS Economics', 'ACCA / CFA'],
    exampleCareers: ['Chartered Accountant', 'Investment Banker', 'Financial Analyst', 'Entrepreneur', 'Business Consultant'],
  },
  'Engineering': {
    field: 'Engineering',
    icon: 'Cog',
    studyNext: 'Appear for ECAT and pursue a BS in Engineering (4 years). Specialize in civil, mechanical, electrical, chemical, or mechatronics engineering.',
    suggestedDegrees: ['BS Civil Engineering', 'BS Mechanical Engineering', 'BS Electrical Engineering', 'BS Mechatronics Engineering'],
    exampleCareers: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Project Manager'],
  },
  'Law': {
    field: 'Law',
    icon: 'Scale',
    studyNext: 'Pursue an LLB (5 years integrated or 3 years post-grad). Build strong analytical and argumentation skills through moot courts and internships.',
    suggestedDegrees: ['LLB (Bachelor of Laws)', 'BA LLB (5-year integrated)', 'BS Political Science (pre-law)'],
    exampleCareers: ['Advocate/Lawyer', 'Judge', 'Legal Advisor', 'Corporate Counsel', 'Public Prosecutor'],
  },
  'Design & Architecture': {
    field: 'Design & Architecture',
    icon: 'Building2',
    studyNext: 'Pursue a B.Arch (5 years) or BS in Interior Design, Graphic Design, or Industrial Design. Build a strong portfolio of creative work.',
    suggestedDegrees: ['B.Arch (Bachelor of Architecture)', 'BS Interior Design', 'BS Graphic Design', 'BS Industrial Design'],
    exampleCareers: ['Architect', 'UI/UX Designer', 'Interior Designer', 'Graphic Designer', 'Product Designer'],
  },
  'Education': {
    field: 'Education',
    icon: 'GraduationCap',
    studyNext: 'Pursue a BS Education, B.Ed, or a subject-specific bachelor degree followed by a teaching certification. Specialize in your area of interest.',
    suggestedDegrees: ['BS Education', 'B.Ed (Bachelor of Education)', 'BS English / BS Mathematics (with B.Ed)'],
    exampleCareers: ['Teacher', 'Education Consultant', 'Academic Coordinator', 'Curriculum Developer'],
  },
  'Media & Communication': {
    field: 'Media & Communication',
    icon: 'Radio',
    studyNext: 'Pursue a BS Mass Communication, BS Media Studies, or BS Journalism. Build skills in writing, video production, and digital media.',
    suggestedDegrees: ['BS Mass Communication', 'BS Media Studies', 'BS Journalism', 'BS Film & TV Production'],
    exampleCareers: ['Journalist', 'News Anchor', 'Content Creator', 'PR Manager', 'Filmmaker'],
  },
};
