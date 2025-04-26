package ditod.conduit.web.response;

import java.util.List;

public record MultipleCommentsResponse(List<CommentDto> comments) {}
