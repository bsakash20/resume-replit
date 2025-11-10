import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Resume, CertificationItem } from "@shared/schema";
import { Award, Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";

interface CertificationsFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function CertificationsForm({ resume, onUpdate }: CertificationsFormProps) {
  const [showSection, setShowSection] = useState(resume.showCertifications);
  const certifications = (resume.certifications as CertificationItem[]) || [];

  const addCertification = () => {
    const newCert: CertificationItem = {
      id: nanoid(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onUpdate({ certifications: [...certifications, newCert] as any });
  };

  const updateCertification = (id: string, field: keyof CertificationItem, value: any) => {
    const updated = certifications.map((cert) =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    onUpdate({ certifications: updated as any });
  };

  const removeCertification = (id: string) => {
    const updated = certifications.filter((cert) => cert.id !== id);
    onUpdate({ certifications: updated as any });
  };

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showCertifications: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certifications
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-certifications"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-6">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Certification #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                  data-testid={`button-remove-certification-${index}`}
                  className="hover-elevate active-elevate-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    data-testid={`input-certification-name-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Issuing Organization</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                    placeholder="Amazon Web Services"
                    data-testid={`input-certification-issuer-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date Obtained</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                    data-testid={`input-certification-date-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Credential URL (Optional)</Label>
                  <Input
                    value={cert.url || ""}
                    onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                    placeholder="https://credential.url"
                    data-testid={`input-certification-url-${index}`}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addCertification}
            className="w-full hover-elevate active-elevate-2"
            data-testid="button-add-certification"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
