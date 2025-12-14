package lk.ac.pdn.sms.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String role;
    private String faculty;
}