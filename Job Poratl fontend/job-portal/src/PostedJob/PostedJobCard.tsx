/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconEye, IconPencil, IconTrash, IconClock, IconUsers, IconCurrencyDollar, IconMapPin, IconCalendar } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../Services/Utilities";
import { useState } from "react";

interface PostedJobCardProps {
    job: any;
    isSelected?: boolean;
    onSelect?: (jobId: string | null) => void;
}

const PostedJobCard = ({ job, isSelected = false, onSelect }: PostedJobCardProps) => {
    const navigate = useNavigate();
    const [isClicking, setIsClicking] = useState(false);

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/posted-job/${job.id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/edit-job/${job.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${job.jobTitle}"?`)) {
            console.log(`Delete job ${job.id}`);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Hiệu ứng click
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);

        // Xử lý toggle selection
        if (onSelect) {
            onSelect(isSelected ? null : job.id);
        }


        navigate(`/posted-job/${job.id}`);
    };

    // Map backend data to display format
    const status = job.jobStatus === 'ACTIVE' || job.jobStatus === 'OPEN' ? 'active' : 'draft';
    const applicantsCount = job.applicants?.length || 0;
    const salary = job.packageOffered
        ? `$${(job.packageOffered / 1000).toFixed(0)}k/year`
        : 'Negotiable';
    const postedDate = job.posTime ? timeAgo(job.posTime) : 'Recently';
    const views = job.views || 0;
    const tags = Array.isArray(job.skillsRequired) ? job.skillsRequired.slice(0, 3) : [];

    return (
        <div
            className="relative group cursor-pointer select-none"
            onClick={handleCardClick}
        >
            {/* Glow effect - Chỉ hiển thị khi được chọn */}
            <div
                className={`absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl transition-all duration-500 -z-10 ${isSelected
                    ? 'opacity-60 scale-100'
                    : 'opacity-0 scale-95 group-hover:opacity-20'
                    }`}
            />

            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center z-10 shadow-lg shadow-blue-500/50">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
            )}

            {/* Click animation */}
            {isClicking && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl animate-ping opacity-50 -z-5"></div>
            )}

            {/* Main Card */}
            <div className={`
                relative bg-gradient-to-br from-mine-shaft-800/50 via-mine-shaft-900/50 to-mine-shaft-900/70 
                border rounded-2xl p-6 backdrop-blur-sm transition-all duration-300
                ${isSelected
                    ? 'border-blue-500/70 shadow-xl shadow-blue-500/30 scale-[1.02]'
                    : 'border-mine-shaft-700/50 group-hover:border-blue-500/40 group-hover:shadow-lg group-hover:shadow-blue-500/10'
                }
                ${isClicking ? 'scale-95' : ''}
            `}>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                        <h3 className={`
                            font-bold text-xl transition-colors duration-300
                            ${isSelected ? 'text-white' : 'text-mine-shaft-100 group-hover:text-white'}
                        `}>
                            {job.jobTitle}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-sm text-mine-shaft-400">
                                <IconClock size={14} className={isSelected ? "text-blue-400" : "text-mine-shaft-500"} />
                                <span>{job.jobType}</span>
                            </div>
                            <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-mine-shaft-600'}`}></span>
                            <div className="flex items-center gap-1 text-sm text-mine-shaft-400">
                                <IconMapPin size={14} className={isSelected ? "text-blue-400" : "text-mine-shaft-500"} />
                                <span>{job.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div className={`
                        px-3 py-1 rounded-full text-xs font-bold transition-all duration-300
                        ${status === 'active'
                            ? isSelected
                                ? 'bg-gradient-to-r from-green-500/60 to-emerald-500/60 text-white border border-green-500/80'
                                : 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border border-green-500/40'
                            : isSelected
                                ? 'bg-gradient-to-r from-yellow-500/60 to-amber-500/60 text-white border border-yellow-500/80'
                                : 'bg-gradient-to-r from-yellow-500/30 to-amber-500/30 text-yellow-300 border border-yellow-500/40'
                        }
                    `}>
                        <span>
                            {job.jobStatus === 'ACTIVE' || job.jobStatus === 'OPEN'
                                ? 'LIVE'
                                : job.jobStatus === 'CLOSED'
                                    ? 'CLOSED'
                                    : 'DRAFT'}
                        </span>
                        <span className="opacity-50">•</span>
                        <span>{timeAgo(job?.posTime)}</span>

                    </div>
                </div>

                {/* Job details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <IconUsers size={16} className={isSelected ? "text-blue-300" : "text-blue-400"} />
                        <span className={`text-sm ${isSelected ? "text-blue-200" : "text-mine-shaft-300"}`}>
                            {applicantsCount} applicant{applicantsCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconCurrencyDollar size={16} className={isSelected ? "text-blue-300" : "text-blue-400"} />
                        <span className={`text-sm ${isSelected ? "text-blue-200" : "text-mine-shaft-300"}`}>
                            {salary}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconEye size={16} className={isSelected ? "text-blue-300" : "text-blue-400"} />
                        <span className={`text-sm ${isSelected ? "text-blue-200" : "text-mine-shaft-300"}`}>
                            {views} view{views !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconCalendar size={16} className={isSelected ? "text-blue-300" : "text-blue-400"} />
                        <span className={`text-sm ${isSelected ? "text-blue-200" : "text-mine-shaft-300"}`}>
                            {postedDate}
                        </span>
                    </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((tag: string, index: number) => (
                            <div
                                key={index}
                                className={`
                                    py-1 px-3 rounded-lg text-xs font-medium border transition-all duration-300
                                    ${isSelected
                                        ? 'bg-gradient-to-r from-blue-500/40 to-cyan-500/40 text-white border-blue-500/60'
                                        : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
                                    }
                                `}
                            >
                                {tag}
                            </div>
                        ))}
                        {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 3 && (
                            <div className={`
                                py-1 px-3 rounded-lg text-xs font-medium border transition-all duration-300
                                ${isSelected
                                    ? 'bg-mine-shaft-600 text-mine-shaft-200 border-mine-shaft-500'
                                    : 'bg-mine-shaft-800/50 text-mine-shaft-400 border-mine-shaft-700'
                                }
                            `}>
                                +{job.skillsRequired.length - 3} more
                            </div>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-mine-shaft-800/50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleView}
                            className="flex items-center gap-2 text-sm transition-all duration-300 hover:scale-105"
                        >
                            <IconEye size={16} className={isSelected ? "text-blue-300" : "text-blue-400"} />
                            <span className={isSelected ? "text-blue-300" : "text-blue-400 hover:text-blue-300"}>
                                View
                            </span>
                        </button>
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 text-sm transition-all duration-300 hover:scale-105"
                        >
                            <IconPencil size={16} className={isSelected ? "text-yellow-300" : "text-yellow-400"} />
                            <span className={isSelected ? "text-yellow-300" : "text-yellow-400 hover:text-yellow-300"}>
                                Edit
                            </span>
                        </button>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-sm transition-all duration-300 hover:scale-105"
                    >
                        <IconTrash size={16} className={isSelected ? "text-red-300" : "text-red-400"} />
                        <span className={isSelected ? "text-red-300" : "text-red-400 hover:text-red-300"}>
                            Delete
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostedJobCard;