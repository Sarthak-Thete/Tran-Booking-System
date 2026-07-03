package com.railbook.controller;

import com.railbook.dto.Dto;
import com.railbook.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking endpoints.
 *
 * POST /api/bookings              → create a booking
 * GET  /api/bookings/user/{userId}→ all bookings for a user
 * GET  /api/bookings/pnr/{pnr}    → look up by PNR
 * GET  /api/bookings              → all bookings (admin)
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Dto.BookingRequest request) {
        try {
            Dto.BookingResponse booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new Dto.ErrorResponse(e.getMessage()));
        }
    }

    // Get bookings for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Dto.BookingResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    // Get booking by PNR number
    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<?> getByPnr(@PathVariable String pnr) {
        try {
            return ResponseEntity.ok(bookingService.getByPnr(pnr));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all bookings (admin use)
    @GetMapping
    public ResponseEntity<List<Dto.BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
