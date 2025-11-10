import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Resume, InterestItem } from "@shared/schema";
import { Heart, Plus, X } from "lucide-react";
import { nanoid } from "nanoid";

interface InterestsFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function InterestsForm({ resume, onUpdate }: InterestsFormProps) {
  const [showSection, setShowSection] = useState(resume.showInterests);
  const interests = (resume.interests as InterestItem[]) || [];

  const addInterest = (interestName: string) => {
    if (interestName.trim()) {
      const newInterest: InterestItem = {
        id: nanoid(),
        interest: interestName.trim(),
      };
      onUpdate({ interests: [...interests, newInterest] as any });
    }
  };

  const removeInterest = (id: string) => {
    const updated = interests.filter((interest) => interest.id !== id);
    onUpdate({ interests: updated as any });
  };

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showInterests: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Interests & Hobbies
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-interests"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map((interest, index) => (
                <Badge
                  key={interest.id}
                  variant="secondary"
                  className="gap-1"
                  data-testid={`badge-interest-${index}`}
                >
                  {interest.interest}
                  <button
                    onClick={() => removeInterest(interest.id)}
                    className="ml-1 hover:text-destructive"
                    data-testid={`button-remove-interest-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Type an interest and press Enter (e.g., Photography, Hiking)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.currentTarget;
                  addInterest(input.value);
                  input.value = "";
                }
              }}
              data-testid="input-add-interest"
            />
            <p className="text-xs text-muted-foreground">
              Press Enter to add an interest
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
