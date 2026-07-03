package com.railbook.controller;

import com.railbook.dto.Dto;
import com.railbook.model.Train;
import com.railbook.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Train endpoints.
 *
 * GET  /api/trains              → all trains
 * GET  /api/trains/search       → search by ?from=Mumbai&to=Delhi
 * POST /api/trains              → add train (admin)
 * DELETE /api/trains/{id}       → remove train (admin)
 */
@RestController
@RequestMapping("/api/trains")
public class TrainController {

    @Autowired
    private TrainService trainService;

    // Get all trains
    @GetMapping
    public ResponseEntity<List<Train>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    // Search trains by from/to city
    @GetMapping("/search")
    public ResponseEntity<List<Train>> searchTrains(
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(trainService.searchTrains(from, to));
    }

    // Add a new train (admin only — in production, add role check)
    @PostMapping
    public ResponseEntity<?> addTrain(@RequestBody Train train) {
        try {
            Train saved = trainService.addTrain(train);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new Dto.ErrorResponse(e.getMessage()));
        }
    }

    // Delete a train by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrain(@PathVariable String id) {
        try {
            trainService.deleteTrain(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
