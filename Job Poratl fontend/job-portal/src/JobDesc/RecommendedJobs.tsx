import { useEffect, useState } from "react";
import JobCard from "../FindJobs/JobCard";
import { getAllJobs } from "../Services/JobService";
import { useParams } from "react-router-dom";

const RecommendedJobs = () => {
    const [jobList, setJobList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {id} = useParams();
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await getAllJobs();
                // Filter to show only first 5 jobs
                setJobList(res.slice(0, 5).filter((job: { _id: string | undefined; }) => job._id !== id));
                setError(null);
            } catch (err) {
                console.error("Error fetching recommended jobs:", err);
                setError("Failed to load recommended jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchJobs();
    }, []);
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-mine-shaft-300">Loading recommended jobs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-red-400">{error}</div>
            </div>
        );
    }
    
    return (
        <div>
            <div className="text-xl font-semibold mb-5">Recommended Jobs</div>
            <div className="flex flex-col gap-5">
                {jobList.length > 0 ? (
                    jobList?.map((job, index) => (
                        <JobCard key={ index} job={job} />
                    ))
                ) : (
                    <div className="text-mine-shaft-300 text-center py-10">
                        No recommended jobs available
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecommendedJobs;