package ditod.conduit.domain.user.dto;

import ditod.conduit.domain.user.AuthUser;
import ditod.conduit.domain.user.User;

public record MeResponse(String email, String username, String bio, String token) {
    public static MeResponse fromAuthUser(AuthUser authUser, String token) {
        User user = authUser.getUser();
        return new MeResponse(user.getEmail(), user.getUsername(), user.getBio(), token);
    }
}
