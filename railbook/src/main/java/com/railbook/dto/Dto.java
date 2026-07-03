package com.railbook.dto;

import lombok.Data;

/**
 * All simple request/response data objects live here.
 * Using static inner classes keeps everything in one file and easy to read.
 */
public class Dto {

    // ── Auth ──────────────────────────────────────────────────────

    /** Body sent to POST /api/auth/login */
    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    /** Body sent to POST /api/auth/register */
    @Data
    public static class RegisterRequest {
        private String name;
        private String username;
        private String email;
        private String password;
    }

    /** User info returned after login or registration (no password) */
    @Data
    public static class UserResponse {
        private Long   id;
        private String name;
        private String username;
        private String email;
        private String role;
    }

    // ── Booking ───────────────────────────────────────────────────

    /** Body sent to POST /api/bookings */
    @Data
    public static class BookingRequest {
        private Long   userId;
        private String trainId;
        private String travelDate;   // "2026-07-20"
        private int    passengers;
    }

    /** Booking info returned to the frontend */
    @Data
    public static class BookingResponse {
        private String pnr;
        private Long   userId;
        private String trainId;
        private String trainName;
        private String travelDate;
        private int    passengers;
        private int    totalPrice;
        private String status;
        private String bookedOn;
    }

    // ── Error ─────────────────────────────────────────────────────

    @Data
    public static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
    }
}
