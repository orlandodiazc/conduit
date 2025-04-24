package ditod.conduit.core.model.article;

import ditod.conduit.core.model.BaseEntity;
import ditod.conduit.core.model.tag.Tag;
import jakarta.persistence.*;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"article_id", "tag_id"})})
public class ArticleTag extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;
}
