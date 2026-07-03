package com.railbook.service;

import com.railbook.model.Train;
import com.railbook.model.User;
import com.railbook.repository.TrainRepository;
import com.railbook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the database with initial trains and users on first startup.
 * Runs automatically when Spring Boot starts.
 * Skips seeding if data already exists.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private TrainRepository trainRepository;
    @Autowired private UserRepository  userRepository;

    @Override
    public void run(String... args) {
        seedTrains();
        seedUsers();
    }

    private void seedTrains() {
        if (trainRepository.count() > 0) return; // Already seeded

        List<Train> trains = List.of(
            makeTrain("T001", "Rajdhani Express", "Mumbai",  "Delhi",     "06:00", "22:00", "16h",    120, 1450),
            makeTrain("T002", "Shatabdi Express", "Mumbai",  "Pune",      "07:30", "10:30", "3h",      80,  380),
            makeTrain("T003", "Duronto Express",  "Delhi",   "Kolkata",   "08:15", "02:30", "18h15m", 100, 1200),
            makeTrain("T004", "Garib Rath",       "Chennai", "Bangalore", "05:00", "11:00", "6h",     200,  320),
            makeTrain("T005", "Vande Bharat",     "Delhi",   "Varanasi",  "06:00", "14:00", "8h",      60, 1750),
            makeTrain("T006", "Kerala Express",   "Delhi",   "Trivandrum","11:35", "17:05", "29.5h",  150, 1600)
        );

        trainRepository.saveAll(trains);
        System.out.println("✅ Seeded " + trains.size() + " trains");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return; // Already seeded

        List<User> users = List.of(
            makeUser("Admin User",    "admin", "admin@railbook.in",     "admin123", "ADMIN"),
            makeUser("Rahul Sharma",  "rahul", "rahul@example.com",     "pass123",  "USER"),
            makeUser("Priya Patel",   "priya", "priya@example.com",     "pass123",  "USER")
        );

        userRepository.saveAll(users);
        System.out.println("✅ Seeded " + users.size() + " users");
    }

    private Train makeTrain(String id, String name, String from, String to,
                            String dep, String arr, String dur, int seats, int price) {
        Train t = new Train();
        t.setId(id); t.setName(name); t.setFromCity(from); t.setToCity(to);
        t.setDeparture(dep); t.setArrival(arr); t.setDuration(dur);
        t.setSeats(seats); t.setPrice(price);
        return t;
    }

    private User makeUser(String name, String username, String email, String password, String role) {
        User u = new User();
        u.setName(name); u.setUsername(username); u.setEmail(email);
        u.setPassword(password); u.setRole(role);
        return u;
    }
}
