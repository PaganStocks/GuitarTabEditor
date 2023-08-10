package com.paganstocks.musicapp.save;

import com.paganstocks.musicapp.musicxml.ScorePartwise;
import jakarta.xml.bind.JAXB;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.StringWriter;
import java.util.Map;
import java.util.UUID;

import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toMap;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin
public class ScoreController {

    private final ScoreRepository scoreRepository;

    private static final String MUSIC_XML_CONTENT_TYPE = "application/vnd.recordare.musicxml+xml;charset=UTF-8";

    /**
     * saveScore will save the song under the current user
     * @param user the authenticated user
     * @param score the song
     */
    @PostMapping(consumes = MUSIC_XML_CONTENT_TYPE, path = "/scores")
    @ResponseStatus(CREATED)
    public void saveScore(@AuthenticationPrincipal Jwt user, @RequestBody ScorePartwise score) {
        StringWriter stringWriter = new StringWriter();
        JAXB.marshal(score, stringWriter);
        var scoreToSave = new Score(
                UUID.randomUUID().toString(),
                user.getSubject(),
                stringWriter.toString()
        );
        scoreRepository.save(scoreToSave);
    }

    /**
     * Index will return all the songs belonging to a user
     * @return a list of songs
     */
    @GetMapping(path = "/scores")
    public ScoreResponse index(@AuthenticationPrincipal Jwt user) {
        return scoreRepository.findAllByUserId(user.getSubject()).stream()
                .collect(collectingAndThen(toMap(Score::getScoreId, Score::getScoreContent), ScoreResponse::new));
    }

    @GetMapping(path = "/score/{id}", produces = MUSIC_XML_CONTENT_TYPE)
    public String findScoreById(@AuthenticationPrincipal Jwt user, @PathVariable String id) {
        return scoreRepository.findByUserIdAndScoreId(user.getSubject(), id)
                .map(Score::getScoreContent)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
    }

    private record ScoreResponse(Map<String, String> scores) {}
}
