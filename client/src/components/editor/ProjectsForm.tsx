import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Resume, ProjectItem } from "@shared/schema";
import { FolderGit2, Plus, Trash2, X } from "lucide-react";
import { nanoid } from "nanoid";
import { Separator } from "@/components/ui/separator";

interface ProjectsFormProps {
  resume: Resume;
  onUpdate: (data: Partial<Resume>) => void;
}

export function ProjectsForm({ resume, onUpdate }: ProjectsFormProps) {
  const [showSection, setShowSection] = useState(resume.showProjects);
  const projects = (resume.projects as ProjectItem[]) || [];

  const addProject = () => {
    const newProject: ProjectItem = {
      id: nanoid(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
    };
    onUpdate({ projects: [...projects, newProject] as any });
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    const updated = projects.map((proj) =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onUpdate({ projects: updated as any });
  };

  const removeProject = (id: string) => {
    const updated = projects.filter((proj) => proj.id !== id);
    onUpdate({ projects: updated as any });
  };

  const addTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && tech.trim()) {
      const technologies = project.technologies || [];
      updateProject(projectId, "technologies", [...technologies, tech.trim()]);
    }
  };

  const removeTechnology = (projectId: string, techIndex: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && project.technologies) {
      const updated = project.technologies.filter((_, i) => i !== techIndex);
      updateProject(projectId, "technologies", updated);
    }
  };

  const handleToggle = (checked: boolean) => {
    setShowSection(checked);
    onUpdate({ showProjects: checked });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5" />
            Projects
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSection}
              onCheckedChange={handleToggle}
              data-testid="toggle-projects"
            />
            <Label className="text-sm">Show</Label>
          </div>
        </div>
      </CardHeader>
      {showSection && (
        <CardContent className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Project #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  data-testid={`button-remove-project-${index}`}
                  className="hover-elevate active-elevate-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(project.id, "name", e.target.value)}
                    placeholder="My Awesome Project"
                    data-testid={`input-project-name-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL (Optional)</Label>
                  <Input
                    value={project.url || ""}
                    onChange={(e) => updateProject(project.id, "url", e.target.value)}
                    placeholder="https://github.com/username/project"
                    data-testid={`input-project-url-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date (Optional)</Label>
                  <Input
                    type="month"
                    value={project.startDate || ""}
                    onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                    data-testid={`input-project-start-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input
                    type="month"
                    value={project.endDate || ""}
                    onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                    data-testid={`input-project-end-${index}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="Describe what the project does and your key contributions..."
                  rows={4}
                  data-testid={`textarea-project-description-${index}`}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(project.technologies || []).map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="gap-1"
                      data-testid={`badge-project-tech-${index}-${techIndex}`}
                    >
                      {tech}
                      <button
                        onClick={() => removeTechnology(project.id, techIndex)}
                        className="ml-1 hover:text-destructive"
                        data-testid={`button-remove-project-tech-${index}-${techIndex}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Type a technology and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addTechnology(project.id, input.value);
                      input.value = "";
                    }
                  }}
                  data-testid={`input-add-project-tech-${index}`}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter to add a technology
                </p>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addProject}
            className="w-full hover-elevate active-elevate-2"
            data-testid="button-add-project"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
