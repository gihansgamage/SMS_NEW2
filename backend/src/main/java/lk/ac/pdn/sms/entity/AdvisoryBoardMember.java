package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "advisory_board_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvisoryBoardMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id")
    private SocietyRegistration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renewal_id")
    private SocietyRenewal renewal;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private String department;
}