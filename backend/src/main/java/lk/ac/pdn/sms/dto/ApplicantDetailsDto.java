package lk.ac.pdn.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDetailsDto {
    private String name;
    private String regNo;
    private String email;
    private String mobile;
    private String faculty;
}