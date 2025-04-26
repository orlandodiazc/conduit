package ditod.conduit.core.model.article;

import ditod.conduit.core.model.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
    Optional<Article> findBySlug(String slug);

    boolean existsByTitle(String title);

    @Query("SELECT DISTINCT a FROM Article a " + "LEFT JOIN a.tagList at "
            + "LEFT JOIN at.tag t "
            + "LEFT JOIN ArticleFavorite af ON af.article = a "
            + "LEFT JOIN af.user fu "
            + "WHERE (:tag IS NULL OR t.name = :tag) "
            + "AND (:author IS NULL OR a.author.username = :author) "
            + "AND (:favorited IS NULL OR fu.username = :favorited)")
    Page<Article> findByFilters(
            @Param("tag") String tag,
            @Param("author") String author,
            @Param("favorited") String favorited,
            Pageable pageable);

    Page<Article> findByAuthorIn(List<User> following, Pageable pageable);
}
