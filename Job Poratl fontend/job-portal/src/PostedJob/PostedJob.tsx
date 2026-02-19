/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs } from "@mantine/core";
import { IconPlus, IconDownload } from "@tabler/icons-react";
import PostedJobCard from "./PostedJobCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PostedJobProps {
    jobs?: any[];
}

const PostedJob = ({ jobs = [] }: PostedJobProps) => {
    const [activeTab, setActiveTab] = useState('active');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const navigate = useNavigate();
    
    // Filter jobs based on status
    const activeJobs = jobs.filter((job: any) => job.jobStatus === 'ACTIVE' || job.jobStatus === 'OPEN');
    const draftJobs = jobs.filter((job: any) => job.jobStatus === 'DRAFT');
    const closeJobs = jobs.filter((job: any) => job.jobStatus === 'CLOSED');
    
    // Hiển thị jobs theo tab được chọn
    const displayJobs = activeTab === 'active' 
        ? activeJobs 
        : activeTab === 'draft' 
            ? draftJobs 
            : closeJobs;
    
    // Calculate stats
    const calculateStats = (jobsList: any[]) => {
        if (!jobsList || jobsList.length === 0) {
            return {
                totalApplicants: 0,
                avgViews: 0,
                remoteJobs: 0,
                avgSalary: '$0'
            };
        }

        const totalApplicants = jobsList.reduce((sum, job) => 
            sum + (job.applicants?.length || 0), 0
        );
        
        const avgViews = Math.round(
            jobsList.reduce((sum, job) => sum + (job.views || 0), 0) / jobsList.length
        );
        
        const remoteJobs = jobsList.filter(job => 
            job.location?.toLowerCase().includes('remote')
        ).length;
        
        const avgSalaryNum = jobsList.reduce((sum, job) => 
            sum + (job.packageOffered || 0), 0
        ) / jobsList.length;
        
        const avgSalary = avgSalaryNum > 0 
            ? `$${Math.round(avgSalaryNum / 1000)}k` 
            : '$0';

        return {
            totalApplicants,
            avgViews,
            remoteJobs,
            avgSalary
        };
    };

    const stats = calculateStats(displayJobs);

    const handlePostNewJob = () => {
        navigate('/post-job');
    };

    const handleExportData = () => {
        console.log('Export data');
        // TODO: Implement export functionality
    };

    // Handler để xử lý việc chọn/bỏ chọn thẻ
    const handleSelectJob = (jobId: string | null) => {
        setSelectedJobId(jobId);
    };

    // Reset selection khi chuyển tab
    const handleTabChange = (value: string | null) => {
        setActiveTab(value as string);
        setSelectedJobId(null);
    };

    return (
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-mine-shaft-900/40 via-mine-shaft-950/40 to-mine-shaft-950/60 border border-mine-shaft-700/50 backdrop-blur-xl shadow-xl">
            {/* Background effects */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-purple-500/5 -z-10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
                        <div className="relative p-4 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-blue-300">📋</div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            Posted Jobs
                        </h3>
                        <p className="text-mine-shaft-300/80 mt-2 text-lg">
                            Manage your job listings and applications
                        </p>
                    </div>
                </div>
                <div className="hidden lg:block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full text-blue-300 font-bold backdrop-blur-sm">
                    {jobs.length} Job{jobs.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Tabs Section with Mantine Tabs */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange}
                            variant="pills"
                            className="w-full"
                        >
                            <Tabs.List className="[&_button[aria-selected='false']]:bg-mine-shaft-800 [&_button[aria-selected='false']]:text-mine-shaft-400 [&_button[aria-selected='true']]:bg-gradient-to-r [&_button[aria-selected='true']]:from-blue-500 [&_button[aria-selected='true']]:to-cyan-500 font-bold">
                                <Tabs.Tab value="active" className="px-6 py-3">
                                    Active [{activeJobs.length}]
                                </Tabs.Tab>
                                <Tabs.Tab value="draft" className="px-6 py-3">
                                    Drafts [{draftJobs.length}]
                                </Tabs.Tab>
                                <Tabs.Tab value="closed" className="px-6 py-3">
                                    Closed [{closeJobs.length}]
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs>
                    </div>
                    
                    {/* Create new job button */}
                    <div className="ml-6">
                        <button 
                            onClick={handlePostNewJob}
                            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 border border-blue-400/40"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                            <span className="relative z-10 flex items-center gap-2">
                                <IconPlus size={20} />
                                Post New Job
                            </span>
                        </button>
                    </div>
                </div>

                {/* Stats Bar - hiển thị cho cả 3 tabs */}
                {displayJobs.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                            <div className="text-sm text-mine-shaft-400 mb-1">Total Applicants</div>
                            <div className="text-2xl font-bold text-blue-300">
                                {stats.totalApplicants}
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                            <div className="text-sm text-mine-shaft-400 mb-1">Avg. Views</div>
                            <div className="text-2xl font-bold text-cyan-300">
                                {stats.avgViews}
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                            <div className="text-sm text-mine-shaft-400 mb-1">Remote Jobs</div>
                            <div className="text-2xl font-bold text-purple-300">
                                {stats.remoteJobs}
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-mine-shaft-800/30 to-mine-shaft-900/30 border border-mine-shaft-700/50">
                            <div className="text-sm text-mine-shaft-400 mb-1">Avg. Salary</div>
                            <div className="text-2xl font-bold text-blue-400">{stats.avgSalary}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
                {displayJobs.length > 0 ? (
                    displayJobs.map(job => (
                        <PostedJobCard 
                            key={job.id} 
                            job={job}
                            isSelected={selectedJobId === job.id}
                            onSelect={handleSelectJob}
                        />
                    ))
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6">
                            <div className="text-3xl">📝</div>
                        </div>
                        <h4 className="text-2xl font-bold text-mine-shaft-200 mb-4">
                            No {activeTab === 'active' ? 'Active' : activeTab === 'draft' ? 'Draft' : 'Closed'} Jobs
                        </h4>
                        <p className="text-mine-shaft-400 max-w-lg mx-auto mb-8">
                            {activeTab === 'active' 
                                ? 'You don\'t have any active job listings. Create a new job posting to find talented candidates.'
                                : activeTab === 'draft'
                                    ? 'You don\'t have any draft job listings. Start creating a new job to save as draft.'
                                    : 'You don\'t have any closed job listings.'}
                        </p>
                        {activeTab !== 'closed' && (
                            <button 
                                onClick={handlePostNewJob}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 mx-auto"
                            >
                                <IconPlus size={20} />
                                <span>Create New Job</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            {displayJobs.length > 0 && (
                <div className="mt-10 pt-6 border-t border-mine-shaft-800/50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-mine-shaft-400">
                            Showing {displayJobs.length} of {displayJobs.length} job{displayJobs.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleExportData}
                                className="px-4 py-2 bg-mine-shaft-800 hover:bg-mine-shaft-700 text-mine-shaft-300 rounded-lg transition-colors duration-300 text-sm flex items-center gap-2"
                            >
                                <IconDownload size={18} />
                                Export Data
                            </button>
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all duration-300 text-sm">
                                Manage All Jobs
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostedJob;