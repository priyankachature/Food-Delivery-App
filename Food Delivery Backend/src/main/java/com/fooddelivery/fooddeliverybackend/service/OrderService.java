package com.fooddelivery.fooddeliverybackend.service;

import com.fooddelivery.fooddeliverybackend.dto.order.AddressResponse;
import com.fooddelivery.fooddeliverybackend.dto.order.CreateOrderRequest;
import com.fooddelivery.fooddeliverybackend.dto.order.OrderItemRequest;
import com.fooddelivery.fooddeliverybackend.dto.order.OrderItemResponse;
import com.fooddelivery.fooddeliverybackend.dto.order.OrderResponse;
import com.fooddelivery.fooddeliverybackend.dto.order.OrderSummaryCalculation;
import com.fooddelivery.fooddeliverybackend.entity.Address;
import com.fooddelivery.fooddeliverybackend.entity.CustomerOrder;
import com.fooddelivery.fooddeliverybackend.entity.MenuItem;
import com.fooddelivery.fooddeliverybackend.entity.OrderItem;
import com.fooddelivery.fooddeliverybackend.entity.OrderStatus;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.exception.BadRequestException;
import com.fooddelivery.fooddeliverybackend.exception.ResourceNotFoundException;
import com.fooddelivery.fooddeliverybackend.repository.AddressRepository;
import com.fooddelivery.fooddeliverybackend.repository.CustomerOrderRepository;
import com.fooddelivery.fooddeliverybackend.repository.MenuItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final MenuItemRepository menuItemRepository;
    private final AddressRepository addressRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final OrderSummaryCalculationService orderSummaryCalculationService;

    public OrderService(MenuItemRepository menuItemRepository,
                        AddressRepository addressRepository,
                        CustomerOrderRepository customerOrderRepository,
                        OrderSummaryCalculationService orderSummaryCalculationService) {
        this.menuItemRepository = menuItemRepository;
        this.addressRepository = addressRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.orderSummaryCalculationService = orderSummaryCalculationService;
    }

    @Transactional
    public OrderResponse createOrder(User user, CreateOrderRequest request) {
        Address address = addressRepository.findById(request.addressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        // Ownership check
        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Address does not belong to user");
        }

        CustomerOrder order = new CustomerOrder();
        order.setUser(user);
        order.setAddress(address);
        order.setStatus(OrderStatus.PAYMENT_PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.menuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemRequest.menuItemId()));
            if (!menuItem.isActive()) {
                throw new BadRequestException("Menu item is not active: " + menuItem.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setUnitPrice(menuItem.getPrice());
            order.addItem(orderItem);

            subtotal = subtotal.add(menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
        }

        // Centralized fee calculation
        OrderSummaryCalculation summary = orderSummaryCalculationService.calculate(subtotal);

        order.setSubtotalAmount(summary.getSubtotal());
        order.setDeliveryFee(summary.getDeliveryFee());
        order.setTaxes(summary.getTaxes());
        order.setPlatformFee(summary.getPlatformFee());
        order.setTotalAmount(summary.getTotal());

        CustomerOrder saved = customerOrderRepository.save(order);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(User user, Long orderId) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to user");
        }

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(User user) {
        return customerOrderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return customerOrderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        CustomerOrder order = customerOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(OrderStatus.valueOf(status));
        CustomerOrder updated = customerOrderRepository.save(order);
        return toResponse(updated);
    }


    private OrderResponse toResponse(CustomerOrder order) {
        return new OrderResponse(
                order.getId(),
                order.getSubtotalAmount(),
                order.getDeliveryFee(),
                order.getTaxes(),
                order.getPlatformFee(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                new AddressResponse(
                        order.getAddress().getId(),
                        order.getAddress().getFullName(),
                        order.getAddress().getMobile(),
                        order.getAddress().getAddress1(),
                        order.getAddress().getAddress2(),
                        order.getAddress().getCity(),
                        order.getAddress().getState(),
                        order.getAddress().getPin()
                ),
                order.getItems().stream()
                        .map(item -> new OrderItemResponse(
                                item.getMenuItem().getId(),
                                item.getMenuItem().getName(),
                                item.getQuantity(),
                                item.getUnitPrice()
                        ))
                        .toList()
        );
    }
}