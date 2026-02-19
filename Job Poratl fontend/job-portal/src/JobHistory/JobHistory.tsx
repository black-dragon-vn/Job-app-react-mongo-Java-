/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs } from "@mantine/core";
import { IconBriefcase, IconBuilding, IconUsers, IconView360, IconCircleCheck, IconX } from "@tabler/icons-react";
import Card from "./Card";
import { useEffect, useState } from "react";
import { getAllJobs } from "../Services/JobService";
import { useSelector } from "react-redux";

const JobHistory = () => {
    const [activeTab, setActiveTab] = useState<string>('APPLIED');
    const [allJobs, setAllJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        getAllJobs()
            .then((res) => {
                console.log("Jobs loaded:", res);
                setAllJobs(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching jobs:", err);
                setLoading(false);
            });
    }, []);

    const handleTabChange = (value: string | null) => {
        if (value) {
            setActiveTab(value);
        }
    };

    // ✅ Filter jobs dựa trên applicationStatus từ backend
    const getFilteredJobs = () => {
        if (!allJobs || allJobs.length === 0) return [];

        switch (activeTab) {
            case 'APPLIED':
                // Tất cả jobs mà user đã apply (bất kể status)
                return allJobs.filter((job) => 
                    job.applicants?.some((applicant: any) => 
                        applicant.email === user.email || 
                        applicant.name === user.name
                    )
                );

            case 'SAVED':
                // Jobs mà user đã save
                const savedJobIds = profile.savedJobs || [];
                return allJobs.filter((job) => savedJobIds.includes(job.id));

            case 'OFFERED':
                // Jobs có applicationStatus = "OFFERED"
                return allJobs.filter((job) => 
                    job.applicants?.some((applicant: any) => 
                        (applicant.email === user.email || applicant.name === user.name) &&
                        applicant.applicationStatus === 'OFFERED'
                    )
                );

            case 'INTERVIEWING':
                // Jobs có applicationStatus = "INTERVIEWING"
                return allJobs.filter((job) => 
                    job.applicants?.some((applicant: any) => 
                        (applicant.email === user.email || applicant.name === user.name) &&
                        applicant.applicationStatus === 'INTERVIEWING'
                    )
                );

            case 'ACCEPTED':
                // ✅ NEW: Jobs có applicationStatus = "ACCEPTED"
                return allJobs.filter((job) => 
                    job.applicants?.some((applicant: any) => 
                        (applicant.email === user.email || applicant.name === user.name) &&
                        applicant.applicationStatus === 'ACCEPTED'
                    )
                );

            case 'REJECTED':
                // ✅ NEW: Jobs có applicationStatus = "REJECTED"
                return allJobs.filter((job) => 
                    job.applicants?.some((applicant: any) => 
                        (applicant.email === user.email || applicant.name === user.name) &&
                        applicant.applicationStatus === 'REJECTED'
                    )
                );

            default:
                return [];
        }
    };

    const filteredJobs = getFilteredJobs();

    // Helper function để check application status
    const getApplicationStatus = (job: any) => {
        const userApplication = job.applicants?.find((applicant: any) => 
            applicant.email === user.email || applicant.name === user.name
        );
        return userApplication?.applicationStatus || null;
    };

    return (
        <div className="w-full px-5 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] mb-2">
                    Job History
                </h2>
                <p className="text-mine-shaft-400 text-lg">
                    Track all your job applications and opportunities
                </p>
            </div>

            <div>
                <Tabs
                    variant="outline"
                    radius="xl"
                    value={activeTab}
                    onChange={handleTabChange}
                    classNames={{
                        tab: "data-[active]:!bg-cyan-500/20 data-[active]:!border-cyan-500/50 data-[active]:!text-cyan-300 hover:bg-mine-shaft-800/50 transition-all duration-300",
                        list: "border-mine-shaft-700/50 mb-8"
                    }}
                >
                    <Tabs.List className="text-base font-semibold flex w-full flex-wrap">
                        {/* Tab 1: Applied */}
                        <Tabs.Tab
                            value="APPLIED"
                            leftSection={<IconBuilding size={18} />}
                            className="group flex-1 min-w-0"
                        >
                            <span className="hidden sm:inline">Applied</span>
                            <span className="sm:hidden">All</span>
                            <span className="ml-1">
                                ({allJobs.filter((job) => 
                                    job.applicants?.some((a: any) => 
                                        a.email === user.email || a.name === user.name
                                    )
                                ).length})
                            </span>
                        </Tabs.Tab>

                        {/* Tab 2: Saved */}
                        <Tabs.Tab
                            value="SAVED"
                            leftSection={<IconBriefcase size={18} />}
                            className="group flex-1 min-w-0"
                        >
                            <span className="hidden sm:inline">Saved</span>
                            <span className="sm:hidden">💾</span>
                            <span className="ml-1">({profile.savedJobs?.length || 0})</span>
                        </Tabs.Tab>

                        {/* Tab 3: Interviewing */}
                        <Tabs.Tab
                            value="INTERVIEWING"
                            leftSection={<IconView360 size={18} />}
                            className="group flex-1 min-w-0"
                        >
                            <span className="hidden lg:inline">Interviewing</span>
                            <span className="lg:hidden">📅</span>
                            <span className="ml-1">
                                ({allJobs.filter((job) => 
                                    job.applicants?.some((a: any) => 
                                        (a.email === user.email || a.name === user.name) &&
                                        a.applicationStatus === 'INTERVIEWING'
                                    )
                                ).length})
                            </span>
                        </Tabs.Tab>

                        {/* Tab 4: Offered */}
                        <Tabs.Tab
                            value="OFFERED"
                            leftSection={<IconUsers size={18} />}
                            className="group flex-1 min-w-0"
                        >
                            <span className="hidden sm:inline">Offered</span>
                            <span className="sm:hidden">💼</span>
                            <span className="ml-1">
                                ({allJobs.filter((job) => 
                                    job.applicants?.some((a: any) => 
                                        (a.email === user.email || a.name === user.name) &&
                                        a.applicationStatus === 'OFFERED'
                                    )
                                ).length})
                            </span>
                        </Tabs.Tab>

                        {/* ✅ NEW Tab 5: Accepted (Hired) */}
                        <Tabs.Tab
                            value="ACCEPTED"
                            leftSection={<IconCircleCheck size={18} />}
                            className="group flex-1 min-w-0 data-[active]:!text-green-300"
                        >
                            <span className="hidden sm:inline">Accepted</span>
                            <span className="sm:hidden">✓</span>
                            <span className="ml-1">
                                ({allJobs.filter((job) => 
                                    job.applicants?.some((a: any) => 
                                        (a.email === user.email || a.name === user.name) &&
                                        a.applicationStatus === 'ACCEPTED'
                                    )
                                ).length})
                            </span>
                        </Tabs.Tab>

                        {/* ✅ NEW Tab 6: Rejected */}
                        <Tabs.Tab
                            value="REJECTED"
                            leftSection={<IconX size={18} />}
                            className="group flex-1 min-w-0 data-[active]:!text-red-300"
                        >
                            <span className="hidden sm:inline">Rejected</span>
                            <span className="sm:hidden">×</span>
                            <span className="ml-1">
                                ({allJobs.filter((job) => 
                                    job.applicants?.some((a: any) => 
                                        (a.email === user.email || a.name === user.name) &&
                                        a.applicationStatus === 'REJECTED'
                                    )
                                ).length})
                            </span>
                        </Tabs.Tab>
                    </Tabs.List>

                    <div className="relative">
                        <div className="absolute -top-8 left-0 w-full h-8 bg-gradient-to-b from-cyan-500/5 to-transparent blur-lg -z-10" />
                    </div>

                    {/* Applied Panel */}
                    <Tabs.Panel value="APPLIED" className="animate-fade-in">
                        <div className="flex flex-wrap gap-5 mt-10">
                            {loading ? (
                                <div className="text-mine-shaft-400 text-lg">Loading jobs...</div>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => {
                                    const status = getApplicationStatus(job);
                                    return (
                                        <Card 
                                            key={job.id} 
                                            job={job} 
                                            applied={true} 
                                            saved={profile.savedJobs?.includes(job.id)} 
                                            offered={status === 'OFFERED'} 
                                            interviewing={status === 'INTERVIEWING'} 
                                        />
                                    );
                                })
                            ) : (
                                <div className="w-full text-center py-20">
                                    <div className="text-mine-shaft-400 text-xl mb-2">No applied jobs yet</div>
                                    <div className="text-mine-shaft-500">Start applying to jobs to see them here</div>
                                </div>
                            )}
                        </div>
                    </Tabs.Panel>

                    {/* Saved Panel */}
                    <Tabs.Panel value="SAVED" className="animate-fade-in">
                        <div className="flex flex-wrap gap-5 mt-10">
                            {loading ? (
                                <div className="text-mine-shaft-400 text-lg">Loading jobs...</div>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => {
                                    const hasApplied = job.applicants?.some((a: any) => 
                                        a.email === user.email || a.name === user.name
                                    );
                                    const status = getApplicationStatus(job);
                                    return (
                                        <Card 
                                            key={job.id} 
                                            job={job} 
                                            applied={hasApplied} 
                                            saved={true} 
                                            offered={status === 'OFFERED'} 
                                            interviewing={status === 'INTERVIEWING'} 
                                        />
                                    );
                                })
                            ) : (
                                <div className="w-full text-center py-20">
                                    <div className="text-mine-shaft-400 text-xl mb-2">No saved jobs yet</div>
                                    <div className="text-mine-shaft-500">Save jobs you're interested in to view them later</div>
                                </div>
                            )}
                        </div>
                    </Tabs.Panel>

                    {/* Interviewing Panel */}
                    <Tabs.Panel value="INTERVIEWING" className="animate-fade-in">
                        <div className="flex flex-wrap gap-5 mt-10">
                            {loading ? (
                                <div className="text-mine-shaft-400 text-lg">Loading jobs...</div>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <Card 
                                        key={job.id} 
                                        job={job} 
                                        applied={true} 
                                        saved={profile.savedJobs?.includes(job.id)} 
                                        offered={false} 
                                        interviewing={true} 
                                    />
                                ))
                            ) : (
                                <div className="w-full text-center py-20">
                                    <div className="text-mine-shaft-400 text-xl mb-2">No interviews scheduled yet</div>
                                    <div className="text-mine-shaft-500">Your scheduled interviews will appear here</div>
                                </div>
                            )}
                        </div>
                    </Tabs.Panel>

                    {/* Offered Panel */}
                    <Tabs.Panel value="OFFERED" className="animate-fade-in">
                        <div className="flex flex-wrap gap-5 mt-10">
                            {loading ? (
                                <div className="text-mine-shaft-400 text-lg">Loading jobs...</div>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <Card 
                                        key={job.id} 
                                        job={job} 
                                        applied={true} 
                                        saved={profile.savedJobs?.includes(job.id)} 
                                        offered={true} 
                                        interviewing={false} 
                                    />
                                ))
                            ) : (
                                <div className="w-full text-center py-20">
                                    <div className="text-mine-shaft-400 text-xl mb-2">No job offers yet</div>
                                    <div className="text-mine-shaft-500">Keep applying! Your offers will appear here</div>
                                </div>
                            )}
                        </div>
                    </Tabs.Panel>

                    {/* ✅ NEW: Accepted Panel */}
                    <Tabs.Panel value="ACCEPTED" className="animate-fade-in">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-green-400 mb-2">
                                🎉 Congratulations!
                            </h3>
                            <p className="text-mine-shaft-400">
                                Jobs you've accepted - your new career opportunities!
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-5 mt-10">
                            {loading ? (
                                <div className="text-mine-shaft-400 text-lg">Loading jobs...</div>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div key={job.id} className="relative">
                                        {/* Success badge */}
                                        <div className="absolute -top-2 -right-2 z-10">
                                            <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                ✓ ACCEPTED
                                            </div>
                                        </div>
                                        <Card 
                                            job={job} 
                                            applied={true} 
                                            saved={profile.savedJobs?.includes(job.id)} 
                                            offered={false} 
                                            interviewing={false} 
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-20">
                                    <div className="text-mine-shaft-400 text-xl mb-2">No accepted offers yet</div>
                                    <div className="text-mine-shaft-500">Accept job offers to see them here</div>
                                </div>
                            )}
                        </div>
                    </Tabs.Panel>

                    {/* ✅ NEW: Rejected Panel */}
                    <Tabs.Panel value="REJECTED" className="animate-fade-in">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-red-400 mb-2">
                                Declined Offers
                            </h3>
                            <p className="text-mine-shaft-400">
                                Job offers you've declined
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-5 mt-10">
                            {loading ? (
                                <div className="text-mine-shaft-400 text-lg">Loading jobs...</div>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div key={job.id} className="relative opacity-60">
                                        {/* Rejected badge */}
                                        <div className="absolute -top-2 -right-2 z-10">
                                            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                × DECLINED
                                            </div>
                                        </div>
                                        <Card 
                                            job={job} 
                                            applied={true} 
                                            saved={profile.savedJobs?.includes(job.id)} 
                                            offered={false} 
                                            interviewing={false} 
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-20">
                                    <div className="text-mine-shaft-400 text-xl mb-2">No declined offers</div>
                                    <div className="text-mine-shaft-500">Offers you decline will appear here</div>
                                </div>
                            )}
                        </div>
                    </Tabs.Panel>
                </Tabs>
            </div>

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

export default JobHistory;