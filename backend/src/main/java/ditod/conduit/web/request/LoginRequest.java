package ditod.conduit.web.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(@Valid LoginUserDto user) {
    public LoginRequest(String email, String password) {
        this(new LoginUserDto(email, password));
    }

    public record LoginUserDto(@NotNull String email, @NotNull String password) {}
}
