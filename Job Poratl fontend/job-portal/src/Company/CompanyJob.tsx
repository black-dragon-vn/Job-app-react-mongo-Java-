/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconBriefcase, IconCheck, IconExternalLink, IconStar, IconTrendingUp, IconUsers } from "@tabler/icons-react";
import { getAllJobs } from "../Services/JobService";
import { Link } from "react-router-dom";
import JobCard from "../FindJobs/JobCard";
import { useEffect, useState } from "react";
import { Badge, Skeleton } from "@mantine/core";
import type { CompanyData } from "../Data/companyData";

// Định nghĩa kiểu dữ liệu cho công việc từ backend
interface JobData {
    id: number;
    jobTitle: string;
    company: string;
    about: string;
    experience: string;
    jobType: string;
    applicants: [];
    location?: string;
    packageOffered?: number;
    posTime?: string;
    description?: string;
    skillsRequired?: string[];
    jobStatus?: string;
    logo?: string;
}

// Định nghĩa props cho CompanyJob
interface CompanyJobProps {
    company: CompanyData;
}

// Helper function để normalize company name
const normalizeCompanyName = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/\s*(co\.,?|ltd\.?|inc\.?|llc|corporation|corp\.?)\s*$/gi, '')
        .trim();
};

// Component CompanyJob chính
const CompanyJob = ({ company }: CompanyJobProps) => {
    const [jobList, setJobList] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await getAllJobs();
                setJobList(res);
                setError(null);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchJobs();
    }, []);
    
    if (loading) {
        return (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 to-mine-shaft-950/60 border border-mine-shaft-700/50">
                <div className="flex items-center gap-4 mb-10">
                    <Skeleton height={60} width={60} radius="xl" />
                    <div className="flex-1">
                        <Skeleton height={32} width="60%" radius="sm" className="mb-2" />
                        <Skeleton height={20} width="40%" radius="sm" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[1,2,3,4].map(i => (
                        <Skeleton key={i} height={80} radius="md" />
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <Skeleton key={i} height={320} radius="lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 to-mine-shaft-950/60 border border-mine-shaft-700/50">
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 mb-4">
                        <IconUsers size={32} className="text-red-400" />
                    </div>
                    <h4 className="text-xl font-bold text-mine-shaft-200 mb-2">Failed to Load Jobs</h4>
                    <p className="text-mine-shaft-400 max-w-md mx-auto mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }
    
    // ⭐ IMPROVED: Filter jobs theo công ty với normalization
    const companyJobs = jobList.filter(job => {
        const jobCompanyName = normalizeCompanyName(job.company);
        const currentCompanyName = normalizeCompanyName(company.name);
        return jobCompanyName === currentCompanyName;
    });

    // Display jobs - chỉ hiển thị jobs của company này
    const displayJobs = companyJobs.slice(0, 6);
    const totalJobs = companyJobs.length; // Total jobs của company này

    // Tính toán thống kê chỉ dựa trên company jobs
    const remoteJobs = companyJobs.filter(job => 
        job.skillsRequired?.some((tag: string) => tag.toLowerCase().includes('remote')) ||
        job.location?.toLowerCase().includes('remote')
    ).length;

    // Xác định job urgent
    const getUrgencyLevel = (posTime?: string) => {
        if (!posTime) return 'low';
        try {
            const date = new Date(posTime);
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
            
            if (diffInHours < 24) return 'high';
            if (diffInHours < 72) return 'medium';
            return 'low';
        } catch {
            return 'low';
        }
    };

    const urgentJobs = companyJobs.filter(job => 
        getUrgencyLevel(job.posTime) === 'high'
    ).length;

    // Tính avg salary
    const avgSalary = companyJobs.length > 0 
        ? Math.round(
            companyJobs.reduce((sum, job) => sum + (job.packageOffered || 0), 0) / companyJobs.length
        )
        : 0;

    // Helper function để tạo logo
    const getCompanyLogo = (companyName: string, logoUrl?: string) => {
        // Nếu job đã có logo, dùng luôn
        if (logoUrl && logoUrl.trim() !== '') {
            return logoUrl;
        }
        
        const cleanCompany = companyName
            .replace(/Co\.,?\s*Ltd\.?/gi, '')
            .replace(/Ltd\.?/gi, '')
            .replace(/Inc\.?/gi, '')
            .replace(/Corporation/gi, '')
            .trim();
        
        return `https://logo.clearbit.com/${encodeURIComponent(cleanCompany.toLowerCase().replace(/\s+/g, ''))}.com`;
    };

    return (
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 via-mine-shaft-950/40 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-xl shadow-xl overflow-hidden">
            {/* Background Gradient Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 -z-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -z-10" />

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-emerald-500/20 rounded-full -z-10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-teal-500/20 rounded-full -z-10" />

            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
                        <div className="relative p-4 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                            <IconBriefcase size={32} className="text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                            Careers at {company.name}
                        </h3>
                        <p className="text-mine-shaft-300/80 mt-2 text-sm lg:text-base flex items-center gap-2">
                            <IconCheck size={18} className="text-emerald-400 shrink-0" />
                            {totalJobs > 0
                                ? `${totalJobs} open position${totalJobs !== 1 ? 's' : ''} available`
                                : 'Currently not hiring'}
                        </p>
                    </div>
                </div>
                
                {totalJobs > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge 
                            size="lg"
                            className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 font-bold backdrop-blur-sm"
                        >
                            {totalJobs} Open Position{totalJobs !== 1 ? 's' : ''}
                        </Badge>
                        {company.stats?.avgRating && (
                            <Badge 
                                size="lg"
                                className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-300 font-bold backdrop-blur-sm"
                                leftSection={<IconStar size={14} className="fill-yellow-300" />}
                            >
                                {company.stats.avgRating.toFixed(1)}
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Nếu có công việc, hiển thị thống kê và danh sách */}
            {totalJobs > 0 ? (
                <>
                    {/* Job Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            {
                                label: "Total Positions",
                                value: totalJobs,
                                icon: <IconBriefcase size={20} className="text-emerald-400" />,
                                color: "from-emerald-500/10 to-emerald-600/10",
                                border: "border-emerald-500/20",
                                text: "text-emerald-300"
                            },
                            {
                                label: "Remote Jobs",
                                value: remoteJobs,
                                icon: <IconTrendingUp size={20} className="text-teal-400" />,
                                color: "from-teal-500/10 to-teal-600/10",
                                border: "border-teal-500/20",
                                text: "text-teal-300"
                            },
                            {
                                label: "Urgent Hiring",
                                value: urgentJobs,
                                icon: <IconCheck size={20} className="text-cyan-400" />,
                                color: "from-cyan-500/10 to-cyan-600/10",
                                border: "border-cyan-500/20",
                                text: "text-cyan-300"
                            },
                            {
                                label: "Avg. Salary",
                                value: avgSalary > 0 ? `$${(avgSalary / 1000).toFixed(0)}K` : "N/A",
                                icon: <IconUsers size={20} className="text-green-400" />,
                                color: "from-green-500/10 to-green-600/10",
                                border: "border-green-500/20",
                                text: "text-green-300"
                            }
                        ].map((stat, index) => (
                            <div 
                                key={index}
                                className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm text-mine-shaft-400">{stat.label}</div>
                                    {stat.icon}
                                </div>
                                <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Jobs Grid */}
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayJobs.map((job) => {
                                // Map JobData sang Job interface cho JobCard
                                const jobCardData = {
                                    id: job.id,
                                    jobTitle: job.jobTitle,
                                    company: job.company,
                                    logo: getCompanyLogo(job.company, job.logo),
                                    applicants: job.applicants || [],
                                    about: job.about || "No description available",
                                    experience: job.experience || "",
                                    jobType: job.jobType || "Full-time",
                                    location: job.location || "Not specified",
                                    packageOffered: job.packageOffered || 0,
                                    posTime: job.posTime || new Date().toISOString(),
                                    description: job.description || job.about || "",
                                    skillsRequired: job.skillsRequired || [],
                                    jobStatus: job.jobStatus || "OPEN",
                                    urgent: getUrgencyLevel(job.posTime) === 'high',
                                    featured: [
                                        'google', 'microsoft', 'apple', 'amazon', 
                                        'meta', 'netflix', 'tesla', 'nvidia'
                                    ].some(brand => job.company.toLowerCase().includes(brand))
                                };

                                return (
                                    <div key={job.id} className="group relative">
                                        {/* Glow effect */}
                                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                        
                                        {/* Job Card Container */}
                                        <div className="relative h-full">
                                            <JobCard job={jobCardData} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* View All Button */}
                        {companyJobs.length > 6 && (
                            <div className="mt-10 pt-8 border-t border-mine-shaft-700/50">
                                <div className="text-center">
                                    <Link 
                                        to={`/jobs?company=${encodeURIComponent(company.name)}`}
                                        className="inline-flex items-center gap-2 group"
                                    >
                                        <button className="relative overflow-hidden px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 border border-emerald-400/40">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                            <span className="relative z-10 flex items-center gap-2">
                                                View All {companyJobs.length} Positions
                                                <IconExternalLink size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                                            </span>
                                        </button>
                                    </Link>
                                    <p className="text-mine-shaft-400 text-sm mt-3">
                                        Discover all career opportunities at {company.name}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Nếu không có công việc, hiển thị thông báo */
                <div className="text-center py-12 px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
                        <IconBriefcase size={40} className="text-emerald-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-mine-shaft-200 mb-4">
                        No Open Positions Currently
                    </h4>
                    <p className="text-mine-shaft-400 max-w-lg mx-auto mb-8 leading-relaxed">
                        {company.name} is not actively hiring at the moment. Career opportunities are regularly updated, so please check back soon or explore similar companies in the {company.industry || "same industry"}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/jobs">
                            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2">
                                <span>Browse All Jobs</span>
                                <IconExternalLink size={18} />
                            </button>
                        </Link>
                        <button className="px-6 py-3 bg-gradient-to-r from-mine-shaft-800 to-mine-shaft-900 hover:from-mine-shaft-700 hover:to-mine-shaft-800 text-mine-shaft-300 font-medium rounded-lg transition-all duration-300 hover:scale-105 border border-mine-shaft-700">
                            Set Job Alert
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyJob;