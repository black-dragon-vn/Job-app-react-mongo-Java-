package com.jobportal.utility;

import com.jobportal.exception.JobPortalException;
import com.jobportal.exception.UserException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class ExceptionControllerAdvice {

    @Autowired
    private Environment environment;

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ErrorInfo> handleUserException(UserException ex) {
        log.warn("UserException: {}", ex.getMessage());

        ErrorInfo error = new ErrorInfo(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(JobPortalException.class)
    public ResponseEntity<ErrorInfo> handleJobPortalException(JobPortalException ex) {
        log.warn("JobPortalException: {}", ex.getMessage());

        String message = ex.getMessage();
        // Try to get message from properties file
        try {
            String propertyMessage = environment.getProperty(message);
            if (propertyMessage != null && !propertyMessage.isEmpty()) {
                message = propertyMessage;
            }
        } catch (Exception e) {
            log.debug("Could not find message in properties for key: {}", message);
        }

        ErrorInfo error = new ErrorInfo(
                message,
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorInfo> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation errors: {}", errors);

        String message = errors.values().stream()
                .collect(Collectors.joining(", "));

        ErrorInfo errorInfo = new ErrorInfo(
                message,
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorInfo> handleConstraintViolation(ConstraintViolationException ex) {
        String msg = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));

        log.warn("Constraint violation: {}", msg);

        ErrorInfo error = new ErrorInfo(
                msg,
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorInfo> handleGeneralException(Exception exception) {
        log.error("Unhandled exception occurred: ", exception);

        // In production, don't expose detailed error messages
        String errorMessage = "An unexpected error occurred. Please try again later.";

        // In development, show more details
        String activeProfile = environment.getProperty("spring.profiles.active", "prod");
        if ("dev".equals(activeProfile) || "local".equals(activeProfile)) {
            errorMessage = "Internal server error: " + exception.getMessage();
        }

        ErrorInfo error = new ErrorInfo(
                errorMessage,
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}