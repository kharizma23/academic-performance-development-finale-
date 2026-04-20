const FLASK_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://127.0.0.1:8001/api";

interface PlacementOverview {
  total_students: number;
  eligible_students: number;
  placed_students: number;
  placement_percentage: number;
  average_package: number;
  highest_package: number;
  companies_hiring: number;
}

interface StudentPlacementProfile {
  name: string;
  roll_number: string;
  department: string;
  year: number;
  email: string;
  readiness: {
    cgpa: number;
    career_readiness: number;
    readiness_score: number;
    status: string;
  };
  eligible_companies: Array<{
    company: string;
    minCGPA: number;
    matchPercentage: number;
    requiredSkills: string[];
    placementProbability: number;
  }>;
  skills_proficiency: Record<string, number>;
  skill_gaps: string[];
  mock_test_score: {
    aptitude: number;
    coding: number;
    communication: number;
  };
  interview_rounds_cleared: number;
  offers_received: number;
  training_recommendations: string[];
}

interface CompanyEligibility {
  company: string;
  total_eligible: number;
  students: Array<{
    id: string;
    name: string;
    roll_number: string;
    department: string;
    cgpa: number;
    readiness_score: number;
    match_percentage: number;
    placement_probability: number;
  }>;
  company_details: {
    min_cgpa: number;
    required_skills: string[];
    min_readiness: number;
  };
}

interface PlacementStudent {
  id: string;
  name: string;
  roll_number: string;
  department: string;
  year: number;
  cgpa: number;
  readiness_score: number;
  eligible_companies: number;
  top_match: string;
  placement_probability: number;
  status: string;
}

export const placementAPI = {
  async getOverview(): Promise<PlacementOverview> {
    const res = await fetch(`${FLASK_URL}/placement/overview`);
    if (!res.ok) throw new Error("Failed to fetch overview");
    return res.json();
  },

  async getStudentProfile(studentId: string): Promise<StudentPlacementProfile> {
    const res = await fetch(`${FLASK_URL}/placement/student/${studentId}`);
    if (!res.ok) throw new Error(`Failed to fetch student profile: ${studentId}`);
    return res.json();
  },

  async getCompanyEligible(companyName: string): Promise<CompanyEligibility> {
    const res = await fetch(`${FLASK_URL}/placement/company/${encodeURIComponent(companyName)}`);
    if (!res.ok) throw new Error(`Failed to fetch company data: ${companyName}`);
    return res.json();
  },

  async getPlacementInsights(): Promise<{ insights: string[] }> {
    const res = await fetch(`${FLASK_URL}/placement/insights`);
    if (!res.ok) throw new Error("Failed to fetch insights");
    return res.json();
  },

  async getPlacedStudents(): Promise<{ total_placed: number; placed_students: Array<any> }> {
    const res = await fetch(`${FLASK_URL}/placement/placed-students`);
    if (!res.ok) throw new Error("Failed to fetch placed students");
    return res.json();
  },

  async getSkillGap(studentId: string): Promise<any> {
    const res = await fetch(`${FLASK_URL}/placement/skills-gap/${studentId}`);
    if (!res.ok) throw new Error(`Failed to fetch skill gap: ${studentId}`);
    return res.json();
  },

  async getPrediction(studentId: string): Promise<any> {
    const res = await fetch(`${FLASK_URL}/placement/prediction/${studentId}`);
    if (!res.ok) throw new Error(`Failed to fetch prediction: ${studentId}`);
    return res.json();
  },

  async getInterviewTracking(): Promise<any> {
    const res = await fetch(`${FLASK_URL}/placement/interview-tracking`);
    if (!res.ok) throw new Error("Failed to fetch interview tracking");
    return res.json();
  },

  async getCompaniesList(): Promise<Array<any>> {
    const res = await fetch(`${FLASK_URL}/placement/companies-list`);
    if (!res.ok) throw new Error("Failed to fetch companies list");
    return res.json();
  },

  async getPlacementRanking(): Promise<any> {
    const res = await fetch(`${FLASK_URL}/placement/ranking`);
    if (!res.ok) throw new Error("Failed to fetch ranking");
    return res.json();
  },

  async getAllPlacementStudents(): Promise<{ total: number; students: PlacementStudent[] }> {
    const res = await fetch(`${FLASK_URL}/placement/all-students`);
    if (!res.ok) throw new Error("Failed to fetch placement students");
    return res.json();
  }
};
