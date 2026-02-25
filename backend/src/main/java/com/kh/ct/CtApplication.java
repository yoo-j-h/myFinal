package com.kh.ct;

import org.springframework.boot.CommandLineRunner; // 추가됨
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // 추가됨
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder; // 추가됨

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class CtApplication {

	public static void main(String[] args) {
		SpringApplication.run(CtApplication.class, args);
	}

}