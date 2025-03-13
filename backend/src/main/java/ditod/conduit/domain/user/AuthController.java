package ditod.conduit.domain.user;

import ditod.conduit.domain.user.dto.LoginRequest;
import ditod.conduit.domain.user.dto.MeResponse;
import ditod.conduit.security.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    public AuthController(TokenService tokenService, AuthenticationManager authenticationManager) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public MeResponse token(@RequestBody LoginRequest loginRequest) {
        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.username(), loginRequest.password());
        Authentication authentication = this.authenticationManager.authenticate(authenticationRequest);
        var authUser = (AuthUser) authentication.getPrincipal();
        return MeResponse.fromAuthUser(authUser, tokenService.generateToken(authentication));
    }
}