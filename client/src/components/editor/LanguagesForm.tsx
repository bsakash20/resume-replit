import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Resume, LanguageItem } from "@shared/schema";
import { Languages, Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";

interface LanguagesFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function LanguagesForm({ resume, onUpdate }: LanguagesFormProps) {
  const [showSection, setShowSection] = useState(resume.showLanguages);
  const languages = (resume.languages as LanguageItem[]) || [];

  const proficiencyLevels = [
    "Native",
    "Fluent",
    "Professional",
    "Intermediate",
    "Basic",
  ];

  const addLanguage = () => {
    const newLanguage: LanguageItem = {
      id: nanoid(),
      language: "",
      proficiency: "Professional",
    };
    onUpdate({ languages: [...languages, newLanguage] as any });
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, value: any) => {
    const updated = languages.map((lang) =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    onUpdate({ languages: updated as any });
  };

  const removeLanguage = (id: string) => {
    const updated = languages.filter((lang) => lang.id !== id);
    onUpdate({ languages: updated as any });
  };

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showLanguages: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Languages
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-languages"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-6">
          {languages.map((language, index) => (
            <div key={language.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Language #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(language.id)}
                  data-testid={`button-remove-language-${index}`}
                  className="hover-elevate active-elevate-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input
                    value={language.language}
                    onChange={(e) => updateLanguage(language.id, "language", e.target.value)}
                    placeholder="English"
                    data-testid={`input-language-name-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Proficiency Level</Label>
                  <Select
                    value={language.proficiency}
                    onValueChange={(value) => updateLanguage(language.id, "proficiency", value)}
                  >
                    <SelectTrigger data-testid={`select-language-proficiency-${index}`}>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addLanguage}
            className="w-full hover-elevate active-elevate-2"
            data-testid="button-add-language"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
