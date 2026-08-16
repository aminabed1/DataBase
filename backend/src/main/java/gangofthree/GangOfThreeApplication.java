package gangofthree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@SpringBootApplication
@EnableScheduling
public class GangOfThreeApplication {

    public static void main(String[] args) {
        SpringApplication.run(GangOfThreeApplication.class, args);
    }

}
