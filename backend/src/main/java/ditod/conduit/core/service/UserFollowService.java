package ditod.conduit.core.service;

import ditod.conduit.core.model.user.User;
import ditod.conduit.core.model.user.UserFollow;
import ditod.conduit.core.model.user.UserFollowRepository;
import org.springframework.stereotype.Service;

@Service
public class UserFollowService {
    private final UserFollowRepository userFollowRepository;

    public UserFollowService(UserFollowRepository userFollowRepository) {
        this.userFollowRepository = userFollowRepository;
    }

    public boolean isFollower(User me, User user) {
        return userFollowRepository.existsByFollowerAndFollowing(me, user);
    }

    public void follow(User me, User user) {
        if (this.isFollower(me, user)) {
            return;
        }
        var userFollow = new UserFollow();
        userFollow.setFollower(me);
        userFollow.setFollowing(user);
        userFollowRepository.save(userFollow);
    }

    public void unfollow(User me, User user) {
        if (this.isFollower(me, user)) {
            userFollowRepository.deleteByFollowerAndFollowing(me, user);
        }
    }
}
