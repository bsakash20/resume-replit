import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FileText,
  Save,
  Download,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  GripVertical,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import type { Resume } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ResumePreview } from "@/components/ResumePreview";
import { PersonalInfoForm } from "@/components/editor/PersonalInfoForm";
import { SummaryForm } from "@/components/editor/SummaryForm";
import { ExperienceForm } from "@/components/editor/ExperienceForm";
import { EducationForm } from "@/components/editor/EducationForm";
import { SkillsForm } from "@/components/editor/SkillsForm";
import { ProjectsForm } from "@/components/editor/ProjectsForm";
import { CertificationsForm } from "@/components/editor/CertificationsForm";
import { AchievementsForm } from "@/components/editor/AchievementsForm";
import { LanguagesForm } from "@/components/editor/LanguagesForm";
import { InterestsForm } from "@/components/editor/InterestsForm";
import { TemplateSelector } from "@/components/TemplateSelector";
import { PaymentModal } from "@/components/PaymentModal";
import { JobAnalyzer } from "@/components/JobAnalyzer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ResumeEditor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showPreview, setShowPreview] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showJobAnalyzer, setShowJobAnalyzer] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", id],
    enabled: !!id && isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Resume>) => {
      setSaveStatus("saving");
      return await apiRequest("PATCH", `/api/resumes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", id] });
      setSaveStatus("saved");
    },
    onError: (error: Error) => {
      setSaveStatus("unsaved");
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (data: Partial<Resume>) => {
    setSaveStatus("unsaved");
    const timeoutId = setTimeout(() => {
      updateMutation.mutate(data);
    }, 1000);
    return () => clearTimeout(timeoutId);
  };

  const useCreditMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/downloads/use-credit", {});
    },
    onSuccess: async () => {
      if (!resume) return;
      
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      const response = await fetch(`/api/resumes/${id}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.title || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Resume downloaded successfully!",
      });
    },
    onError: (error: Error) => {
      if (error.message.includes("Insufficient")) {
        setShowPaymentModal(true);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to download resume",
          variant: "destructive",
        });
      }
    },
  });

  const handleDownload = () => {
    if (!user) return;
    
    if (user.downloadCredits > 0) {
      useCreditMutation.mutate();
    } else {
      setShowPaymentModal(true);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold">Resume not found</p>
          <Button onClick={() => setLocation("/")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              data-testid="button-back"
              className="hover-elevate active-elevate-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <Input
                value={resume.title}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                className="border-none shadow-none focus-visible:ring-0 text-lg font-semibold px-2"
                placeholder="Untitled Resume"
                data-testid="input-resume-title"
              />
            </div>

            <Badge
              variant={
                saveStatus === "saved"
                  ? "secondary"
                  : saveStatus === "saving"
                  ? "secondary"
                  : "destructive"
              }
              data-testid="badge-save-status"
            >
              <Save className="w-3 h-3 mr-1" />
              {saveStatus === "saved"
                ? "Saved"
                : saveStatus === "saving"
                ? "Saving..."
                : "Unsaved"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              data-testid="button-toggle-preview"
              className="hover-elevate active-elevate-2 hidden md:flex"
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
            
            <TemplateSelector
              currentTemplate={resume.template}
              onTemplateChange={(template) => handleUpdate({ template })}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJobAnalyzer(true)}
              data-testid="button-job-analyzer"
              className="hover-elevate active-elevate-2 hidden lg:flex"
            >
              <Target className="w-4 h-4 mr-2" />
              Job Match
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              data-testid="button-download"
              className="hover-elevate active-elevate-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className={`${showPreview ? 'w-full md:w-1/2' : 'w-full'} overflow-y-auto p-6 space-y-6`}>
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Personal Information */}
            <PersonalInfoForm resume={resume} onUpdate={handleUpdate} />

            {/* Summary */}
            <SummaryForm resume={resume} onUpdate={handleUpdate} />

            {/* Experience */}
            <ExperienceForm resume={resume} onUpdate={handleUpdate} />

            {/* Education */}
            <EducationForm resume={resume} onUpdate={handleUpdate} />

            {/* Skills */}
            <SkillsForm resume={resume} onUpdate={handleUpdate} />

            {/* Projects */}
            <ProjectsForm resume={resume} onUpdate={handleUpdate} />

            {/* Certifications */}
            <CertificationsForm resume={resume} onUpdate={handleUpdate} />

            {/* Achievements */}
            <AchievementsForm resume={resume} onUpdate={handleUpdate} />

            {/* Languages */}
            <LanguagesForm resume={resume} onUpdate={handleUpdate} />

            {/* Interests */}
            <InterestsForm resume={resume} onUpdate={handleUpdate} />
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="hidden md:block w-1/2 border-l bg-muted/20 overflow-y-auto p-6">
            <div className="sticky top-6">
              <ResumePreview resume={resume} />
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={async () => {
          await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
          await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
          useCreditMutation.mutate();
        }}
      />

      {/* Job Analyzer Dialog */}
      <Dialog open={showJobAnalyzer} onOpenChange={setShowJobAnalyzer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Job Match Analyzer
            </DialogTitle>
            <DialogDescription>
              Analyze how well your resume matches a specific job posting and get AI-powered recommendations
            </DialogDescription>
          </DialogHeader>
          <JobAnalyzer resumeId={id!} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
