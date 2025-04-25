package ditod.conduit.web;

import ditod.conduit.core.service.UserFollowService;
import ditod.conduit.core.service.UserService;
import ditod.conduit.web.response.AuthorDto;
import ditod.conduit.web.response.ProfileResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
public class ProfileController {
    private final UserService userService;
    private final UserFollowService userFollowService;

    public ProfileController(UserService userService, UserFollowService userFollowService) {
        this.userService = userService;
        this.userFollowService = userFollowService;
    }

    @GetMapping("/{username}")
    ProfileResponse getProfile(@PathVariable String username, Authentication auth) {
        var profileUser = userService.getUserByUsername(username);
        if (auth == null || !auth.isAuthenticated()) {
            return new ProfileResponse(AuthorDto.from(profileUser, false));
        }
        var me = userService.getUserByEmail(auth.getName());
        var isMeAFollower = userFollowService.isFollower(me, profileUser);
        return new ProfileResponse(AuthorDto.from(profileUser, isMeAFollower));
    }

    @PostMapping("/{username}/follow")
    ProfileResponse saveUserFollow(@PathVariable String username, Authentication auth) {
        var userToFollow = userService.getUserByUsername(username);
        var me = userService.getUserByEmail(auth.getName());
        userFollowService.follow(me, userToFollow);
        return new ProfileResponse(AuthorDto.from(userToFollow, true));
    }

    @DeleteMapping("/{username}/follow")
    ProfileResponse deleteUserFollow(@PathVariable String username, Authentication auth) {
        var userToUnfollow = userService.getUserByUsername(username);
        var me = userService.getUserByEmail(auth.getName());
        userFollowService.unfollow(me, userToUnfollow);
        return new ProfileResponse(AuthorDto.from(userToUnfollow, false));
    }
}
