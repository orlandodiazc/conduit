package ditod.conduit.web.response;

import ditod.conduit.core.model.comment.Comment;
import jakarta.validation.constraints.NotNull;

public record CommentResponse(@NotNull CommentDto comment) {
    public static CommentResponse from(Comment comment, AuthorDto author) {
        return new CommentResponse(CommentDto.from(comment, author));
    }

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(CommentDto.from(comment, AuthorDto.from(comment.getAuthor(), false)));
    }
}
