import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Resume } from "@shared/schema";
import { FileText, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface SummaryFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function SummaryForm({ resume, onUpdate }: SummaryFormProps) {
  const { toast } = useToast();
  const [showSection, setShowSection] = useState(resume.showSummary);

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/ai/generate-summary`, {
        resumeId: resume.id,
        context: {
          fullName: resume.fullName,
          experience: resume.experience,
          skills: resume.skills,
        },
      });
    },
    onSuccess: (data: { summary: string }) => {
      onUpdate({ summary: data.summary });
      toast({
        title: "Success",
        description: "AI summary generated successfully!",
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
        description: error.message || "Failed to generate summary",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showSummary: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Professional Summary
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              data-testid="button-generate-summary"
              className="hover-elevate active-elevate-2"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateMutation.isPending ? "Generating..." : "Generate with AI"}
            </Button>
            <div className="flex items-center gap-2">
              <Switch
                checked={showSection}
                onCheckedChange={handleToggle}
                data-testid="toggle-summary"
              />
              <Label className="text-sm">Show</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-4">
          <Textarea
            value={resume.summary || ""}
            onChange={(e) => onUpdate({ summary: e.target.value })}
            placeholder="Write a compelling professional summary highlighting your key achievements and career goals..."
            rows={5}
            data-testid="textarea-summary"
            className="resize-none"
          />
        </CardContent>
      )}
    </Card>
  );
}
