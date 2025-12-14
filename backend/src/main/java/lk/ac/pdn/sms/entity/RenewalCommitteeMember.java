package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "renewal_committee_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RenewalCommitteeMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renewal_id", nullable = false)
    private SocietyRenewal renewal;

    @Column(name = "reg_no", nullable = false)
    private String regNo;

    @Column(nullable = false)
    private String name;
}