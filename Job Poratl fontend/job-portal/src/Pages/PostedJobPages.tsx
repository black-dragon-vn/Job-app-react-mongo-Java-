/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import PostedJob from "../PostedJob/PostedJob";
import PostedJobDesc from "../PostedJob/PostedJobDesc";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getJobPostedBy } from "../Services/JobService";

const PostedJobPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);
    const [jobList, setJobList] = useState<any[]>([]);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    window.scrollTo(0, 0);
    
    // Change from user?.id to user?.userId
    if (!user?.userId) {
        console.error("User ID not found");
        setLoading(false);
        return;
    }

    setLoading(true);
    
    // Change user.id to user.userId
    getJobPostedBy(user.userId)
        .then((res) => {
            console.log("Jobs fetched:", res);
            setJobList(res || []);
            
            if (!id && res && res.length > 0) {
                navigate(`/posted-job/${res[0].id}`, { replace: true });
                return;
            }
            
            const foundJob = res?.find((item: any) => String(item.id) === String(id));
            console.log("Found job:", foundJob);
            
            setJob(foundJob || null);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching jobs:", err);
            setLoading(false);
        });
}, [id, user?.userId, navigate]);  // Also update dependency

    return (
        <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins p-4">
            {loading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4 animate-pulse">
                            Loading...
                        </div>
                        <div className="text-mine-shaft-400">Fetching your posted jobs</div>
                    </div>
                </div>
            ) : !job ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-400 mb-4">
                            Job Not Found
                        </div>
                        <div className="text-mine-shaft-400 mb-4">
                            The job with ID <span className="text-cyan-300 font-semibold">{id}</span> was not found
                        </div>
                        {jobList.length > 0 && (
                            <button
                                onClick={() => navigate(`/posted-job/${jobList[0].id}`)}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
                            >
                                View First Job
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex gap-10 justify-center">
                    <PostedJob jobs={jobList} />
                    <PostedJobDesc job={job} edit={true} />
                </div>
            )}
        </div>
    );
};

export default PostedJobPage;