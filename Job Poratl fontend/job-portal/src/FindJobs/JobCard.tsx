/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconBookmark, IconClockHour3, IconMapPin, IconBriefcase, IconUsers, IconCheck } from "@tabler/icons-react";
import { Text, Badge, Tooltip, Skeleton, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../Slices/ProfileSlice";
import { sucessNotification } from "../Services/NotificationService";

// Job data type definition
interface Job {
  id: number;
  jobTitle: string;
  company: string;
  logo: string;
  applicants: [];
  about: string;
  experience: string;
  jobType: string;
  location: string;
  packageOffered: number;
  posTime: string;
  description: string;
  skillsRequired: string[];
  jobStatus: string;
  urgent?: boolean;
  featured?: boolean;
}

interface JobCardProps {
  job: Job;
  loading?: boolean;
}

const JobCard = ({ job, loading = false }: JobCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const profile = useSelector((state: any) => state.profile);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  //  LOAD SAVED JOBS FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    const loadSavedJobs = () => {
      const userId = profile.id || profile._id || user.id || user._id;
      if (!userId) return;

      try {
        const storageKey = `savedJobs_${userId}`;
        const savedJobsJson = localStorage.getItem(storageKey);
        
        if (savedJobsJson) {
          const savedJobsFromStorage = JSON.parse(savedJobsJson);
          
          // Only update if different from current Redux state
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
  }, [user.id, profile.id, dispatch, profile, profile.savedJobs]);

  //  LOCALSTORAGE-ONLY MODE (NO BACKEND CALLS)
  const handleSaveJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

      //  NO BACKEND CALL - Using localStorage only
      console.log(" Backend sync disabled - using localStorage only");

    } catch (error) {
      console.error(' localStorage error:', error);
      
      // Silently fail - don't show error to user
      // The app will still work, just this one save operation failed
    }
  };

  if (loading) {
    return <JobCardSkeleton />;
  }

  if (!job) return null;

  // Get company logo
  const getCompanyLogo = (company: string) => {
    const cleanCompany = company
      .replace(/Co\.,?\s*Ltd\.?/gi, '')
      .replace(/Ltd\.?/gi, '')
      .replace(/Inc\.?/gi, '')
      .replace(/Corporation/gi, '')
      .trim();

    return `https://logo.clearbit.com/${encodeURIComponent(cleanCompany.toLowerCase().replace(/\s+/g, ''))}.com`;
  };

  // Salary formatting
  const formatSalary = (salary: number) => {
    if (salary >= 1000000) {
      return `$${(salary / 1000000).toFixed(1)}M`;
    }
    if (salary >= 1000) {
      return `$${(salary / 1000).toFixed(1)}K`;
    }
    return `$${salary}`;
  };

  const logoUrl = (job.logo && job.logo.trim() !== "")
    ? job.logo
    : getCompanyLogo(job.company);

  // ✅ Check if job is saved
  const isSaved = profile.savedJobs?.includes(job.id) || false;

  return (
    <div className="group bg-mine-shaft-900 p-5 w-80 flex flex-col gap-4 rounded-xl transition-all duration-300 border border-mine-shaft-800 hover:border-bright-sun-400/50 hover:shadow-xl hover:shadow-bright-sun-500/10 hover:-translate-y-1">
      {/* Featured Badge */}
      {job.featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge
            radius="sm"
            className="bg-gradient-to-r from-bright-sun-500 to-bright-sun-600 text-mine-shaft-900 font-bold text-xs px-3 py-1 shadow-lg"
          >
            FEATURED
          </Badge>
        </div>
      )}

      {/* Urgent Indicator */}
      {job.urgent && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge
            radius="sm"
            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-xs px-3 py-1 shadow-lg animate-pulse"
          >
            URGENT
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 items-start flex-1 min-w-0">
          {/* Company Logo */}
          <div className="relative">
            <div className="p-2 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 rounded-xl flex-shrink-0 border border-mine-shaft-700 group-hover:border-bright-sun-400 transition-colors">
              <div className="h-10 w-10 relative overflow-hidden rounded-lg">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 bg-mine-shaft-700 animate-pulse rounded-lg" />
                )}
                <img
                  src={logoUrl}
                  alt={`${job.company} logo`}
                  className={`h-full w-full object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    setImageError(true);
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=0F172A&color=FBBF24&size=40&bold=true&format=svg`;
                  }}
                />
              </div>
            </div>

            {/* Verified Badge for some companies */}
            {job.company.toLowerCase().includes('tech') && (
              <div className="absolute -bottom-1 -right-1 bg-bright-sun-500 rounded-full p-0.5 border border-mine-shaft-900">
                <IconCheck size={10} className="text-mine-shaft-900" stroke={3} />
              </div>
            )}
          </div>

          {/* Job Title & Company */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-mine-shaft-100 truncate group-hover:text-bright-sun-300 transition-colors">
              {job.jobTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-mine-shaft-300 truncate">
                {job.company}
              </span>
              <div className="flex items-center gap-1 text-xs text-mine-shaft-500">
                <IconUsers size={12} />
                <span>{job.applicants?.length || 0} applicants</span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Save Button (localStorage only) */}
        <Tooltip 
          label={isSaved ? "Remove from saved" : "Save job"} 
          position="top" 
          withArrow
        >
          <button
            onClick={handleSaveJob}
            className="p-2 hover:bg-mine-shaft-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          >
            <IconBookmark
              className={`transition-all duration-300 ${
                isSaved
                  ? "text-bright-sun-400 fill-bright-sun-400"
                  : "text-mine-shaft-400 group-hover:text-bright-sun-300"
              }`}
              size={22}
              stroke={1.5}
            />
          </button>
        </Tooltip>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 px-3 py-1 bg-mine-shaft-800 rounded-lg">
          <IconBriefcase size={14} className="text-mine-shaft-400" />
          <span className="text-xs text-mine-shaft-300">{job.jobType}</span>
        </div>

        <div className="flex items-center gap-1 px-3 py-1 bg-mine-shaft-800 rounded-lg">
          <IconMapPin size={14} className="text-mine-shaft-400" />
          <span className="text-xs text-mine-shaft-300 truncate max-w-[100px]">{job.location}</span>
        </div>

        <div className="flex items-center gap-1 px-3 py-1 rounded-lg">
          {/* Experience Level */}
          {job.experience && (
            <Badge
              variant="outline"
              color="yellow"
              size="sm"
              className="border-mine-shaft-600 text-mine-shaft-300"
            >
              {job.experience}
            </Badge>
          )}
        </div>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {job.skillsRequired?.slice(0, 5).map((skill, index) => (
          <div
            key={index}
            className="px-3 py-1.5 bg-gradient-to-r from-mine-shaft-800 to-mine-shaft-700 text-bright-sun-300 rounded-lg text-xs font-medium border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors"
          >
            {skill}
          </div>
        ))}
        {job.skillsRequired?.length > 5 && (
          <Tooltip label={`${job.skillsRequired.slice(5).join(', ')}`} position="top" withArrow>
            <div className="px-3 py-1.5 bg-mine-shaft-800 text-mine-shaft-400 rounded-lg text-xs font-medium hover:bg-mine-shaft-700 transition-colors cursor-help">
              +{job.skillsRequired.length - 5}
            </div>
          </Tooltip>
        )}
      </div>

      {/* Job Description */}
      <Text
        lineClamp={3}
        className="text-sm text-mine-shaft-300 leading-relaxed"
      >
        {job.about}
      </Text>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-mine-shaft-700 to-transparent" />

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold text-mine-shaft-100">
            {formatSalary(job.packageOffered)}
            <span className="text-xs text-mine-shaft-400 font-normal">/year</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-mine-shaft-400">
          <IconClockHour3 size={14} className="text-bright-sun-400" />
          <span className="group-hover:text-mine-shaft-300 transition-colors">
            <span>{timeAgo(job.posTime)}</span>
          </span>
        </div>
      </div>

      <Link to={`/jobs/${job.id}`}>
        <Button
          className="group relative w-full mt-2 overflow-hidden bg-gradient-to-r from-bright-sun-500 via-amber-500 to-orange-500 hover:from-bright-sun-400 hover:via-bright-sun-500 hover:to-amber-600 text-mine-shaft-900 font-bold transition-all duration-500 hover:scale-[1.05] shadow-xl hover:shadow-2xl hover:shadow-bright-sun-500/70 border-2 border-bright-sun-200/40 animate-pulse hover:animate-none"
          variant="light"
          size="sm"
        >
          {/* Multiple glow layers */}
          <div className="absolute -inset-1 bg-gradient-to-r from-bright-sun-400 via-amber-500 to-orange-400 opacity-50 group-hover:opacity-75 blur-lg transition-opacity duration-500" />
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-700" />

          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            <span className="group-hover:tracking-wider transition-all duration-300">View Details</span>
            <span className="text-lg group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300">→</span>
          </span>
        </Button>
      </Link>

      {/* Hover Effect Indicator */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-bright-sun-400/20 pointer-events-none transition-all duration-300" />
    </div>
  );
};

// Skeleton Loader
const JobCardSkeleton = () => {
  return (
    <div className="bg-mine-shaft-900 p-5 w-80 flex flex-col gap-4 rounded-2xl border border-mine-shaft-800">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start flex-1">
          <Skeleton height={44} width={44} radius="md" />
          <div className="flex-1">
            <Skeleton height={20} width="80%" radius="sm" className="mb-2" />
            <Skeleton height={14} width="60%" radius="sm" />
          </div>
        </div>
        <Skeleton height={32} width={32} radius="md" />
      </div>

      <div className="flex gap-2">
        <Skeleton height={28} width={80} radius="lg" />
        <Skeleton height={28} width={100} radius="lg" />
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} height={28} width={70} radius="lg" />
        ))}
      </div>

      <Skeleton height={60} radius="md" />

      <Skeleton height={1} width="100%" />

      <div className="flex justify-between">
        <Skeleton height={20} width={80} radius="sm" />
        <Skeleton height={20} width={60} radius="sm" />
      </div>
    </div>
  );
};

export default JobCard;