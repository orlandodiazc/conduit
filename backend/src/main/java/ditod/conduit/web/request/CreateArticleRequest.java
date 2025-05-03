package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateArticleRequest(@Valid @NotNull CreateArticleDto article) {
    public record CreateArticleDto(
            @NotNull String title, @NotNull String description, @NotNull String body, String[] tagList) {}
}
