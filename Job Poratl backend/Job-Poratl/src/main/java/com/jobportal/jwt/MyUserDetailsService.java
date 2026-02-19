package com.jobportal.jwt;

import com.jobportal.dto.UserDTO;
import com.jobportal.exception.JobPortalException;
import com.jobportal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("=== Loading user: " + email);

        try {
            UserDTO dto = userService.getUserByEmai(email);

            System.out.println("=== User found: " + (dto != null ? dto.getEmail() : "NULL"));
            System.out.println("=== ProfileId: " + (dto != null ? dto.getProfileId() : "NULL"));
            System.out.println("=== Password: " + (dto != null && dto.getPassword() != null ? "EXISTS" : "NULL"));

            if (dto == null) {
                throw new UsernameNotFoundException("User not found: " + email);
            }

            return new CustomUserDetails(
                    dto.getId(),
                    email,
                    dto.getName(),
                    dto.getPassword(),
                    dto.getProfileId(),
                    dto.getAccountType().toString(),
                    new ArrayList<>()
            );
        } catch (JobPortalException e) {
            System.out.println("=== Exception: " + e.getMessage());
            throw new UsernameNotFoundException("User not found: " + email, e);
        }
    }
}