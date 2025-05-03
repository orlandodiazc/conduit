package ditod.conduit.web.response;

import ditod.conduit.core.model.article.Article;
import ditod.conduit.core.model.article.ArticleTag;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record ArticleDto(
        @NotNull Integer id,
        @NotNull String slug,
        @NotNull String title,
        @NotNull String description,
        @NotNull String body,
        @NotNull List<String> tagList,
        @NotNull Instant createdAt,
        @NotNull Instant updatedAt,
        @NotNull boolean favorited,
        @NotNull long favoritesCount,
        @NotNull AuthorDto author) {
    public static ArticleDto from(Article article, boolean favorited, long favoritesCount, AuthorDto author) {
        return new ArticleDto(
                article.getId(),
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
