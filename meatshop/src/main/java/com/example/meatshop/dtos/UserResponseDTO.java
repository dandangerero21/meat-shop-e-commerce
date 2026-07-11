package com.example.meatshop.dtos;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
    private UUID id;
    private String username;
    private String email;
    private String role;
    private String profilePictureUrl;
}
