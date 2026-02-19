import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import JobDesc from "../JobDesc/JobDesc";
import RecomendedJobs from "../JobDesc/RecommendedJobs";
import { useEffect, useState } from "react";
import { getJob } from "../Services/JobService";

// Interface cho Job data từ backend
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
const JobDescPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
            getJob(Number(id))
                .then((res) => {
                    setJob(res);
                    setError(null);
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to load job details");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-[100vh] bg-mine-shaft-950 flex items-center justify-center">
                <div className="text-cyan-300 text-2xl font-bold animate-pulse">
                    Loading job details...
                </div>
            </div>
        );
    }

    // Error state
    if (error || !job) {
        return (
            <div className="min-h-[100vh] bg-mine-shaft-950 flex flex-col items-center justify-center gap-4">
                <div className="text-red-400 text-xl">{error || "Job not found"}</div>
                <Link to="/find-jobs">
                    <Button
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        size="md"
                    >
                        Back to Jobs
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins p-4">
            <Link to="/find-jobs" className="my-4 inline-block">
                <Button
                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/40 hover:border-cyan-300"
                    type="submit"
                    size="md"
                    variant="light"
                >
                    {/* Animated gradient background layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                    <span className="relative z-10 flex items-center gap-2">
                        <span className="group-hover:-translate-x-1 transition-transform duration-300">
                            <IconArrowLeft size={18} stroke={2.5} />
                        </span>
                        Back
                    </span>
                </Button>
            </Link>
            <div className="flex gap-10 justify-center mt-6 mb-10">
                <JobDesc job={job} />
                <RecomendedJobs />
            </div>
        </div>
    );
};

export default JobDescPage;