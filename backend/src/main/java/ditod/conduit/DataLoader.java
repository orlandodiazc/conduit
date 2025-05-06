package ditod.conduit;

import ditod.conduit.core.model.article.*;
import ditod.conduit.core.model.comment.Comment;
import ditod.conduit.core.model.comment.CommentRepository;
import ditod.conduit.core.model.tag.Tag;
import ditod.conduit.core.model.tag.TagRepository;
import ditod.conduit.core.model.user.User;
import ditod.conduit.core.model.user.UserFollow;
import ditod.conduit.core.model.user.UserFollowRepository;
import ditod.conduit.core.model.user.UserRepository;
import net.datafaker.Faker;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
// @Profile("disable")
public class DataLoader implements ApplicationRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;
    private static final Faker faker = new Faker();
    private final CommentRepository commentRepository;
    private final UserFollowRepository userFollowRepository;
    private final ArticleFavoriteRepository articleFavoriteRepository;

    public DataLoader(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            TagRepository tagRepository,
            ArticleRepository articleRepository,
            CommentRepository commentRepository,
            UserFollowRepository userFollowRepository,
            ArticleFavoriteRepository articleFavoriteRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tagRepository = tagRepository;
        this.articleRepository = articleRepository;
        this.commentRepository = commentRepository;
        this.userFollowRepository = userFollowRepository;
        this.articleFavoriteRepository = articleFavoriteRepository;
    }

    public User createFakeUser() {
        User user = new User();
        user.setEmail(faker.internet().emailAddress());
        user.setUsername(faker.name().name());
        user.setPassword(passwordEncoder.encode(faker.internet().password(8, 16))); // Random password 8-16 chars
        user.setImage("/logo192.png");
        user.setBio(faker.lorem().sentence());
        return user;
    }

    public Article createFakeArticle(User author) {
        Article article = new Article();
        var title = faker.lorem().sentence(4);
        article.setSlug(title.toLowerCase().replaceAll("\\s+", "-"));
        article.setTitle(title);
        article.setDescription(faker.lorem().sentence(3));
        article.setBody(faker.lorem().paragraph(1));
        article.setAuthor(author);

        Set<ArticleTag> articleTags = generateRandomTags(article);
        article.setTagList(articleTags);

        return article;
    }

    public Comment createFakeComment(Article article, User author) {
        Comment comment = new Comment();
        comment.setBody(faker.lorem().sentence(3)); // Random comment text
        comment.setArticle(article);
        comment.setAuthor(author);
        return comment;
    }


    private Set<ArticleTag> generateRandomTags(Article article) {
        List<String> tagNames = List.of(
                faker.hipster().word());

        return tagNames.stream()
                .map(this::findOrCreateTag)
                .map(tag -> {
                    ArticleTag articleTag = new ArticleTag(tag);
                    articleTag.setArticle(article);
                    return articleTag;
                })
                .collect(Collectors.toSet());
    }

    private Tag findOrCreateTag(String name) {
        return tagRepository.findByName(name).orElseGet(() -> tagRepository.save(new Tag(name)));
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        var me = new User();
        me.setEmail("ditod@mail.com");
        me.setUsername("ditod");
        me.setPassword(passwordEncoder.encode("123456"));
        me.setBio("I'm cool as hell and I know it because of the way it is");
        me.setImage("/logo192.png");
        Random random = new Random();
        int numberOfUsers = random.nextInt(2) + 4; // 5-10
        List<User> users = IntStream.range(0, numberOfUsers)
                .mapToObj(i -> this.createFakeUser())
                .collect(Collectors.toList());
        users.add(me);
        userRepository.saveAll(users);

        // 2. Create articles for each user
        List<Article> allArticles = new ArrayList<>();
        for (User user : users) {
            int articlesPerUser = random.nextInt(10) + 15; // 1–3 articles per user
            for (int i = 0; i < articlesPerUser; i++) {
                Article article = this.createFakeArticle(user);
                articleRepository.save(article);
                allArticles.add(article);

                // 3. Create comments for each article
                int commentsPerArticle = random.nextInt(5) + 1; // 1–5 comments per article
                for (int j = 0; j < commentsPerArticle; j++) {
                    User randomCommenter = users.get(random.nextInt(users.size()));
                    Comment comment = this.createFakeComment(article, randomCommenter);
                    commentRepository.save(comment);
                }
            }
        }

        // 4. Make users follow each other

        for (User follower : users) {
            int follows = random.nextInt(users.size()); // each user can follow 0–(n-1) users
            Collections.shuffle(users);
            for (int i = 0; i < follows; i++) {
                User following = users.get(i);
                if (!follower.equals(following)) { // Don't follow themselves
                    UserFollow userFollow = new UserFollow();
                    userFollow.setFollower(follower);
                    userFollow.setFollowing(following);
                    if (!userFollowRepository.existsByFollowerAndFollowing(follower, following)) {
                        userFollowRepository.save(userFollow);
                    }
                }
            }
        }


        // 5. Make users favorite random articles

        for (User user : users) {
            int favorites = random.nextInt(allArticles.size()); // 0 to total articles
            Collections.shuffle(allArticles);
            for (int i = 0; i < favorites; i++) {
                Article article = allArticles.get(i);
                if (!articleFavoriteRepository.existsByUserAndArticle(user, article)) {
                    ArticleFavorite favorite = new ArticleFavorite(user, article);
                    articleFavoriteRepository.save(favorite);
                }
            }
        }

    }
}
