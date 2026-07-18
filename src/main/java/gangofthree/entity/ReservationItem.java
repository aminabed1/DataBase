package gangofthree.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "reservation_items")
public class ReservationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price_at_time", nullable = false, precision = 19, scale = 2)
    private BigDecimal priceAtTime;
}