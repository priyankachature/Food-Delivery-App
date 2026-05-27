package com.fooddelivery.fooddeliverybackend.controller;

import com.fooddelivery.fooddeliverybackend.dto.menu.MenuItemResponse;
import com.fooddelivery.fooddeliverybackend.service.MenuService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public List<MenuItemResponse> getMenu() {
        return menuService.getMenu();
    }
    
    @GetMapping("/categories")
    public List<Map<String, String>> getCategories() {
        return menuService.getAllCategories();
    }


    @GetMapping("/{id}")
    public MenuItemResponse getById(@PathVariable Long id) {
        return menuService.getMenuItem(id);
    }
}
