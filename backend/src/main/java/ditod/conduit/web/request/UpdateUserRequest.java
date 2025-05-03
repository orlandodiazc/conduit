package ditod.conduit.web.request;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(@NotNull UpdateUserDto user) {
    public record UpdateUserDto(@NotNull String email, @NotNull String username, @NotNull String password, @NotNull String bio, String image) {}
}