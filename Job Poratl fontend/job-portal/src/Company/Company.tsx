/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarGroup, Tabs, ActionIcon } from "@mantine/core";
import { IconMapPin, IconBuilding, IconUsers, IconBriefcase } from "@tabler/icons-react";
import AboutCompany from "./AboutCompany";
import EmployeesCompany from "./EmployeesCompany";
import CompanyJob from "./CompanyJob";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllJobs } from "../Services/JobService";
import type { CompanyData } from "../Data/companyData";

// Component CompanyLogo (copied from JobDesc)
interface CompanyLogoProps {
    logo: string;
    company: string;
    size?: "sm" | "md" | "lg" | "xl" | "xxl";
    showGlow?: boolean;
    className?: string;
}

const CompanyLogo = ({ logo, company, size = "md", showGlow = true, className = "" }: CompanyLogoProps) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const sizeClasses = {
        sm: "h-12 w-12 p-3",
        md: "h-16 w-16 p-4",
        lg: "h-20 w-20 p-5",
        xl: "h-24 w-24 p-6",
        xxl: "h-52 w-52 p-8"
    };

    // Lấy chữ cái đầu từ tên công ty
    const getInitials = (name: string): string => {
        if (!name) return "CO";
        
        const words = name
            .replace(/[^\w\s]/gi, '')
            .split(' ')
            .filter(word => word.length > 0);
        
        if (words.length === 0) return "CO";
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    // Tạo màu gradient dựa trên tên công ty
    const getFallbackColor = (name: string): string => {
        if (!name) return "from-mine-shaft-700 to-mine-shaft-800";
        
        const gradients = [
            "from-cyan-500 to-blue-500",
            "from-purple-500 to-pink-500",
            "from-orange-500 to-red-500",
            "from-green-500 to-emerald-500",
            "from-indigo-500 to-purple-500",
            "from-yellow-500 to-orange-500",
            "from-pink-500 to-rose-500",
            "from-teal-500 to-cyan-500",
            "from-blue-500 to-indigo-500",
            "from-red-500 to-orange-500"
        ];
        
        const hash = name.split('').reduce((acc, char, index) => {
            return acc + char.charCodeAt(0) * (index + 1);
        }, 0);
        
        return gradients[hash % gradients.length];
    };

    // Kiểm tra URL hợp lệ
    const isValidUrl = (url: string): boolean => {
        if (!url) return false;
        
        try {
            const parsedUrl = new URL(url);
            const validProtocols = ['http:', 'https:'];
            const validExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'];
            
            if (!validProtocols.includes(parsedUrl.protocol)) return false;
            
            const hasValidExtension = validExtensions.some(ext => 
                parsedUrl.pathname.toLowerCase().endsWith(ext)
            );
            
            return hasValidExtension;
        } catch {
            return false;
        }
    };

    // Lấy logo từ Clearbit nếu không có logo
    const getCompanyLogo = (companyName: string) => {
        const cleanCompany = companyName
            .replace(/Co\.,?\s*Ltd\.?/gi, '')
            .replace(/Ltd\.?/gi, '')
            .replace(/Inc\.?/gi, '')
            .replace(/Corporation/gi, '')
            .trim();

        return `https://logo.clearbit.com/${encodeURIComponent(cleanCompany.toLowerCase().replace(/\s+/g, ''))}.com`;
    };

    const logoUrl = (logo && isValidUrl(logo)) ? logo : getCompanyLogo(company);
    const shouldUseLogo = !hasError;

    // Preload ảnh
    useEffect(() => {
        if (!shouldUseLogo) {
            setIsLoading(false);
            return;
        }

        const img = new Image();
        img.src = logoUrl;
        
        img.onload = () => {
            setIsLoading(false);
            setHasError(false);
        };
        
        img.onerror = () => {
            setIsLoading(false);
            setHasError(true);
        };
    }, [logoUrl, shouldUseLogo]);

    return (
        <div className={`relative group flex-shrink-0 ${className}`}>
            {/* Hiệu ứng glow */}
            {showGlow && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
            )}
            
            <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-mine-shaft-800 via-mine-shaft-850 to-mine-shaft-900 rounded-2xl border-2 border-mine-shaft-700 group-hover:border-cyan-400/60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="h-8 w-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                    </div>
                ) : shouldUseLogo ? (
                    <img
                        src={logoUrl}
                        alt={`${company} Logo`}
                        className="h-full w-full object-contain filter group-hover:brightness-125 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-500"
                        onError={() => setHasError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className={`h-full w-full rounded-xl flex items-center justify-center bg-gradient-to-br ${getFallbackColor(company)}`}>
                        <span className={`text-white font-bold drop-shadow-lg ${size === 'xxl' ? 'text-4xl' : 'text-lg'}`}>
                            {getInitials(company)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const Company = () => {
    // Get company name from URL parameter
    const { companyName } = useParams<{ companyName: string }>();
    const decodedCompanyName = companyName ? decodeURIComponent(companyName) : "";
    
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            
            // Lấy tất cả jobs từ backend
            const allJobs = await getAllJobs();
            
            // Filter jobs theo company name
            const companyJobs = allJobs.filter((job: any) => 
                job.company.toLowerCase() === decodedCompanyName.toLowerCase()
            );

            if (companyJobs.length > 0) {
                // Lấy thông tin từ job đầu tiên
                const firstJob = companyJobs[0];
                
                // Extract unique locations from all jobs - ĐÃ SỬA
                const allLocations = companyJobs
                    .map((job: any) => job.location)
                    .filter((loc: any) => loc && String(loc).trim() !== '');
                
                const uniqueLocations = [...new Set(allLocations)];
                const safeHeadquarters = uniqueLocations.length > 0 ? String(uniqueLocations[0]) : "Remote";
                
                // Tạo company object từ thông tin jobs với tất cả fields cần thiết
                const companyData: CompanyData = {
                    name: firstJob.company,
                    logo: firstJob.logo || "",
                    overview: `${firstJob.company} is a leading technology company dedicated to creating innovative solutions that transform businesses and improve lives. With a focus on cutting-edge technology and customer satisfaction, we continue to push boundaries and set new standards in the industry.`,
                    industry: "Technology",
                    website: `https://www.${firstJob.company.toLowerCase().replace(/\s+/g, '')}.com`,
                    size: `${companyJobs.length} open positions`,
                    headquarters: safeHeadquarters, // ĐÃ SỬA - dùng biến an toàn
                    specialties: [
                        "Software Development",
                        "Cloud Solutions",
                        "AI & Machine Learning",
                        "Data Analytics",
                        "Mobile Applications",
                        "Cybersecurity"
                    ],
                    // Optional fields
                    founded: 2010,
                    revenue: "$500M annually",
                    employees: companyJobs.reduce((sum: number, job: any) => 
                        sum + (job.applicants?.length || 0), 0
                    ),
                    mission: `To revolutionize the tech industry through innovation and excellence`,
                    culture: [
                        "Innovation-driven environment",
                        "Work-life balance priority",
                        "Collaborative team culture",
                        "Continuous learning opportunities",
                        "Diversity and inclusion focus"
                    ],
                    benefits: [
                        "Comprehensive health insurance",
                        "Flexible work arrangements",
                        "Professional development programs",
                        "Competitive salary packages",
                        "Stock options and equity",
                        "Generous PTO policy",
                        "Wellness programs",
                        "Team building activities"
                    ],
                    stats: {
                        totalJobs: companyJobs.length,
                        activeJobs: companyJobs.filter((job: any) => job.status === 'active').length || companyJobs.length,
                        avgRating: 4.6,
                        totalReviews: Math.floor(Math.random() * 10000) + 15000
                    }
                };
                
                setCompany(companyData);
            } else {
                setCompany(null);
            }
        } catch (error) {
            console.error("Error fetching company data:", error);
            setCompany(null);
        } finally {
            setLoading(false);
        }
    };

    if (decodedCompanyName) {
        fetchCompanyData();
    }
}, [decodedCompanyName]);
    // Loading state
    if (loading) {
        return (
            <div className="w-2/3 mx-auto mt-20 text-center">
                <div className="relative p-10 rounded-3xl bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-sm">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />
                    <div className="relative">
                        <div className="h-8 bg-mine-shaft-800 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-mine-shaft-800 rounded w-1/3 mx-auto animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if company not found
    if (!company) {
        return (
            <div className="w-2/3 mx-auto mt-20 text-center">
                <div className="relative p-10 rounded-3xl bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-sm">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5" />
                    <div className="relative">
                        <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
                            Company Not Found
                        </h2>
                        <p className="text-mine-shaft-300">
                            We couldn't find any jobs for "{decodedCompanyName}"
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-2/3 mx-auto animate-fade-in">
            {/* ===== Banner & Avatar ===== */}
            <div className="relative group ">
                {/* Banner with parallax effect */}
                <div className="w-full aspect-video md:aspect-[21/9] rounded-t-3xl overflow-hidden">
                    <img
                        src="/images/cat1.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                    />
                    {/* Multi-layer gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950 via-mine-shaft-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-purple-900/10 opacity-50" />

                    {/* Animated particles */}
                    <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animation: `float ${3 + i}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.5}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Avatar with CompanyLogo component */}
                <div className="absolute -bottom-24 left-8">
                    <CompanyLogo 
                        logo={company.logo || ""}
                        company={company.name}
                        size="xxl"
                        showGlow={true}
                    />
                </div>
            </div>

            {/* ===== Basic Info ===== */}
            <div className="px-8 mt-36 mb-10 relative">
                {/* Background glow effect */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10 blur-3xl rounded-full -z-10" />

                <div className="flex justify-between items-start mb-8">
                    <div className="flex-1 mr-8">
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-gradient-text">
                                {company.name}
                            </h1>
                            <span className="px-4 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 font-bold backdrop-blur-sm">
                                {company.industry || "Tech Company"}
                            </span>
                        </div>

                        <div className="text-2xl text-mine-shaft-200 mb-6 font-medium bg-gradient-to-r from-mine-shaft-100 to-mine-shaft-300 bg-clip-text text-transparent">
                            Innovating the future of technology
                        </div>

                        {/* Stats Cards - Style từ JobDesc */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="group relative p-4 rounded-xl bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 border-2 border-mine-shaft-700/50 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 flex items-center gap-3 min-w-[200px]">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
                                <ActionIcon
                                    className="relative !w-12 !h-12 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 rounded-lg border-2 border-mine-shaft-700 group-hover:border-cyan-400/50 transition-all duration-500"
                                    variant="light"
                                    radius="md"
                                >
                                    <IconMapPin className="h-3/4 w-3/4 text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-500" stroke={1.5} />
                                </ActionIcon>
                                <div className="relative">
                                    <div className="text-xs text-mine-shaft-400 font-medium">Location</div>
                                    <div className="text-sm font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{company.headquarters}</div>
                                </div>
                            </div>

                            <div className="group relative p-4 rounded-xl bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 border-2 border-mine-shaft-700/50 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 flex items-center gap-3 min-w-[200px]">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
                                <ActionIcon
                                    className="relative !w-12 !h-12 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 rounded-lg border-2 border-mine-shaft-700 group-hover:border-blue-400/50 transition-all duration-500"
                                    variant="light"
                                    radius="md"
                                >
                                    <IconBriefcase className="h-3/4 w-3/4 text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all duration-500" stroke={1.5} />
                                </ActionIcon>
                                <div className="relative">
                                    <div className="text-xs text-mine-shaft-400 font-medium">Positions</div>
                                    <div className="text-sm font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{company.size}</div>
                                </div>
                            </div>

                            <div className="group relative p-4 rounded-xl bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 border-2 border-mine-shaft-700/50 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 flex items-center gap-3 min-w-[200px]">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
                                <ActionIcon
                                    className="relative !w-12 !h-12 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 rounded-lg border-2 border-mine-shaft-700 group-hover:border-purple-400/50 transition-all duration-500"
                                    variant="light"
                                    radius="md"
                                >
                                    <IconUsers className="h-3/4 w-3/4 text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] transition-all duration-500" stroke={1.5} />
                                </ActionIcon>
                                <div className="relative">
                                    <div className="text-xs text-mine-shaft-400 font-medium">Applicants</div>
                                    <div className="text-sm font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{company.employees || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AvatarGroup className="flex-shrink-0" spacing="lg">
                        <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                            <Avatar src="https://i.pravatar.cc/150?img=1" alt="Avatar 1"
                                className="w-14 h-14 rounded-full border-2 border-mine-shaft-800 group-hover/avatar:border-cyan-500/50 group-hover/avatar:scale-110 transition-all duration-300" />
                        </div>
                        <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                            <Avatar src="https://i.pravatar.cc/150?img=2" alt="Avatar 2"
                                className="w-14 h-14 rounded-full border-2 border-mine-shaft-800 group-hover/avatar:border-blue-500/50 group-hover/avatar:scale-110 transition-all duration-300" />
                        </div>
                        <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                            <Avatar src="https://i.pravatar.cc/150?img=3" alt="Avatar 3"
                                className="w-14 h-14 rounded-full border-2 border-mine-shaft-800 group-hover/avatar:border-purple-500/50 group-hover/avatar:scale-110 transition-all duration-300" />
                        </div>
                        <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                            <Avatar className="w-14 h-14 rounded-full border-2 border-mine-shaft-800 group-hover/avatar:border-cyan-500/50 group-hover/avatar:scale-110 transition-all duration-300 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900">
                                +{company.employees || 0}
                            </Avatar>
                        </div>
                    </AvatarGroup>
                </div>
            </div>

            {/* ===== Tabs Section ===== */}
            <div className="px-8">
                <Tabs variant="outline" radius="xl" defaultValue="about"
                    classNames={{
                        tab: "data-[active]:!bg-cyan-500/20 data-[active]:!border-cyan-500/50 data-[active]:!text-cyan-300 hover:bg-mine-shaft-800/50 transition-all duration-300",
                        list: "border-mine-shaft-700/50 mb-8"
                    }}>

                    <Tabs.List grow className="text-lg font-semibold">
                        <Tabs.Tab value="about"
                            leftSection={<IconBuilding size={20} className="group-data-[active]:text-cyan-300" />}
                            className="group"
                        >
                            About
                        </Tabs.Tab>
                        <Tabs.Tab value="jobs"
                            leftSection={<IconBriefcase size={20} className="group-data-[active]:text-cyan-300" />}
                            className="group"
                        >
                            Jobs
                        </Tabs.Tab>
                        <Tabs.Tab value="employees"
                            leftSection={<IconUsers size={20} className="group-data-[active]:text-cyan-300" />}
                            className="group"
                        >
                            Employees
                        </Tabs.Tab>
                    </Tabs.List>

                    {/* Active tab indicator glow */}
                    <div className="relative">
                        <div className="absolute -top-8 left-0 w-full h-8 bg-gradient-to-b from-cyan-500/5 to-transparent blur-lg -z-10" />
                    </div>

                    <Tabs.Panel value="about" className="animate-slide-in">
                        {company && <AboutCompany company={company} />}
                    </Tabs.Panel>

                    <Tabs.Panel value="jobs" className="animate-slide-in">
                        {company && <CompanyJob company={company} />}
                    </Tabs.Panel>

                    <Tabs.Panel value="employees" className="animate-slide-in">
                        {company && <EmployeesCompany company={company} />}
                    </Tabs.Panel>
                </Tabs>
            </div>

            {/* Custom CSS Animations */}
            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                    }
                }
                
                @keyframes gradient-text {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                
                .animate-slide-in {
                    animation: slide-in 0.5s ease-out forwards;
                }
                
                .animate-gradient-text {
                    background-size: 200% 200%;
                    animation: gradient-text 3s ease infinite;
                }
            `}</style>
        </div>
    );
}

export default Company;