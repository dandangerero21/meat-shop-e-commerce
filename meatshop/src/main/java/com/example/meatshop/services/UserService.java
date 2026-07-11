package com.example.meatshop.services;

import java.util.Optional;
import java.util.UUID;
import java.util.List;
import org.springframework.stereotype.Service;
import com.example.meatshop.models.User;
import com.example.meatshop.repositories.UserRepository;
import com.example.meatshop.enums.Role;
import com.example.meatshop.configs.PasswordEncoder;
import com.example.meatshop.dtos.UserRegistrationDTO;
import com.example.meatshop.dtos.UserResponseDTO;
import com.example.meatshop.dtos.LoginRequestDTO;
import com.example.meatshop.dtos.LoginResponseDTO;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    // LOGIN METHOD

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password."));

        boolean matches = passwordEncoder.verifyPassword(loginRequest.getPassword(), user.getPassword());

        if (!matches) {
            throw new RuntimeException("Invalid username or password.");
        }

        String token = tokenService.generateToken(user.getUsername());

        return new LoginResponseDTO(token, convertToResponseDTO(user));
    }

    // REGISTER (or create. if you must)
    public UserResponseDTO registerUser(UserRegistrationDTO dto) {
        Role role = Role.valueOf(dto.getRole().toUpperCase());

        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists.");
        }

        if (userRepository.findByEmailIgnoreCase(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        String hashedPassword = passwordEncoder.hashPassword(dto.getRawPassword());

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(hashedPassword);
        user.setRole(role);
        user.setProfilePictureUrl(dto.getProfilePictureUrl());

        User saved = userRepository.save(user);

        return convertToResponseDTO(saved);
    }

    // read
    public UserResponseDTO findById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));
        return convertToResponseDTO(user);
    }

    public UserResponseDTO findByName(String name) {
        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new RuntimeException("User not found."));
        return convertToResponseDTO(user);
    }

    public UserResponseDTO findByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found."));
        return convertToResponseDTO(user);
    }

    // these two functions are to be used only by admin
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    public List<UserResponseDTO> getUsersByRole(Role role) {
        List<User> users = userRepository.findByRole(role);
        if (users.isEmpty()) {
            throw new RuntimeException("No users found.");
        }
        return users.stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    // update
    public UserResponseDTO updateUser(UUID id, UserRegistrationDTO userDetails) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setRole(Role.valueOf(userDetails.getRole().toUpperCase()));
            existingUser.setProfilePictureUrl(userDetails.getProfilePictureUrl());
            return convertToResponseDTO(userRepository.save(existingUser));
        } else {
            throw new RuntimeException("User not found");
        }
    }

    // delete
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    // ----HELPER METHOD----//

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        return dto;
    }
}
