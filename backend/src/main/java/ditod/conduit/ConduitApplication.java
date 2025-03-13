package ditod.conduit;

import ditod.conduit.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyProperties.class)
public class ConduitApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConduitApplication.class, args);
    }
}
