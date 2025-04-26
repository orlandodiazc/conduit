package ditod.conduit.core.service;

import ditod.conduit.core.OffsetPageRequest;
import ditod.conduit.core.model.article.Article;
import ditod.conduit.core.model.article.ArticleFavoriteRepository;
import ditod.conduit.core.model.article.ArticleRepository;
import ditod.conduit.core.model.article.ArticleTag;
import ditod.conduit.core.model.comment.CommentRepository;
import ditod.conduit.core.model.tag.Tag;
import ditod.conduit.core.model.tag.TagRepository;
import ditod.conduit.core.model.user.User;
import ditod.conduit.exception.EntityAlreadyExistsException;
import ditod.conduit.exception.EntityDoesNotExistException;
import ditod.conduit.web.request.CreateArticleRequest;
import ditod.conduit.web.request.UpdateArticleRequest;
import ditod.conduit.web.response.ArticleDto;
import ditod.conduit.web.response.AuthorDto;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final ArticleFavoriteRepository articleFavoriteRepository;
    private final UserFollowService userFollowService;

    public ArticleService(
            ArticleRepository articleRepository,
            TagRepository tagRepository,
            CommentRepository commentRepository,
            ArticleFavoriteRepository articleFavoriteRepository,
            UserFollowService userFollowService) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.commentRepository = commentRepository;
        this.articleFavoriteRepository = articleFavoriteRepository;
        this.userFollowService = userFollowService;
    }

    public ArticleDto getArticleDetails(Article article, User me) {
        var favoritesCount = articleFavoriteRepository.countByArticle(article);
        var isFavorited = articleFavoriteRepository.existsByUserAndArticle(me, article);
        var isMeAFollower = userFollowService.isFollowing(me, article.getAuthor());
        return ArticleDto.from(article, isFavorited, favoritesCount, AuthorDto.from(me, isMeAFollower));
    }

    public ArticleDto getArticleDetails(Article article, User me, boolean isFavorited) {
        var favoritesCount = articleFavoriteRepository.countByArticle(article);
        var isMeAFollower = userFollowService.isFollowing(me, article.getAuthor());
        return ArticleDto.from(article, isFavorited, favoritesCount, AuthorDto.from(me, isMeAFollower));
    }

    public ArticleDto getArticleDetails(Article article) {
        var favoritesCount = articleFavoriteRepository.countByArticle(article);
        return ArticleDto.from(article, favoritesCount);
    }

    public Article getArticleBySlug(String slug) {
        return articleRepository
                .findBySlug(slug)
                .orElseThrow(() -> new EntityDoesNotExistException("article", "slug", slug));
    }

    public Article create(CreateArticleRequest createArticleRequest, User me) {
        var articleDetails = createArticleRequest.article();
        if (articleRepository.existsByTitle(articleDetails.title())) {
            throw new EntityAlreadyExistsException("article", "title");
        }

        var article = new Article();
        article.setTitle(articleDetails.title());
        article.setDescription(articleDetails.description());
        article.setBody(articleDetails.body());
        article.setAuthor(me);
        if (articleDetails.tagList() != null) {
            for (String tagName : articleDetails.tagList()) {
                Tag tag = tagRepository.findByName(tagName).orElseGet(() -> tagRepository.save(new Tag(tagName)));
                article.addTag(new ArticleTag(tag));
            }
        }
        return articleRepository.save(article);
    }

    public Article update(Article articleToUpdate, UpdateArticleRequest updateArticleRequest, User author) {
        if (!articleToUpdate.getAuthor().equals(author)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        var updateDetails = updateArticleRequest.article();
        if (StringUtils.hasText(updateDetails.title())) {
            articleToUpdate.setTitle(updateDetails.title());
        }

        if (StringUtils.hasText(updateDetails.description())) {
            articleToUpdate.setDescription(updateDetails.description());
        }

        if (StringUtils.hasText(updateDetails.body())) {
            articleToUpdate.setBody(updateDetails.body());
        }

        return articleRepository.save(articleToUpdate);
    }

    @Transactional
    public void delete(Article article, User author) {
        if (!article.getAuthor().equals(author)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        commentRepository.deleteByArticle(article);
        articleRepository.delete(article);
    }

    public Page<Article> search(String tag, String author, String favorited, OffsetPageRequest pageable) {
        return articleRepository.findByFilters(tag, author, favorited, pageable);
    }

    public Page<Article> findFollowedArticles(List<User> following, OffsetPageRequest pageable) {
        return articleRepository.findByAuthorIn(following, pageable);
    }
}
