import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {},
    reducers: {
        //  CHỈ update Redux state, KHÔNG gọi API
        changeProfile: (state, action) => {
            return action.payload;
        },
        
        //  Set profile data từ backend
        setProfile: (state, action) => {
            return action.payload;
        }
    }
});

export const { changeProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;