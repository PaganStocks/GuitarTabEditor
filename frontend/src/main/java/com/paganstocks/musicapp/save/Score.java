package com.paganstocks.musicapp.save;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String scoreId;
    private String userId;

    @Lob
    private String scoreContent;
}
