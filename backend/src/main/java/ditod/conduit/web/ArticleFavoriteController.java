package ditod.conduit.web;

import ditod.conduit.core.model.article.ArticleFavorite;
import ditod.conduit.core.model.article.ArticleFavoriteRepository;
import ditod.conduit.core.service.ArticleService;
import ditod.conduit.core.service.UserService;
import ditod.conduit.web.response.ArticleResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/articles/{slug}/favorite")
public class ArticleFavoriteController {
    private final UserService userService;
    private final ArticleFavoriteRepository articleFavoriteRepository;
    private final ArticleService articleService;

    public ArticleFavoriteController(
            UserService userService,
            ArticleFavoriteRepository articleFavoriteRepository,
            ArticleService articleService) {
        this.userService = userService;
        this.articleFavoriteRepository = articleFavoriteRepository;
        this.articleService = articleService;
    }

    @PostMapping
    ArticleResponse favoriteArticle(@PathVariable String slug, Authentication auth) {
        var me = userService.getUserByEmail(auth.getName());
        var article = articleService.getArticleBySlug(slug);
        articleFavoriteRepository.save(new ArticleFavorite(me, article));
        return new ArticleResponse(articleService.getArticleDetails(article, me, true));
    }

    @DeleteMapping
    ArticleResponse unfavoriteArticle(@PathVariable String slug, Authentication auth) {
        var me = userService.getUserByEmail(auth.getName());
        var article = articleService.getArticleBySlug(slug);
        articleFavoriteRepository.deleteByUserAndArticle(me, article);
        return new ArticleResponse(articleService.getArticleDetails(article, me, false));
    }
}
