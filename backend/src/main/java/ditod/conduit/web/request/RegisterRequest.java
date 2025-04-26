package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(@Valid Params user) {
    public record Params(@NotNull String username, @NotNull String email, @NotNull String password) {}
}
