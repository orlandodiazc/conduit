package ditod.conduit.web;

import ditod.conduit.core.service.UserService;
import ditod.conduit.security.AuthService;
import ditod.conduit.web.request.LoginRequest;
import ditod.conduit.web.request.RegisterRequest;
import ditod.conduit.web.request.UpdateUserRequest;
import ditod.conduit.web.response.CurrentUserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

@RestController
public class UserController {
    private final AuthService authService;
    private final UserService userService;

    UserController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/users/login")
    CurrentUserResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        var authenticated = authService.login(
                loginRequest.user().email(), loginRequest.user().password());
        return CurrentUserResponse.from(authenticated.user(), authenticated.token());
    }

    @PostMapping("/users")
    CurrentUserResponse register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        var userRegister = registerRequest.user();
        userService.registerUser(userRegister.email(), userRegister.username(), userRegister.password());
        var authenticated = authService.login(userRegister.email(), userRegister.password());
        return CurrentUserResponse.from(authenticated.user(), authenticated.token());
    }

    @GetMapping("/user")
    CurrentUserResponse getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        var user = userService.getUserByEmail(jwt.getSubject());
        return CurrentUserResponse.from(user, jwt.getTokenValue());
    }

    @PutMapping("/user")
    CurrentUserResponse updateCurrentUser(
            @RequestBody UpdateUserRequest updateRequest, @AuthenticationPrincipal Jwt jwt) {
        var me = userService.getUserByEmail(jwt.getSubject());
        var updatedUser = userService.updateUser(me, updateRequest);
        return CurrentUserResponse.from(updatedUser, jwt.getTokenValue());
    }
}
