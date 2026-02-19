package com.jobportal.service;

import com.jobportal.dto.LoginDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.exception.JobPortalException;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO) throws JobPortalException;
    UserDTO getUserByEmai(String email) throws JobPortalException;
    UserDTO loginUser(LoginDTO loginDTO)  throws JobPortalException;

     Boolean sendOtp(String email) throws   Exception;

    Boolean verifyOtp(String email, String otp) throws JobPortalException;

    ResponseDTO changePassword( LoginDTO loginDTO) throws JobPortalException;
}