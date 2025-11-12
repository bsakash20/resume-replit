import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertResumeSchema, type Resume } from "@shared/schema";
import OpenAI from "openai";
import Razorpay from "razorpay";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Razorpay instance - keys must be set in environment
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️  Razorpay credentials not configured. Payment features will be unavailable.");
  console.warn("   Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment.");
}

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

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

  // Job Analysis route
  app.post("/api/resumes/:id/analyze-job", isAuthenticated, async (req: any, res) => {
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

      const resume = await storage.getResume(req.params.id, userId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const { jobDescription } = req.body;
      if (!jobDescription || jobDescription.trim().length === 0) {
        return res.status(400).json({ message: "Job description is required" });
      }

      // Prepare resume content for analysis
      const experienceArray = (resume.experience as any[]) || [];
      const educationArray = (resume.education as any[]) || [];
      const skillsArray = (resume.skills as any[]) || [];
      const projectsArray = (resume.projects as any[]) || [];
      const certificationsArray = (resume.certifications as any[]) || [];

      const resumeText = `
RESUME:
Name: ${resume.fullName || 'Not provided'}
Email: ${resume.email || 'Not provided'}
Phone: ${resume.phone || 'Not provided'}
Location: ${resume.location || 'Not provided'}
Website: ${resume.website || 'Not provided'}
LinkedIn: ${resume.linkedin || 'Not provided'}

Professional Summary: ${resume.summary || 'Not provided'}

Skills: ${skillsArray.map((s: any) => s.name).join(', ') || 'Not provided'}

Work Experience:
${experienceArray.map((exp: any) => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
  ${exp.description || ''}
`).join('\n') || 'Not provided'}

Education:
${educationArray.map((edu: any) => `
- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.endDate || edu.graduationDate || ''})
`).join('\n') || 'Not provided'}

Projects: ${projectsArray.map((p: any) => `${p.name}: ${p.description}`).join('; ') || 'Not provided'}
Certifications: ${certificationsArray.map((c: any) => c.name).join(', ') || 'Not provided'}
`;

      // Generate analysis using OpenAI
      const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyst. Analyze how well this resume matches the job description below.

${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "matchScore": <number 0-100>,
  "overallAssessment": "<2-3 sentence summary of the match>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "skillsGap": ["<missing skill 1>", "<missing skill 2>", "<missing skill 3>"],
  "recommendations": [
    "<specific actionable recommendation 1>",
    "<specific actionable recommendation 2>",
    "<specific actionable recommendation 3>",
    "<specific actionable recommendation 4>"
  ],
  "atsOptimization": [
    "<ATS tip 1>",
    "<ATS tip 2>",
    "<ATS tip 3>"
  ]
}

Be specific and actionable in your recommendations. Focus on concrete improvements the candidate can make.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const analysisText = completion.choices[0]?.message?.content?.trim() || "{}";
      const analysis = JSON.parse(analysisText);

      // Deduct AI credit if not premium
      if (!user.isPremium) {
        await storage.updateUserCredits(userId, user.aiCredits - 1);
      }

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing job match:", error);
      res.status(500).json({ message: "Failed to analyze job match" });
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

  // Payment routes - Download credits via Razorpay
  app.post("/api/payments/initiate", isAuthenticated, async (req: any, res) => {
    try {
      if (!razorpay) {
        return res.status(503).json({ 
          message: "Payment service unavailable. Please contact support." 
        });
      }

      const userId = req.user.claims.sub;
      const { plan } = req.body; // 'single' or 'bundle'

      // Determine amount and credits based on plan
      const planConfig: Record<string, { amount: number; credits: number; name: string }> = {
        single: { amount: 1000, credits: 1, name: "Single Download" }, // ₹10 in paise
        bundle: { amount: 10000, credits: 20, name: "20 Downloads Bundle" }, // ₹100 in paise
      };

      const config = planConfig[plan];
      if (!config) {
        return res.status(400).json({ message: "Invalid plan" });
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: config.amount,
        currency: "INR",
        receipt: `download_${userId}_${Date.now()}`,
      });

      // Store payment record in database
      await storage.createPayment({
        userId,
        razorpayOrderId: order.id,
        amount: config.amount,
        currency: "INR",
        status: "pending",
        plan,
        type: "download_credits",
        creditsGranted: config.credits,
      });

      res.json({
        orderId: order.id,
        amount: config.amount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  });

  app.post("/api/payments/verify", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(503).json({ 
          success: false,
          message: "Payment service unavailable" 
        });
      }

      // Verify signature
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid payment signature" 
        });
      }

      // Get payment record
      const payment = await storage.getPaymentByOrderId(razorpayOrderId);
      if (!payment) {
        return res.status(404).json({ 
          success: false, 
          message: "Payment record not found" 
        });
      }

      // Prevent double-credit
      if (payment.status === "completed") {
        return res.json({ 
          success: true, 
          message: "Payment already processed" 
        });
      }

      // Update payment status
      await storage.updatePayment(payment.id, {
        razorpayPaymentId,
        razorpaySignature,
        status: "completed",
      });

      // Add download credits to user account
      await storage.addDownloadCredits(userId, payment.creditsGranted);

      res.json({ 
        success: true, 
        credits: payment.creditsGranted,
        message: `Successfully added ${payment.creditsGranted} download credit${payment.creditsGranted > 1 ? 's' : ''}` 
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to verify payment" 
      });
    }
  });

  // Download credit management
  app.post("/api/downloads/use-credit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const user = await storage.useDownloadCredit(userId);
      if (!user) {
        return res.status(403).json({ 
          message: "Insufficient download credits" 
        });
      }

      res.json({ 
        success: true, 
        remainingCredits: user.downloadCredits 
      });
    } catch (error) {
      console.error("Error using download credit:", error);
      res.status(500).json({ message: "Failed to use download credit" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
