package ditod.conduit.web.response;

import ditod.conduit.core.model.article.Article;
import jakarta.validation.constraints.NotNull;

public record ArticleResponse(@NotNull ArticleDto article) {
    public static ArticleResponse from(Article article, boolean favorited, long favoritesCount, AuthorDto author) {
        return new ArticleResponse(ArticleDto.from(article, favorited, favoritesCount, author));
    }
}
