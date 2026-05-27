package com.fooddelivery.fooddeliverybackend.controller;

import com.fooddelivery.fooddeliverybackend.dto.order.OrderResponse;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.entity.ContactMessage;
import com.fooddelivery.fooddeliverybackend.entity.MenuItem;
import com.fooddelivery.fooddeliverybackend.repository.UserRepository;
import com.fooddelivery.fooddeliverybackend.service.OrderService;
import com.fooddelivery.fooddeliverybackend.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final MenuService menuService; // ✅ Inject MenuService

    public AdminController(OrderService orderService, UserRepository userRepository, MenuService menuService) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.menuService = menuService;
    }

    // ✅ Get all orders
    @GetMapping("/orders")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    // ✅ Update order status
    @PutMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return orderService.updateOrderStatus(id, status);
    }

    // ✅ Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Get all menu items
    @GetMapping("/menu")
    public List<MenuItem> getAllMenuItems() {
        return menuService.getAllMenuItems();
    }

    // ✅ Update menu item
    @PutMapping("/menu/{id}")
    public MenuItem updateMenuItem(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return menuService.updateMenuItem(id, payload);
    }

    // (Optional) Add new menu item
    @PostMapping("/menu")
    public MenuItem addMenuItem(@RequestBody MenuItem menuItem) {
        return menuService.addMenuItem(menuItem);
    }

    // (Optional) Delete menu item
    @DeleteMapping("/menu/{id}")
    public void deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
    }
    
    @GetMapping("/messages")
    public List<ContactMessage> getContactMessages() {
        return menuService.getAllContactMessages();
    }
}