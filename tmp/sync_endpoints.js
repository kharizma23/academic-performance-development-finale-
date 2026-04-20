const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\kharizma\\Downloads\\StudentAcademicPlatform-main\\StudentAcademicPlatform-main\\client\\components\\admin';

const mappings = {
    'FeedbackAnalyticsTab.tsx': '/admin/modules/feedback',
    'WeeklyReportsTab.tsx': '/admin/modules/reports',
    'AttendanceIntelligenceTab.tsx': '/admin/modules/attendance',
    'CourseManagementTab.tsx': '/admin/modules/courses',
    'TestAssessmentTab.tsx': '/admin/modules/tests',
    'AIAlertsTab.tsx': '/admin/modules/alerts',
    'AlumniIntelligenceTab.tsx': '/admin/modules/alumni',
    'IndustryTrendsTab.tsx': '/admin/modules/trends',
    'LearningPathTab.tsx': '/admin/modules/learning-path'
};

Object.entries(mappings).forEach(([file, endpoint]) => {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace getApiUrl call or literal endpoint
        content = content.replace(/\/admin\/analytics\/[a-zA-Z0-9_\-]+/g, endpoint);
        content = content.replace(/\/admin\/[a-zA-Z0-9_\-]+\/analytics/g, endpoint);
        content = content.replace(/\/admin\/[a-zA-Z0-9_\-]+\/stats/g, endpoint);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} to use ${endpoint}`);
    }
});
