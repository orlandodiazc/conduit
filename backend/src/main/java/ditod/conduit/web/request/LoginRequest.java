package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(@Valid Params user) {
    public LoginRequest(String email, String password) {
        this(new Params(email, password));
    }

    public record Params(@NotNull String email, @NotNull String password) {}
}
