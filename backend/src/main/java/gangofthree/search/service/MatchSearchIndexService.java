package gangofthree.search.service;

import gangofthree.match.entity.Match;
import gangofthree.match.repository.MatchRepository;
import gangofthree.search.document.MatchSearchDocument;
import gangofthree.search.repository.MatchSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchSearchIndexService {

    private final MatchSearchRepository matchSearchRepository;
    private final MatchRepository matchRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    public void indexMatch(Match match) {
        MatchSearchDocument document = MatchSearchDocument.builder()
                .id(match.getId())
                .hostTeam(match.getHostTeam().getName())
                .guestTeam(match.getGuestTeam().getName())
                .sport(match.getSport().getName())
                .venue(match.getVenue().getName())
                .city(match.getVenue().getCity().getName())
                .status(match.getStatus().name())
                .datetime(match.getDatetime())
                .build();

        matchSearchRepository.save(document);
    }

    public void deleteMatch(Long matchId) {
        matchSearchRepository.deleteById(matchId);
    }

    private MatchSearchDocument convertToDocument(Match match) {
        return MatchSearchDocument.builder()
                .id(match.getId())
                .hostTeam(match.getHostTeam().getName())
                .guestTeam(match.getGuestTeam().getName())
                .sport(match.getSport().getName())
                .venue(match.getVenue().getName())
                .city(match.getVenue().getCity().getName())
                .status(match.getStatus().name())
                .datetime(match.getDatetime())
                .build();
    }

    public long reindexAllMatches() {
        IndexOperations indexOps = elasticsearchOperations.indexOps(MatchSearchDocument.class);

        if (indexOps.exists()) {
            indexOps.delete();
        }

        indexOps.create();
        indexOps.putMapping(indexOps.createMapping());

        List<Match> matches = matchRepository.findAll();
        List<MatchSearchDocument> documents = matches.stream()
                .map(this::convertToDocument)
                .toList();

        matchSearchRepository.saveAll(documents);
        return documents.size();
    }

}