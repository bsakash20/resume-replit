import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Check } from "lucide-react";

interface TemplateSelectorProps {
  currentTemplate: string;
  onTemplateChange: (template: string) => void;
}

export function TemplateSelector({ currentTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    { id: "classic", name: "Classic", description: "Traditional format" },
    { id: "modern", name: "Modern", description: "Contemporary design" },
    { id: "minimalist", name: "Minimalist", description: "Simple and elegant" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-testid="button-template-selector"
          className="hover-elevate active-elevate-2"
        >
          <FileText className="w-4 h-4 mr-2" />
          Template: {templates.find((t) => t.id === currentTemplate)?.name || "Classic"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {templates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className="flex items-start gap-3 p-3"
            data-testid={`menu-template-${template.id}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{template.name}</span>
                {currentTemplate === template.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
