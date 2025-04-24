package ditod.conduit.core.model.user;

import ditod.conduit.core.model.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"follower_id", "following_id"})})
public class UserFollow extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower;

    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following;
}
