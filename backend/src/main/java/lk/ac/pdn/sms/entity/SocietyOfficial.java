package lk.ac.pdn.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "society_officials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocietyOfficial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Position position;

    @Column(name = "reg_no")
    private String regNo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobile;

    private String address;
    private String title;
    private String designation;
    private String department;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Position {
        PRESIDENT, VICE_PRESIDENT, SECRETARY, JOINT_SECRETARY, 
        JUNIOR_TREASURER, EDITOR, SENIOR_TREASURER
    }
}