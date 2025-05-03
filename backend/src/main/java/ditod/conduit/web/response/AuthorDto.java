package ditod.conduit.web.response;

import ditod.conduit.core.model.user.User;
import jakarta.validation.constraints.NotNull;

public record AuthorDto(@NotNull String username, String bio, String image, @NotNull boolean following) {
    public static AuthorDto from(User user, boolean following) {
        return new AuthorDto(user.getUsername(), user.getBio(), user.getImage(), following);
    }
}
