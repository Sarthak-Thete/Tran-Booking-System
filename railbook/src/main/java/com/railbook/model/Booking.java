package com.railbook.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Represents a ticket booking made by a user.
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
public class Booking {

    @Id
    @Column(nullable = false, unique = true)
    private String pnr;                 // e.g. "PNR4523"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @Column(nullable = false)
    private LocalDate travelDate;

    @Column(nullable = false)
    private int passengers;

    @Column(nullable = false)
    private int totalPrice;

    @Column(nullable = false)
    private String status = "CONFIRMED"; // CONFIRMED / CANCELLED

    @Column(nullable = false)
    private LocalDate bookedOn = LocalDate.now();
}
