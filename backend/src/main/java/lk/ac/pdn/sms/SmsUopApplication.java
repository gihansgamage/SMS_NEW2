package lk.ac.pdn.sms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmsUopApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmsUopApplication.class, args);
    }
}