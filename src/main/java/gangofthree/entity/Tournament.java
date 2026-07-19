package gangofthree.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "tournament")
public class Tournament{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
}