package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateArticleRequest(@Valid Params article) {
    public record Params(@NotNull String title, @NotNull String description, @NotNull String body, String[] tagList) {}
}
