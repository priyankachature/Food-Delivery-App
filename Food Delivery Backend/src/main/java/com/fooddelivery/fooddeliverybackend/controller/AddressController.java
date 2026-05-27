package com.fooddelivery.fooddeliverybackend.controller;

import com.fooddelivery.fooddeliverybackend.dto.order.AddressRequest;
import com.fooddelivery.fooddeliverybackend.dto.order.AddressResponse;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.security.CustomUserDetails;
import com.fooddelivery.fooddeliverybackend.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {

    private final AddressService service;

    public AddressController(AddressService service) {
        this.service = service;
    }

    @GetMapping
    public List<AddressResponse> getAddresses(Authentication authentication) {
    	User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return service.getAddresses(user);
    }

    @PostMapping
    public AddressResponse addAddress(@Valid @RequestBody AddressRequest request,
                                      Authentication authentication) {
    	User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return service.addAddress(user, request);
    }

    @PutMapping("/{addressId}")
    public AddressResponse updateAddress(@PathVariable Long addressId,
                                         @Valid @RequestBody AddressRequest request,
                                         Authentication authentication) {
    	User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return service.updateAddress(user, addressId, request);
    }

    @DeleteMapping("/{addressId}")
    public void deleteAddress(@PathVariable Long addressId,
                              Authentication authentication) {
    	User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        service.deleteAddress(user, addressId);
    }
}