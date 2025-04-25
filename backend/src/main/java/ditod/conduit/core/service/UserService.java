package ditod.conduit.core.service;

import ditod.conduit.core.model.user.User;
import ditod.conduit.core.model.user.UserRepository;
import ditod.conduit.exception.EntityAlreadyExistsException;
import ditod.conduit.exception.EntityDoesNotExistException;
import ditod.conduit.web.request.UpdateUserRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(String email, String username, String password) {
        checkIfEmailOrUsernameExists(username, email);
        var user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new EntityDoesNotExistException("user", "email", email));
    }

    public User getUserByUsername(String username) {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new EntityDoesNotExistException("user", "username", username));
    }

    public User updateUser(User user, UpdateUserRequest updateUserRequest) {
        var userUpdate = updateUserRequest.user();
        if (!user.getUsername().equals(userUpdate.username())
                && userRepository.existsByUsername(userUpdate.username())) {
            throw new EntityAlreadyExistsException("user", "username");
        }

        if (!user.getEmail().equals(userUpdate.email()) && userRepository.existsByEmail(userUpdate.email())) {
            throw new EntityAlreadyExistsException("user", "email");
        }
        if (StringUtils.hasText(userUpdate.username())) {
            user.setUsername(userUpdate.username());
        }

        if (StringUtils.hasText(userUpdate.email())) {
            user.setEmail(userUpdate.email());
        }

        if (StringUtils.hasText(userUpdate.image())) {
            user.setImage(userUpdate.image());
        }

        if (StringUtils.hasText(userUpdate.bio())) {
            user.setBio(userUpdate.bio());
        }

        if (StringUtils.hasText(userUpdate.password())
                && !passwordEncoder.matches(userUpdate.password(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(userUpdate.password()));
        }

        return user;
    }

    private void checkIfEmailOrUsernameExists(String email, String username) {
        if (userRepository.existsByUsername(username)) {
            throw new EntityAlreadyExistsException("user", "username");
        }
        if (userRepository.existsByEmail(email)) {
            throw new EntityAlreadyExistsException("user", "email");
        }
    }
}
