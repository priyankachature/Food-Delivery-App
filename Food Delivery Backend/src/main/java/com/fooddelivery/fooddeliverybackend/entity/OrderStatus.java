package com.fooddelivery.fooddeliverybackend.entity;

public enum OrderStatus {
	PAYMENT_PENDING,
    PAYMENT_SUCCESS,
    PAYMENT_FAILED,
    PLACED,
    PREPARING,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED

}
