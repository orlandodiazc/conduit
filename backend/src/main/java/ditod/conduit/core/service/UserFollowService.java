package ditod.conduit.core.service;

import ditod.conduit.core.model.user.User;
import ditod.conduit.core.model.user.UserFollow;
import ditod.conduit.core.model.user.UserFollowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserFollowService {
    private final UserFollowRepository userFollowRepository;

    public UserFollowService(UserFollowRepository userFollowRepository) {
        this.userFollowRepository = userFollowRepository;
    }

    public boolean isFollowing(User me, User user) {
        return userFollowRepository.existsByFollowerAndFollowing(me, user);
    }

    public void follow(User me, User user) {
        if (this.isFollowing(me, user)) {
            return;
        }
        var userFollow = new UserFollow();
        userFollow.setFollower(me);
        userFollow.setFollowing(user);
        userFollowRepository.save(userFollow);
    }

    public void unfollow(User me, User user) {
        if (this.isFollowing(me, user)) {
            userFollowRepository.deleteByFollowerAndFollowing(me, user);
        }
    }

    public List<User> followingByReader(User reader) {
        return userFollowRepository.findByFollower(reader).stream()
                .map(UserFollow::getFollowing)
                .toList();
    }
}
