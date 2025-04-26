package ditod.conduit.web;

import ditod.conduit.core.OffsetPageRequest;
import ditod.conduit.core.model.article.Article;
import ditod.conduit.core.model.user.User;
import ditod.conduit.core.service.ArticleService;
import ditod.conduit.core.service.UserFollowService;
import ditod.conduit.core.service.UserService;
import ditod.conduit.security.AuthService;
import ditod.conduit.web.request.CreateArticleRequest;
import ditod.conduit.web.request.UpdateArticleRequest;
import ditod.conduit.web.response.ArticleResponse;
import ditod.conduit.web.response.MultipleArticlesResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
public class ArticleController {
    private final ArticleService articleService;
    private final UserService userService;
    private final UserFollowService userFollowService;
    private final AuthService authService;

    public ArticleController(
            ArticleService articleService,
            UserService userService,
            UserFollowService userFollowService,
            AuthService authService) {
        this.articleService = articleService;
        this.userService = userService;
        this.userFollowService = userFollowService;
        this.authService = authService;
    }

    @GetMapping
    MultipleArticlesResponse listArticle(
            @RequestParam(value = "tag", required = false) String tag,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "favorited", required = false) String favorited,
            @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
            @RequestParam(value = "limit", required = false, defaultValue = "20") int limit,
            Authentication auth) {
        var articlesPage = articleService.search(
                tag, author, favorited, new OffsetPageRequest(offset, limit, Sort.by("createdAt")));
        var articles = articlesPage.getContent();
        if (authService.isAnonymous(auth)) {
            return new MultipleArticlesResponse(
                    articles.stream().map(articleService::getArticleDetails).toList());
        }
        var me = userService.getUserByEmail(auth.getName());
        return new MultipleArticlesResponse(articles.stream()
                .map(article -> articleService.getArticleDetails(article, me))
                .toList());
    }

    @GetMapping("/feed")
    MultipleArticlesResponse listArticleFeed(
            @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
            @RequestParam(value = "limit", required = false, defaultValue = "20") int limit,
            Authentication auth) {
        var me = userService.getUserByEmail(auth.getName());
        List<User> following = userFollowService.followingByReader(me);
        if (following.isEmpty()) {
            return new MultipleArticlesResponse(List.of());
        }
        Page<Article> articlesPage = articleService.findFollowedArticles(
                following, new OffsetPageRequest(offset, limit, Sort.by("createdAt")));
        return new MultipleArticlesResponse(articlesPage.getContent().stream()
                .map(article -> articleService.getArticleDetails(article, me))
                .toList());
    }

    @GetMapping("/{slug}")
    ArticleResponse getArticle(@PathVariable String slug, Authentication auth) {
        var article = articleService.getArticleBySlug(slug);
        if (authService.isAnonymous(auth)) {
            return new ArticleResponse(articleService.getArticleDetails(article));
        }
        var me = userService.getUserByEmail(auth.getName());
        return new ArticleResponse(articleService.getArticleDetails(article, me));
    }

    @PostMapping
    ArticleResponse createArticle(@Valid @RequestBody CreateArticleRequest createArticleRequest, Authentication auth) {
        var me = userService.getUserByEmail(auth.getName());
        var createdArticle = articleService.create(createArticleRequest, me);
        return new ArticleResponse(articleService.getArticleDetails(createdArticle));
    }

    @PutMapping("/{slug}")
    ArticleResponse updateArticle(
            @PathVariable String slug, @RequestBody UpdateArticleRequest updateArticleRequest, Authentication auth) {
        var article = articleService.getArticleBySlug(slug);
        var me = userService.getUserByEmail(auth.getName());
        Article updatedArticle = articleService.update(article, updateArticleRequest, me);
        return new ArticleResponse(articleService.getArticleDetails(updatedArticle));
    }

    @DeleteMapping("/{slug}")
    void deleteArticle(@PathVariable String slug, Authentication auth) {
        var author = userService.getUserByEmail(auth.getName());
        var article = articleService.getArticleBySlug(slug);
        articleService.delete(article, author);
    }
}
