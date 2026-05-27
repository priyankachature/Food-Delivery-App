package com.fooddelivery.fooddeliverybackend.dto.auth;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email
) {
}
