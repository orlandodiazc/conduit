package ditod.conduit.web.response;

import ditod.conduit.core.model.article.Article;

public record ArticleResponse(ArticleDto article) {
    public static ArticleResponse from(Article article, boolean favorited, long favoritesCount, AuthorDto author) {
        return new ArticleResponse(ArticleDto.from(article, favorited, favoritesCount, author));
    }
}
