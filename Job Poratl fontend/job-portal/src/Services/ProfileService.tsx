/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../Interceptor/AxiosInsstance";


const BASE_URL = "profiles/";

export const getProfile = async (profileId: number) => {
    try {
        const result = await axiosInstance.get(`profiles/get/${profileId}`);
        return result.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getAllProfile = async () => {
    try {
        const result = await axiosInstance.get(`${BASE_URL}getAll`);
        return result.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateProfile = async (profile: any) => {
    try {
        const result = await axiosInstance.put(`${BASE_URL}update`, profile);
        return result.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};