package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.Applicant;
import com.jobportal.entity.Job;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.JobRepository;
import com.jobportal.utility.Utilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service("jobService")
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public JobDTO postJob(JobDTO jobDTO) throws JobPortalException {
        if (jobDTO.getId() == null || jobDTO.getId() == 0){
            jobDTO.setId(Utilities.getNextSequence("jobs"));
            jobDTO.setPosTime(LocalDateTime.now());

            // Lưu job trước
            JobDTO savedJob = jobRepository.save(jobDTO.toEntity()).toDTO();

            // Gửi notification sau, với try-catch để không ảnh hưởng đến việc lưu job
            try {
                NotificationDTO notiDto = new NotificationDTO();
                notiDto.setAction("Job Posted");
                notiDto.setMessage("Job posted successfully for " + jobDTO.getJobTitle() + " at " + jobDTO.getCompany());
                notiDto.setUserId(jobDTO.getPostedBy());
                notiDto.setRoute("/posted-jobs/" + savedJob.getId());
                notificationService.sendNotification(notiDto);
            } catch (Exception e) {
                // Log lỗi nhưng không throw để không ảnh hưởng job creation
            }

            return savedJob;
        } else {
            Job job = jobRepository.findById(jobDTO.getId())
                    .orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
            if(job.getJobStatus().equals(JobStatus.CLOSED))
                jobDTO.setPosTime(LocalDateTime.now());
        }
        return jobRepository.save(jobDTO.toEntity()).toDTO();
    }

    @Override
    public List<JobDTO> getAllJobs() {
        return jobRepository.findAll().stream().map(x -> x.toDTO()).toList();
    }

    @Override
    public JobDTO getJob(Long id) throws JobPortalException {
        return jobRepository.findById(id)
                .orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"))
                .toDTO();
    }

    @Override
    public void applyJob(Long id, ApplicantDTO applicantDTO) throws JobPortalException {
        if (applicantDTO == null || applicantDTO.getApplicantId() == null) {
            throw new JobPortalException("INVALID_APPLICANT_DATA");
        }

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants();
        if (applicants == null) applicants = new ArrayList<>();

        boolean alreadyApplied = applicants.stream()
                .anyMatch(x -> x.getApplicantId() != null &&
                        x.getApplicantId().equals(applicantDTO.getApplicantId()));

        if (alreadyApplied) {
            throw new JobPortalException("JOB_APPLIED_ALREADY");
        }

        applicantDTO.setApplicationStatus(ApplicationStatus.APPLIED);
        applicantDTO.setTimestamp(LocalDateTime.now());
        applicants.add(applicantDTO.toEntity());
        job.setApplicants(applicants);
        jobRepository.save(job);

        // Send notification to recruiter
        try {
            NotificationDTO recruiterNotif = new NotificationDTO();
            recruiterNotif.setUserId(job.getPostedBy());
            recruiterNotif.setAction("New Application");
            recruiterNotif.setMessage(applicantDTO.getName() + " applied for '" + job.getJobTitle() + "'");
            recruiterNotif.setRoute("/posted-jobs");
            notificationService.sendNotification(recruiterNotif);
        } catch (Exception e) {
            // Ignore notification errors
        }

        // Send confirmation to applicant
        try {
            NotificationDTO applicantNotif = new NotificationDTO();
            applicantNotif.setUserId(applicantDTO.getApplicantId());
            applicantNotif.setAction("Application Submitted");
            applicantNotif.setMessage("Your application for '" + job.getJobTitle() + "' has been submitted");
            applicantNotif.setRoute("/job-history");
            notificationService.sendNotification(applicantNotif);
        } catch (Exception e) {
            // Ignore notification errors
        }
    }

    @Override
    public List<JobDTO> getJobsPostedBy(Long id) {
        return jobRepository.findByPostedBy(id).stream().map(x -> x.toDTO()).toList();
    }

    @Override
    public void changeAppStatus(Application application) throws JobPortalException {
        Job job = jobRepository.findById(application.getId())
                .orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants().stream().map(x -> {
            if (application.getApplicantId().equals(x.getApplicantId())) {
                x.setApplicationStatus(application.getApplicationStatus());

                NotificationDTO notiDto = new NotificationDTO();
                notiDto.setUserId(application.getApplicantId());
                notiDto.setRoute("/job-history");

                switch (application.getApplicationStatus()) {
                    case INTERVIEWING:
                        x.setInterviewTime(application.getInterviewTime());
                        notiDto.setAction("Interview Scheduled");
                        notiDto.setMessage("Interview scheduled for '" + job.getJobTitle() + "' on " + application.getInterviewTime());
                        break;
                    case ACCEPTED:
                        notiDto.setAction("Application Accepted");
                        notiDto.setMessage("Your application for '" + job.getJobTitle() + "' has been accepted");
                        break;
                    case REJECTED:
                        notiDto.setAction("Application Status Update");
                        notiDto.setMessage("Your application for '" + job.getJobTitle() + "' has been reviewed");
                        break;
                    default:
                        notiDto.setAction("Application Status Update");
                        notiDto.setMessage("Status updated for '" + job.getJobTitle() + "'");
                }

                try {
                    notificationService.sendNotification(notiDto);
                } catch (JobPortalException e) {
                    throw new RuntimeException(e);
                }
            }
            return x;
        }).toList();

        job.setApplicants(applicants);
        jobRepository.save(job);
    }
}