package com.example.meatshop.services;

import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private final Map<String, String> tokenMap = new ConcurrentHashMap<>();

    public String generateToken(String username) {
        String token = UUID.randomUUID().toString();
        tokenMap.put(token, username);
        return token;
    }

    public String getUsernameByToken(String token) {
        return tokenMap.get(token);
    }

    public void invalidateToken(String token) {
        tokenMap.remove(token);
    }
}
