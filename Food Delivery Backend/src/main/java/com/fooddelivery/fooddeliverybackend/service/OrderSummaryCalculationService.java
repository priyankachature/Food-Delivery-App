package com.fooddelivery.fooddeliverybackend.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.fooddelivery.fooddeliverybackend.dto.order.OrderSummaryCalculation;

@Service
public class OrderSummaryCalculationService {
	
	public OrderSummaryCalculation calculate(BigDecimal subtotal) {
        if (subtotal.compareTo(BigDecimal.ZERO) == 0) {
            return new OrderSummaryCalculation(BigDecimal.ZERO, BigDecimal.ZERO,
                                               BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        BigDecimal deliveryFee = subtotal.compareTo(BigDecimal.valueOf(500)) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(30);
        BigDecimal taxes = subtotal.multiply(BigDecimal.valueOf(0.05));
        BigDecimal platformFee = BigDecimal.valueOf(15);
        BigDecimal total = subtotal.add(deliveryFee).add(taxes).add(platformFee);

        return new OrderSummaryCalculation(subtotal, deliveryFee, taxes, platformFee, total);
    }


}
