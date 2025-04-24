package ditod.conduit.core.model.article;

import ditod.conduit.core.model.DateTimeAudit;
import ditod.conduit.core.model.user.User;
import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Article extends DateTimeAudit {
    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String body;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ArticleTag> tagList;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
}
