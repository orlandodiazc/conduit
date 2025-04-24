package ditod.conduit.core.model.comment;

import ditod.conduit.core.model.DateTimeAudit;
import ditod.conduit.core.model.article.Article;
import ditod.conduit.core.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Comment extends DateTimeAudit {
    @Column(nullable = false)
    private String body;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
}
