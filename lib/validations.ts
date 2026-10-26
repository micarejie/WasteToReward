import { z } from "zod";
import { projectStatuses, skillCategories, skillLevels } from "@/types/portfolio";
import { safeAssetUrl, safeExternalUrl, slugify } from "@/lib/utils";

function externalOrAsset(value: string | null) {
  if (!value) return null;
  return safeExternalUrl(value) ?? safeAssetUrl(value);
}

const assetUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .or(z.literal(""))
  .transform((value) => externalOrAsset(value || null));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  subject: z.string().trim().min(3, "Enter a subject.").max(140, "Subject must be 140 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Write a slightly longer message.")
    .max(4000, "Message must be 4,000 characters or fewer."),
  website: z.string().optional().default(""),
  startedAt: z.string().optional().default(""),
});

const skillSchema = z.object({
  name: z.string().trim().min(1).max(40),
  category: z.enum(skillCategories),
  level: z.enum(skillLevels).optional().or(z.literal("")).transform((value) => value || undefined),
});

const educationSchema = z.object({
  school: z.string().trim().min(2).max(120),
  credential: z.string().trim().min(2).max(140),
  period: z.string().trim().min(2).max(60),
  location: z.string().trim().max(80).optional().or(z.literal("")).transform((value) => value || undefined),
  details: z.string().trim().max(400).default(""),
  status: z.enum(["In progress", "Completed"]),
});

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your name.").max(80),
  headline: z.string().trim().max(120).default(""),
  tagline: z.string().trim().max(180).default(""),
  motto: z.string().trim().max(80).default(""),
  bio: z.string().trim().max(2000).default(""),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  avatar_url: assetUrl,
  resume_url: assetUrl,
  github_url: z.string().trim().max(300).optional().or(z.literal("")).transform((value) => safeExternalUrl(value || null)),
  linkedin_url: z.string().trim().max(300).optional().or(z.literal("")).transform((value) => safeExternalUrl(value || null)),
  location: z.string().trim().max(80).optional().or(z.literal("")).transform((value) => value || null),
  interests: z.array(z.string().trim().min(2).max(40)).max(12).default([]),
  strengths: z.array(z.string().trim().min(2).max(180)).max(8).default([]),
  career_goals: z.string().trim().max(1000).default(""),
  skills: z.array(skillSchema).max(40).default([]),
  education: z.array(educationSchema).max(8).default([]),
});

const listItem = z.string().trim().min(1).max(300);

export const projectSchema = z.object({
  title: z.string().trim().min(3, "Enter a project title.").max(120),
  slug: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((value) => slugify(value || ""))
    .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Use a lowercase slug with hyphens."),
  description: z.string().trim().min(10, "Add a short description.").max(400),
  category: z.string().trim().min(2, "Add a category.").max(40),
  status: z.enum(projectStatuses),
  tech_stack: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
  image_url: assetUrl,
  gallery: z
    .array(
      z.object({
        url: z.string().trim().min(1).max(300),
        alt: z.string().trim().max(140).default("Project image"),
      }),
    )
    .max(8)
    .default([])
    .transform((images) =>
      images
        .map((image) => {
          const url = externalOrAsset(image.url);
          return url ? { url, alt: image.alt || "Project image" } : null;
        })
        .filter((image): image is { url: string; alt: string } => Boolean(image)),
    ),
  demo_url: z.string().trim().max(300).optional().or(z.literal("")).transform((value) => externalOrAsset(value || null)),
  github_url: z.string().trim().max(300).optional().or(z.literal("")).transform((value) => safeExternalUrl(value || null)),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  overview: z.string().trim().max(3000).default(""),
  problem: z.string().trim().max(3000).default(""),
  objectives: z.array(listItem).max(8).default([]),
  target_users: z.string().trim().max(1000).default(""),
  features: z.array(listItem).max(12).default([]),
  process: z.string().trim().max(3000).default(""),
  challenges: z
    .array(
      z.object({
        challenge: z.string().trim().max(400),
        solution: z.string().trim().max(400),
      }),
    )
    .max(8)
    .default([]),
  lessons: z.array(listItem).max(8).default([]),
});

export const blogSchema = z.object({
  title: z.string().trim().min(3, "Enter a title.").max(140),
  slug: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((value) => slugify(value || ""))
    .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Use a lowercase slug with hyphens."),
  excerpt: z.string().trim().min(10, "Add a short summary.").max(300),
  content: z.string().trim().min(20, "Write the article.").max(20000),
  cover_image_url: assetUrl,
  category: z.string().trim().min(2, "Add a category.").max(40),
  tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
  published: z.boolean().default(false),
});

export const certificateSchema = z.object({
  title: z.string().trim().min(3, "Enter the certificate title.").max(140),
  issuer: z.string().trim().min(2, "Enter the issuing organization.").max(120),
  description: z.string().trim().max(1000).default(""),
  date_earned: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || null)
    .refine((value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value), "Use a valid date."),
  image_url: assetUrl,
  credential_url: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .transform((value) => safeExternalUrl(value || null)),
  featured: z.boolean().default(false),
});

const administratorEmail = z
  .string()
  .trim()
  .max(120)
  .refine((value) => /^[^\s@]+@[^\s@]+$/.test(value), "Enter the email on the administrator account.");

export const loginSchema = z.object({
  email: administratorEmail,
  password: z.string().min(6, "Enter your password.").max(200),
});

export const passwordResetSchema = z.object({
  email: administratorEmail,
});

export const passwordUpdateSchema = z.object({
  password: z.string().min(8, "Use at least 8 characters.").max(200),
  confirm: z.string().min(8).max(200),
}).refine((value) => value.password === value.confirm, {
  message: "The two passwords do not match.",
  path: ["confirm"],
});

export function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message || "Check the form and try again.";
}
