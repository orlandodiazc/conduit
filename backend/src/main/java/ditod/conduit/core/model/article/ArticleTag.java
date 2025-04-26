package ditod.conduit.core.model.article;

import ditod.conduit.core.model.BaseEntity;
import ditod.conduit.core.model.tag.Tag;
import jakarta.persistence.*;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"article_id", "tag_id"})})
public class ArticleTag extends BaseEntity {
    public ArticleTag() {}

    public ArticleTag(Tag tag) {
        this.tag = tag;
    }

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }

    public String getTagName() {
        return tag.getName();
    }
}
