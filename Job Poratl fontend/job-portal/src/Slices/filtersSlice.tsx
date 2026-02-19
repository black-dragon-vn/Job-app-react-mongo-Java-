import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
    talentName?: string;
    "Job Title"?: string[];
    "Location"?: string[];
    "Skills"?: string[];
    "Experience"?: string[];
    "Job Type"?: string[];
    experienceRange?: [number, number];
}

const initialState: FilterState = {
    talentName: '',
    "Job Title": [],
    "Location": [],
    "Skills": [],
    "Experience": [],
    "Job Type": [],
    experienceRange: [0, 50]
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        updateFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
            return { ...state, ...action.payload };
        },
        setTalentName: (state, action: PayloadAction<string>) => {
            state.talentName = action.payload;
        },
        setExperienceRange: (state, action: PayloadAction<[number, number]>) => {
            state.experienceRange = action.payload;
        },
        resetFilter: () => {
            return initialState;
        }
    }
});

export const { 
    updateFilter, 
    setTalentName,
    setExperienceRange,
    resetFilter 
} = filterSlice.actions;

export default filterSlice.reducer;