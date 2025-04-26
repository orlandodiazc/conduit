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
@RequestMapping("/articles/{articleSlug}/comments")
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

    @PostMapping
    CommentResponse createComment(
            @PathVariable String articleSlug, @RequestBody CreateCommentRequest commentRequest, Authentication auth) {
        var article = articleService.getArticleBySlug(articleSlug);
        var me = userService.getUserByEmail(auth.getName());
        var createdComment = commentService.create(commentRequest.comment().body(), article, me);
        return CommentResponse.from(createdComment);
    }

    @GetMapping
    MultipleCommentsResponse getComments(@PathVariable String articleSlug, Authentication auth) {
        var comments = commentService.findByArticleSlug(articleSlug);
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

    @DeleteMapping("/{commentId}")
    void deleteComment(@PathVariable Integer commentId, Authentication auth) {
        var me = userService.getUserByEmail(auth.getName());
        var comment = commentService.getById(commentId);
        commentService.delete(comment, me);
    }
}
