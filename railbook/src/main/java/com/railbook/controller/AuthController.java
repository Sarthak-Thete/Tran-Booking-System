package com.railbook.controller;

import com.railbook.dto.Dto;
import com.railbook.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication endpoints.
 *
 * POST /api/auth/login    → returns user info
 * POST /api/auth/register → creates account, returns user info
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Dto.LoginRequest request) {
        try {
            Dto.UserResponse user = authService.login(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(new Dto.ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Dto.RegisterRequest request) {
        try {
            Dto.UserResponse user = authService.register(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new Dto.ErrorResponse(e.getMessage()));
        }
    }
}
