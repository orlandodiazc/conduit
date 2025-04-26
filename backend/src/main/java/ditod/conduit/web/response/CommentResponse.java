package ditod.conduit.web.response;

import ditod.conduit.core.model.comment.Comment;

public record CommentResponse(CommentDto comment) {
    public static CommentResponse from(Comment comment, AuthorDto author) {
        return new CommentResponse(CommentDto.from(comment, author));
    }

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(CommentDto.from(comment, AuthorDto.from(comment.getAuthor(), false)));
    }
}
