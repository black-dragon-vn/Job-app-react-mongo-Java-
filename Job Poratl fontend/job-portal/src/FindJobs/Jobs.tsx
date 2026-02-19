/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import JobCard from "./JobCard";
import Sort from "./Sort";
import { getAllJobs } from "../Services/JobService";
import { Button } from "@mantine/core";
import { IconX, IconFilter } from "@tabler/icons-react";
import { resetJobFilter } from "../Slices/jobFiltersSlice";

const Jobs = () => {
    const dispatch = useDispatch();
    const [allJobs, setAllJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const jobFilter = useSelector((state: any) => state.jobFilter);
    const sort = useSelector((state: any) => state.sort.jobSort);

    // Fetch all jobs on mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await getAllJobs();
                const activeJobs = res.filter((job: any) => job.jobStatus === "ACTIVE");
                setAllJobs(activeJobs);
                setError(null);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Apply filters - DÙNG useMemo
    const filteredJobs = useMemo(() => {
        let filtered = [...allJobs];

        // Filter by search text (job title or company)
        if (jobFilter.jobSearch && jobFilter.jobSearch.trim() !== '') {
            filtered = filtered.filter(job =>
                job.jobTitle?.toLowerCase().includes(jobFilter.jobSearch.toLowerCase()) ||
                job.company?.toLowerCase().includes(jobFilter.jobSearch.toLowerCase())
            );
        }

        // Filter by Job Title
        if (jobFilter["Job Title"] && jobFilter["Job Title"].length > 0) {
            filtered = filtered.filter(job =>
                jobFilter["Job Title"].some((title: string) =>
                    job.jobTitle?.toLowerCase().includes(title.toLowerCase())
                )
            );
        }

        // Filter by Location
        if (jobFilter["Location"] && jobFilter["Location"].length > 0) {
            filtered = filtered.filter(job =>
                jobFilter["Location"].some((loc: string) =>
                    job.location?.toLowerCase().includes(loc.toLowerCase())
                )
            );
        }

        // Filter by Job Type
        if (jobFilter["Job Type"] && jobFilter["Job Type"].length > 0) {
            filtered = filtered.filter(job =>
                jobFilter["Job Type"].some((type: string) =>
                    job.jobType?.toLowerCase().includes(type.toLowerCase())
                )
            );
        }

        // Filter by Skills
        if (jobFilter["Skills"] && jobFilter["Skills"].length > 0) {
            filtered = filtered.filter(job => {
                if (!job.skillsRequired || !Array.isArray(job.skillsRequired)) return false;
                return jobFilter["Skills"].some((skill: string) =>
                    job.skillsRequired.some((s: string) =>
                        s.toLowerCase().includes(skill.toLowerCase())
                    )
                );
            });
        }

        // Filter by Experience
        if (jobFilter["Experience"] && jobFilter["Experience"].length > 0) {
            filtered = filtered.filter(job =>
                jobFilter["Experience"].some((exp: string) =>
                    job.experience?.toLowerCase().includes(exp.toLowerCase())
                )
            );
        }

        // Filter by Salary Range
        if (jobFilter.salaryRange &&
            (jobFilter.salaryRange[0] !== 0 || jobFilter.salaryRange[1] !== 500000)) {
            filtered = filtered.filter(job => {
                const salary = job.packageOffered || 0;
                return salary >= jobFilter.salaryRange[0] &&
                    salary <= jobFilter.salaryRange[1];
            });
        }

        return filtered;
    }, [jobFilter, allJobs]);

    // Apply sorting - THÊM MỚI
    const sortedJobs = useMemo(() => {
        if (!sort || Object.keys(sort).length === 0 || sort === 'Relevance') {
            return filteredJobs;
        }

        return [...filteredJobs].sort((a, b) => {
            switch (sort) {
                case 'Most Recent':
                    // Sử dụng createdAt hoặc postedDate - điều chỉnh theo field trong database của bạn
                    const dateA = new Date(a.createdAt || a.postedDate || 0).getTime();
                    const dateB = new Date(b.createdAt || b.postedDate || 0).getTime();
                    return dateB - dateA;

                case 'Salary (Low to High)':
                    return (a.packageOffered || 0) - (b.packageOffered || 0);

                case 'Salary (High to Low)':
                    return (b.packageOffered || 0) - (a.packageOffered || 0);

                default:
                    return 0;
            }
        });
    }, [filteredJobs, sort]);

    // Count active filters
    const activeFiltersCount = () => {
        let count = 0;
        if (jobFilter.jobSearch) count++;
        if (jobFilter["Job Title"]?.length > 0) count++;
        if (jobFilter["Location"]?.length > 0) count++;
        if (jobFilter["Job Type"]?.length > 0) count++;
        if (jobFilter["Skills"]?.length > 0) count++;
        if (jobFilter["Experience"]?.length > 0) count++;
        if (jobFilter.salaryRange &&
            (jobFilter.salaryRange[0] !== 0 || jobFilter.salaryRange[1] !== 500000)) count++;
        return count;
    };

    if (loading) {
        return (
            <div className="p-5 flex justify-center items-center min-h-[400px]">
                <div className="text-mine-shaft-300 text-lg">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 flex justify-center items-center min-h-[400px]">
                <div className="text-red-400 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="text-2xl font-semibold text-white mb-2">
                        Recommended Jobs
                    </div>
                    <p className="text-mine-shaft-400">
                        {sortedJobs.length === allJobs.length ? (
                            `Browse ${sortedJobs.length} available positions`
                        ) : (
                            <>
                                Found <span className="text-cyan-400 font-semibold">
                                    {sortedJobs.length}
                                </span> of {allJobs.length} jobs
                                {activeFiltersCount() > 0 && (
                                    <span className="ml-2">
                                        with <span className="text-cyan-400 font-semibold">
                                            {activeFiltersCount()}
                                        </span> active filters
                                    </span>
                                )}
                            </>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {activeFiltersCount() > 0 && (
                        <Button
                            leftSection={<IconX size={18} />}
                            variant="subtle"
                            color="red"
                            onClick={() => dispatch(resetJobFilter())}
                        >
                            Clear Filters
                        </Button>
                    )}
                    <Sort sort="job" />
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount() > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-mine-shaft-900 rounded-lg border border-mine-shaft-800">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                        <IconFilter size={18} />
                        Active Filters:
                    </div>

                    {jobFilter.jobSearch && (
                        <div className="bg-cyan-900/20 text-cyan-400 px-3 py-1 rounded-full text-sm">
                            Search: "{jobFilter.jobSearch}"
                        </div>
                    )}

                    {jobFilter["Job Title"]?.map((title: string) => (
                        <div key={title} className="bg-purple-900/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                            💼 {title}
                        </div>
                    ))}

                    {jobFilter["Location"]?.map((loc: string) => (
                        <div key={loc} className="bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-sm">
                            📍 {loc}
                        </div>
                    ))}

                    {jobFilter["Job Type"]?.map((type: string) => (
                        <div key={type} className="bg-pink-900/20 text-pink-400 px-3 py-1 rounded-full text-sm">
                            🕒 {type}
                        </div>
                    ))}

                    {jobFilter["Skills"]?.map((skill: string) => (
                        <div key={skill} className="bg-blue-900/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            🔧 {skill}
                        </div>
                    ))}

                    {jobFilter["Experience"]?.map((exp: string) => (
                        <div key={exp} className="bg-yellow-900/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                            📊 {exp}
                        </div>
                    ))}

                    {jobFilter.salaryRange && (
                        jobFilter.salaryRange[0] !== 0 || jobFilter.salaryRange[1] !== 500000
                    ) && (
                            <div className="bg-orange-900/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                                💰 ${jobFilter.salaryRange[0] / 1000}K - ${jobFilter.salaryRange[1] / 1000}K
                            </div>
                        )}
                </div>
            )}

            {/* Jobs Grid */}
            {sortedJobs.length > 0 ? (
                <div className="flex flex-wrap gap-5 mt-10">
                    {sortedJobs.map((job, index) => (
                        <JobCard key={index} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <div className="text-gray-400 text-xl mb-2">
                        No jobs found matching your criteria
                    </div>
                    <div className="text-gray-500 mb-6">
                        Try adjusting your filters or search terms
                    </div>
                    {activeFiltersCount() > 0 && (
                        <Button
                            variant="filled"
                            color="cyan"
                            onClick={() => dispatch(resetJobFilter())}
                            leftSection={<IconX size={18} />}
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Jobs;