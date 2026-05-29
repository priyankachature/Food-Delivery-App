package com.fooddelivery.fooddeliverybackend.config;

import com.fooddelivery.fooddeliverybackend.entity.MenuItem;
import com.fooddelivery.fooddeliverybackend.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class MenuDataSeeder {

    // @Bean
    CommandLineRunner seedMenuItems(MenuItemRepository menuItemRepository) {
        return args -> {
            if (menuItemRepository.count() > 0) {
                return;
            }

            List<MenuSeed> seeds = List.of(
                    new MenuSeed(1L, "Greek Salad", "Salad", 12, "Crisp cucumbers, tomatoes, kalamata olives, and feta tossed in lemon-oregano vinaigrette."),
                    new MenuSeed(2L, "Caesar Salad", "Salad", 11, "Romaine hearts with creamy Caesar dressing, shaved parmesan, and crunchy garlic croutons."),
                    new MenuSeed(3L, "Quinoa Tabbouleh", "Salad", 10, "Protein-rich quinoa with parsley, mint, tomatoes, and zesty lemon-olive oil."),
                    new MenuSeed(4L, "Watermelon Feta Salad", "Salad", 9, "Juicy watermelon cubes, briny feta, fresh mint, and a drizzle of balsamic glaze."),
                    new MenuSeed(5L, "Veg Spring Roll", "Rolls", 8, "Crispy rolls stuffed with julienned veggies and served with a sweet-chili dip."),
                    new MenuSeed(6L, "Paneer Kathi Roll", "Rolls", 9, "Spiced paneer tikka wrapped in a flaky paratha with onions and mint chutney."),
                    new MenuSeed(7L, "Chicken Shawarma Roll", "Rolls", 10, "Marinated chicken, garlic toum, pickles, and lettuce rolled in warm pita."),
                    new MenuSeed(8L, "Avocado Sushi Roll", "Rolls", 11, "Creamy avocado with seasoned rice and nori, finished with toasted sesame."),
                    new MenuSeed(9L, "Chocolate Mousse", "Dessert", 7, "Silky dark chocolate mousse with a cloud of whipped cream."),
                    new MenuSeed(10L, "Mango Cheesecake", "Dessert", 8, "Baked cheesecake crowned with luscious Alphonso mango puree."),
                    new MenuSeed(11L, "Gulab Jamun", "Dessert", 6, "Soft milk-solid dumplings soaked in warm cardamom-rose syrup."),
                    new MenuSeed(12L, "Tiramisu Cup", "Dessert", 9, "Espresso-soaked ladyfingers layered with airy mascarpone and cocoa."),
                    new MenuSeed(13L, "Grilled Veggie Sandwich", "Sandwich", 10, "Charred peppers, zucchini, and mozzarella on toasted sourdough with pesto."),
                    new MenuSeed(14L, "Chicken Club Sandwich", "Sandwich", 12, "Stacked chicken, bacon, cheddar, tomato, and lettuce with herbed mayo."),
                    new MenuSeed(15L, "Paneer Tikka Sandwich", "Sandwich", 11, "Smoky paneer tikka with onions and mint-coriander chutney in a press-grilled bread."),
                    new MenuSeed(16L, "Egg Mayo Sandwich", "Sandwich", 9, "Classic creamy egg mayo with chives and pepper on soft white bread."),
                    new MenuSeed(17L, "Red Velvet Cake Slice", "Cake", 9, "Moist crimson cake with tangy cream cheese frosting."),
                    new MenuSeed(18L, "Black Forest Cake", "Cake", 10, "Chocolate sponge layered with cherries, whipped cream, and chocolate shavings."),
                    new MenuSeed(19L, "Blueberry Cheesecake Slice", "Cake", 8, "Velvety cheesecake on a buttery crust topped with blueberry compote."),
                    new MenuSeed(20L, "Carrot Walnut Cake", "Cake", 9, "Spiced carrot sponge studded with walnuts and finished with cream cheese icing."),
                    new MenuSeed(21L, "Dal Tadka with Jeera Rice", "Pure Veg", 12, "Yellow lentils tempered with ghee, cumin, and garlic served alongside cumin rice."),
                    new MenuSeed(22L, "Veg Thali Mini", "Pure Veg", 13, "A compact platter of two sabzis, dal, roti, rice, salad, and pickle—100% vegetarian."),
                    new MenuSeed(23L, "Aloo Paratha with Curd", "Pure Veg", 10, "Stuffed whole-wheat parathas with spiced potatoes served with fresh curd."),
                    new MenuSeed(24L, "Chole Bhature", "Pure Veg", 12, "Punjabi-style spiced chickpeas paired with fluffy fried bhature."),
                    new MenuSeed(25L, "Penne Arrabbiata", "Pasta", 11, "Al dente penne tossed in a fiery garlic-chili tomato sauce."),
                    new MenuSeed(26L, "Spaghetti Aglio e Olio", "Pasta", 10, "Garlic-infused olive oil, chili flakes, and parsley over spaghetti with a lemon lift."),
                    new MenuSeed(27L, "Fettuccine Alfredo", "Pasta", 12, "Rich parmesan cream sauce coating ribbons of fettuccine."),
                    new MenuSeed(28L, "Pesto Basil Pasta", "Pasta", 11, "Fragrant basil pesto, pine nuts, and parmesan with a hint of lemon zest."),
                    new MenuSeed(29L, "Veg Hakka Noodles", "Noodles", 10, "Wok-tossed noodles with crunchy veggies and a light soy-garlic kick."),
                    new MenuSeed(30L, "Chicken Chow Mein", "Noodles", 11, "Stir-fried noodles with chicken, cabbage, and scallions in savory sauce."),
                    new MenuSeed(31L, "Pad Thai Tofu", "Noodles", 12, "Tamarind-kissed rice noodles with tofu, sprouts, peanuts, and lime."),
                    new MenuSeed(32L, "Singapore Noodles", "Noodles", 10, "Curried rice vermicelli tossed with vegetables and aromatics.")
            );

            for (MenuSeed seed : seeds) {
                MenuItem menuItem = new MenuItem();
                menuItem.setId(seed.id());
                menuItem.setName(seed.name());
                menuItem.setCategory(seed.category());
                menuItem.setPrice(BigDecimal.valueOf(seed.price()));
                menuItem.setDescription(seed.description());
                menuItem.setImageUrl("/images/food_" + seed.id() + ".png");
                menuItem.setActive(true);
                menuItemRepository.save(menuItem);
            }
        };
    }

    private record MenuSeed(Long id, String name, String category, int price, String description) {
    }
}
