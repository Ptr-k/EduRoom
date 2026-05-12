package com.eduroom.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EduRoomApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduRoomApplication.class, args);
    }
}