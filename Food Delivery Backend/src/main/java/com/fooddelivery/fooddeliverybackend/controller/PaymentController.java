package com.fooddelivery.fooddeliverybackend.controller;

import com.fooddelivery.fooddeliverybackend.entity.CustomerOrder;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.security.CustomUserDetails;
import com.fooddelivery.fooddeliverybackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<CustomerOrder> initiatePayment(@RequestBody Map<String, String> payload, Authentication authentication) {
        Long orderId = Long.valueOf(payload.get("orderId"));
        String method = payload.get("method");
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        CustomerOrder order = paymentService.initiatePayment(orderId, method, user);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/confirm")
    public ResponseEntity<CustomerOrder> confirmPayment(@RequestBody Map<String, String> payload, Authentication authentication) {
        Long orderId = Long.valueOf(payload.get("orderId"));
        String paymentId = payload.get("paymentId");
        boolean success = Boolean.parseBoolean(payload.get("success"));
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        CustomerOrder order = paymentService.confirmPayment(orderId, paymentId, success, user);
        return ResponseEntity.ok(order);
    }
    
    @PostMapping("/place")
    public ResponseEntity<CustomerOrder> placeOrder(@RequestBody Map<String, String> payload, Authentication authentication) {
        Long orderId = Long.valueOf(payload.get("orderId"));
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        CustomerOrder order = paymentService.placeOrder(orderId, user);
        return ResponseEntity.ok(order);
    }

}