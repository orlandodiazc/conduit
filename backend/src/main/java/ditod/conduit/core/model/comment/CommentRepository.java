package ditod.conduit.core.model.comment;

import ditod.conduit.core.model.article.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    void deleteByArticle(Article article);

    List<Comment> findByArticleId(Integer id);
}
