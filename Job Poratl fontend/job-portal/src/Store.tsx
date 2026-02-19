/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import userReduce from "./Slices/UserSlice";
import profileReduce from "./Slices/ProfileSlice"
import filterReduce from "./Slices/filtersSlice";
import jobFilterReducer from './Slices/jobFiltersSlice';
import sortReduce from './Slices/SortSlice';
import jwtReducer from './Slices/JwtSlice';
export default configureStore({
    reducer:{
        user:userReduce,
        profile:profileReduce,
        filter: filterReduce,
        jobFilter: jobFilterReducer,
        sort: sortReduce,
        jwt:jwtReducer
    }
});