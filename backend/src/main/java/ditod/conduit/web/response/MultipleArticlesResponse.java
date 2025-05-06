package ditod.conduit.web.response;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record MultipleArticlesResponse(@NotNull List<ArticleDto> articles, @NotNull long totalArticles) {
}