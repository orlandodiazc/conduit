package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(@Valid @NotNull RegisterUserDto user) {
    public record RegisterUserDto(@NotNull String username, @NotNull String email, @NotNull String password) {}
}
