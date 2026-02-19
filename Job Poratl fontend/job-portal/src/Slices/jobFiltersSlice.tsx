import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface JobFilterState {
    jobSearch?: string;
    "Job Title"?: string[];
    "Location"?: string[];
    "Job Type"?: string[];
    "Experience"?: string[];
    salaryRange?: [number, number];
}

const initialState: JobFilterState = {
    jobSearch: '',
    "Job Title": [],
    "Location": [],
    "Job Type": [],
    "Experience": [],
    salaryRange: [0, 500000]
};

const jobFilterSlice = createSlice({
    name: 'jobFilter',
    initialState,
    reducers: {
        updateJobFilter: (state, action: PayloadAction<Partial<JobFilterState>>) => {
            return { ...state, ...action.payload };
        },
        setJobSearch: (state, action: PayloadAction<string>) => {
            state.jobSearch = action.payload;
        },
        setSalaryRange: (state, action: PayloadAction<[number, number]>) => {
            state.salaryRange = action.payload;
        },
        resetJobFilter: () => {
            return initialState;
        }
    }
});

export const { 
    updateJobFilter, 
    setJobSearch,
    setSalaryRange,
    resetJobFilter 
} = jobFilterSlice.actions;

export default jobFilterSlice.reducer;