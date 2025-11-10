import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Sparkles,
  Download,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
  FileCheck,
  Brain,
  Target,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Landing() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: "AI-Powered Content",
      description: "Generate professional summaries and bullet points with intelligent AI assistance.",
    },
    {
      icon: <FileCheck className="w-6 h-6 text-primary" />,
      title: "ATS Optimization",
      description: "Get your resume scored and optimized for Applicant Tracking Systems.",
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Multiple Templates",
      description: "Choose from professional templates designed to impress recruiters.",
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Real-Time Preview",
      description: "See your resume update instantly as you type with live preview.",
    },
    {
      icon: <Download className="w-6 h-6 text-primary" />,
      title: "Export to PDF",
      description: "Download print-ready PDFs optimized for professional use.",
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely with enterprise-grade security.",
    },
  ];

  const templates = [
    {
      name: "Classic",
      description: "Traditional format perfect for corporate roles",
      badge: "Popular",
    },
    {
      name: "Modern",
      description: "Clean and contemporary design for tech professionals",
      badge: "Trending",
    },
    {
      name: "Minimalist",
      description: "Simple and elegant layout for creative fields",
      badge: null,
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      features: [
        "3 AI generations",
        "Basic templates",
        "PDF export",
        "1 resume",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "month",
      features: [
        "50 AI generations/month",
        "All premium templates",
        "Unlimited resumes",
        "Priority support",
        "ATS scoring",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Lifetime",
      price: "₹1,999",
      period: "one-time",
      features: [
        "Unlimited AI generations",
        "All templates forever",
        "Unlimited resumes",
        "Lifetime updates",
        "Premium support",
      ],
      cta: "Get Lifetime Access",
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Google",
      content: "This AI resume builder helped me land my dream job! The ATS optimization feature is game-changing.",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Product Manager",
      company: "Amazon",
      content: "The professional templates and AI-generated content saved me hours. Highly recommend!",
      rating: 5,
    },
    {
      name: "Ananya Patel",
      role: "Data Scientist",
      company: "Microsoft",
      content: "Best resume builder I've used. The live preview and easy editing made the process so smooth.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
              className="hover-elevate active-elevate-2"
            >
              Log In
            </Button>
            <Button
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-signup"
              className="hover-elevate active-elevate-2"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build Your Dream Resume
              <br />
              <span className="text-primary">With AI Assistance</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create professional, ATS-optimized resumes in minutes with intelligent AI content generation and beautiful templates.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-hero-cta"
                className="hover-elevate active-elevate-2 text-base px-8 py-6"
              >
                Start Building Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                data-testid="button-hero-secondary"
                className="hover-elevate active-elevate-2 text-base px-8 py-6"
              >
                View Templates
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground pt-2">
              <CheckCircle2 className="w-4 h-4 inline mr-1 text-primary" />
              No credit card required • Free forever plan
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Four simple steps to your perfect resume</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Sign Up", desc: "Create your free account in seconds" },
              { step: "2", title: "Choose Template", desc: "Pick from professional designs" },
              { step: "3", title: "Add Content", desc: "Fill sections with AI assistance" },
              { step: "4", title: "Download", desc: "Export your polished resume" },
            ].map((item, i) => (
              <Card key={i} className="text-center p-6 hover-elevate">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to create the perfect resume</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 hover-elevate">
                <CardContent className="p-0 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Templates</h2>
            <p className="text-muted-foreground text-lg">Designed by experts, optimized for ATS</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template, i) => (
              <Card key={i} className="overflow-hidden hover-elevate">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                  {template.badge && (
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      {template.badge}
                    </Badge>
                  )}
                  <FileText className="w-20 h-20 text-primary/40" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{template.name}</h3>
                  <p className="text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Smart AI Assistant at Your Service
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our advanced AI helps you craft compelling content, optimize for ATS systems, and stand out from the competition.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: <Sparkles className="w-5 h-5" />, text: "Generate professional summaries instantly" },
                  { icon: <Target className="w-5 h-5" />, text: "Create achievement-focused bullet points" },
                  { icon: <TrendingUp className="w-5 h-5" />, text: "Get resume scoring and improvement tips" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <p className="text-base pt-2">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI-Generated Content</span>
                </div>
                <div className="bg-background rounded-lg p-6 space-y-3">
                  <p className="text-sm font-medium">Professional Summary</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Results-driven software engineer with 5+ years of experience building scalable web applications. 
                    Proven track record of delivering high-impact projects and leading cross-functional teams. 
                    Expertise in React, Node.js, and cloud architecture.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">Choose the plan that works for you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Card
                key={i}
                className={`p-6 relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} hover-elevate`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                
                <CardContent className="p-0 space-y-6">
                  <div>
                    <h3 className="font-semibold text-2xl mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full hover-elevate active-elevate-2"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => window.location.href = "/api/login"}
                    data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Job Seekers</h2>
            <p className="text-muted-foreground text-lg">See what our users have to say</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 hover-elevate">
                <CardContent className="p-0 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-sm leading-relaxed">{testimonial.content}</p>
                  
                  <div className="pt-2 border-t">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of successful job seekers who built their resumes with ResumeAI
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-final-cta"
            className="hover-elevate active-elevate-2 text-base px-8 py-6"
          >
            Get Started for Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-bold">ResumeAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build professional resumes with AI assistance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Templates</li>
                <li>Features</li>
                <li>Pricing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
