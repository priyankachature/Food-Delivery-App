package com.fooddelivery.fooddeliverybackend.service;

import com.fooddelivery.fooddeliverybackend.entity.CustomerOrder;
import com.fooddelivery.fooddeliverybackend.entity.OrderStatus;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.repository.CustomerOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private CustomerOrderRepository orderRepository;
    
    @Autowired
    private CartService cartService;

    // Step 1: Initiate payment
    public CustomerOrder initiatePayment(Long orderId, String method, User user) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        //ownership check
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized payment attempt");
        }


        order.setPaymentMethod(method);
        order.setStatus(OrderStatus.PAYMENT_PENDING);
        if (order.getPaymentId() == null) {
            order.setPaymentId("mock_" + System.currentTimeMillis());
        }
 

        return orderRepository.save(order);
    }

    // Step 2: Confirm payment
    public CustomerOrder confirmPayment(Long orderId, String paymentId, boolean success, User user) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ownership check
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized payment attempt");
        }

        if (paymentId != null && !paymentId.isBlank()) {
            order.setPaymentId(paymentId);
        }



        if (success) {
            order.setStatus(OrderStatus.PAYMENT_SUCCESS);
        } else {
            order.setStatus(OrderStatus.PAYMENT_FAILED);
        }


        return orderRepository.save(order);
    }
    
    
 // Step 3: Place order after payment success
    public CustomerOrder placeOrder(Long orderId, User user) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized action");
        }

        if (order.getStatus() != OrderStatus.PAYMENT_SUCCESS) {
            throw new RuntimeException("Order cannot be placed without successful payment");
        }

        order.setStatus(OrderStatus.PLACED);

        // clear cart once order is placed
        cartService.clearCart(user);

        return orderRepository.save(order);
    }

}