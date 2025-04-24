package ditod.conduit.web.response;

import ditod.conduit.core.model.user.User;

public record MeResponse(Params user) {
    public MeResponse(String email, String token, String username, String bio, String image) {
        this(new Params(email, token, username, bio, image));
    }

    public static MeResponse from(User user, String token) {
        return new MeResponse(user.getEmail(), token, user.getUsername(), user.getBio(), user.getImage());
    }

    public record Params(String email, String token, String username, String bio, String image) {}
}
