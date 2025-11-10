import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Resume, AchievementItem } from "@shared/schema";
import { Trophy, Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";

interface AchievementsFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function AchievementsForm({ resume, onUpdate }: AchievementsFormProps) {
  const [showSection, setShowSection] = useState(resume.showAchievements);
  const achievements = (resume.achievements as AchievementItem[]) || [];

  const addAchievement = () => {
    const newAchievement: AchievementItem = {
      id: nanoid(),
      title: "",
      description: "",
      date: "",
    };
    onUpdate({ achievements: [...achievements, newAchievement] as any });
  };

  const updateAchievement = (id: string, field: keyof AchievementItem, value: any) => {
    const updated = achievements.map((ach) =>
      ach.id === id ? { ...ach, [field]: value } : ach
    );
    onUpdate({ achievements: updated as any });
  };

  const removeAchievement = (id: string) => {
    const updated = achievements.filter((ach) => ach.id !== id);
    onUpdate({ achievements: updated as any });
  };

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showAchievements: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-achievements"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-6">
          {achievements.map((achievement, index) => (
            <div key={achievement.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Achievement #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAchievement(achievement.id)}
                  data-testid={`button-remove-achievement-${index}`}
                  className="hover-elevate active-elevate-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Achievement Title</Label>
                  <Input
                    value={achievement.title}
                    onChange={(e) => updateAchievement(achievement.id, "title", e.target.value)}
                    placeholder="Top Performer of the Year"
                    data-testid={`input-achievement-title-${index}`}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={achievement.description}
                    onChange={(e) => updateAchievement(achievement.id, "description", e.target.value)}
                    placeholder="Describe the achievement and its impact..."
                    rows={3}
                    data-testid={`textarea-achievement-description-${index}`}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date (Optional)</Label>
                  <Input
                    type="month"
                    value={achievement.date || ""}
                    onChange={(e) => updateAchievement(achievement.id, "date", e.target.value)}
                    data-testid={`input-achievement-date-${index}`}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addAchievement}
            className="w-full hover-elevate active-elevate-2"
            data-testid="button-add-achievement"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
