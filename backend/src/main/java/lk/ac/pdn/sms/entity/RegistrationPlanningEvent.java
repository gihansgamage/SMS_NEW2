package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registration_planning_events")
@Data
public class RegistrationPlanningEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String month;
    @Column(columnDefinition = "TEXT")
    private String activity;
}