/* eslint-disable react-hooks/set-state-in-effect */
import { Divider, Input, RangeSlider } from "@mantine/core"
import React, { useState, useEffect } from "react"
import { IconMap, IconUserCircle } from "@tabler/icons-react"
import MultiInput from "../FindJobs/MultiInput"
import { searchFields } from "../Data/TalentData"
import { useDispatch, useSelector } from "react-redux"
import { setTalentName, setExperienceRange } from "../Slices/filtersSlice"
import type { FilterState } from "../Slices/filtersSlice"

interface RootState {
    filter: FilterState;
}

const SearchBar = () => {
    const dispatch = useDispatch();
    const filter = useSelector((state: RootState) => state.filter);
    
    const [value, setValue] = useState<[number, number]>([0, 50]);
    const [talentName, setLocalTalentName] = useState("");
    
    // Sync with Redux state on mount or reset
    useEffect(() => {
        if (filter.experienceRange) {
            setValue(filter.experienceRange);
        }
        if (filter.talentName !== undefined) {
            setLocalTalentName(filter.talentName);
        }
    }, [filter.experienceRange, filter.talentName]);
    
    // Handle talent name change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.value;
        setLocalTalentName(name);
        dispatch(setTalentName(name));
    };

    // Handle experience range change
    const handleExperienceChange = (newValue: [number, number]) => {
        setValue(newValue);
        dispatch(setExperienceRange(newValue));
    };
    
    return (
        <div className="flex px-5 py-8 items-center text-mine-shaft-100">
            {/* Talent Name Input */}
            <div className="flex items-center gap-3 w-1/5">
                <div className="text-cyan-400 bg-mine-shaft-900 rounded-full p-2">
                    <IconUserCircle size={22} />
                </div>
                <Input
                    variant="unstyled"
                    placeholder="Talent Name"
                    value={talentName}
                    onChange={handleNameChange}
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

            {/* Search Fields */}
            {searchFields.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <div className="w-1/5">
                            <MultiInput title={item.title} icon={item.icon} option={item.options}  filterType="talent"/>
                        </div>
                        <Divider mx="xs" orientation="vertical" />
                    </React.Fragment>
                )
            })}

            {/* Experience Range Slider */}
            <div className="w-1/5 pl-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-900/20 rounded-full text-cyan-400">
                            <IconMap size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-100">Experience (Year)</span>
                        </div>
                    </div>

                    <div className="text-sm">
                        <span className="text-cyan-300 font-semibold">
                            {value[0]}
                        </span>
                        <span className="mx-1 text-gray-500">-</span>
                        <span className="text-cyan-300 font-semibold">
                            {value[1]}
                        </span>
                        <span className="ml-1 text-gray-500 text-xs">yrs</span>
                    </div>
                </div>

                <RangeSlider
                    value={value}
                    onChange={handleExperienceChange}
                    color="cyan"
                    size="sm"
                    min={0}
                    max={50}
                    step={1}
                    minRange={0}
                    label={(val) => `${val} years`}
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
                    <span>0</span>
                    <span>25</span>
                    <span>50+</span>
                </div>
            </div>
        </div>
    )
}

export default SearchBar