package com.fooddelivery.fooddeliverybackend.controller;

import com.fooddelivery.fooddeliverybackend.dto.order.CreateOrderRequest;
import com.fooddelivery.fooddeliverybackend.dto.order.OrderResponse;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.security.CustomUserDetails;
import com.fooddelivery.fooddeliverybackend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request,
                                     Authentication authentication) {
    	User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return orderService.createOrder(user, request);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id, Authentication authentication) {
    	User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return orderService.getOrderById(user, id);
    }

    @GetMapping("/my")
    public List<OrderResponse> myOrders(Authentication authentication) {
    	User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return orderService.getMyOrders(user);
    }
}