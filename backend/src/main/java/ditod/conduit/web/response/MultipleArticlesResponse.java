package ditod.conduit.web.response;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record MultipleArticlesResponse(@NotNull List<ArticleDto> articles, @NotNull int articlesCount) {
    public MultipleArticlesResponse {
        articlesCount = articles.size();
    }

    public MultipleArticlesResponse(List<ArticleDto> articles) {
        this(articles, articles.size());
    }
}