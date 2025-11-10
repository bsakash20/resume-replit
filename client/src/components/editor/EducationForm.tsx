import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Resume, EducationItem } from "@shared/schema";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";

interface EducationFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function EducationForm({ resume, onUpdate }: EducationFormProps) {
  const [showSection, setShowSection] = useState(resume.showEducation);
  const education = (resume.education as EducationItem[]) || [];

  const addEducation = () => {
    const newEducation: EducationItem = {
      id: nanoid(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
    };
    onUpdate({ education: [...education, newEducation] as any });
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: any) => {
    const updated = education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate({ education: updated as any });
  };

  const removeEducation = (id: string) => {
    const updated = education.filter((edu) => edu.id !== id);
    onUpdate({ education: updated as any });
  };

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showEducation: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Education
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-education"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Education #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  data-testid={`button-remove-education-${index}`}
                  className="hover-elevate active-elevate-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    placeholder="Stanford University"
                    data-testid={`input-education-institution-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    placeholder="Bachelor of Science"
                    data-testid={`input-education-degree-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    placeholder="Computer Science"
                    data-testid={`input-education-field-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={edu.location || ""}
                    onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                    placeholder="Stanford, CA"
                    data-testid={`input-education-location-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                    data-testid={`input-education-start-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate || ""}
                    onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                    disabled={edu.current}
                    data-testid={`input-education-end-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa || ""}
                    onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                    placeholder="3.8/4.0"
                    data-testid={`input-education-gpa-${index}`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={edu.current}
                    onCheckedChange={(checked) => updateEducation(edu.id, "current", checked)}
                    data-testid={`toggle-education-current-${index}`}
                  />
                  <Label className="text-sm">Currently Studying</Label>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addEducation}
            className="w-full hover-elevate active-elevate-2"
            data-testid="button-add-education"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
