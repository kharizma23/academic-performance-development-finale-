from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: Optional[str] = None
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class User(UserBase):
    full_name: Optional[str] = None
    institutional_email: Optional[str] = None
    plain_password: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

class StudentBase(BaseModel):
    department: Optional[str] = None
    year: Optional[int] = None
    section: Optional[str] = None
    previous_school: Optional[str] = None

class StudentCreate(StudentBase):
    full_name: str
    personal_email: EmailStr
    dob: str
    blood_group: str
    parent_phone: str = Field(..., pattern=r"^\+?1?\d{9,15}$")
    personal_phone: str = Field(..., pattern=r"^\+?1?\d{9,15}$")
    password: Optional[str] = None
    current_cgpa: Optional[float] = 0.0 # Added to support immediate AI generation

class Student(StudentBase):
    id: Optional[str] = None
    user_id: Optional[str] = None
    name: Optional[str] = None
    roll_number: Optional[str] = None
    dob: Optional[str] = None
    blood_group: Optional[str] = None
    parent_phone: Optional[str] = None
    personal_phone: Optional[str] = None
    personal_email: Optional[str] = None
    alternate_email: Optional[str] = None
    previous_school: Optional[str] = None
    gender: Optional[str] = None
    current_cgpa: float = 0.0
    academic_dna_score: float = 0.0
    growth_index: float = 0.0
    risk_level: str = "Stable"
    career_readiness_score: float = 0.0
    weakness: Optional[str] = None
    admin_notes: Optional[str] = None 
    full_name: Optional[str] = None
    ai_scores: Optional["AIScore"] = None
    user: Optional[User] = None
    
    # --- Deep Profiling Fields ---
    school_11th: Optional[str] = None
    school_12th: Optional[str] = None
    cutoff_12th: Optional[float] = None
    area_of_interest: Optional[str] = None
    cgpa_trend: Optional[List[float]] = None
    ai_suggestion: Optional[str] = None
    faculty_feedback: Optional[str] = None
    placement_analysis: Optional[str] = None
    weak_areas: Optional[str] = None
    subject_performance: List[dict] = []
    
    # --- New Intelligence Fields ---
    father_name: Optional[str] = None
    father_phone: Optional[str] = None
    mother_name: Optional[str] = None
    mother_phone: Optional[str] = None
    location: Optional[str] = None
    backlog_details: Optional[str] = None
    risk_reason: Optional[str] = None
    attendance_percentage: float = 85.0
    xp_points: int = 0
    streak_count: int = 0
    coding_score: float = 75.0
    aptitude_score: float = 80.0
    communication_score: float = 85.0
    eligible_companies: List[str] = ["Google", "Amazon", "Zoho", "Freshworks"]
    
    # Documents
    resume_url: Optional[str] = None
    certificates: Optional[str] = None
    
    # Notifications
    notifications_test: bool = True
    notifications_placement: bool = True
    notifications_ai: bool = True
    
    # Status
    last_login: Optional[datetime] = None
    login_device: Optional[str] = None
    is_first_login: bool = True

    class Config:
        from_attributes = True

class StudentSearchResponse(BaseModel):
    total: int
    students: List[Student]
    page: int
    pages: int

class AcademicRecordBase(BaseModel):
    semester: int
    subject: str
    internal_marks: float
    external_marks: float
    attendance_percentage: float

class AcademicRecordCreate(AcademicRecordBase):
    pass

class AcademicRecord(AcademicRecordBase):
    id: str
    student_id: str
    grade: Optional[str] = None

    class Config:
        from_attributes = True

class AIScoreBase(BaseModel):
    consistency_index: float
    performance_volatility: float
    cgpa_prediction: float
    risk_probability: float
    skill_gap_score: float
    career_suggestions: Optional[str] = None
    recommended_courses: Optional[str] = None

class AIScore(AIScoreBase):
    student_id: str

    class Config:
        from_attributes = True

class FeedbackBase(BaseModel):
    student_id: str
    q1_technical_clarity: float = 0.0
    q2_problem_solving: float = 0.0
    q3_code_efficiency: float = 0.0
    q4_algorithm_knowledge: float = 0.0
    q5_debugging_skills: float = 0.0
    q6_concept_application: float = 0.0
    q7_mathematical_aptitude: float = 0.0
    q8_system_design: float = 0.0
    q9_documentation_quality: float = 0.0
    q10_test_coverage_awareness: float = 0.0
    q11_presentation_skills: float = 0.0
    q12_collaborative_spirit: float = 0.0
    q13_adaptability: float = 0.0
    q14_curiosity_level: float = 0.0
    q15_deadline_discipline: float = 0.0
    q16_resourcefulness: float = 0.0
    q17_critical_thinking: float = 0.0
    q18_puncuality: float = 0.0
    q19_peer_mentoring: float = 0.0
    q20_leadership_potential: float = 0.0
    q21_ethical_awareness: float = 0.0
    q22_feedback_receptivity: float = 0.0
    q23_passion_for_field: float = 0.0
    q24_originality_of_ideas: float = 0.0
    q25_consistency_index: float = 0.0
    detailed_remarks: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: str
    faculty_id: str
    faculty_name: Optional[str] = None
    overall_rating: float
    created_at: str # will be converted from datetime

    class Config:
        from_attributes = True

class TodoBase(BaseModel):
    task_name: str
    priority: str = "Medium"
    status: str = "Not Started"
    difficulty: str = "Medium"
    due_date: Optional[datetime] = None # Support both datetime objects and ISO strings

class ProfileUpdate(BaseModel):
    phone_number: Optional[str] = None
    personal_email: Optional[str] = None
    alternate_email: Optional[str] = None
    location: Optional[str] = None
    notifications_test: Optional[bool] = None
    notifications_placement: Optional[bool] = None
    notifications_ai: Optional[bool] = None
    avatar_url: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None

class Todo(TodoBase):
    id: str
    is_completed: bool
    start_time: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    time_spent: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StudyPlanBase(BaseModel):
    day_number: int
    topic: str
    sub_tasks: Optional[str] = None

class StudyPlan(StudyPlanBase):
    id: str
    is_completed: bool
    is_rescheduled: bool = False
    actual_date: Optional[datetime] = None
    completed_tasks: List[Todo] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Assuming UserDetail and Skill are new schemas that need to be defined for StudentDetail to be valid.
# Adding placeholder definitions for UserDetail and Skill to ensure syntactic correctness.
class UserDetail(User):
    class Config:
        from_attributes = True

class Skill(BaseModel):
    id: str
    skill_name: str
    proficiency_level: int
    category: Optional[str] = None

    class Config:
        from_attributes = True

class StudentDetail(Student):
    id: str
    user: UserDetail
    academic_records: List[AcademicRecord] = []
    ai_scores: Optional[AIScore] = None
    skills: List[Skill] = []
    feedback: List[Feedback] = []
    xp_points: int = 0
    streak_count: int = 0

    class Config:
        from_attributes = True

class StaffBase(BaseModel):
    department: Optional[str] = None
    designation: Optional[str] = None
    be_degree: Optional[str] = None
    be_college: Optional[str] = None
    me_degree: Optional[str] = None
    me_college: Optional[str] = None
    primary_skill: Optional[str] = None
    projects_completed: int = 0
    publications_count: int = 0
    consistency_score: float = 0.0
    student_feedback_rating: float = 0.0
    personal_email: Optional[str] = None
    personal_phone: Optional[str] = None

class StaffCreate(StaffBase):
    full_name: str
    personal_email: EmailStr
    password: Optional[str] = None
    staff_id: Optional[str] = None # Allow manual override

class Staff(StaffBase):
    id: Optional[str] = None
    user_id: Optional[str] = None
    staff_id: Optional[str] = None
    name: Optional[str] = None
    full_name: Optional[str] = None
    user: Optional[User] = None

    class Config:
        from_attributes = True


class StaffDetail(Staff):
    user: User
    teaching_impact_score: float = 0.0
    improvement_index: float = 0.0
    difficulty_handling: float = 0.0
    feedback_sentiment: str = "Neutral"
    impact_trends: List[float] = [] # Monthly tracking
    ai_pedagogical_suggestion: Optional[str] = None

# --- Advanced Dashboard Analytics ---

class InstitutionalStats(BaseModel):
    total_students: int
    active_students: int
    placement_readiness_avg: float
    dna_score: float
    avg_cgpa: float # Standard 0-10 scaled node
    risk_ratio: float
    avg_growth_index: float

class EarlyWarningStats(BaseModel):
    high_risk_count: int
    medium_risk_count: int
    low_risk_percent: float
    dropout_probability_next_6m: float

class PerformanceCluster(BaseModel):
    name: str # High Achievers, Stable Performers, etc.
    count: int
    percentage: float
    description: str

class DeptPerformanceRank(BaseModel):
    department: str
    avg_cgpa: float
    avg_growth: float
    placement_readiness: float
    skill_score: float
    risk_percent: float
    overall_rank: int

class PlacementForecast(BaseModel):
    forecast_placement_percent: float
    core_vs_it_ratio: str
    avg_career_readiness: float
    skill_gap_avg: float

class FacultyImpactRank(BaseModel):
    name: str
    dept: str
    feedback_consistency: float
    improvement_impact: float
    impact_score: float

class ResourceOptimization(BaseModel):
    faculty_load_percent: float
    lab_utilization_percent: float
    remedial_need_percent: float
    coaching_demand: str

class ActionPlanStrategy(BaseModel):
    label: str
    detail: str

class ActionPlanStep(BaseModel):
    title: str
    detail: str

class DynamicActionPlan(BaseModel):
    executive_summary: str
    roi_efficiency: str
    strategies: List[ActionPlanStrategy]
    resource_label: str
    resource_value: str
    roadmap: List[ActionPlanStep]
    insight_quote: str

class AIAnomaly(BaseModel):
    type: str
    detail: str
    priority: str # 'high' or 'medium'

class DashboardOverview(BaseModel):
    institutional: InstitutionalStats
    early_warning: EarlyWarningStats
    performance_clusters: List[PerformanceCluster]
    department_ranking: List[DeptPerformanceRank]
    placement_forecast: PlacementForecast
    faculty_impact: List[FacultyImpactRank]
    resource_opt: ResourceOptimization
    weekly_insight: str
    action_plan: DynamicActionPlan
    ai_anomalies: List[AIAnomaly] = []

class RemedialAssessmentBase(BaseModel):
    subject: str

class RemedialAssessmentCreate(RemedialAssessmentBase):
    student_ids: List[str]

class RemedialAssessment(RemedialAssessmentBase):
    id: str
    student_id: str
    assigned_at: str
    status: str
    admin_id: str

    class Config:
        from_attributes = True

# --- NEW: Departmental Intelligence Schemas ---

class DeptOverviewMetrics(BaseModel):
    total_students: int
    avg_cgpa: float
    placement_readiness: float # Overall
    coding_readiness: float
    communication_readiness: float
    core_skill_depth: float
    risk_index: float
    core_performance: float
    ai_health_score: float
    stability_indicator: str # "Stable", "Monitoring", "Intervention Needed"
    # New Fields
    dropout_probability_forecast: float
    placement_forecast_percent: float
    skill_gap_index_core_it: float
    total_faculty: int
    hod_name: str

class SubjectPerformance(BaseModel):
    subject_name: str
    pass_percentage: float
    failure_density: float # For graph
    is_most_difficult: bool
    skill_gap_score: float # For heatmap
    dependency_risk_text: Optional[str] = None # e.g. "Math weak -> ML Impact"
    # New Fields
    is_core: bool
    backlog_rate: float
    internal_external_gap: float

class FacultyIntelligence(BaseModel):
    faculty_name: str
    teaching_impact_score: float
    student_improvement_index: float
    subject_difficulty_handling: float
    feedback_sentiment: str # Positive/Neutral/Negative
    attendance_influence_percent: float
    ai_suggestion: Optional[str] = None # e.g. "Assign DBMS next semester"
    # New Fields
    feedback_summary_ai: str
    subject_comparison_score: float

class DeptStudentMicroSegment(BaseModel):
    cluster_name: str # High Achievers, Stable, Improving, Critical Zone
    count: int
    core_weak_count: int
    aptitude_weak_count: int
    attendance_risk_count: int
    emotional_stress_risk_count: int
    trend_change: str # e.g. "+5% from last sem"

class DeptDropoutProbability(BaseModel):
    region_label: str # Semantic label representing a group/subject
    probability_percent: float

class TrendForecast(BaseModel):
    year: str
    avg_cgpa: float

class DeptTrendAndForecast(BaseModel):
    cgpa_trend_3yr: List[TrendForecast]
    placement_trend_forecast: float
    next_semester_risk_prediction: float
    lab_utilization_correlation: str # e.g. "High positive correlation"
    ai_insight: str # e.g. "If internal marks increase by 5%..."

class DeptInterventionRecommendation(BaseModel):
    remedial_class_list: List[str] # Subjects
    bootcamp_recommendation: str
    faculty_reallocation_suggestion: str
    lab_hour_increase_suggestion: str
    syllabus_adjustment: str

class DeptResourceOptimization(BaseModel):
    faculty_load_balance: float # Percentage
    lab_usage_percent: float
    subject_allocation_efficiency: float
    elective_demand_forecast: str

class DeptAdvancedAIFeatures(BaseModel):
    digital_twin_simulation_ready: bool
    skill_evolution_trend: float # % improvement over time
    ai_risk_alert_feed: List[str]
    # New Fields
    graduation_rate: float
    avg_time_to_placement: float
    higher_studies_percent: float
    startup_founders_count: int
    research_paper_count: int

class DeptVsInstitution(BaseModel):
    metric: str
    dept_value: float
    inst_value: float

class WeeklyIntelligenceReport(BaseModel):
    summary: str
    recommendation: str
    generated_at: str

class RoadmapCreate(BaseModel):
    goal: str

class DepartmentOverview(BaseModel):
    department_name: str
    metrics: DeptOverviewMetrics
    subjects: List[SubjectPerformance]
    faculty: List[FacultyIntelligence]
    micro_segments: List[DeptStudentMicroSegment]
    dropout_probability_map: List[DeptDropoutProbability]
    trends: DeptTrendAndForecast
    intervention_engine: DeptInterventionRecommendation
    resource_opt: DeptResourceOptimization
    advanced_ai: DeptAdvancedAIFeatures
    # New: Sections 8 & 9
    weekly_report: WeeklyIntelligenceReport
    comparative_analysis: List[DeptVsInstitution]

# --- Predictive Analysis Schemas ---

class PredictedRank(BaseModel):
    rank: int
    student_id: str
    student_name: str
    predicted_cgpa: float

class PerformanceTrend(BaseModel):
    semester: str
    cgpa: float
    is_predicted: bool

class SubjectSkill(BaseModel):
    subject: str
    score: float

class AcademicActivity(BaseModel):
    category: str
    score: float

class PerformancePoint(BaseModel):
    week: str
    performance_score: float

class TopStudent(BaseModel):
    rank: int
    name: str
    cgpa: float

class ScoreDistribution(BaseModel):
    range: str
    count: int

class DepartmentReportData(BaseModel):
    department_name: str
    current_week: str
    total_students: int
    avg_cgpa: float
    avg_attendance: float
    assignment_submission_rate: float
    performance_trend: List[PerformancePoint]
    top_students: List[TopStudent]
    score_distribution: List[ScoreDistribution]
    predicted_top_student: str
    predicted_avg_cgpa: float
    struggling_subjects: List[str]
    attendance_alerts: List[str]
    academic_health_score: float
    academic_health_status: str

class StudentPredictionInsight(BaseModel):
    student_id: str
    student_name: str
    performance_trend: List[PerformanceTrend]
    subject_skills: List[SubjectSkill]
    academic_activities: List[AcademicActivity]
    rank_probability: float

# --- MODULE 1: FEEDBACK ANALYTICS ---
class SentimentScore(BaseModel):
    positive: float
    neutral: float
    negative: float

class FacultyRating(BaseModel):
    name: str
    rating: float
    feedback_count: int

class FeedbackTrend(BaseModel):
    month: str
    rating: float

class ActionRecommendation(BaseModel):
    category: str
    suggestion: str
    priority: str # High, Medium, Low

class FeedbackAnalytics(BaseModel):
    total_feedbacks: int
    avg_rating: float
    sentiment: SentimentScore
    faculty_ratings: List[FacultyRating]
    trends: List[FeedbackTrend]
    ai_recommendations: List[ActionRecommendation]

# --- MODULE 2: WEEKLY REPORTS ---
class WeeklyReportSummary(BaseModel):
    week_number: int
    start_date: str
    end_date: str
    academic_performance: float
    attendance_rate: float
    syllabus_completion: float
    ai_summary: str
    performance_vs_last_week: float # Delta

class WeeklyReportData(BaseModel):
    reports: List[WeeklyReportSummary]
    department_stats: List[dict] # Simplified for now

class StaffSearchResponse(BaseModel):
    total: int
    staff: List[Staff]
    page: int
    pages: int

# --- MODULE 3: ATTENDANCE INTELLIGENCE ---
class StudentAttendance(BaseModel):
    id: str
    name: str
    percentage: float
    status: str # "Stable", "Warning", "Critical"

class AttendanceHeatmap(BaseModel):
    subject: str
    attendance: float

class AttendancePrediction(BaseModel):
    student_id: str
    predicted_drop_percent: float
    risk_level: str

class AttendanceIntelligence(BaseModel):
    overall_percentage: float
    high_risk_count: int
    heatmap: List[AttendanceHeatmap]
    predictions: List[AttendancePrediction]
    student_list: List[StudentAttendance]

# --- MODULE 4: COURSE MANAGEMENT ---
class CourseProgress(BaseModel):
    course_name: str
    faculty_name: str
    progress: float
    resources_count: int
    ai_optimization: str

# --- MODULE 5: TEST ASSESSMENT ---
class TestResult(BaseModel):
    test_id: str
    title: str
    avg_score: float
    submissions_count: int
    total_students: int

# --- MODULES 6-9: AI Alerts, Alumni, Industry Trends, Learning Path ---
class AIAlert(BaseModel):
    id: str
    type: str # Risk, Anomaly, Accomplishment
    message: str
    severity: str
    timestamp: str

class AlumniMetric(BaseModel):
    total_alumni: int
    placed_percent: float
    mentorship_ready: int
    engagement_score: float

class IndustryTrend(BaseModel):
    skill: str
    demand: str
    salary_avg: str
    requirement: str

class LearningPathNode(BaseModel):
    goal: str
    steps: List[str]
    progress: float
    certificates: List[str]
class AIAssessmentCreate(BaseModel):
    title: str
    subject: str
    year: int
    difficulty: str = "Medium"
    duration: str = "30m"

class StaffStats(BaseModel):
    total_students: int
    avg_cgpa: float
    high_risk_count: int
    department: str

class RankItem(BaseModel):
    name: str
    cgpa: float

class ClassIntelligence(BaseModel):
    top_performers: List[str]
    risk_list: List[str]
    rank_list: List[RankItem]

class CareerRole(BaseModel):
    title: str
    match: float
    readiness: str # "HIGH", "MEDIUM", "LOW"
    missing_skills: List[str]
    suggestions: List[str]
    domain: str
    lpa: Optional[str] = None
    required_skills: List[str] = []
    learning_path: List[str] = []

class CareerRecommendations(BaseModel):
    roles: List[CareerRole]
    domain_scores: dict # e.g. {"software": 90, "data_science": 75, "devops": 80}
    institutional_readiness: float
    ai_recommendations: str

class AIAdviceRequest(BaseModel):
    student_profile: dict

class CareerAdvice(BaseModel):
    personalized_suggestion: str
    improvement_tips: List[str]

class CareerProgressTrend(BaseModel):
    label: str # Week 1, Week 2, etc.
    value: float

class CareerProgress(BaseModel):
    improvement_trend: List[CareerProgressTrend]
    skill_growth: List[dict] # e.g. [{"skill": "Python", "growth": 20}]
    readiness_change: float # e.g. 10.5

