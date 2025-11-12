import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Target,
  Lightbulb,
  FileSearch
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface JobAnalysis {
  matchScore: number;
  overallAssessment: string;
  strengths: string[];
  missingKeywords: string[];
  skillsGap: string[];
  recommendations: string[];
  atsOptimization: string[];
}

interface JobAnalyzerProps {
  resumeId: string;
}

export function JobAnalyzer({ resumeId }: JobAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/resumes/${resumeId}/analyze-job`, {
        jobDescription,
      });
    },
    onSuccess: (data: JobAnalysis) => {
      setAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Analysis Complete!",
        description: `Match Score: ${data.matchScore}%`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste a job description to analyze",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" />
            Job Description
          </CardTitle>
          <CardDescription>
            Paste the job description you want to match your resume against
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the complete job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] resize-y"
            data-testid="textarea-job-description"
          />
          <Button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending || !jobDescription.trim()}
            className="w-full"
            data-testid="button-analyze-job"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {analyzeMutation.isPending ? "Analyzing..." : "Analyze Match"}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Match Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Match Score
                </span>
                <Badge variant="secondary" data-testid="badge-match-score">
                  {getScoreBadge(analysis.matchScore)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`text-5xl font-bold ${getScoreColor(analysis.matchScore)}`} data-testid="text-match-score">
                  {analysis.matchScore}%
                </div>
                <div className="flex-1">
                  <Progress value={analysis.matchScore} className="h-3" />
                </div>
              </div>
              <p className="text-muted-foreground" data-testid="text-overall-assessment">
                {analysis.overallAssessment}
              </p>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2" data-testid={`item-strength-${idx}`}>
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Missing Keywords & Skills Gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.missingKeywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Missing Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" data-testid={`badge-missing-keyword-${idx}`}>
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis.skillsGap.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    Skills Gap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skillsGap.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" data-testid={`badge-skill-gap-${idx}`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2" data-testid={`item-recommendation-${idx}`}>
                      <span className="text-primary font-semibold flex-shrink-0">
                        {idx + 1}.
                      </span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* ATS Optimization */}
          {analysis.atsOptimization.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  ATS Optimization Tips
                </CardTitle>
                <CardDescription>
                  Improve your chances of passing Applicant Tracking Systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.atsOptimization.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2" data-testid={`item-ats-tip-${idx}`}>
                      <span className="text-purple-600 flex-shrink-0">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
