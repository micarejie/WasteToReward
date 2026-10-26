export const skillCategories = [
  "Frontend Development",
  "Backend Development",
  "Database Management",
  "Programming Languages",
  "UI/UX Design",
  "Development Tools",
] as const;

export const skillLevels = ["Learning", "Familiar", "Comfortable"] as const;

export const projectStatuses = ["Planned", "In progress", "Completed"] as const;

export type SkillCategory = (typeof skillCategories)[number];
export type SkillLevel = (typeof skillLevels)[number];
export type ProjectStatus = (typeof projectStatuses)[number];

export type Skill = {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
};

export type EducationItem = {
  school: string;
  credential: string;
  period: string;
  location?: string;
  details: string;
  status: "In progress" | "Completed";
};

export type Profile = {
  id: string;
  full_name: string;
  headline: string;
  tagline: string;
  motto: string;
  bio: string;
  email: string;
  avatar_url: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  location: string | null;
  interests: string[];
  strengths: string[];
  career_goals: string;
  roles: string[];
  skills: Skill[];
  education: EducationItem[];
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  url: string;
  alt: string;
};

export type ProjectChallenge = {
  challenge: string;
  solution: string;
};

export type ProjectContent = {
  overview: string;
  problem: string;
  objectives: string[];
  target_users: string;
  features: string[];
  process: string;
  challenges: ProjectChallenge[];
  lessons: string[];
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: ProjectContent;
  category: string;
  status: ProjectStatus;
  tech_stack: string[];
  image_url: string;
  gallery: GalleryImage[];
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  description: string;
  date_earned: string | null;
  image_url: string;
  credential_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type ProjectFilters = {
  q?: string;
  category?: string;
  tech?: string;
  page?: number;
};

export type BlogFilters = {
  q?: string;
  category?: string;
  page?: number;
};
