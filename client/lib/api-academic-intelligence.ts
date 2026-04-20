const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `http://127.0.0.1:8001`;
    return `${baseUrl}${path}`;
};

export const fetchInstitutionIntelligence = async () => {
  const res = await fetch(getApiUrl("/api/academic-intelligence/institution"), { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch institution intelligence");
  return res.json();
};

export const fetchDepartmentIntelligence = async (dept: string) => {
  const res = await fetch(getApiUrl(`/api/academic-intelligence/department/${dept}`), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${dept} intelligence`);
  return res.json();
};

export const fetchStudentAcademicProfile = async (studentId: string) => {
  const res = await fetch(getApiUrl(`/api/academic-intelligence/student/${studentId}`), { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch student academic profile");
  return res.json();
};
