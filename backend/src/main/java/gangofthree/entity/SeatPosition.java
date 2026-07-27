package gangofthree.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class SeatPosition {

    @Column(name = "position_number", nullable = false)
    private Integer number;

    @Column(name = "position_section", nullable = false)
    private String section;

    @Column(name = "position_row_label", nullable = false)
    private String rowLabel;
}
