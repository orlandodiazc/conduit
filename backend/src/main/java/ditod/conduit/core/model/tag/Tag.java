package ditod.conduit.core.model.tag;

import ditod.conduit.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Tag extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String name;

    public Tag() {}

    public Tag(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
