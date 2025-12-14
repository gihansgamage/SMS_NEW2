package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registration_advisory_board")
@Data
public class RegistrationAdvisoryBoardMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String designation;
    private String department;
}