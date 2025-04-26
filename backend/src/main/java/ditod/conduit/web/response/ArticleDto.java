package ditod.conduit.web.response;

import ditod.conduit.core.model.article.Article;
import ditod.conduit.core.model.article.ArticleTag;

import java.time.Instant;
import java.util.List;

public record ArticleDto(
        String slug,
        String title,
        String description,
        String body,
        List<String> tagList,
        Instant createdAt,
        Instant updatedAt,
        boolean favorited,
        long favoritesCount,
        AuthorDto author) {
    public static ArticleDto from(Article article, boolean favorited, long favoritesCount, AuthorDto author) {
        return new ArticleDto(
                article.getSlug(),
                article.getTitle(),
                article.getDescription(),
                article.getBody(),
                article.getTagList().stream().map(ArticleTag::getTagName).toList(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                favorited,
                favoritesCount,
                author);
    }

    public static ArticleDto from(Article article, long favoritesCount) {
        return ArticleDto.from(article, false, favoritesCount, AuthorDto.from(article.getAuthor(), false));
    }
}
