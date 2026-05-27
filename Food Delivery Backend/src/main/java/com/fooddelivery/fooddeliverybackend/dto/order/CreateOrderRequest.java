package com.fooddelivery.fooddeliverybackend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateOrderRequest(
        @Valid @NotNull Long addressId,
        @Valid @NotEmpty List<OrderItemRequest> items
) {
}
