package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registration_general_members")
@Data
public class RegistrationGeneralMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String regNo;
    private String name;
}