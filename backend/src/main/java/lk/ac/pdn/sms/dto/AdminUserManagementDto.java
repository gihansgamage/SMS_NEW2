package lk.ac.pdn.sms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lk.ac.pdn.sms.entity.AdminUser.Role;
import lombok.Data;

@Data
public class AdminUserManagementDto {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull(message = "Role is required")
    private Role role;

    // Required only if the role is DEAN
    private String faculty;
}