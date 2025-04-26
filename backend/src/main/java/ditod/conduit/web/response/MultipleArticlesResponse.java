package ditod.conduit.web.response;

import java.util.List;

public record MultipleArticlesResponse(List<ArticleDto> articles, int articlesCount) {
    public MultipleArticlesResponse {
        articlesCount = articles.size();
    }

    public MultipleArticlesResponse(List<ArticleDto> articles) {
        this(articles, articles.size());
    }
}