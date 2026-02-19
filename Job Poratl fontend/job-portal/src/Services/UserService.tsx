
import axiosInstance from "../Interceptor/AxiosInsstance";
import {  type UserRegistration, type UserResponse } from "../types/Usetype";

const USERS_URL = "users/";

export const registerUser = async (user: UserRegistration): Promise<UserResponse> => {
  const response = await axiosInstance.post<UserResponse>(`${USERS_URL}register`, user);
  return response.data;
};

export const sendOtp = async (email: string): Promise<UserResponse> => {
  const response = await axiosInstance.post<UserResponse>(`${USERS_URL}sendOtp/${email}`);
  return response.data;
};

export const verifyOtp = async (email: string, otp: string): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>(`${USERS_URL}verifyOtp/${email}/${otp}`);
  return response.data;
};

export const changePass = async (email: string, password: string): Promise<UserResponse> => {
  const response = await axiosInstance.post<UserResponse>(`${USERS_URL}changePass`, { email, password });
  return response.data;
};