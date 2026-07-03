package com.railbook.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a train with its schedule and pricing.
 */
@Entity
@Table(name = "trains")
@Data
@NoArgsConstructor
public class Train {

    @Id
    @Column(nullable = false, unique = true)
    private String id;          // e.g. "T001"

    @Column(nullable = false)
    private String name;        // e.g. "Rajdhani Express"

    @Column(name = "from_city", nullable = false)
    private String fromCity;    // Departure city

    @Column(name = "to_city", nullable = false)
    private String toCity;      // Destination city

    @Column(nullable = false)
    private String departure;   // e.g. "06:00"

    @Column(nullable = false)
    private String arrival;     // e.g. "22:00"

    @Column(nullable = false)
    private String duration;    // e.g. "16h"

    @Column(nullable = false)
    private int seats;          // Available seat count

    @Column(nullable = false)
    private int price;          // Price per person in ₹
}
