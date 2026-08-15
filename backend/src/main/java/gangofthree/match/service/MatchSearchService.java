package gangofthree.match.service;

import gangofthree.search.document.MatchSearchDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchSearchService {

    private final ElasticsearchOperations elasticsearchOperations;

    public List<Long> searchMatchIds(String query, String sport, String city) {
        BoolQuery.Builder boolQuery = new BoolQuery.Builder();

        if (query != null && !query.isBlank()) {
            boolQuery.must(q -> q.multiMatch(m -> m
                    .fields("hostTeam", "guestTeam", "venue")
                    .query(query)
                    .fuzziness("AUTO")
            ));
        }

        if (sport != null && !sport.isBlank()) {
            boolQuery.filter(f -> f.term(t -> t.field("sport").value(sport)));
        }

        if (city != null && !city.isBlank()) {
            boolQuery.filter(f -> f.term(t -> t.field("city").value(city)));
        }

        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(boolQuery.build()._toQuery())
                .build();

        SearchHits<MatchSearchDocument> hits = elasticsearchOperations.search(nativeQuery, MatchSearchDocument.class);

        return hits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .map(MatchSearchDocument::getId)
                .toList();
    }
}
