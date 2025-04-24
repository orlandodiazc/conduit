package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(@Valid Params user) {
    public RegisterRequest(String username, String email, String password) {
        this(new Params(username, email, password));
    }

    public record Params(@NotNull String username, @NotNull String email, @NotNull String password) {}
}
