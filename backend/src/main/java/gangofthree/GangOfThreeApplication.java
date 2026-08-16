package gangofthree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;
@SpringBootApplication
@EnableScheduling
@EnableAsync(proxyTargetClass = true)
public class GangOfThreeApplication {

    public static void main(String[] args) {
        SpringApplication.run(GangOfThreeApplication.class, args);
    }

}
