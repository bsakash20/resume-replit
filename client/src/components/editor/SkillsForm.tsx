import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Resume, SkillItem } from "@shared/schema";
import { Code, Plus, Trash2, X } from "lucide-react";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";

interface SkillsFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function SkillsForm({ resume, onUpdate }: SkillsFormProps) {
  const [showSection, setShowSection] = useState(resume.showSkills);
  const skills = (resume.skills as SkillItem[]) || [];

  const addSkillCategory = () => {
    const newCategory: SkillItem = {
      id: nanoid(),
      category: "",
      skills: [],
    };
    onUpdate({ skills: [...skills, newCategory] as any });
  };

  const updateCategory = (id: string, field: keyof SkillItem, value: any) => {
    const updated = skills.map((cat) =>
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    onUpdate({ skills: updated as any });
  };

  const removeCategory = (id: string) => {
    const updated = skills.filter((cat) => cat.id !== id);
    onUpdate({ skills: updated as any });
  };

  const addSkill = (categoryId: string, skillName: string) => {
    const category = skills.find((c) => c.id === categoryId);
    if (category && skillName.trim()) {
      updateCategory(categoryId, "skills", [...category.skills, skillName.trim()]);
    }
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    const category = skills.find((c) => c.id === categoryId);
    if (category) {
      const updated = category.skills.filter((_, i) => i !== skillIndex);
      updateCategory(categoryId, "skills", updated);
    }
  };

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showSkills: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Skills
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-skills"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-6">
          {skills.map((category, index) => (
            <div key={category.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Category #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(category.id)}
                  data-testid={`button-remove-skill-category-${index}`}
                  className="hover-elevate active-elevate-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={category.category}
                  onChange={(e) => updateCategory(category.id, "category", e.target.value)}
                  placeholder="e.g., Programming Languages, Frameworks, Tools"
                  data-testid={`input-skill-category-${index}`}
                />
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="gap-1"
                      data-testid={`badge-skill-${index}-${skillIndex}`}
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(category.id, skillIndex)}
                        className="ml-1 hover:text-destructive"
                        data-testid={`button-remove-skill-${index}-${skillIndex}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addSkill(category.id, input.value);
                      input.value = "";
                    }
                  }}
                  data-testid={`input-add-skill-${index}`}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter to add a skill
                </p>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addSkillCategory}
            className="w-full hover-elevate active-elevate-2"
            data-testid="button-add-skill-category"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill Category
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
