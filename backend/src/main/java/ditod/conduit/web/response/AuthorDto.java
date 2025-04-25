package ditod.conduit.web.response;

import ditod.conduit.core.model.user.User;

public record AuthorDto(String username, String bio, String image, boolean following) {
    public static AuthorDto from(User user, boolean following) {
        return new AuthorDto(user.getUsername(), user.getBio(), user.getImage(), following);
    }
}
