package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateCommentRequest(@Valid Params comment) {
    public record Params(@NotNull String body) {}
}
