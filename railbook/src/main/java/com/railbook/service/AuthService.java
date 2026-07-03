package com.railbook.service;

import com.railbook.dto.Dto;
import com.railbook.model.User;
import com.railbook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Login: find user by username, then check password.
     * Returns the user info (without password) or throws RuntimeException.
     *
     * NOTE: In production, passwords should be hashed with BCrypt.
     * For now we keep it simple and store/compare plain text.
     */
    public Dto.UserResponse login(Dto.LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return toResponse(user);
    }

    /**
     * Register: validate uniqueness, save new user, return user info.
     */
    public Dto.UserResponse register(Dto.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());  // Store plain text (demo only)
        user.setRole("USER");

        userRepository.save(user);
        return toResponse(user);
    }

    // Convert User entity → response DTO (hides password)
    private Dto.UserResponse toResponse(User user) {
        Dto.UserResponse res = new Dto.UserResponse();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole());
        return res;
    }
}
