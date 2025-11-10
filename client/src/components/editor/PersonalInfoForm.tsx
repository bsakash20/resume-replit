import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Resume } from "@shared/schema";
import { User } from "lucide-react";

interface PersonalInfoFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function PersonalInfoForm({ resume, onUpdate }: PersonalInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={resume.fullName || ""}
              onChange={(e) => onUpdate({ fullName: e.target.value })}
              placeholder="John Doe"
              data-testid="input-full-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={resume.email || ""}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="john@example.com"
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={resume.phone || ""}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              data-testid="input-phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={resume.location || ""}
              onChange={(e) => onUpdate({ location: e.target.value })}
              placeholder="San Francisco, CA"
              data-testid="input-location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={resume.website || ""}
              onChange={(e) => onUpdate({ website: e.target.value })}
              placeholder="https://johndoe.com"
              data-testid="input-website"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={resume.linkedin || ""}
              onChange={(e) => onUpdate({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/johndoe"
              data-testid="input-linkedin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={resume.github || ""}
              onChange={(e) => onUpdate({ github: e.target.value })}
              placeholder="github.com/johndoe"
              data-testid="input-github"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
