package ditod.conduit.core.model.article;

import ditod.conduit.core.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface ArticleFavoriteRepository extends JpaRepository<ArticleFavorite, Integer> {
    long countByArticle(Article article);

    boolean existsByUserAndArticle(User user, Article article);

    @Transactional
    void deleteByUserAndArticle(User me, Article article);
}
