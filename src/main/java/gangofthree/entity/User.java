package gangofthree.entity;

import gangofthree.entity.enums.Role;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "users")
@Check(name = "chk_user_phone", constraints = "phone ~ '^(09|9)[0-9]{9}$'")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id" , nullable = false)
    private City city;
}
