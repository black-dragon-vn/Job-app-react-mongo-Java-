export interface PostedJob {
    id: number;
    title: string;
    type: string;
    location: string;
    applicants: number;
    salary: string;
    postedDate: string;
    views: number;
    status: 'active' | 'draft';
    tags: string[];
    description?: string;
    requirements?: string[];
}

// Mock data for active jobs
export const activeJobs: PostedJob[] = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        type: "Full-time",
        location: "Remote",
        applicants: 45,
        salary: "$120-150/hr",
        postedDate: "2 days ago",
        views: 120,
        status: "active",
        tags: ["React", "TypeScript", "Next.js"],
        description: "Build cutting-edge user interfaces using modern web technologies.",
        requirements: ["5+ years experience", "React expertise", "TypeScript"]
    },
    {
        id: 2,
        title: "Product Designer",
        type: "Full-time",
        location: "San Francisco, CA",
        applicants: 78,
        salary: "$100-130/hr",
        postedDate: "1 week ago",
        views: 230,
        status: "active",
        tags: ["Figma", "UI/UX", "Prototyping"],
        description: "Create beautiful and intuitive user experiences.",
        requirements: ["3+ years experience", "Portfolio required", "Figma mastery"]
    },
    {
        id: 3,
        title: "DevOps Engineer",
        type: "Contract",
        location: "Remote",
        applicants: 32,
        salary: "$110-140/hr",
        postedDate: "3 days ago",
        views: 95,
        status: "active",
        tags: ["AWS", "Docker", "Kubernetes"],
        description: "Build and maintain cloud infrastructure.",
        requirements: ["AWS certification", "CI/CD experience", "3+ years"]
    },
    {
        id: 4,
        title: "Backend Developer",
        type: "Full-time",
        location: "New York, NY",
        applicants: 56,
        salary: "$115-145/hr",
        postedDate: "5 days ago",
        views: 180,
        status: "active",
        tags: ["Node.js", "Python", "PostgreSQL"],
        description: "Develop scalable backend services and APIs.",
        requirements: ["Node.js expertise", "Database design", "4+ years"]
    }
];

// Mock data for draft jobs
export const draftJobs: PostedJob[] = [
    {
        id: 5,
        title: "Mobile App Developer",
        type: "Full-time",
        location: "Remote",
        applicants: 0,
        salary: "$100-130/hr",
        postedDate: "Not posted",
        views: 0,
        status: "draft",
        tags: ["React Native", "iOS", "Android"],
        description: "Build cross-platform mobile applications.",
        requirements: ["React Native experience", "Mobile development", "2+ years"]
    }
];

// Calculate statistics
export const calculateStats = (jobs: PostedJob[]) => {
    const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);
    const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);
    const remoteJobs = jobs.filter(job => job.location.toLowerCase().includes('remote')).length;
    const avgSalary = jobs.length > 0 
        ? `$${Math.round(jobs.reduce((sum, job) => {
            const avg = job.salary.split('-').map(s => parseInt(s.replace(/[^0-9]/g, ''))).reduce((a, b) => a + b, 0) / 2;
            return sum + avg;
        }, 0) / jobs.length)}/hr`
        : "$0/hr";

    return {
        totalApplicants,
        totalViews,
        remoteJobs,
        avgSalary,
        avgViews: jobs.length > 0 ? Math.round(totalViews / jobs.length) : 0
    };
};