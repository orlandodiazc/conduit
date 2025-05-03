package ditod.conduit.core.model.article;

import ditod.conduit.core.model.DateTimeAudit;
import ditod.conduit.core.model.user.User;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Article extends DateTimeAudit {
    @Column(nullable = false)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String body;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ArticleTag> tagList = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        this.slug = title.toLowerCase().replaceAll("\\s+", "-");
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Set<ArticleTag> getTagList() {
        return tagList;
    }

    public void setTagList(Set<ArticleTag> tagList) {
        this.tagList = tagList;
    }

    public void addTag(ArticleTag articleTag) {
        tagList.add(articleTag);
        articleTag.setArticle(this);
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}
