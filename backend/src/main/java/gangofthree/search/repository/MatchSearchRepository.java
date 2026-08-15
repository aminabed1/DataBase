package gangofthree.search.repository;

import gangofthree.search.document.MatchSearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface MatchSearchRepository extends ElasticsearchRepository<MatchSearchDocument, Long> {
}
