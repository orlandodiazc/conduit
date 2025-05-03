package ditod.conduit.web.response;

import jakarta.validation.constraints.NotNull;

public record ProfileResponse(@NotNull AuthorDto profile) {}
