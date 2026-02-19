/* eslint-disable react-hooks/set-state-in-effect */
import { Divider, Input, RangeSlider } from "@mantine/core"
import React, { useState, useEffect } from "react"
import { IconPigMoney, IconSearch} from "@tabler/icons-react"
import MultiInput from "./MultiInput"
import { useDispatch, useSelector } from "react-redux"
import { setJobSearch, setSalaryRange } from "../Slices/jobFiltersSlice"
import type { JobFilterState } from "../Slices/jobFiltersSlice"
import { jobSearchFields } from "../Data/jobSearchFields "

interface RootState {
    jobFilter: JobFilterState;
}



const JobSearchBar = () => {
    const dispatch = useDispatch();
    const jobFilter = useSelector((state: RootState) => state.jobFilter);
    
    const [salaryRange, setSalaryRangeLocal] = useState<[number, number]>([0, 500000]);
    const [searchText, setSearchText] = useState("");
    
    // Sync with Redux state
    useEffect(() => {
        if (jobFilter.salaryRange) {
            setSalaryRangeLocal(jobFilter.salaryRange);
        }
        if (jobFilter.jobSearch !== undefined) {
            setSearchText(jobFilter.jobSearch);
        }
    }, [jobFilter.salaryRange, jobFilter.jobSearch]);
    
    // Handle search text change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value;
        setSearchText(text);
        dispatch(setJobSearch(text));
    };

    // Handle salary range change
    const handleSalaryChange = (newValue: [number, number]) => {
        setSalaryRangeLocal(newValue);
        dispatch(setSalaryRange(newValue));
    };

    // Format salary display
    const formatSalary = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value}`;
    };
    
    return (
         <div className="flex px-5 py-8 items-center text-mine-shaft-100">
            {/* Search Input */}
            <div className="flex items-center gap-3 w-1/5">
                <div className="text-cyan-400 bg-mine-shaft-800 rounded-full p-2">
                    <IconSearch size={22} />
                </div>
                <Input
                    variant="unstyled"
                    placeholder="Search jobs..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="w-full"
                    styles={{
                        input: {
                            fontSize: '18px',
                            fontWeight: 500,
                            color: '#e5e5e5',
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                            '&::placeholder': {
                                color: '#a1a1aa',
                                opacity: 1,
                            },
                            '&:focus': {
                                outline: 'none',
                                border: 'none',
                                boxShadow: 'none',
                            }
                        }
                    }}
                />
            </div>
            <Divider mx="xs" orientation="vertical" />

            {/* Filter Fields */}
            {jobSearchFields.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <div className="w-1/5">
                            <MultiInput 
                                title={item.title} 
                                icon={item.icon} 
                                option={item.options}
                                filterType="job" 
                            />
                        </div>
                        <Divider mx="xs" orientation="vertical" />
                    </React.Fragment>
                )
            })}

            {/* Salary Range Slider */}
            <div className="w-1/5 pl-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-900/20 rounded-full text-cyan-400">
                            <IconPigMoney size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-100">Salary</span>
                        </div>
                    </div>

                    <div className="text-sm">
                        <span className="text-cyan-300 font-semibold">
                            {formatSalary(salaryRange[0])}
                        </span>
                        <span className="mx-1 text-gray-500">-</span>
                        <span className="text-cyan-300 font-semibold">
                            {formatSalary(salaryRange[1])}
                        </span>
                    </div>
                </div>

                <RangeSlider
                    value={salaryRange}
                    onChange={handleSalaryChange}
                    color="cyan"
                    size="sm"
                    min={0}
                    max={500000}
                    step={5000}
                    minRange={0}
                    label={(val) => formatSalary(val)}
                    styles={{
                        root: { paddingTop: 6, paddingBottom: 4 },
                        track: { 
                            backgroundColor: '#0b1014',
                            height: 4
                        },
                        bar: { 
                            backgroundColor: '#06b6d4',
                        },
                        thumb: {
                            backgroundColor: '#06b6d4',
                            border: '2px solid rgba(6,182,212,0.3)',
                            width: 16,
                            height: 16,
                        },
                        label: { 
                            fontSize: 11, 
                            padding: '2px 6px',
                            backgroundColor: '#06b6d4',
                        },
                    }}
                />
                <div className="flex justify-between mt-1 text-[10px] text-gray-600">
                    <span>$0</span>
                    <span>$250K</span>
                    <span>$500K+</span>
                </div>
            </div>
        </div>
    )
}

export default JobSearchBar