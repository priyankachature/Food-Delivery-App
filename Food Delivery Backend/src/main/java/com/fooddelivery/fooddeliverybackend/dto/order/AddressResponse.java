package com.fooddelivery.fooddeliverybackend.dto.order;

public record AddressResponse(
        Long id,
        String fullName,
        String mobile,
        String address1,
        String address2,
        String city,
        String state,
        String pin
) {
}
