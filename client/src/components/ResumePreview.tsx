import type { Resume, ExperienceItem, EducationItem, SkillItem, ProjectItem, CertificationItem, AchievementItem, LanguageItem, InterestItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const renderClassicTemplate = () => (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-12 shadow-2xl rounded-lg min-h-[800px]">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 dark:border-gray-100 pb-6 mb-6">
        <h1 className="text-4xl font-bold mb-2">{resume.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>•</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>•</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm mt-2">
          {resume.website && <span>{resume.website}</span>}
          {resume.linkedin && <span>•</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
          {resume.github && <span>•</span>}
          {resume.github && <span>{resume.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.showSummary && resume.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.showExperience && (resume.experience as ExperienceItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Experience</h2>
          {(resume.experience as ExperienceItem[]).map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-base">{exp.position}</h3>
                  <p className="text-sm">{exp.company}{exp.location && `, ${exp.location}`}</p>
                </div>
                <p className="text-sm whitespace-nowrap">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate || "")}
                </p>
              </div>
              {exp.description && (
                <div className="text-sm whitespace-pre-line">{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.showEducation && (resume.education as EducationItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Education</h2>
          {(resume.education as EducationItem[]).map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-base">{edu.institution}</h3>
                  <p className="text-sm">{edu.degree} in {edu.field}</p>
                  {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                </div>
                <p className="text-sm whitespace-nowrap">
                  {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate || "")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.showSkills && (resume.skills as SkillItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Skills</h2>
          {(resume.skills as SkillItem[]).map((category) => (
            <div key={category.id} className="mb-2">
              <p className="text-sm">
                <span className="font-semibold">{category.category}:</span> {category.skills.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.showProjects && (resume.projects as ProjectItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Projects</h2>
          {(resume.projects as ProjectItem[]).map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-bold text-base">{project.name}</h3>
              {project.description && <p className="text-sm mb-1">{project.description}</p>}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-sm"><span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.showCertifications && (resume.certifications as CertificationItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Certifications</h2>
          {(resume.certifications as CertificationItem[]).map((cert) => (
            <div key={cert.id} className="mb-2">
              <p className="text-sm"><span className="font-semibold">{cert.name}</span> - {cert.issuer} ({formatDate(cert.date)})</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {resume.showAchievements && (resume.achievements as AchievementItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Achievements</h2>
          {(resume.achievements as AchievementItem[]).map((achievement) => (
            <div key={achievement.id} className="mb-2">
              <p className="text-sm font-semibold">{achievement.title}</p>
              {achievement.description && <p className="text-sm">{achievement.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {resume.showLanguages && (resume.languages as LanguageItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Languages</h2>
          <p className="text-sm">
            {(resume.languages as LanguageItem[]).map((lang) => `${lang.language} (${lang.proficiency})`).join(", ")}
          </p>
        </div>
      )}

      {/* Interests */}
      {resume.showInterests && (resume.interests as InterestItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Interests</h2>
          <p className="text-sm">
            {(resume.interests as InterestItem[]).map((interest) => interest.interest).join(", ")}
          </p>
        </div>
      )}
    </div>
  );

  const renderModernTemplate = () => (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-12 shadow-2xl rounded-lg min-h-[800px]">
      {/* Header with Accent */}
      <div className="bg-blue-600 text-white p-8 -m-12 mb-8 rounded-t-lg">
        <h1 className="text-4xl font-bold mb-3">{resume.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-3 text-sm opacity-90">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>•</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>•</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </div>

      {/* Rest of content similar to classic but with modern styling */}
      {resume.showSummary && resume.summary && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">Summary</h2>
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience with modern cards */}
      {resume.showExperience && (resume.experience as ExperienceItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Experience</h2>
          {(resume.experience as ExperienceItem[]).map((exp) => (
            <div key={exp.id} className="mb-4 pl-4 border-l-4 border-blue-600 dark:border-blue-400">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate || "")}
                </p>
              </div>
              {exp.description && (
                <div className="text-sm mt-2 whitespace-pre-line">{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Continue with similar modern styling for other sections */}
      {resume.showEducation && (resume.education as EducationItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Education</h2>
          {(resume.education as EducationItem[]).map((edu) => (
            <div key={edu.id} className="mb-3 pl-4 border-l-4 border-blue-600 dark:border-blue-400">
              <h3 className="font-bold text-lg">{edu.institution}</h3>
              <p className="text-sm">{edu.degree} in {edu.field}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate || "")}
              </p>
            </div>
          ))}
        </div>
      )}

      {resume.showSkills && (resume.skills as SkillItem[]).length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(resume.skills as SkillItem[]).map((category) =>
              category.skills.map((skill, i) => (
                <Badge key={`${category.id}-${i}`} variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                  {skill}
                </Badge>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderMinimalistTemplate = () => (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-12 shadow-2xl rounded-lg min-h-[800px]">
      {/* Minimal Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-light mb-2">{resume.fullName || "Your Name"}</h1>
        <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </div>

      {/* Clean sections with minimal styling */}
      {resume.showSummary && resume.summary && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-3 text-gray-500 dark:text-gray-400">Summary</h2>
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {resume.showExperience && (resume.experience as ExperienceItem[]).length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 text-gray-500 dark:text-gray-400">Experience</h2>
          {(resume.experience as ExperienceItem[]).map((exp, index) => (
            <div key={exp.id} className={index > 0 ? "mt-6" : ""}>
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{exp.position} · {exp.company}</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate || "")}
                </span>
              </div>
              {exp.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {resume.showEducation && (resume.education as EducationItem[]).length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 text-gray-500 dark:text-gray-400">Education</h2>
          {(resume.education as EducationItem[]).map((edu) => (
            <div key={edu.id} className="flex justify-between">
              <div>
                <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate || "")}
              </span>
            </div>
          ))}
        </div>
      )}

      {resume.showSkills && (resume.skills as SkillItem[]).length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-3 text-gray-500 dark:text-gray-400">Skills</h2>
          {(resume.skills as SkillItem[]).map((category) => (
            <p key={category.id} className="text-sm mb-1">{category.skills.join(" · ")}</p>
          ))}
        </div>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (resume.template) {
      case "modern":
        return renderModernTemplate();
      case "minimalist":
        return renderMinimalistTemplate();
      case "classic":
      default:
        return renderClassicTemplate();
    }
  };

  return (
    <div className="w-full" data-testid="resume-preview">
      {renderTemplate()}
    </div>
  );
}
