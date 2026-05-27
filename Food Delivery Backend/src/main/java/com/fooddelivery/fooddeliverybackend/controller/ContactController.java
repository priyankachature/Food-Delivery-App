package com.fooddelivery.fooddeliverybackend.controller;

import com.fooddelivery.fooddeliverybackend.dto.common.MessageResponse;
import com.fooddelivery.fooddeliverybackend.dto.contact.ContactRequest;
import com.fooddelivery.fooddeliverybackend.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public MessageResponse submit(@Valid @RequestBody ContactRequest request) {
        contactService.save(request);
        return new MessageResponse("Thanks! We received your message.");
    }
}
