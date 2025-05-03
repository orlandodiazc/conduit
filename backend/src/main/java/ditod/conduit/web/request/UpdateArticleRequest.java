package ditod.conduit.web.request;

import jakarta.validation.constraints.NotNull;

public record UpdateArticleRequest(@NotNull UpdateArticleDto article) {
    public record UpdateArticleDto(@NotNull String title, @NotNull String description, @NotNull String body) {}
}
