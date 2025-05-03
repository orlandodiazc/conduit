package ditod.conduit.web.response;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record MultipleCommentsResponse(@NotNull List<CommentDto> comments) {}
