export type University = {
  id: string;
  name: string;
  shortName: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  region: string;
  continent?: string;
  type: 'Public' | 'Private';
  established: number;
  qsWorld: number | null;
  qsAsia: number | null;
  hecRank: number | null;
  website: string;
  admissionsLink: string | null;
  scholarshipLink: string | null;
  campuses: number;
  programs: string[];
  fields: string[];
  degreeLevels: string[];
  tuitionPerSemester: string;
  admissionTest: string;
  meritWeight: string;
  description: string;
  logoColor: string;
  lat: number;
  lng: number;
  internationalStudents: boolean;
  scholarshipAvailable: boolean;
  languageRequirements: string;
  featured: boolean;
  lastVerified: string;
};

export type ScholarshipStatus = 'open' | 'upcoming' | 'closed' | 'check';

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  country: string;
  flag: string;
  level: string[];
  coverage: string[];
  fundingType: 'Fully Funded' | 'Partially Funded' | 'Tuition Only';
  eligibility: string;
  eligibilitySummary: string;
  documentsRequired: string[];
  applicationProcess: string;
  deadline: string;
  status: ScholarshipStatus;
  amount: string;
  whatItCovers: string[];
  countries: string[];
  eligibleNationality: string;
  pakistanEligible: boolean;
  link: string;
  applicationLink: string | null;
  lastVerified: string;
  featured: boolean;
};

export type Country = {
  id: string;
  name: string;
  flag: string;
  popularFields: string[];
  degreeLevels: string[];
  internationalStudents: boolean;
  avgTuitionRange: string;
  scholarshipsAvailable: boolean;
  languageRequirement: string;
  visaInfo: string;
  officialResource: string;
  description: string;
};

export type Career = {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  salaryPKR: string;
  salaryUSD: string;
  growthRate: string;
  skills: string[];
  educationPath: string[];
  topEmployers: string[];
  difficulty: 'Low' | 'Medium' | 'High' | 'Very High';
};

export type EducationLevel = 'matric' | 'intermediate';

export type IntermediateGroup =
  | 'Pre-Medical'
  | 'Pre-Engineering'
  | 'ICS/Computer Science'
  | 'Commerce'
  | 'Arts/Humanities'
  | 'Other';

export type QuizCategory =
  | 'Interest'
  | 'Subject Preference'
  | 'Personality'
  | 'Logical Ability'
  | 'Numerical Ability'
  | 'Communication'
  | 'Creativity'
  | 'Career Preference'
  | 'Problem Solving'
  | 'Work Style';

export type QuizQuestionV2 = {
  id: number;
  category: QuizCategory;
  question: string;
  options: string[];
  fieldScores: Record<string, number[]>;
};

export type RecommendedField = {
  field: string;
  icon: string;
  matchPercent: number;
  explanation: string;
  studyNext: string;
  suggestedDegrees: string[];
  exampleCareers: string[];
};

export type JobMarketData = {
  role: string;
  demand: 'Very High' | 'High' | 'Medium' | 'Emerging';
  avgSalaryPKR: string;
  growth: string;
  topSkills: string[];
};

export type MatcherInput = {
  educationLevel: string;
  gpa: string;
  intendedDegree: string;
  preferredField: string;
  preferredCountries: string[];
  budget: string;
  scholarshipNeeded: boolean;
  englishTest: string;
  careerGoal: string;
};
