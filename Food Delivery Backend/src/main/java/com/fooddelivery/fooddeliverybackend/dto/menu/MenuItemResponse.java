package com.fooddelivery.fooddeliverybackend.dto.menu;

import java.math.BigDecimal;

public record MenuItemResponse(
        Long id,
        String name,
        String category,
        BigDecimal price,
        String description,
        String imageUrl,
        boolean active
) {
}
