package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateCommentRequest(@Valid @NotNull CreateCommentDto comment) {
    public record CreateCommentDto(@NotNull String body) {}
}
