package gangofthree.entity;
import org.hibernate.annotations.Check;
import jakarta.persistence.*;

@Entity
@Table(name = "venues")
@Check(name = "chk_venue_capacity", constraints = "capacity > 0")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Integer capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
}
