import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FileText,
  Plus,
  Sparkles,
  MoreVertical,
  Trash2,
  Copy,
  Download,
  Edit,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Resume, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: resumes, isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/resumes", {
        title: "Untitled Resume",
        template: "classic",
      });
      return await response.json();
    },
    onSuccess: (data: Resume) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      setLocation(`/editor/${data.id}`);
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
        description: "Failed to create resume",
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return await apiRequest("POST", `/api/resumes/${resumeId}/duplicate`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume duplicated successfully",
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
        description: "Failed to duplicate resume",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return await apiRequest("DELETE", `/api/resumes/${resumeId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume deleted successfully",
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
        description: "Failed to delete resume",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">ResumeAI</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                {user?.aiCredits || 0} AI Credits
              </Badge>
              {user?.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                  Premium
                </Badge>
              )}
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout"
              className="hover-elevate active-elevate-2"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <CardContent className="p-0 space-y-2">
              <p className="text-sm text-muted-foreground">Total Resumes</p>
              <p className="text-3xl font-bold">{resumes?.length || 0}</p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0 space-y-2">
              <p className="text-sm text-muted-foreground">AI Credits</p>
              <p className="text-3xl font-bold">{user?.aiCredits || 0}</p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0 space-y-2">
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="text-3xl font-bold">{user?.isPremium ? "Premium" : "Free"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
            <p className="text-muted-foreground">
              Create and manage your professional resumes
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            data-testid="button-create-resume"
            className="hover-elevate active-elevate-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Creating..." : "New Resume"}
          </Button>
        </div>

        {/* Resumes Grid */}
        {resumesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : resumes && resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className="group hover-elevate cursor-pointer"
                onClick={() => setLocation(`/editor/${resume.id}`)}
                data-testid={`card-resume-${resume.id}`}
              >
                <CardHeader className="space-y-0 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate mb-1">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Updated {formatDate(resume.updatedAt)}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover-elevate active-elevate-2"
                          data-testid={`button-resume-menu-${resume.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/editor/${resume.id}`);
                          }}
                          data-testid={`menu-edit-${resume.id}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateMutation.mutate(resume.id);
                          }}
                          data-testid={`menu-duplicate-${resume.id}`}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement download
                          }}
                          data-testid={`menu-download-${resume.id}`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this resume?")) {
                              deleteMutation.mutate(resume.id);
                            }
                          }}
                          className="text-destructive focus:text-destructive"
                          data-testid={`menu-delete-${resume.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary/40" />
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Badge variant="secondary" className="capitalize">
                    {resume.template}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CardContent className="p-0 space-y-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No resumes yet</h3>
                <p className="text-muted-foreground">
                  Create your first resume to get started
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
                data-testid="button-create-first-resume"
                className="hover-elevate active-elevate-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upgrade CTA for Free Users */}
        {!user?.isPremium && (
          <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Upgrade to Premium
                </h3>
                <p className="text-muted-foreground">
                  Get unlimited AI generations, premium templates, and priority support
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setLocation("/pricing")}
                data-testid="button-upgrade"
                className="hover-elevate active-elevate-2 whitespace-nowrap"
              >
                View Plans
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
