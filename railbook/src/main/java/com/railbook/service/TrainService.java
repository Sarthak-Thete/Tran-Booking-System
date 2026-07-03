package com.railbook.service;

import com.railbook.model.Train;
import com.railbook.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    /** Get all trains */
    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    /** Search trains by origin and destination */
    public List<Train> searchTrains(String from, String to) {
        return trainRepository.findByFromCityIgnoreCaseAndToCityIgnoreCase(from, to);
    }

    /** Add a new train (admin only) */
    public Train addTrain(Train train) {
        if (trainRepository.existsById(train.getId())) {
            throw new RuntimeException("Train ID already exists: " + train.getId());
        }
        return trainRepository.save(train);
    }

    /** Delete a train by ID (admin only) */
    public void deleteTrain(String id) {
        if (!trainRepository.existsById(id)) {
            throw new RuntimeException("Train not found: " + id);
        }
        trainRepository.deleteById(id);
    }
}
