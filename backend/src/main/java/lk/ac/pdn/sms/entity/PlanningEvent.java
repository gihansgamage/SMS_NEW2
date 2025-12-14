package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "planning_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanningEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id")
    private SocietyRegistration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renewal_id")
    private SocietyRenewal renewal;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String activity;
}