package com.fooddelivery.fooddeliverybackend.dto.order;

import com.fooddelivery.fooddeliverybackend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        BigDecimal subtotalAmount,
        BigDecimal deliveryFee,
        BigDecimal taxes,          // NEW
        BigDecimal platformFee,  
        BigDecimal totalAmount,
        OrderStatus status,
        Instant createdAt,
        AddressResponse address,
        List<OrderItemResponse> items
) {
}
