package com.paganstocks.musicapp.save;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, String> {
    List<Score> findAllByUserId(String userId);
    Optional<Score> findByUserIdAndScoreId(String userId, String id);
}
