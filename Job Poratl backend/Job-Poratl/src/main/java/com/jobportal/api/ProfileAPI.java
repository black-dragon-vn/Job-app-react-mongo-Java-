package com.jobportal.api;

import com.jobportal.dto.ProfileDTO;
import com.jobportal.exception.JobPortalException;
import com.jobportal.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@CrossOrigin
@Validated
@RequestMapping("/profiles")
public class ProfileAPI {
    @Autowired
    private ProfileService profileService;
    @GetMapping("/get/{id}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable Long id) throws JobPortalException{
        ProfileDTO profile = profileService.getProfile(id);
        log.info("Returning profile: {}", profile);
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ProfileDTO>> getAllProfile() throws JobPortalException{
        return new ResponseEntity<>(profileService.getAllProfile(),HttpStatus.OK);
    }
    @PutMapping("/update")
    public ResponseEntity<ProfileDTO> updateProfile(@RequestBody ProfileDTO profileDTO)
            throws JobPortalException {

        log.info("Updating profile: {}", profileDTO);
        return ResponseEntity.ok(profileService.updateProfile(profileDTO));
    }

}


