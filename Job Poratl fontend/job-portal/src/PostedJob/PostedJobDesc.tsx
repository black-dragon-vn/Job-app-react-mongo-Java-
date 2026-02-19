/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Tabs } from "@mantine/core";
import { 
  IconBriefcase, 
  IconBuilding, 
  IconUsers, 
  IconMapPin, 
  IconCheck, 
  IconX,
  IconCircleCheck 
} from "@tabler/icons-react";
import JobDesc from "../JobDesc/JobDesc";
import TalentCard from "../FindTalent/TalentCard";
import { timeAgo } from "../Services/Utilities";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface PostedJobDescProps {
    job?: any;
    edit?: boolean;
}

const PostedJobDesc = ({ job, edit = false }: PostedJobDescProps) => {
    const [tab, setTab] = useState("overview");
    const [arr, setArr] = useState<any>([]);
    
    const user = useSelector((state: any) => state.user);
    const [currentUserApplied, setCurrentUserApplied] = useState(false);

    // ✅ FIXED: Kiểm tra xem user hiện tại đã apply chưa - BY EMAIL
    useEffect(() => {
        if (job?.applicants && user) {
            console.log("🔍 PostedJobDesc - Checking if current user applied:", {
                userId: user.id,
                userEmail: user.email,
                applicantsCount: job.applicants.length
            });

            const hasApplied = job.applicants.some(
                (applicant: any) => {
                    // ✅ PRIORITY 1: Check by email (most reliable)
                    if (applicant.email && user.email) {
                        const match = applicant.email.toLowerCase() === user.email.toLowerCase();
                        if (match) {
                            console.log("✅ PostedJobDesc - Found application match by EMAIL:", applicant.email);
                        }
                        return match;
                    }
                    
                    // ✅ PRIORITY 2: Fallback - check by ID (handle both string and number)
                    if ((applicant.applicantId || applicant.id) && user.id) {
                        const applicantId = applicant.applicantId || applicant.id;
                        const match = applicantId === user.id || 
                               applicantId?.toString() === user.id?.toString();
                        if (match) {
                            console.log("✅ PostedJobDesc - Found application match by ID:", applicantId);
                        }
                        return match;
                    }
                    
                    return false;
                }
            );
            
            console.log(`📊 PostedJobDesc - Applied status: ${hasApplied ? 'APPLIED ✓' : 'NOT APPLIED ✗'}`);
            setCurrentUserApplied(hasApplied);
        } else {
            setCurrentUserApplied(false);
        }
    }, [job?.applicants, user?.id, user?.email]);

    // Loading state
    if (!job) {
        return (
            <div className="mt-5 w-4/5 px-5">
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

    // ✅ GET APPLICANTS BY STATUS - TẤT CẢ CÁC TRẠNG THÁI
    const appliedApplicants = job.applicants?.filter((applicant: any) => 
        applicant.applicationStatus === 'APPLIED'
    ) || [];
    
    const interviewingApplicants = job.applicants?.filter((applicant: any) => 
        applicant.applicationStatus === 'INTERVIEWING'
    ) || [];
    
    const offeredApplicants = job.applicants?.filter((applicant: any) => 
        applicant.applicationStatus === 'OFFERED'
    ) || [];
    
    const acceptedApplicants = job.applicants?.filter((applicant: any) => 
        applicant.applicationStatus === 'ACCEPTED'
    ) || [];
    
    const rejectedApplicants = job.applicants?.filter((applicant: any) => 
        applicant.applicationStatus === 'REJECTED'
    ) || [];
    
    // Counts
    const applicantsCount = appliedApplicants.length;
    const interviewingCount = interviewingApplicants.length;
    const offeredCount = offeredApplicants.length;
    const acceptedCount = acceptedApplicants.length;
    const rejectedCount = rejectedApplicants.length;
    const totalApplicants = job.applicants?.length || 0;
    const statusDisplay = job.jobStatus === 'ACTIVE' || job.jobStatus === 'OPEN' ? 'Open' : 'Closed';
    
    //  handleTabChange
    const handleTabChange = (value: string | null) => {
    if (!value) return; // Guard clause để check null
    
    setTab(value);
    if (value === "applicants") {
        setArr(appliedApplicants);
    } else if (value === "interviewing") {
        setArr(interviewingApplicants);
    } else if (value === "offered") {
        setArr(offeredApplicants);
    } else if (value === "rejected") {
        setArr(rejectedApplicants);
    }
};
    
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        handleTabChange("overview");
    }, [job]);
    
    // Function để map applicant data sang format TalentCard expect
    const mapApplicantToTalent = (applicant: any) => {
        const applicantId = applicant.applicantId || applicant._id || applicant.id;
        
        // Handle picture - convert Binary object if needed
        let pictureData = null;
        if (applicant.picture) {
            if (typeof applicant.picture === 'string') {
                pictureData = applicant.picture;
            } else if (applicant.picture.buffer) {
                try {
                    pictureData = applicant.picture.buffer.toString('base64');
                } catch (e) {
                    console.error("Error converting picture buffer:", e);
                }
            } else if (typeof applicant.picture === 'object') {
                pictureData = applicant.picture.toString?.() || null;
            }
        }
        
        return {
            _id: applicant._id || applicant.id,
            id: applicantId,
            applicantId: applicantId,
            name: applicant.name || applicant.email?.split('@')[0] || 'Unknown',
            email: applicant.email || '',
            jobTitle: applicant.jobTitle || 'Not specified',
            company: applicant.company || 'Not specified',
            location: applicant.location || job.location || 'Not specified',
            experience: applicant.experience || applicant.experiences?.[0]?.duration || 'Not specified',
            experiences: applicant.experiences || [],
            skills: Array.isArray(applicant.skills) ? applicant.skills : [],
            certifications: applicant.certifications || [],
            savedJobs: applicant.savedJobs || [],
            about: applicant.about || 'No description available',
            picture: pictureData,
            hourlyRate: applicant.hourlyRate || applicant.expectedSalary || 0,
            avatar: applicant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name || 'User')}&background=0ea5e9&color=fff`,
            _class: applicant._class,
            // ✅ CRITICAL: Pass through all application data
            interviewTime: applicant.interviewTime,
            applicationStatus: applicant.applicationStatus || 'APPLIED',
            // Application-specific fields
            website: applicant.website || '',
            phone: applicant.phone || '',
            resume: applicant.resume || null,
            coverLetter: applicant.coverLetter || ''
        };
    };

    
    return (
        <div className="mt-5 w-4/5 px-5">
            {/* Header Section */}
            <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        {job.jobTitle}
                    </h2>
                    
                    {/* Job Status Badge */}
                    <Badge 
                        variant="light" 
                        size="lg"
                        className={`${
                            statusDisplay === 'Open'
                                ? '!bg-cyan-500/10 !text-cyan-300 !border-cyan-500/30'
                                : '!bg-yellow-500/10 !text-yellow-300 !border-yellow-500/30'
                        }`}
                    >
                        {statusDisplay}
                    </Badge>
                    
                    {/* Applied Status Badge */}
                    {currentUserApplied && (
                        <Badge 
                            variant="light" 
                            size="lg"
                            className="!bg-green-500/10 !text-green-300 !border-green-500/30 animate-fade-in"
                        >
                            <span className="flex items-center gap-1">
                                <span className="text-lg">✓</span>
                                <span>Applied</span>
                            </span>
                        </Badge>
                    )}
                </div>
                
                <div className="flex items-center gap-2 text-mine-shaft-300">
                    <IconMapPin size={18} className="text-cyan-400" />
                    <h4 className="text-lg font-medium">{job.location}</h4>
                    <span className="text-mine-shaft-600">•</span>
                    <span className="text-sm">Posted {timeAgo(job.posTime)}</span>
                    {totalApplicants > 0 && (
                        <>
                            <span className="text-mine-shaft-600">•</span>
                            <span className="text-sm">{totalApplicants} total applicant{totalApplicants !== 1 ? 's' : ''}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Thêm value và onChange vào Tabs */}
            <Tabs 
                variant="outline" 
                radius="xl" 
                value={tab}
                onChange={(value) => handleTabChange(value)}
                classNames={{
                    tab: "data-[active]:!bg-cyan-500/20 data-[active]:!border-cyan-500/50 data-[active]:!text-cyan-300 hover:bg-mine-shaft-800/50 transition-all duration-300",
                    list: "border-mine-shaft-700/50 mb-8"
                }}
            >
                <Tabs.List className="text-base font-semibold flex w-full flex-nowrap overflow-x-auto">
                    {/* Tab 1 - Overview */}
                    <Tabs.Tab 
                        value="overview"
                        leftSection={<IconBuilding size={18} className="group-data-[active]:text-cyan-300" />}
                        className="group flex-1 min-w-0 whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">Overview</span>
                        <span className="sm:hidden">Info</span>
                    </Tabs.Tab>
                    
                    {/* Tab 2: Applied */}
                    <Tabs.Tab 
                        value="applicants"
                        leftSection={<IconBriefcase size={18} className="group-data-[active]:text-cyan-300" />}
                        className="group flex-1 min-w-0 whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">Applied {applicantsCount > 0 && `(${applicantsCount})`}</span>
                        <span className="sm:hidden">New {applicantsCount > 0 && `(${applicantsCount})`}</span>
                    </Tabs.Tab>
                    
                    {/* Tab 3: Interviewing */}
                    <Tabs.Tab 
                        value="interviewing"
                        leftSection={<IconUsers size={18} className="group-data-[active]:text-cyan-300" />}
                        className="group flex-1 min-w-0 whitespace-nowrap"
                    >
                        <span className="hidden lg:inline">Interviewing {interviewingCount > 0 && `(${interviewingCount})`}</span>
                        <span className="lg:hidden">Interview {interviewingCount > 0 && `(${interviewingCount})`}</span>
                    </Tabs.Tab>
                    
                    {/* Tab 4: Offered */}
                    <Tabs.Tab 
                        value="offered"
                        leftSection={<IconCheck size={18} className="group-data-[active]:text-cyan-300" />}
                        className="group flex-1 min-w-0 whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">Offered {offeredCount > 0 && `(${offeredCount})`}</span>
                        <span className="sm:hidden">Offer {offeredCount > 0 && `(${offeredCount})`}</span>
                    </Tabs.Tab>
                    
                    {/* Tab 5: Accepted (Hired) */}
                    <Tabs.Tab 
                        value="accepted"
                        leftSection={<IconCircleCheck size={18} className="group-data-[active]:text-green-300" />}
                        className="group flex-1 min-w-0 whitespace-nowrap data-[active]:!text-green-300"
                    >
                        Hired {acceptedCount > 0 && `(${acceptedCount})`}
                    </Tabs.Tab>
                    
                    {/* Tab 6: Rejected */}
                    <Tabs.Tab 
                        value="rejected"
                        leftSection={<IconX size={18} className="group-data-[active]:text-red-300" />}
                        className="group flex-1 min-w-0 whitespace-nowrap data-[active]:!text-red-300"
                    >
                        <span className="hidden sm:inline">Rejected {rejectedCount > 0 && `(${rejectedCount})`}</span>
                        <span className="sm:hidden">× {rejectedCount > 0 && `(${rejectedCount})`}</span>
                    </Tabs.Tab>
                </Tabs.List>

                {/* Active tab indicator glow */}
                <div className="relative">
                    <div className="absolute -top-8 left-0 w-full h-8 bg-gradient-to-b from-cyan-500/5 to-transparent blur-lg -z-10" />
                </div>

                {/* Tab Panel 1: Overview */}
                <Tabs.Panel value="overview" className="animate-fade-in [&>div]:w-full">
                    <JobDesc job={job} edit={edit} closed={job.jobStatus === "CLOSED"} />
                </Tabs.Panel>

                {/* Tab Panel 2: Applied */}
                <Tabs.Panel value="applicants" className="animate-fade-in">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-mine-shaft-100">
                                {applicantsCount} New Applicant{applicantsCount !== 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-mine-shaft-400 mt-1">
                                Review and schedule interviews with candidates
                            </p>
                        </div>
                    </div>

                    {applicantsCount > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {appliedApplicants.map((applicant: any, index: number) => {
                                const mappedTalent = mapApplicantToTalent(applicant);
                                const key = mappedTalent.applicantId || mappedTalent._id || `applicant-${index}`;
                                
                                return (
                                    <TalentCard 
                                        key={key} 
                                        talent={mappedTalent}
                                        posted={false} 
                                        invited={false} 
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-mine-shaft-800/50 flex items-center justify-center mb-4">
                                <IconBriefcase size={40} className="text-mine-shaft-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-mine-shaft-300 mb-2">
                                No new applicants
                            </h3>
                            <p className="text-mine-shaft-500 max-w-md">
                                When candidates apply for this position, they will appear here.
                            </p>
                        </div>
                    )}
                </Tabs.Panel>

                {/* Tab Panel 3: Interviewing */}
                <Tabs.Panel value="interviewing" className="animate-fade-in">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-mine-shaft-100">
                                {interviewingCount} Candidate{interviewingCount !== 1 ? 's' : ''} in Interview
                            </h3>
                            <p className="text-sm text-mine-shaft-400 mt-1">
                                Candidates currently in the interview process
                            </p>
                        </div>
                    </div>

                    {interviewingCount > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {interviewingApplicants.map((applicant: any, index: number) => {
                                const mappedTalent = mapApplicantToTalent(applicant);
                                const key = mappedTalent.applicantId || mappedTalent._id || `interviewing-${index}`;
                                
                                return (
                                    <TalentCard 
                                        key={key} 
                                        talent={mappedTalent}
                                        posted={true} 
                                        invited={true} 
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-mine-shaft-800/50 flex items-center justify-center mb-4">
                                <IconUsers size={40} className="text-mine-shaft-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-mine-shaft-300 mb-2">
                                No interviews scheduled
                            </h3>
                            <p className="text-mine-shaft-500 max-w-md">
                                Schedule interviews from the Applied tab.
                            </p>
                        </div>
                    )}
                </Tabs.Panel>

                {/* Tab Panel 4: Offered */}
                <Tabs.Panel value="offered" className="animate-fade-in">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-mine-shaft-100">
                                {offeredCount} Pending Offer{offeredCount !== 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-mine-shaft-400 mt-1">
                                Candidates who have received job offers
                            </p>
                        </div>
                    </div>

                    {offeredCount > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {offeredApplicants.map((applicant: any, index: number) => {
                                const mappedTalent = mapApplicantToTalent(applicant);
                                const key = mappedTalent.applicantId || mappedTalent._id || `offered-${index}`;
                                
                                return (
                                    <TalentCard 
                                        key={key} 
                                        talent={mappedTalent}
                                        posted={true} 
                                        invited={true} 
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-mine-shaft-800/50 flex items-center justify-center mb-4">
                                <IconCheck size={40} className="text-mine-shaft-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-mine-shaft-300 mb-2">
                                No offers made yet
                            </h3>
                            <p className="text-mine-shaft-500 max-w-md">
                                Make offers to candidates after successful interviews.
                            </p>
                        </div>
                    )}
                </Tabs.Panel>

                {/* Tab Panel 5: Accepted (Hired) */}
                <Tabs.Panel value="accepted" className="animate-fade-in">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-green-400">
                                {acceptedCount} Hired Candidate{acceptedCount !== 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-mine-shaft-400 mt-1">
                                Candidates who accepted the offer and are hired
                            </p>
                        </div>
                    </div>

                    {acceptedCount > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {acceptedApplicants.map((applicant: any, index: number) => {
                                const mappedTalent = mapApplicantToTalent(applicant);
                                const key = mappedTalent.applicantId || mappedTalent._id || `accepted-${index}`;
                                
                                return (
                                    <div key={key} className="relative">
                                        {/* Success badge overlay */}
                                        <div className="absolute -top-2 -right-2 z-10">
                                            <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <IconCircleCheck size={14} />
                                                <span>HIRED</span>
                                            </div>
                                        </div>
                                        <TalentCard 
                                            talent={mappedTalent}
                                            posted={true} 
                                            invited={true} 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                <IconCircleCheck size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-mine-shaft-300 mb-2">
                                No hires yet
                            </h3>
                            <p className="text-mine-shaft-500 max-w-md">
                                Candidates who accept your offers will appear here.
                            </p>
                        </div>
                    )}
                </Tabs.Panel>

                {/* Tab Panel 6: Rejected */}
                <Tabs.Panel value="rejected" className="animate-fade-in">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-red-400">
                                {rejectedCount} Rejected Candidate{rejectedCount !== 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-mine-shaft-400 mt-1">
                                Candidates who were rejected or declined the offer
                            </p>
                        </div>
                    </div>

                    {rejectedCount > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {rejectedApplicants.map((applicant: any, index: number) => {
                                const mappedTalent = mapApplicantToTalent(applicant);
                                const key = mappedTalent.applicantId || mappedTalent._id || `rejected-${index}`;
                                
                                return (
                                    <div key={key} className="relative opacity-60 hover:opacity-100 transition-opacity">
                                        {/* Rejected badge overlay */}
                                        <div className="absolute -top-2 -right-2 z-10">
                                            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <IconX size={14} />
                                                <span>REJECTED</span>
                                            </div>
                                        </div>
                                        <TalentCard 
                                            talent={mappedTalent}
                                            posted={true} 
                                            invited={true} 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <IconX size={40} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-mine-shaft-300 mb-2">
                                No rejections
                            </h3>
                            <p className="text-mine-shaft-500 max-w-md">
                                Rejected candidates will appear here for record keeping.
                            </p>
                        </div>
                    )}
                </Tabs.Panel>
            </Tabs>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

export default PostedJobDesc;