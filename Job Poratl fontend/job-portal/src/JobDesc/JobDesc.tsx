/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconBookmark, IconBookmarkFilled, IconBriefcase, IconClock, IconMapPin, IconPremiumRights } from "@tabler/icons-react";
import { ActionIcon, Button, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { timeAgo } from "../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../Slices/ProfileSlice";
import { useEffect, useState } from "react";
import { sucessNotification, errNotification } from "../Services/NotificationService";
import { postJob } from "../Services/JobService";

interface Applicant {
    applicantId: number;
    name: string;
    email?: string;
    phone?: number;
    website?: string;
    applicationStatus: string;
}

interface Job {
    id: number;
    jobTitle: string;
    company: string;
    logo: string;
    applicants?: Applicant[];
    about: string;
    experience: string;
    jobType: string;
    location: string;
    packageOffered: number;
    posTime: string;
    description: string;
    skillsRequired: string[];
    jobStatus: string;
}

interface JobDescProps {
    job?: Job;
    edit?: boolean;
    closed?: boolean;
}

// Component CompanyLogo riêng biệt
interface CompanyLogoProps {
    logo: string;
    company: string;
    size?: "sm" | "md" | "lg" | "xl";
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
        xl: "h-24 w-24 p-6"
    };

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

    const shouldUseLogo = logo && isValidUrl(logo) && !hasError;

    useEffect(() => {
        if (!shouldUseLogo) {
            setIsLoading(false);
            return;
        }

        const img = new Image();
        img.src = logo;

        img.onload = () => {
            setIsLoading(false);
            setHasError(false);
        };

        img.onerror = () => {
            setIsLoading(false);
            setHasError(true);
        };
    }, [logo, shouldUseLogo]);

    return (
        <div className={`relative group flex-shrink-0 ${className}`}>
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
                        src={logo}
                        alt={`${company} Logo`}
                        className="h-full w-full object-contain filter group-hover:brightness-125 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-500"
                        onError={() => setHasError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className={`h-full w-full rounded-xl flex items-center justify-center bg-gradient-to-br ${getFallbackColor(company)}`}>
                        <span className="text-white font-bold text-lg drop-shadow-lg">
                            {getInitials(company)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Component chính JobDesc
const JobDesc = ({ job, edit = false, closed = false }: JobDescProps) => {
    const profile = useSelector((state: any) => state.profile);
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const [applied, setApplied] = useState(false);

    // ✅ LOAD SAVED JOBS FROM LOCALSTORAGE ON MOUNT
    useEffect(() => {
        const loadSavedJobs = () => {
            const userId = profile.id || profile._id || user.id || user._id;
            if (!userId) return;

            try {
                const storageKey = `savedJobs_${userId}`;
                const savedJobsJson = localStorage.getItem(storageKey);
                
                if (savedJobsJson) {
                    const savedJobsFromStorage = JSON.parse(savedJobsJson);
                    
                    if (JSON.stringify(savedJobsFromStorage) !== JSON.stringify(profile.savedJobs)) {
                        console.log("📥 Loading savedJobs from localStorage:", savedJobsFromStorage);
                        dispatch(changeProfile({
                            ...profile,
                            savedJobs: savedJobsFromStorage
                        }));
                    }
                }
            } catch (error) {
                console.error('❌ Failed to load saved jobs from localStorage:', error);
            }
        };

        loadSavedJobs();
    }, [user.id, profile.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // ✅ LOCALSTORAGE-ONLY MODE (NO BACKEND CALLS)
    const handleSaveJob = () => {
        if (!job) return;

        const userId = profile.id || profile._id || user.id || user._id;
        
        if (!userId) {
            console.warn("⚠️ User not authenticated");
            return;
        }

        const savedJobs: number[] = Array.isArray(profile.savedJobs)
            ? [...profile.savedJobs]
            : [];

        const isSaving = !savedJobs.includes(job.id);
        
        const updatedSavedJobs = isSaving
            ? [...savedJobs, job.id]
            : savedJobs.filter(id => id !== job.id);

        try {
            // 1. Save to localStorage (PRIMARY STORAGE)
            const storageKey = `savedJobs_${userId}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedSavedJobs));
            console.log("💾 Saved to localStorage:", {
                userId,
                storageKey,
                savedJobs: updatedSavedJobs,
                action: isSaving ? 'SAVED' : 'REMOVED',
                jobId: job.id
            });

            // 2. Update Redux state (for UI reactivity)
            dispatch(changeProfile({
                ...profile,
                savedJobs: updatedSavedJobs
            }));

            // 3. Show success notification
            sucessNotification(
                "Success",
                isSaving ? "✓ Job saved" : "✓ Job removed"
            );

            // ℹ️ NO BACKEND CALL - Using localStorage only
            console.log("ℹ️ Backend sync disabled - using localStorage only");

        } catch (error) {
            console.error('❌ localStorage error:', error);
            // Silently fail - don't show error to user
        }
    };

    // ✅ FIXED: Check applied status by EMAIL instead of numeric ID
    useEffect(() => {
        if (!job) return;
        
        console.log("🔍 Checking applied status:", {
            userId: user.id,
            userEmail: user.email,
            applicantsCount: job.applicants?.length || 0,
            applicants: job.applicants
        });
        
        const hasApplied = job.applicants?.some(
            (applicant: any) => {
                // ✅ PRIORITY 1: Check by email (most reliable)
                if (applicant.email && user.email) {
                    const match = applicant.email.toLowerCase() === user.email.toLowerCase();
                    if (match) {
                        console.log("✅ Found application match by EMAIL:", applicant.email);
                    }
                    return match;
                }
                
                // ✅ PRIORITY 2: Fallback - check by ID (handle both string and number)
                if (applicant.applicantId && user.id) {
                    const match = applicant.applicantId === user.id || 
                           applicant.applicantId?.toString() === user.id?.toString();
                    if (match) {
                        console.log("✅ Found application match by ID:", applicant.applicantId);
                    }
                    return match;
                }
                
                return false;
            }
        ) ?? false;
        
        console.log(`📊 Applied status: ${hasApplied ? 'APPLIED ✓' : 'NOT APPLIED ✗'}`);
        setApplied(hasApplied);
    }, [job, job?.applicants, user.id, user.email]);

    const handleClose = () => {
        if (!job) return;
        postJob({ ...job, jobStatus: "CLOSED" }).then((res) => {
            console.log(res);
            sucessNotification("Success", "✓ Job Closed Successfully");
        }).catch((err) => {
            errNotification("Error", err.response.data.errorMessage);
        })
    }

    // Early return if job is undefined or null
    if (!job) {
        return (
            <div className="w-2/3">
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-sm">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />
                    <div className="relative text-center py-20">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
                            Loading job description...
                        </div>
                        <div className="text-mine-shaft-400">Please wait while we fetch the job details</div>
                    </div>
                </div>
            </div>
        );
    }

    const data = DOMPurify.sanitize(job.description || '');

    const cardData = [
        {
            name: "Job Type",
            value: job.jobType || 'N/A',
            icon: IconBriefcase
        },
        {
            name: "Experience",
            value: job.experience || 'N/A',
            icon: IconClock
        },
        {
            name: "Location",
            value: job.location || 'N/A',
            icon: IconMapPin
        },
        {
            name: "Package Offered",
            value: job.packageOffered ? `$${job.packageOffered.toLocaleString('en-US')}/year` : 'Negotiable',
            icon: IconPremiumRights
        }
    ];

    return (
        <div className="w-2/3">
            {/* Job description content */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-sm">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />

                <div className="relative flex justify-between items-start">
                    <div className="flex items-start gap-5">
                        <CompanyLogo
                            logo={job.logo}
                            company={job.company}
                            size="md"
                            showGlow={true}
                        />

                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                {job.jobTitle}
                            </h2>
                            <div className="flex items-center gap-3 text-base">
                                <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 font-bold">
                                    {job.company}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
                                <span className="text-mine-shaft-300 font-medium">{timeAgo(job.posTime)}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
                                <span className="px-3 py-1 bg-mine-shaft-800/50 border border-mine-shaft-700 rounded-full text-mine-shaft-400 text-sm">
                                    {job.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-col">
                        {(edit || !applied) && (
                            <Link to={edit ? `/post-job/${job.id}` : `/apply-job/${job.id}`}>
                                <Button
                                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-black px-8 py-3 rounded-xl hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/60 border-2 border-cyan-400/30"
                                    type="submit"
                                    size="lg"
                                    variant="light"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {closed ? "Reopen" : edit ? "Edit Job" : "Apply Now"}
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                </Button>
                            </Link>
                        )}
                        {!edit && applied && (
                            <Button
                                className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-400 hover:via-blue-400 hover:to-purple-400 text-white font-black px-8 py-3 rounded-xl hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/60 border-2 border-green-400/30"
                                type="submit"
                                color="green"
                                size="lg"
                                variant="light"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Applied
                                    <span className="group-hover:scale-110 transition-transform duration-300">✓</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                            </Button>
                        )}
                        {edit && !closed && (
                            <Button
                                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-black px-8 py-3 rounded-xl hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-red-500/60 border-2 border-red-400/30"
                                size="lg"
                                variant="light"
                                onClick={handleClose}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Close Job
                                    <span className="group-hover:scale-110 transition-transform">🗑</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                            </Button>
                        )}
                        <ActionIcon
                            onClick={handleSaveJob}
                            size="xl"
                            className={`relative transition-all duration-500  ${profile.savedJobs?.includes(job.id)
                                ? "bg-gradient-to-br from-yellow-500/30 to-orange-500/30 hover:from-yellow-500/40 hover:to-orange-500/40 shadow-lg shadow-yellow-500/50"
                                : "bg-mine-shaft-800 hover:bg-mine-shaft-700 shadow-lg"
                                } hover:scale-125 hover:rotate-12 border-2 ${profile.savedJobs?.includes(job.id) ? 'border-yellow-400/50' : 'border-mine-shaft-700'}`}
                            variant="light"
                            radius="md"
                        >
                            {profile.savedJobs?.includes(job.id) ? (
                                <IconBookmarkFilled className="text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" size={24} />
                            ) : (
                                <IconBookmark className="text-mine-shaft-300 group-hover:text-yellow-400 transition-colors" size={24} stroke={2} />
                            )}
                        </ActionIcon>
                    </div>
                </div>
            </div>

            <Divider my="xl" className="border-mine-shaft-700" />

            <div className="flex justify-between flex-wrap gap-5 mb-10">
                {cardData.map((item, index) => (
                    <div
                        key={index}
                        className="group relative p-6 rounded-2xl bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-950/80 border-2 border-mine-shaft-700/50 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 flex flex-col gap-4 flex-1 min-w-[160px] hover:scale-105 hover:-translate-y-2"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/50 group-hover:via-blue-500/50 group-hover:to-purple-500/50 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10" />

                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            <ActionIcon
                                className="relative !w-14 !h-14 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 hover:from-cyan-500/20 hover:to-blue-500/20 rounded-xl border-2 border-mine-shaft-700 group-hover:border-cyan-400/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
                                variant="light"
                                radius="xl"
                            >
                                <item.icon className="h-4/5 w-4/5 text-cyan-400 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-500" stroke={1.5} />
                            </ActionIcon>
                        </div>
                        <div className="relative text-sm text-mine-shaft-400 font-medium">{item.name}</div>
                        <div className="relative text-xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-500">
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>

            <Divider my="xl" className="border-mine-shaft-700" />

            <div>
                <div className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                    Required Skills
                </div>
                <div className="flex flex-wrap gap-4">
                    {job.skillsRequired && job.skillsRequired.length > 0 ? (
                        job.skillsRequired.map((skill, index) => (
                            <div
                                key={index}
                                className="group relative px-6 py-3 text-sm font-bold rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-purple-500/15 text-cyan-300 border-2 border-cyan-500/40 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent hover:scale-125 hover:shadow-2xl hover:shadow-cyan-500/60 transition-all duration-500 cursor-pointer hover:-rotate-2"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/30 group-hover:via-blue-500/30 group-hover:to-purple-500/30 blur-xl transition-all duration-500" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/20 group-hover:to-purple-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <span className="relative drop-shadow-[0_0_8px_rgba(34,211,238,0)] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-500">{skill}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-mine-shaft-400">No skills specified</div>
                    )}
                </div>
            </div>

            <Divider my="xl" className="border-mine-shaft-700" />

            <div>
                <div className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                    About the Job
                </div>
                {data ? (
                    <div
                        className="prose prose-invert max-w-none text-mine-shaft-300 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-4 [&_p]:text-justify [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2"
                        dangerouslySetInnerHTML={{ __html: data }}
                    />
                ) : (
                    <div className="text-mine-shaft-400">No job description available</div>
                )}
            </div>

            <Divider my="xl" className="border-mine-shaft-700" />

            <div>
                <div className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                    About the Company
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-mine-shaft-900/60 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <CompanyLogo
                            logo={job.logo}
                            company={job.company}
                            size="md"
                            showGlow={true}
                        />

                        <div className="flex flex-col gap-1">
                            <h3 className="text-4xl font-bold text-white">{job.company}</h3>
                            <p className="text-mine-shaft-400">{job.location} &bull; {job.applicants?.length || 0} applications</p>
                        </div>
                        <div className="ml-auto">
                            <Link to={`/company/${encodeURIComponent(job.company)}`}>
                                <Button
                                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-black px-6 py-2 rounded-xl hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/60 border-2 border-cyan-400/30"
                                    type="submit"
                                    size="md"
                                    variant="light"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Company Page
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-4 text-mine-shaft-300 text-justify">
                        {job.about || 'No company information available'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDesc;