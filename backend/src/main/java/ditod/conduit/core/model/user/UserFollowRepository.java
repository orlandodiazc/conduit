package ditod.conduit.core.model.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserFollowRepository extends JpaRepository<UserFollow, Integer> {
    boolean existsByFollowerAndFollowing(User follower, User following);

    @Transactional
    void deleteByFollowerAndFollowing(User follower, User following);

    List<UserFollow> findByFollower(User reader);
}
