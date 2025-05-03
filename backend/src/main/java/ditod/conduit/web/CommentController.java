package ditod.conduit.web;

import ditod.conduit.core.service.ArticleService;
import ditod.conduit.core.service.CommentService;
import ditod.conduit.core.service.UserFollowService;
import ditod.conduit.core.service.UserService;
import ditod.conduit.security.AuthService;
import ditod.conduit.web.request.CreateCommentRequest;
import ditod.conduit.web.response.AuthorDto;
import ditod.conduit.web.response.CommentDto;
import ditod.conduit.web.response.CommentResponse;
import ditod.conduit.web.response.MultipleCommentsResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class CommentController {
    private final CommentService commentService;
    private final ArticleService articleService;
    private final UserService userService;
    private final UserFollowService userFollowService;
    private final AuthService authService;

    public CommentController(
            CommentService commentService,
            ArticleService articleService,
            UserService userService,
            UserFollowService userFollowService,
            AuthService authService) {
        this.commentService = commentService;
        this.articleService = articleService;
        this.userService = userService;
        this.userFollowService = userFollowService;
        this.authService = authService;
    }

    @PostMapping("/articles/{articleId}/comments")
    CommentResponse createComment(
            @PathVariable Integer articleId, @RequestBody CreateCommentRequest commentRequest, Authentication auth) {
        var article = articleService.getArticleById(articleId);
        var me = userService.getUserByEmail(auth.getName());
        var createdComment = commentService.create(commentRequest.comment().body(), article, me);
        return CommentResponse.from(createdComment);
    }

    @GetMapping("/articles/{articleId}/comments")
    MultipleCommentsResponse getComments(@PathVariable Integer articleId, Authentication auth) {
        var comments = commentService.findByArticleId(articleId);
        if (authService.isAnonymous(auth)) {
            return new MultipleCommentsResponse(
                    comments.stream().map(CommentDto::from).toList());
        }
        var me = userService.getUserByEmail(auth.getName());
        return new MultipleCommentsResponse(comments.stream()
                .map(comment -> CommentDto.from(
                        comment,
                        AuthorDto.from(comment.getAuthor(), userFollowService.isFollowing(me, comment.getAuthor()))))
                .toList());
    }

    @DeleteMapping("/comments/{id}")
    void deleteComment(@PathVariable Integer id, Authentication auth) {
        var me = userService.getUserByEmail(auth.getName());
        var comment = commentService.getById(id);
        commentService.delete(comment, me);
    }
}
