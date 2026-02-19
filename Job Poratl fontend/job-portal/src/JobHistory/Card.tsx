/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconBookmark, IconBookmarkFilled, IconCalendarMonth, IconClockHour3 } from "@tabler/icons-react";
import { Button, Divider, Text, Modal } from "@mantine/core";
import { Link } from "react-router-dom";
import { formatInterviewTime, timeAgo } from "../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../Slices/ProfileSlice";
import { changeAppStatus } from "../Services/JobService";
import { errNotification, sucessNotification } from "../Services/NotificationService";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";

interface Applicant {
    applicantId?: number;
    id?: number;
    interviewTime?: string;
    applicationStatus?: string;
    name?: string;
    email?: string;
}

interface Job {
    id: number;
    jobTitle: string;
    company: string;
    applicants: Applicant[];
    logo: string;
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

interface JobCardProps {
    job: Job;
    applied?: boolean;
    saved?: boolean;
    offered?: boolean;
    interviewing?: boolean;
}

const Card = ({ job, applied = false, saved = false, offered = false, interviewing = false }: JobCardProps) => {
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const dispatch = useDispatch();

    const isSaved = profile.savedJobs?.includes(job.id) || saved;
    
    const [confirmModal, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
    const [pendingAction, setPendingAction] = useState<{ status: string; message: string } | null>(null);

    //  LOAD SAVEDJOBS TỪ LOCALSTORAGE KHI COMPONENT MOUNT
    useEffect(() => {
        const loadSavedJobs = () => {
            const userId = profile.id || profile._id || user.id || user._id;
            if (!userId) return;

            try {
                const storageKey = `savedJobs_${userId}`;
                const savedJobsJson = localStorage.getItem(storageKey);
                
                if (savedJobsJson) {
                    const savedJobsFromStorage = JSON.parse(savedJobsJson);
                    
                    // Chỉ update nếu khác với Redux state hiện tại
                    if (JSON.stringify(savedJobsFromStorage) !== JSON.stringify(profile.savedJobs)) {
                        console.log(" Loading savedJobs from localStorage:", savedJobsFromStorage);
                        dispatch(changeProfile({
                            ...profile,
                            savedJobs: savedJobsFromStorage
                        }));
                    }
                }
            } catch (error) {
                console.error('Failed to load saved jobs from localStorage:', error);
            }
        };

        loadSavedJobs();
    }, [user.id, profile.id]); // Chỉ chạy khi user ID thay đổi

    if (!job) return null;

    const currentUserApplication = job.applicants?.find(
        (applicant: Applicant) => {
            if (applicant.email && user.email && applicant.email === user.email) {
                return true;
            }
            if (applicant.name && user.name && applicant.name === user.name) {
                return true;
            }
            const applicantId = applicant.applicantId || applicant.id;
            const userId = user.id || user._id;
            if (applicantId && userId) {
                if (applicantId === userId || 
                    applicantId?.toString() === userId?.toString()) {
                    return true;
                }
            }
            return false;
        }
    );

    const userInterviewTime = currentUserApplication?.interviewTime;
    
    const getCompanyLogo = (company: string) => {
        const cleanCompany = company
            .replace(/Co\.,?\s*Ltd\.?/gi, '')
            .replace(/Ltd\.?/gi, '')
            .replace(/Inc\.?/gi, '')
            .replace(/Corporation/gi, '')
            .trim();
        return `https://logo.clearbit.com/${encodeURIComponent(cleanCompany.toLowerCase().replace(/\s+/g, ''))}.com`;
    };

    const formatSalary = (salary: number) => {
        if (salary >= 1000000) {
            return `$${(salary / 1000000).toFixed(1)}M`;
        }
        if (salary >= 1000) {
            return `$${(salary / 1000).toFixed(1)}K`;
        }
        return `$${salary}`;
    };

    const logoUrl = (job.logo && job.logo.trim() !== "") ? job.logo : getCompanyLogo(job.company);

    // SAVE/UNSAVE JOB - CHỈ LOCALSTORAGE, KHÔNG BACKEND
    const handleSaveJob = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const userId = profile.id || profile._id || user.id || user._id;
        
        if (!userId) {
            errNotification("Error", "User not authenticated");
            return;
        }

        const savedJobs: number[] = Array.isArray(profile.savedJobs)
            ? [...profile.savedJobs]
            : [];

        const isSaving = !savedJobs.includes(job.id);
        
        const updatedSavedJobs = isSaving
            ? [...savedJobs, job.id]
            : savedJobs.filter(id => id !== job.id);

        // 1. Update Redux (instant UI)
        dispatch(changeProfile({
            ...profile,
            savedJobs: updatedSavedJobs
        }));

        try {
            // 2. Save to localStorage
            const storageKey = `savedJobs_${userId}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedSavedJobs));
            console.log("💾 Saved to localStorage:", storageKey, updatedSavedJobs);

            // 3. Success notification
            sucessNotification(
                "Success",
                isSaving ? "✓ Job saved" : "✓ Job removed"
            );

            // ⚠️ BACKEND SYNC DISABLED
            // Backend /profiles/update returns 500 error
            console.log("ℹ️ Backend sync disabled - using localStorage only");

        } catch (error: any) {
            console.error('❌ Save operation failed:', error);
            
            // Rollback Redux on error
            dispatch(changeProfile({
                ...profile,
                savedJobs: savedJobs
            }));
            
            errNotification(
                "Error",
                error?.message || "Failed to save job"
            );
        }
    };

    const handleConfirmAction = (status: string, message: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPendingAction({ status, message });
        openConfirm();
    };

    const executeAction = () => {
        if (pendingAction && currentUserApplication) {
            const applicantId = currentUserApplication.applicantId || currentUserApplication.id;
            
            if (!applicantId) {
                errNotification("Error", "Unable to identify applicant");
                closeConfirm();
                return;
            }

            const payload = {
                id: job.id,
                applicantId: applicantId,
                applicationStatus: pendingAction.status
            };

            changeAppStatus(payload)
                .then(() => {
                    const messages: Record<string, string> = {
                        ACCEPTED: "✅ Offer accepted successfully! Congratulations!",
                        REJECTED: "Offer declined"
                    };

                    sucessNotification("Success", messages[pendingAction.status] || "Status updated");
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch((err) => {
                    console.error("Error updating status:", err);
                    errNotification("Error", err?.response?.data?.errorMessage || "Failed to update status");
                })
                .finally(() => {
                    closeConfirm();
                    setPendingAction(null);
                });
        }
    };

    return (
        <>
            <Link
                to={`/jobs/${job.id}`}
                className="group bg-mine-shaft-900 p-5 w-80 flex flex-col gap-4 rounded-xl transition-all duration-300 border border-mine-shaft-800 hover:border-bright-sun-400/50 hover:shadow-xl hover:shadow-bright-sun-400/10 hover:-translate-y-1"
            >
                <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-start flex-1">
                        <div className="p-2.5 bg-mine-shaft-800/50 rounded-lg flex-shrink-0 border border-mine-shaft-700 group-hover:border-bright-sun-400/30 transition-colors">
                            <img
                                src={logoUrl}
                                alt={`${job.company} logo`}
                                className="h-8 w-8 object-contain rounded"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=0F172A&color=FBBF24&size=32&bold=true&format=svg`;
                                }}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-mine-shaft-50 truncate text-base group-hover:text-bright-sun-400 transition-colors">
                                {job.jobTitle}
                            </h3>
                            <div className="text-sm text-mine-shaft-300 truncate mt-1">
                                {job.company} • <span className="text-mine-shaft-400">{job.applicants?.length || 0} Applicants</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveJob}
                        className="p-2 hover:bg-mine-shaft-800/50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                        {isSaved ? (
                            <IconBookmarkFilled
                                className="text-bright-sun-400 cursor-pointer"
                                size={22}
                                stroke={1.5}
                            />
                        ) : (
                            <IconBookmark
                                className="text-mine-shaft-400 group-hover:text-bright-sun-300 transition-colors"
                                size={22}
                                stroke={1.5}
                            />
                        )}
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {job.skillsRequired?.slice(0, 4).map((skill, index) => (
                        <div
                            key={index}
                            className="py-1.5 px-3 bg-mine-shaft-800/70 text-bright-sun-300 rounded-lg text-xs font-medium border border-mine-shaft-700 group-hover:border-bright-sun-400/30 transition-colors"
                        >
                            {skill}
                        </div>
                    ))}
                    {job.skillsRequired && job.skillsRequired.length > 4 && (
                        <div className="py-1.5 px-3 bg-mine-shaft-900/50 text-mine-shaft-400 rounded-lg text-xs font-medium border border-mine-shaft-700">
                            +{job.skillsRequired.length - 4}
                        </div>
                    )}
                </div>

                <Text
                    lineClamp={3}
                    className="text-sm text-justify text-mine-shaft-300 leading-relaxed"
                >
                    {job.about || job.description}
                </Text>

                <Divider size="xs" className="!border-mine-shaft-700/50" />

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-lg text-mine-shaft-50">
                            {formatSalary(job.packageOffered)}
                        </span>
                        <span className="text-xs text-mine-shaft-400">/year</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mine-shaft-400">
                        <IconClockHour3 stroke={1.5} className="h-4 w-4 text-bright-sun-400" />
                        <span className="font-medium">{applied ? "Applied" : "Posted"}</span>
                        <span className="text-mine-shaft-300">{timeAgo(job.posTime)}</span>
                    </div>
                </div>

                {(offered || interviewing) && (
                    <>
                        <Divider size="xs" className="!border-mine-shaft-700/50" />

                        {offered && (
                            <div className="flex gap-3">
                                <Button
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-lg transition-all duration-300 flex-1 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95"
                                    variant="gradient"
                                    size="md"
                                    onClick={(e) => handleConfirmAction("ACCEPTED", "Are you sure you want to accept this offer?", e)}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        ✓ Accept Offer
                                    </span>
                                </Button>
                                <Button
                                    className="bg-mine-shaft-800 hover:bg-mine-shaft-700 text-mine-shaft-300 hover:text-white font-semibold rounded-lg transition-all duration-300 flex-1 border border-mine-shaft-700 hover:border-mine-shaft-500"
                                    variant="light"
                                    size="md"
                                    onClick={(e) => handleConfirmAction("REJECTED", "Are you sure you want to decline this offer?", e)}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        × Decline
                                    </span>
                                </Button>
                            </div>
                        )}

                        {interviewing && userInterviewTime && (
                            <div className="flex items-center gap-3 p-3 bg-mine-shaft-800/30 rounded-lg border border-mine-shaft-700">
                                <div className="p-2 bg-bright-sun-400/10 rounded-lg">
                                    <IconCalendarMonth className="text-bright-sun-400 w-5 h-5" stroke={1.5} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-mine-shaft-50">Interview Scheduled</div>
                                    <div className="text-xs text-mine-shaft-400">
                                        <span className="text-bright-sun-300 font-medium">
                                            {formatInterviewTime(userInterviewTime)} (JST)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Link>

            <Modal
                opened={confirmModal}
                onClose={closeConfirm}
                title={
                    <span className="text-lg font-semibold">
                        {pendingAction?.status === 'ACCEPTED' ? '🎉 Accept Offer' : '❌ Decline Offer'}
                    </span>
                }
                centered
                size="sm"
            >
                <div className="flex flex-col gap-4">
                    <Text className="text-mine-shaft-300">
                        {pendingAction?.message}
                    </Text>
                    <div className="flex gap-2">
                        <Button
                            color="gray"
                            variant="light"
                            fullWidth
                            onClick={closeConfirm}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={pendingAction?.status === 'ACCEPTED' ? 'green' : 'red'}
                            fullWidth
                            onClick={executeAction}
                        >
                            {pendingAction?.status === 'ACCEPTED' ? 'Accept' : 'Decline'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Card;