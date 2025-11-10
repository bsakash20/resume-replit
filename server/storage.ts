import {
  users,
  resumes,
  payments,
  type User,
  type UpsertUser,
  type Resume,
  type InsertResume,
  type Payment,
  type InsertPayment,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(userId: string, credits: number): Promise<User | undefined>;
  updateUserPremium(userId: string, isPremium: boolean): Promise<User | undefined>;

  // Resume operations
  getResumes(userId: string): Promise<Resume[]>;
  getResume(id: string, userId: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, userId: string, data: Partial<Resume>): Promise<Resume | undefined>;
  deleteResume(id: string, userId: string): Promise<void>;
  duplicateResume(id: string, userId: string): Promise<Resume | undefined>;

  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined>;
  getPayment(id: string): Promise<Payment | undefined>;
  getUserPayments(userId: string): Promise<Payment[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserCredits(userId: string, credits: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ aiCredits: credits, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserPremium(userId: string, isPremium: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isPremium, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Resume operations
  async getResumes(userId: string): Promise<Resume[]> {
    return await db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async getResume(id: string, userId: string): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
    return resume;
  }

  async createResume(resumeData: InsertResume): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values(resumeData)
      .returning();
    return resume;
  }

  async updateResume(id: string, userId: string, data: Partial<Resume>): Promise<Resume | undefined> {
    const [resume] = await db
      .update(resumes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();
    return resume;
  }

  async deleteResume(id: string, userId: string): Promise<void> {
    await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
  }

  async duplicateResume(id: string, userId: string): Promise<Resume | undefined> {
    const original = await this.getResume(id, userId);
    if (!original) return undefined;

    const { id: _, createdAt, updatedAt, ...resumeData } = original;
    const [duplicated] = await db
      .insert(resumes)
      .values({
        ...resumeData,
        title: `${original.title} (Copy)`,
      })
      .returning();
    return duplicated;
  }

  // Payment operations
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(paymentData)
      .returning();
    return payment;
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined> {
    const [payment] = await db
      .update(payments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }
}

export const storage = new DatabaseStorage();
