package com.fooddelivery.fooddeliverybackend.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long menuItemId,
        String name,
        Integer quantity,
        BigDecimal unitPrice
) {
}
