package ditod.conduit.core.model.tag;

import ditod.conduit.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Tag extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String name;
}
