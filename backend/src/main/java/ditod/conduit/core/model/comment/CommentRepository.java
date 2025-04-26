package ditod.conduit.core.model.comment;

import ditod.conduit.core.model.article.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByArticleSlug(String slug);

    void deleteByArticle(Article article);
}
