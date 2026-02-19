import { createSlice } from "@reduxjs/toolkit";

const sortSlice = createSlice({
    name: "sort",
    initialState: {
        jobSort: "Relevance",
        talentSort: "Relevance"
    },
    reducers: {
        updateJobSort: (state, action) => {
            state.jobSort = action.payload;
        },
        updateTalentSort: (state, action) => {
            state.talentSort = action.payload;
        },
        resetJobSort: (state) => {
            state.jobSort = "Relevance";
        },
        resetTalentSort: (state) => {
            state.talentSort = "Relevance";
        }
    }
});

export const { updateJobSort, updateTalentSort, resetJobSort, resetTalentSort } = sortSlice.actions;
export default sortSlice.reducer;