package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "society_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocietyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id")
    private SocietyRegistration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renewal_id")
    private SocietyRenewal renewal;

    @Column(name = "reg_no", nullable = false)
    private String regNo;

    @Column(nullable = false)
    private String name;
}