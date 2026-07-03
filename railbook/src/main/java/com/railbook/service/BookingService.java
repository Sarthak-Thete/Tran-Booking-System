package com.railbook.service;

import com.railbook.dto.Dto;
import com.railbook.model.Booking;
import com.railbook.model.Train;
import com.railbook.model.User;
import com.railbook.repository.BookingRepository;
import com.railbook.repository.TrainRepository;
import com.railbook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository    userRepository;
    @Autowired private TrainRepository   trainRepository;

    /** Create a new booking */
    public Dto.BookingResponse createBooking(Dto.BookingRequest request) {
        // Find user and train
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        // Check seats availability
        if (train.getSeats() < request.getPassengers()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Reduce available seat count
        train.setSeats(train.getSeats() - request.getPassengers());
        trainRepository.save(train);

        // Create booking
        Booking booking = new Booking();
        booking.setPnr(generatePNR());
        booking.setUser(user);
        booking.setTrain(train);
        booking.setTravelDate(LocalDate.parse(request.getTravelDate()));
        booking.setPassengers(request.getPassengers());
        booking.setTotalPrice(train.getPrice() * request.getPassengers());
        booking.setStatus("CONFIRMED");
        booking.setBookedOn(LocalDate.now());

        bookingRepository.save(booking);
        return toResponse(booking);
    }

    /** Get all bookings for a user */
    public List<Dto.BookingResponse> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Look up a booking by PNR */
    public Dto.BookingResponse getByPnr(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr.toUpperCase())
                .orElseThrow(() -> new RuntimeException("No booking found for PNR: " + pnr));
        return toResponse(booking);
    }

    /** Get all bookings (admin) */
    public List<Dto.BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Generate a unique PNR like PNR4521
    private String generatePNR() {
        String pnr;
        do {
            pnr = "PNR" + (1000 + new Random().nextInt(9000));
        } while (bookingRepository.existsById(pnr));
        return pnr;
    }

    // Convert Booking entity → response DTO
    private Dto.BookingResponse toResponse(Booking b) {
        Dto.BookingResponse r = new Dto.BookingResponse();
        r.setPnr(b.getPnr());
        r.setUserId(b.getUser().getId());
        r.setTrainId(b.getTrain().getId());
        r.setTrainName(b.getTrain().getName());
        r.setTravelDate(b.getTravelDate().toString());
        r.setPassengers(b.getPassengers());
        r.setTotalPrice(b.getTotalPrice());
        r.setStatus(b.getStatus());
        r.setBookedOn(b.getBookedOn().toString());
        return r;
    }
}
