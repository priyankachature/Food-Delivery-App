package com.fooddelivery.fooddeliverybackend.service;

import com.fooddelivery.fooddeliverybackend.dto.order.AddressRequest;
import com.fooddelivery.fooddeliverybackend.dto.order.AddressResponse;
import com.fooddelivery.fooddeliverybackend.entity.Address;
import com.fooddelivery.fooddeliverybackend.entity.User;
import com.fooddelivery.fooddeliverybackend.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepo;

    public AddressService(AddressRepository addressRepo) {
        this.addressRepo = addressRepo;
    }

    public List<AddressResponse> getAddresses(User user) {
        return addressRepo.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AddressResponse addAddress(User user, AddressRequest request) {
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.fullName());
        address.setMobile(request.mobile());
        address.setAddress1(request.address1());
        address.setAddress2(request.address2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPin(request.pin());

        Address saved = addressRepo.save(address);
        return toResponse(saved);
    }

    public AddressResponse updateAddress(User user, Long addressId, AddressRequest request) {
        Address existing = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        existing.setFullName(request.fullName());
        existing.setMobile(request.mobile());
        existing.setAddress1(request.address1());
        existing.setAddress2(request.address2());
        existing.setCity(request.city());
        existing.setState(request.state());
        existing.setPin(request.pin());

        Address updated = addressRepo.save(existing);
        return toResponse(updated);
    }

    public void deleteAddress(User user, Long addressId) {
        Address existing = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        addressRepo.delete(existing);
    }

    private AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getMobile(),
                address.getAddress1(),
                address.getAddress2(),
                address.getCity(),
                address.getState(),
                address.getPin()
        );
    }
}