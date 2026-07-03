package com.railbook.repository;

import com.railbook.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, String> {

    // Get all bookings for a specific user
    List<Booking> findByUserId(Long userId);

    // Look up a booking by PNR number
    Optional<Booking> findByPnr(String pnr);
}
