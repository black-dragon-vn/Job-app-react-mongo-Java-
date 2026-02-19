/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../Interceptor/AxiosInsstance";
import { removeUser } from "../Slices/UserSlice";


const BASE_URL = "auth/";  // baseURLがあるので "auth/" 

export const loginUser = async (credentials: any) => {
  const response = await axiosInstance.post(`${BASE_URL}login`, credentials);
  return response.data;
};
export const navigateToLogin = (navigate:any) =>{
  localStorage.removeItem('token');
  removeUser();
  navigate("/login");
}