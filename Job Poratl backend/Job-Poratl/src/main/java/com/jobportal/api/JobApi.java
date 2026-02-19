package com.jobportal.api;

import com.jobportal.dto.ApplicantDTO;
import com.jobportal.dto.Application;
import com.jobportal.dto.JobDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.exception.JobPortalException;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tools.jackson.core.JacksonException;

import java.util.List;

@Slf4j
@RestController
@CrossOrigin
@Validated
@RequestMapping("/jobs")
public class JobApi {

    @Autowired
    private JobService jobService;

    @PostMapping("/post")
    public ResponseEntity<JobDTO> postJob(@RequestBody @Valid JobDTO jobDTO)
            throws JacksonException, JobPortalException {
        return new ResponseEntity<>(jobService.postJob(jobDTO), HttpStatus.CREATED);
    }

    @GetMapping("getAll")
    public ResponseEntity<List<JobDTO>> getAllJobs() throws JobPortalException {
        return new ResponseEntity<>(jobService.getAllJobs(), HttpStatus.OK);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<JobDTO> getJob(@PathVariable Long id) throws JobPortalException {
        return new ResponseEntity<>(jobService.getJob(id), HttpStatus.OK);
    }

    @PostMapping("/apply/{id}")
    public ResponseEntity<ResponseDTO> applyJob(
            @PathVariable Long id,
            @RequestBody ApplicantDTO applicantDTO) throws JobPortalException {

        log.info("========================================");
        log.info("Received job application request");
        log.info("Job ID: {}", id);
        log.info("Applicant DTO: {}", applicantDTO);

        if (applicantDTO != null) {
            log.info("Applicant ID: {}", applicantDTO.getApplicantId());
            log.info("Name: {}", applicantDTO.getName());
            log.info("Email: {}", applicantDTO.getEmail());
            log.info("Phone: {}", applicantDTO.getPhone());
            log.info("Website: {}", applicantDTO.getWebsite());
            log.info("Resume length: {}",
                    applicantDTO.getResume() != null ? applicantDTO.getResume().length() : "null");
            log.info("Cover letter length: {}",
                    applicantDTO.getCoverLetter() != null ? applicantDTO.getCoverLetter().length() : "null");
        } else {
            log.error("Applicant DTO is NULL!");
        }
        log.info("========================================");

        try {
            jobService.applyJob(id, applicantDTO);
            log.info("Application submitted successfully for job {}", id);
            return new ResponseEntity<>(
                    new ResponseDTO("Applied Successfully"),
                    HttpStatus.CREATED
            );
        } catch (JobPortalException e) {
            log.error("JobPortalException while applying for job {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while applying for job {}: ", id, e);
            throw e;
        }
    }
    @GetMapping("/postedBy/{id}")
    public ResponseEntity<List<JobDTO>> getJobsPostedBy(@PathVariable Long id ) throws JobPortalException{
        return new ResponseEntity<>(jobService.getJobsPostedBy(id),HttpStatus.OK);
    }
    @PostMapping("/changeAppStatus")
    public ResponseEntity<ResponseDTO> changeAppStatus(@RequestBody Application application) throws JobPortalException{
        jobService.changeAppStatus(application);
        return  new ResponseEntity<>(new ResponseDTO("Application Status Changed Successfully"), HttpStatus.OK);
    }
}