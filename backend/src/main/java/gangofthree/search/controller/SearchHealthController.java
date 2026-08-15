package gangofthree.search.controller;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchHealthController {

    private final ElasticsearchClient elasticsearchClient;

    @GetMapping("/health")
    public Map<String, Object> health() throws IOException {
        var info = elasticsearchClient.info();

        return Map.of(
                "service", "Elasticsearch",
                "connected", true,
                "clusterName", info.clusterName(),
                "version", info.version().number()
        );
    }
}
