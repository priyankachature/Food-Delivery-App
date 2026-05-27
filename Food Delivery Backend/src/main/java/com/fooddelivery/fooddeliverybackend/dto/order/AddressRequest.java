package com.fooddelivery.fooddeliverybackend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Pattern(regexp = "\\d{10}") String mobile,
        @NotBlank @Size(max = 200) String address1,
        @Size(max = 200) String address2,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Size(max = 100) String state,
        @NotBlank @Pattern(regexp = "\\d{6}") String pin
) {
}
