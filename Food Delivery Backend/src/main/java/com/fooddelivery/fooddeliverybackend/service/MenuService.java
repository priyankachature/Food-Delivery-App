package com.fooddelivery.fooddeliverybackend.service;

import com.fooddelivery.fooddeliverybackend.dto.menu.MenuItemResponse;
import com.fooddelivery.fooddeliverybackend.entity.MenuItem;
import com.fooddelivery.fooddeliverybackend.entity.ContactMessage;
import com.fooddelivery.fooddeliverybackend.exception.ResourceNotFoundException;
import com.fooddelivery.fooddeliverybackend.repository.ContactMessageRepository;
import com.fooddelivery.fooddeliverybackend.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final ContactMessageRepository contactMessageRepository;

    // 🔥 FIXED: Added ContactMessageRepository parameter to the constructor for Dependency Injection
    public MenuService(MenuItemRepository menuItemRepository, ContactMessageRepository contactMessageRepository) {
        this.menuItemRepository = menuItemRepository;
        this.contactMessageRepository = contactMessageRepository; // 🔥 FIXED: Mapped the reference correctly
    }

    public List<MenuItemResponse> getMenu() {
        return menuItemRepository.findAll()
                .stream()
                .filter(MenuItem::isActive)
                .map(this::toResponse)
                .toList();
    }

    public MenuItemResponse getMenuItem(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        return toResponse(item);
    }

    private MenuItemResponse toResponse(MenuItem item) {
        return new MenuItemResponse(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getPrice(),
                item.getDescription(),
                item.getImageUrl(),
                item.isActive() 
        );
    }

    public List<Map<String, String>> getAllCategories() {
        return getMenu().stream()
            .collect(Collectors.groupingBy(MenuItemResponse::category))
            .entrySet().stream()
            .map(entry -> {
                String category = entry.getKey();
                String imageUrl = entry.getValue().get(0).imageUrl(); // pick first item’s image
                return Map.of("menu_name", category, "menu_img", imageUrl);
            })
            .toList();
    }
    
    // 🔹 Admin-facing methods
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem updateMenuItem(Long id, Map<String, Object> payload) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        if (payload.containsKey("name")) item.setName((String) payload.get("name"));
        if (payload.containsKey("category")) item.setCategory((String) payload.get("category"));
        if (payload.containsKey("price")) item.setPrice(new BigDecimal(payload.get("price").toString()));
        if (payload.containsKey("description")) item.setDescription((String) payload.get("description"));
        if (payload.containsKey("imageUrl")) item.setImageUrl((String) payload.get("imageUrl"));
        if (payload.containsKey("active")) item.setActive((Boolean) payload.get("active"));

        return menuItemRepository.save(item);
    }

    public MenuItem addMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }

    public List<ContactMessage> getAllContactMessages() {
        return contactMessageRepository.findAll(); // This works perfectly now using the injected instance bean variable!
    }
}