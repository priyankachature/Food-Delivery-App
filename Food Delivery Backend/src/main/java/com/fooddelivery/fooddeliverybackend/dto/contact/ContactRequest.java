package com.fooddelivery.fooddeliverybackend.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 160) String email,
        @Pattern(regexp = "^$|\\d{10}", message = "Phone must be empty or 10 digits")
        String phone,
        @NotBlank @Size(max = 200) String subject,
        @NotBlank @Size(min = 10, max = 1000) String message
) {
}
