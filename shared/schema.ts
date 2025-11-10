// Reference: javascript_log_in_with_replit and javascript_database blueprints
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isPremium: boolean("is_premium").default(false).notNull(),
  aiCredits: integer("ai_credits").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  payments: many(payments),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Resumes table
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  template: varchar("template", { length: 50 }).notNull().default("classic"),
  
  // Personal Information
  fullName: varchar("full_name", { length: 255 }),
  email: varchar("resume_email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  github: varchar("github", { length: 255 }),
  
  // Professional Summary
  summary: text("summary"),
  
  // Sections stored as JSON arrays
  experience: jsonb("experience").default([]).notNull(),
  education: jsonb("education").default([]).notNull(),
  skills: jsonb("skills").default([]).notNull(),
  projects: jsonb("projects").default([]).notNull(),
  certifications: jsonb("certifications").default([]).notNull(),
  achievements: jsonb("achievements").default([]).notNull(),
  languages: jsonb("languages").default([]).notNull(),
  interests: jsonb("interests").default([]).notNull(),
  
  // Section visibility flags
  showSummary: boolean("show_summary").default(true).notNull(),
  showExperience: boolean("show_experience").default(true).notNull(),
  showEducation: boolean("show_education").default(true).notNull(),
  showSkills: boolean("show_skills").default(true).notNull(),
  showProjects: boolean("show_projects").default(true).notNull(),
  showCertifications: boolean("show_certifications").default(true).notNull(),
  showAchievements: boolean("show_achievements").default(true).notNull(),
  showLanguages: boolean("show_languages").default(true).notNull(),
  showInterests: boolean("show_interests").default(true).notNull(),
  
  // Section order
  sectionOrder: jsonb("section_order").default([
    "summary", "experience", "education", "skills", 
    "projects", "certifications", "achievements", "languages", "interests"
  ]).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Payments table for Razorpay transactions
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
  razorpaySignature: varchar("razorpay_signature", { length: 500 }),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  plan: varchar("plan", { length: 50 }).notNull(),
  creditsGranted: integer("credits_granted").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// TypeScript interfaces for JSON fields
export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}

export interface SkillItem {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface InterestItem {
  id: string;
  interest: string;
}
