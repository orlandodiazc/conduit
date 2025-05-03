package ditod.conduit.web.response;

import ditod.conduit.core.model.comment.Comment;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record CommentDto(@NotNull Integer id, @NotNull Instant createdAt, @NotNull Instant updatedAt, @NotNull String body, @NotNull AuthorDto author) {
    public static CommentDto from(Comment comment, AuthorDto author) {
        return new CommentDto(
                comment.getId(), comment.getCreatedAt(), comment.getCreatedAt(), comment.getBody(), author);
    }

    public static CommentDto from(Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getCreatedAt(),
                comment.getCreatedAt(),
                comment.getBody(),
                AuthorDto.from(comment.getAuthor(), false));
    }
}
