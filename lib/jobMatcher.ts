export interface JobPreferences {
  roles?: string[];
  skills?: string[];
  locations?: string[];
  employmentTypes?: string[];
  preferredCompanies?: string[];
  minimumMatchScore?: number;
}

export interface CareerProfile {
  student?: Record<string, unknown>;
  report?: Record<string, unknown>;
}

export interface MatchableJob {
  jobTitle: string;
  company: string;
  location: string;
  employmentType: string;
  skills: string[];
}

export interface JobMatch {
  matchScore: number;
  matchedReasons: string[];
}

function normalized(value: string) {
  return value.trim().toLowerCase();
}

function includesMatch(value: string, choices: string[]) {
  const normalizedValue = normalized(value);
  return choices.some((choice) => normalizedValue.includes(normalized(choice)) || normalized(choice).includes(normalizedValue));
}

export function matchJob(job: MatchableJob, preferences: JobPreferences, career: CareerProfile = {}): JobMatch {
  const roles = preferences.roles || [];
  const skills = preferences.skills || [];
  const locations = preferences.locations || [];
  const employmentTypes = preferences.employmentTypes || [];
  const preferredCompanies = preferences.preferredCompanies || [];
  const reasons: string[] = [];
  let score = 0;

  if (roles.length && includesMatch(job.jobTitle, roles)) {
    score += 35;
    reasons.push("Matches your preferred role");
  }

  const careerSkills = [
    ...(Array.isArray(career.report?.matchedSkills) ? career.report.matchedSkills : []),
    ...(typeof career.student?.skills === "string" ? career.student.skills.split(",") : []),
  ].map(String);
  const desiredSkills = [...new Set([...skills, ...careerSkills])];
  const matchedSkills = job.skills.filter((skill) => includesMatch(skill, desiredSkills));
  if (desiredSkills.length) {
    score += Math.round(30 * (matchedSkills.length / Math.max(job.skills.length, 1)));
    if (matchedSkills.length) reasons.push(`Uses your preferred skills: ${matchedSkills.slice(0, 3).join(" and ")}`);
  }

  if (locations.length && includesMatch(job.location, locations)) {
    score += 15;
    reasons.push("Matches your preferred location");
  }

  if (employmentTypes.length && includesMatch(job.employmentType, employmentTypes)) {
    score += 10;
    reasons.push("Matches your preferred employment type");
  }

  if (preferredCompanies.length && includesMatch(job.company, preferredCompanies)) {
    score += 5;
    reasons.push("Matches a preferred company");
  }

  const readiness = Number(career.report?.readiness || 0);
  score += Math.round(Math.min(Math.max(readiness, 0), 100) * 0.1);

  return { matchScore: Math.min(score, 100), matchedReasons: reasons.length ? reasons : ["Aligned with your Career DNA"] };
}
