package ditod.conduit.web;

import ditod.conduit.core.service.UserService;
import ditod.conduit.security.AuthService;
import ditod.conduit.web.request.LoginRequest;
import ditod.conduit.web.request.RegisterRequest;
import ditod.conduit.web.request.UpdateUserRequest;
import ditod.conduit.web.response.MeResponse;
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

    public UserController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/users/login")
    public MeResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        var authenticated = authService.login(
                loginRequest.user().email(), loginRequest.user().password());
        return MeResponse.from(authenticated.user(), authenticated.token());
    }

    @PostMapping("/users")
    public ModelAndView register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        var user = registerRequest.user();
        userService.registerUser(user.email(), user.username(), user.password());

        var loginRequest = new LoginRequest(user.username(), user.password());
        request.setAttribute(View.RESPONSE_STATUS_ATTRIBUTE, HttpStatus.TEMPORARY_REDIRECT);
        return new ModelAndView("redirect:/users/login", "loginRequest", loginRequest);
    }

    @GetMapping("/user")
    public MeResponse me(@AuthenticationPrincipal Jwt jwt) {
        var user = userService.getUserByEmail(jwt.getSubject());
        return MeResponse.from(user, jwt.getTokenValue());
    }

    @PutMapping("/user")
    public MeResponse updateUser(
            @Valid @RequestBody UpdateUserRequest updateRequest, @AuthenticationPrincipal Jwt jwt) {
        var user = userService.getUserByEmail(jwt.getSubject());
        var updatedUser = userService.updateUser(user, updateRequest);
        return MeResponse.from(updatedUser, jwt.getTokenValue());
    }
}
