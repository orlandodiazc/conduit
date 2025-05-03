package ditod.conduit.web.response;

import ditod.conduit.core.model.user.User;
import jakarta.validation.constraints.NotNull;

public record CurrentUserResponse(@NotNull CurrentUserDto user) {
    public CurrentUserResponse(String email, String token, String username, String bio, String image) {
        this(new CurrentUserDto(email, token, username, bio, image));
    }

    public static CurrentUserResponse from(User user, String token) {
        return new CurrentUserResponse(user.getEmail(), token, user.getUsername(), user.getBio(), user.getImage());
    }

    public record CurrentUserDto(@NotNull String email, @NotNull String token, @NotNull String username, String bio, String image) {}
}
