package com.fooddelivery.fooddeliverybackend.service;

import com.fooddelivery.fooddeliverybackend.dto.contact.ContactRequest;
import com.fooddelivery.fooddeliverybackend.entity.ContactMessage;
import com.fooddelivery.fooddeliverybackend.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public void save(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name().trim());
        message.setEmail(request.email().trim().toLowerCase());
        message.setPhone(request.phone() == null ? "" : request.phone().trim());
        message.setSubject(request.subject().trim());
        message.setMessage(request.message().trim());
        contactMessageRepository.save(message);
    }
}
