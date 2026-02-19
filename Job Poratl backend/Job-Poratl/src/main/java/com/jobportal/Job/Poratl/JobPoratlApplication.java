package com.jobportal.Job.Poratl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = "com.jobportal")
@EnableMongoRepositories(basePackages = "com.jobportal.repository")
@EnableScheduling
public class JobPoratlApplication {
    public static void main(String[] args) {
        SpringApplication.run(JobPoratlApplication.class, args);
    }
}