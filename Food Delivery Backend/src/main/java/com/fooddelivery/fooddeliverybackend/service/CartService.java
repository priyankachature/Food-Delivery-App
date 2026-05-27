package com.fooddelivery.fooddeliverybackend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fooddelivery.fooddeliverybackend.entity.CartItem;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.entity.MenuItem;
import com.fooddelivery.fooddeliverybackend.repository.CartItemRepository;

import com.fooddelivery.fooddeliverybackend.repository.MenuItemRepository;
import com.fooddelivery.fooddeliverybackend.dto.order.OrderSummaryCalculation;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    
    private final MenuItemRepository menuItemRepository;
    private final OrderSummaryCalculationService orderSummaryCalculationService;

    public CartService(CartItemRepository cartItemRepository,
                      
                       MenuItemRepository menuItemRepository,
                       OrderSummaryCalculationService orderSummaryCalculationService) {
        this.cartItemRepository = cartItemRepository;
       
        this.menuItemRepository = menuItemRepository;
        this.orderSummaryCalculationService = orderSummaryCalculationService;
    }

    public List<CartItem> getCart(User user) {
        return cartItemRepository.findByUser(user);
    }


    @Transactional
    public CartItem addToCart(User user, Long menuItemId, int quantity) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId).orElseThrow();

        return cartItemRepository.findByUserAndMenuItem(user, menuItem)
                .map(item -> {
                    item.setQuantity(item.getQuantity() + quantity);
                    return cartItemRepository.save(item);
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(user);
                    newItem.setMenuItem(menuItem);
                    newItem.setQuantity(quantity);
                    return cartItemRepository.save(newItem);
                });
    }

    @Transactional
    public void removeFromCart(User user, Long menuItemId) {
    	
            MenuItem menuItem = menuItemRepository.findById(menuItemId).orElseThrow();

            cartItemRepository.findByUserAndMenuItem(user, menuItem).ifPresent(cartItem -> {
                if (cartItem.getQuantity() > 1) {
                    cartItem.setQuantity(cartItem.getQuantity() - 1);
                    cartItemRepository.save(cartItem);
                } else {
                    cartItemRepository.delete(cartItem);
                }
            });

    }

    @Transactional
    public void removeAllFromCart(User user, Long menuItemId) {
        
        MenuItem menuItem = menuItemRepository.findById(menuItemId).orElseThrow();

        cartItemRepository.findByUserAndMenuItem(user, menuItem)
            .ifPresent(cartItemRepository::delete);
    }

    @Transactional
    public void clearCart(User user) {
        
        cartItemRepository.findByUser(user).forEach(cartItemRepository::delete);
    }

    public int getCartCount(User user) {
        
        return cartItemRepository.findByUser(user)
                .stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    public OrderSummaryCalculation getCartSummary(User user) {
        

        BigDecimal subtotal = cartItemRepository.findByUser(user)
                .stream()
                .map(item -> item.getMenuItem().getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Delegate calculation to the service
        return orderSummaryCalculationService.calculate(subtotal);
    }

}