package ditod.conduit.core.service;

import ditod.conduit.core.model.article.Article;
import ditod.conduit.core.model.comment.Comment;
import ditod.conduit.core.model.comment.CommentRepository;
import ditod.conduit.core.model.user.User;
import ditod.conduit.exception.EntityDoesNotExistException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment create(String body, Article article, User user) {
        return commentRepository.save(new Comment(body, article, user));
    }

    public List<Comment> findByArticleId(Integer id) {
        return commentRepository.findByArticleId(id);
    }

    public Comment getById(Integer commentId) {
        return commentRepository
                .findById(commentId)
                .orElseThrow(() -> new EntityDoesNotExistException("comment", "id", Integer.toString(commentId)));
    }

    @Transactional
    public void delete(Comment comment, User author) {
        if (!comment.getAuthor().equals(author)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        commentRepository.delete(comment);
    }
}
