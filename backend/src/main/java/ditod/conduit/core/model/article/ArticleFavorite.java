package ditod.conduit.core.model.article;

import ditod.conduit.core.model.BaseEntity;
import ditod.conduit.core.model.user.User;
import jakarta.persistence.*;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "article_id"})})
public class ArticleFavorite extends BaseEntity {
    public ArticleFavorite() {}

    public ArticleFavorite(User user, Article article) {
        this.user = user;
        this.article = article;
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;
}
