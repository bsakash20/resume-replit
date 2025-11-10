import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Resume, ExperienceItem } from "@shared/schema";
import { Briefcase, Plus, Trash2, Sparkles } from "lucide-react";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ExperienceFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function ExperienceForm({ resume, onUpdate }: ExperienceFormProps) {
  const { toast } = useToast();
  const [showSection, setShowSection] = useState(resume.showExperience);
  const experiences = (resume.experience as ExperienceItem[]) || [];

  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: nanoid(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onUpdate({ experience: [...experiences, newExperience] as any });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    const updated = experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate({ experience: updated as any });
  };

  const removeExperience = (id: string) => {
    const updated = experiences.filter((exp) => exp.id !== id);
    onUpdate({ experience: updated as any });
  };

  const generateMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      const experience = experiences.find((e) => e.id === experienceId);
      return await apiRequest("POST", `/api/ai/generate-bullets`, {
        resumeId: resume.id,
        context: {
          position: experience?.position,
          company: experience?.company,
          currentDescription: experience?.description,
        },
      });
    },
    onSuccess: (data: { bullets: string }, variables: string) => {
      updateExperience(variables, "description", data.bullets);
      toast({
        title: "Success",
        description: "AI bullet points generated!",
      });
    },
    onError: (error: Error) => {
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
        description: error.message || "Failed to generate bullets",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showExperience: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Work Experience
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-experience"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Experience #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  data-testid={`button-remove-experience-${index}`}
                  className="hover-elevate active-elevate-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    placeholder="Software Engineer"
                    data-testid={`input-experience-position-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    placeholder="Tech Corp"
                    data-testid={`input-experience-company-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location || ""}
                    onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    placeholder="San Francisco, CA"
                    data-testid={`input-experience-location-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    data-testid={`input-experience-start-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate || ""}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                    data-testid={`input-experience-end-${index}`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={exp.current}
                    onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                    data-testid={`toggle-experience-current-${index}`}
                  />
                  <Label className="text-sm">Current Position</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Description & Achievements</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateMutation.mutate(exp.id)}
                    disabled={generateMutation.isPending || !exp.position}
                    data-testid={`button-generate-bullets-${index}`}
                    className="hover-elevate active-elevate-2"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  placeholder="• Led team of 5 engineers to deliver key features&#10;• Increased performance by 40% through optimization&#10;• Implemented CI/CD pipeline reducing deployment time"
                  rows={5}
                  data-testid={`textarea-experience-description-${index}`}
                  className="resize-none font-mono text-sm"
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addExperience}
            className="w-full hover-elevate active-elevate-2"
            data-testid="button-add-experience"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
