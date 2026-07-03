package com.railbook.repository;

import com.railbook.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username (for login)
    Optional<User> findByUsername(String username);

    // Check if username or email already exists (for registration)
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
