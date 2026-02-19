/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../Interceptor/AxiosInsstance";


const BASE_URL = "jobs/";

export const postJob = async (job: any) => {
    const response = await axiosInstance.post(`${BASE_URL}post`, job);
    return response.data;
}

export const getAllJobs = async () => {
    const response = await axiosInstance.get(`${BASE_URL}getAll`);
    return response.data;
}

export const getJob = async (id: string | number) => {
    const response = await axiosInstance.get(`${BASE_URL}get/${id}`);
    return response.data;
}

export const applyJob = async (jobId: number, applicantData: any) => {
    const response = await axiosInstance.post(`${BASE_URL}apply/${jobId}`, applicantData);
    return response.data;
}

export const getJobPostedBy = async (id: number) => {
    const response = await axiosInstance.get(`${BASE_URL}postedBy/${id}`);
    return response.data;
}

export const changeAppStatus = async (application: any) => {
    const response = await axiosInstance.post(`${BASE_URL}changeAppStatus`, application);
    return response.data;
}