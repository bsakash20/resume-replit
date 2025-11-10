import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertResumeSchema, type Resume } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Resume routes
  app.get("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id, userId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.post("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumeData = {
        ...req.body,
        userId,
      };
      
      const validated = insertResumeSchema.parse(resumeData);
      const resume = await storage.createResume(validated);
      res.status(201).json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(400).json({ message: "Failed to create resume" });
    }
  });

  app.patch("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.updateResume(req.params.id, userId, req.body);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteResume(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  app.post("/api/resumes/:id/duplicate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const duplicated = await storage.duplicateResume(req.params.id, userId);
      if (!duplicated) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.status(201).json(duplicated);
    } catch (error) {
      console.error("Error duplicating resume:", error);
      res.status(500).json({ message: "Failed to duplicate resume" });
    }
  });

  // AI generation routes
  app.post("/api/ai/generate-summary", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check AI credits
      if (user.aiCredits <= 0 && !user.isPremium) {
        return res.status(403).json({ 
          message: "Insufficient AI credits. Please upgrade to continue." 
        });
      }

      const { context } = req.body;
      
      // Generate summary using OpenAI
      const prompt = `You are a professional resume writer. Generate a compelling professional summary (2-3 sentences) for a candidate with the following information:

Name: ${context.fullName || "Candidate"}
Experience: ${context.experience ? JSON.stringify(context.experience).slice(0, 500) : "Entry level"}
Skills: ${context.skills ? JSON.stringify(context.skills).slice(0, 300) : "Various skills"}

Write a concise, achievement-focused professional summary that highlights key strengths and career goals. Use action verbs and quantify achievements where possible. Keep it under 100 words.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      const summary = completion.choices[0]?.message?.content?.trim() || "";

      // Deduct AI credit if not premium
      if (!user.isPremium) {
        await storage.updateUserCredits(userId, user.aiCredits - 1);
      }

      res.json({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ message: "Failed to generate summary" });
    }
  });

  app.post("/api/ai/generate-bullets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check AI credits
      if (user.aiCredits <= 0 && !user.isPremium) {
        return res.status(403).json({ 
          message: "Insufficient AI credits. Please upgrade to continue." 
        });
      }

      const { context } = req.body;
      
      // Generate bullet points using OpenAI
      const prompt = `You are a professional resume writer. Generate 3-5 achievement-focused bullet points for this work experience:

Position: ${context.position || ""}
Company: ${context.company || ""}
Current Description: ${context.currentDescription || ""}

Create impactful bullet points that:
- Start with strong action verbs
- Include quantifiable achievements where possible (numbers, percentages, scale)
- Highlight key responsibilities and impact
- Are concise and results-oriented
- Use past tense for completed roles

Format each bullet point starting with "• " on a new line.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      const bullets = completion.choices[0]?.message?.content?.trim() || "";

      // Deduct AI credit if not premium
      if (!user.isPremium) {
        await storage.updateUserCredits(userId, user.aiCredits - 1);
      }

      res.json({ bullets });
    } catch (error) {
      console.error("Error generating bullets:", error);
      res.status(500).json({ message: "Failed to generate bullet points" });
    }
  });

  // Payment routes (Razorpay integration placeholder)
  app.post("/api/payments/create-order", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { plan, amount } = req.body;

      // TODO: Implement Razorpay order creation
      // For now, return a placeholder
      res.json({
        message: "Payment integration coming soon",
        plan,
        amount,
      });
    } catch (error) {
      console.error("Error creating payment order:", error);
      res.status(500).json({ message: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan } = req.body;

      // TODO: Implement Razorpay signature verification
      // For now, return success
      res.json({
        message: "Payment verification coming soon",
        success: false,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
