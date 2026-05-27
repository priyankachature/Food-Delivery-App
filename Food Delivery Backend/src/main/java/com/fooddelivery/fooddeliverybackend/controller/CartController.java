package com.fooddelivery.fooddeliverybackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.fooddelivery.fooddeliverybackend.dto.order.OrderSummaryCalculation;
import com.fooddelivery.fooddeliverybackend.entity.CartItem;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.security.CustomUserDetails;
import com.fooddelivery.fooddeliverybackend.service.CartService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private User getUserFromAuth(Authentication authentication) {
        return ((CustomUserDetails) authentication.getPrincipal()).getUser();
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(Authentication authentication,
                                              @RequestParam Long menuItemId,
                                              @RequestParam(defaultValue = "1") int quantity) {
        User user = getUserFromAuth(authentication);
        return ResponseEntity.ok(cartService.addToCart(user, menuItemId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(Authentication authentication,
                                               @RequestParam Long menuItemId) {
        User user = getUserFromAuth(authentication);
        cartService.removeFromCart(user, menuItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/removeAll")
    public ResponseEntity<Void> removeAllFromCart(Authentication authentication,
                                                  @RequestParam Long menuItemId) {
        User user = getUserFromAuth(authentication);
        cartService.removeAllFromCart(user, menuItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getCartCount(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        int count = cartService.getCartCount(user);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/summary")
    public ResponseEntity<OrderSummaryCalculation> getCartSummary(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        return ResponseEntity.ok(cartService.getCartSummary(user));
    }
}