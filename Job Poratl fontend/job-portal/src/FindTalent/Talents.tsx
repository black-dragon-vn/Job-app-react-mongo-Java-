/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sort from "../FindJobs/Sort";
import TalentCard from "./TalentCard";
import { getAllProfile } from "../Services/ProfileService";
import { Button } from "@mantine/core";
import { IconX, IconFilter } from "@tabler/icons-react";
import { resetFilter } from "../Slices/filtersSlice";

const Talents = () => {
    const dispatch = useDispatch();
    const [allTalents, setAllTalents] = useState<any[]>([]);
    const filter = useSelector((state: any) => state.filter);
    const sort = useSelector((state: any) => state.sort.talentSort); // Lấy talentSort từ Redux

    // Fetch all profiles on mount
    useEffect(() => {
        getAllProfile()
            .then((res) => {
                setAllTalents(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Helper: Parse experience from profile
    const getTotalExperience = (experiences: any[]): number => {
        if (!experiences || experiences.length === 0) return 0;

        return experiences.reduce((total, exp) => {
            // 1. Nếu có trường years trực tiếp
            if (exp.years !== undefined && exp.years !== null) {
                return total + Number(exp.years);
            }

            // 2. Nếu có trường duration (vd: "2 years")
            if (exp.duration) {
                const match = exp.duration.match(/(\d+)/);
                if (match) return total + Number(match[1]);
            }

            // 3. Tính từ period string "2021 - Present" hoặc "2019 - 2021"
            if (exp.period) {
                const match = exp.period.match(/(\d{4})/g);
                if (match && match.length >= 2) {
                    const start = parseInt(match[0]);
                    const end = exp.period.includes('Present')
                        ? new Date().getFullYear()
                        : parseInt(match[1]);
                    return total + (end - start);
                }
                // Nếu chỉ có 1 năm và Present
                if (match && match.length === 1 && exp.period.includes('Present')) {
                    const start = parseInt(match[0]);
                    const end = new Date().getFullYear();
                    return total + (end - start);
                }
            }

            // 4. Tính từ startDate và endDate
            if (exp.startDate) {
                const start = new Date(exp.startDate).getFullYear();
                const end = exp.endDate
                    ? new Date(exp.endDate).getFullYear()
                    : new Date().getFullYear();
                return total + (end - start);
            }

            return total;
        }, 0);
    };

    // Apply filters - DÙNG useMemo
    const filteredTalents = useMemo(() => {
        let filtered = [...allTalents];

        // Filter by talent name
        if (filter.talentName && filter.talentName.trim() !== '') {
            filtered = filtered.filter(talent =>
                talent.name?.toLowerCase().includes(filter.talentName.toLowerCase())
            );
        }

        // Filter by Job Title
        if (filter["Job Title"] && filter["Job Title"].length > 0) {
            filtered = filtered.filter(talent =>
                filter["Job Title"].some((title: string) =>
                    talent.jobTitle?.toLowerCase().includes(title.toLowerCase()) ||
                    talent.role?.toLowerCase().includes(title.toLowerCase())
                )
            );
        }

        // Filter by Location
        if (filter["Location"] && filter["Location"].length > 0) {
            filtered = filtered.filter(talent =>
                filter["Location"].some((loc: string) =>
                    talent.location?.toLowerCase().includes(loc.toLowerCase())
                )
            );
        }

        // Filter by Skills
        if (filter["Skills"] && filter["Skills"].length > 0) {
            filtered = filtered.filter(talent => {
                if (!talent.skills) return false;
                return filter["Skills"].some((skill: string) =>
                    talent.skills.some((s: string) =>
                        s.toLowerCase().includes(skill.toLowerCase())
                    ) ||
                    talent.topSkills?.some((s: string) =>
                        s.toLowerCase().includes(skill.toLowerCase())
                    )
                );
            });
        }

        // Filter by Experience Range
        if (filter.experienceRange) {
            filtered = filtered.filter(talent => {
                const totalExp = getTotalExperience(talent.experiences || talent.experience);
                return totalExp >= filter.experienceRange[0] &&
                    totalExp <= filter.experienceRange[1];
            });
        }

        // Filter by Experience Level
        if (filter["Experience"] && filter["Experience"].length > 0) {
            filtered = filtered.filter(talent => {
                const years = getTotalExperience(talent.experiences || talent.experience);
                return filter["Experience"].some((exp: string) => {
                    if (exp.includes("Intern") || exp.includes("Fresher")) {
                        return years === 0;
                    }
                    if (exp.includes("Junior") || exp.includes("0-2")) {
                        return years >= 0 && years <= 2;
                    }
                    if (exp.includes("Mid") || exp.includes("2-5")) {
                        return years > 2 && years <= 5;
                    }
                    if (exp.includes("Senior") || exp.includes("5+")) {
                        return years > 5;
                    }
                    if (exp.includes("Lead") || exp.includes("Manager")) {
                        return years > 7;
                    }
                    return false;
                });
            });
        }

        // Filter by Job Type
        if (filter["Job Type"] && filter["Job Type"].length > 0) {
            filtered = filtered.filter(talent =>
                filter["Job Type"].some((type: string) =>
                    talent.jobType?.toLowerCase().includes(type.toLowerCase()) ||
                    talent.workType?.toLowerCase().includes(type.toLowerCase())
                )
            );
        }

        return filtered;
    }, [filter, allTalents]);

    // Apply sorting - THÊM MỚI
    const sortedTalents = useMemo(() => {
        if (!sort || sort === 'Relevance') {
            return filteredTalents;
        }
        
        return [...filteredTalents].sort((a, b) => {
            switch (sort) {
                case 'Most Recent':
                    const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
                    const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
                    return dateB - dateA;
                    
                case 'Experience (Low to High)':
                    const expA = getTotalExperience(a.experiences || a.experience);
                    const expB = getTotalExperience(b.experiences || b.experience);
                    return expA - expB;
                    
                case 'Experience (High to Low)':
                    const expA2 = getTotalExperience(a.experiences || a.experience);
                    const expB2 = getTotalExperience(b.experiences || b.experience);
                    return expB2 - expA2;
                    
                default:
                    return 0;
            }
        });
    }, [filteredTalents, sort]);

    // Count active filters
    const activeFiltersCount = () => {
        let count = 0;
        if (filter.talentName) count++;
        if (filter["Job Title"]?.length > 0) count++;
        if (filter["Location"]?.length > 0) count++;
        if (filter["Skills"]?.length > 0) count++;
        if (filter["Experience"]?.length > 0) count++;
        if (filter["Job Type"]?.length > 0) count++;
        return count;
    };

    return (
        <div className="min-h-screen bg-mine-shaft-950">
            {/* Main Content */}
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-2xl font-semibold text-white mb-2">
                            Talented Professionals
                        </div>
                        <p className="text-mine-shaft-400">
                            {sortedTalents.length === allTalents.length ? (
                                `Discover ${sortedTalents.length} skilled professionals ready for your projects`
                            ) : (
                                <>
                                    Found <span className="text-cyan-400 font-semibold">
                                        {sortedTalents.length}
                                    </span> of {allTalents.length} talents
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
                        {/* Reset Filter Button */}
                        {activeFiltersCount() > 0 && (
                            <Button
                                leftSection={<IconX size={18} />}
                                variant="subtle"
                                color="red"
                                onClick={() => dispatch(resetFilter())}
                            >
                                Clear Filters
                            </Button>
                        )}
                        <Sort sort="talent" />
                    </div>
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount() > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-mine-shaft-900 rounded-lg border border-mine-shaft-800">
                        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                            <IconFilter size={18} />
                            Active Filters:
                        </div>

                        {filter.talentName && (
                            <div className="bg-cyan-900/20 text-cyan-400 px-3 py-1 rounded-full text-sm">
                                Name: "{filter.talentName}"
                            </div>
                        )}

                        {filter["Job Title"]?.map((title: string) => (
                            <div key={title} className="bg-purple-900/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                                {title}
                            </div>
                        ))}

                        {filter["Location"]?.map((loc: string) => (
                            <div key={loc} className="bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-sm">
                                📍 {loc}
                            </div>
                        ))}

                        {filter["Skills"]?.map((skill: string) => (
                            <div key={skill} className="bg-blue-900/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                                💻 {skill}
                            </div>
                        ))}

                        {filter["Experience"]?.map((exp: string) => (
                            <div key={exp} className="bg-yellow-900/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                                📊 {exp}
                            </div>
                        ))}

                        {filter["Job Type"]?.map((type: string) => (
                            <div key={type} className="bg-pink-900/20 text-pink-400 px-3 py-1 rounded-full text-sm">
                                🕒 {type}
                            </div>
                        ))}

                        {filter.experienceRange && (
                            filter.experienceRange[0] !== 0 || filter.experienceRange[1] !== 50
                        ) && (
                            <div className="bg-orange-900/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                                Experience: {filter.experienceRange[0]} - {filter.experienceRange[1]} years
                            </div>
                        )}
                    </div>
                )}

                {/* Talents Grid */}
                {sortedTalents.length > 0 ? (
                    <div className="flex flex-wrap gap-6 mt-6">
                        {sortedTalents.map((talent: any) => (
                            <TalentCard
                                key={talent._id || talent.id}
                                talent={talent}
                                posted={true}
                                invited={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <div className="text-gray-400 text-xl mb-2">
                            No talents found matching your criteria
                        </div>
                        <div className="text-gray-500 mb-6">
                            Try adjusting your filters or search terms
                        </div>
                        {activeFiltersCount() > 0 && (
                            <Button
                                variant="filled"
                                color="cyan"
                                onClick={() => dispatch(resetFilter())}
                                leftSection={<IconX size={18} />}
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Talents;