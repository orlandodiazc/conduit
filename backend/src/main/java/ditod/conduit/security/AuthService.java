package ditod.conduit.security;

import ditod.conduit.core.model.user.AuthUser;
import ditod.conduit.core.model.user.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthService(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    public AuthenticatedUser login(String email, String password) {
        var authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(email, password));
        var authUser = (AuthUser) authentication.getPrincipal();
        var token = tokenService.generateToken(authentication);
        return new AuthenticatedUser(authUser.user(), token);
    }

    public record AuthenticatedUser(User user, String token) {}
}
