package com.railbook.repository;

import com.railbook.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainRepository extends JpaRepository<Train, String> {

    // Search trains by departure and destination city (case-insensitive)
    List<Train> findByFromCityIgnoreCaseAndToCityIgnoreCase(String fromCity, String toCity);
}
