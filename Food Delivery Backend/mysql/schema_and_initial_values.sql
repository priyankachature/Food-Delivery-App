CREATE DATABASE IF NOT EXISTS food_delivery;
USE food_delivery;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'ROLE_USER',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id BIGINT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description VARCHAR(600) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS addresses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  address1 VARCHAR(200) NOT NULL,
  address2 VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pin VARCHAR(10) NOT NULL,
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  address_id BIGINT NOT NULL,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'PAYMENT_PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  menu_item_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  menu_item_id BIGINT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_cart_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  UNIQUE KEY unique_user_item (user_id, menu_item_id)
);

INSERT INTO menu_items (id, name, category, price, description, image_url, active) VALUES
  (1, 'Greek Salad', 'Salad', 12.00, 'Crisp cucumbers, tomatoes, kalamata olives, and feta tossed in lemon-oregano vinaigrette.', '/images/food_1.png', TRUE),
  (2, 'Caesar Salad', 'Salad', 11.00, 'Romaine hearts with creamy Caesar dressing, shaved parmesan, and crunchy garlic croutons.', '/images/food_2.png', TRUE),
  (3, 'Quinoa Tabbouleh', 'Salad', 10.00, 'Protein-rich quinoa with parsley, mint, tomatoes, and zesty lemon-olive oil.', '/images/food_3.png', TRUE),
  (4, 'Watermelon Feta Salad', 'Salad', 9.00, 'Juicy watermelon cubes, briny feta, fresh mint, and a drizzle of balsamic glaze.', '/images/food_4.png', TRUE),
  (5, 'Veg Spring Roll', 'Rolls', 8.00, 'Crispy rolls stuffed with julienned veggies and served with a sweet-chili dip.', '/images/food_5.png', TRUE),
  (6, 'Paneer Kathi Roll', 'Rolls', 9.00, 'Spiced paneer tikka wrapped in a flaky paratha with onions and mint chutney.', '/images/food_6.png', TRUE),
  (7, 'Chicken Shawarma Roll', 'Rolls', 10.00, 'Marinated chicken, garlic toum, pickles, and lettuce rolled in warm pita.', '/images/food_7.png', TRUE),
  (8, 'Avocado Sushi Roll', 'Rolls', 11.00, 'Creamy avocado with seasoned rice and nori, finished with toasted sesame.', '/images/food_8.png', TRUE),
  (9, 'Chocolate Mousse', 'Dessert', 7.00, 'Silky dark chocolate mousse with a cloud of whipped cream.', '/images/food_9.png', TRUE),
  (10, 'Mango Cheesecake', 'Dessert', 8.00, 'Baked cheesecake crowned with luscious Alphonso mango puree.', '/images/food_10.png', TRUE),
  (11, 'Gulab Jamun', 'Dessert', 6.00, 'Soft milk-solid dumplings soaked in warm cardamom-rose syrup.', '/images/food_11.png', TRUE),
  (12, 'Tiramisu Cup', 'Dessert', 9.00, 'Espresso-soaked ladyfingers layered with airy mascarpone and cocoa.', '/images/food_12.png', TRUE),
  (13, 'Grilled Veggie Sandwich', 'Sandwich', 10.00, 'Charred peppers, zucchini, and mozzarella on toasted sourdough with pesto.', '/images/food_13.png', TRUE),
  (14, 'Chicken Club Sandwich', 'Sandwich', 12.00, 'Stacked chicken, bacon, cheddar, tomato, and lettuce with herbed mayo.', '/images/food_14.png', TRUE),
  (15, 'Paneer Tikka Sandwich', 'Sandwich', 11.00, 'Smoky paneer tikka with onions and mint-coriander chutney in a press-grilled bread.', '/images/food_15.png', TRUE),
  (16, 'Egg Mayo Sandwich', 'Sandwich', 9.00, 'Classic creamy egg mayo with chives and pepper on soft white bread.', '/images/food_16.png', TRUE),
  (17, 'Red Velvet Cake Slice', 'Cake', 9.00, 'Moist crimson cake with tangy cream cheese frosting.', '/images/food_17.png', TRUE),
  (18, 'Black Forest Cake', 'Cake', 10.00, 'Chocolate sponge layered with cherries, whipped cream, and chocolate shavings.', '/images/food_18.png', TRUE),
  (19, 'Blueberry Cheesecake Slice', 'Cake', 8.00, 'Velvety cheesecake on a buttery crust topped with blueberry compote.', '/images/food_19.png', TRUE),
  (20, 'Carrot Walnut Cake', 'Cake', 9.00, 'Spiced carrot sponge studded with walnuts and finished with cream cheese icing.', '/images/food_20.png', TRUE),
  (21, 'Dal Tadka with Jeera Rice', 'Pure Veg', 12.00, 'Yellow lentils tempered with ghee, cumin, and garlic served alongside cumin rice.', '/images/food_21.png', TRUE),
  (22, 'Veg Thali Mini', 'Pure Veg', 13.00, 'A compact platter of two sabzis, dal, roti, rice, salad, and pickle.', '/images/food_22.png', TRUE),
  (23, 'Aloo Paratha with Curd', 'Pure Veg', 10.00, 'Stuffed whole-wheat parathas with spiced potatoes served with fresh curd.', '/images/food_23.png', TRUE),
  (24, 'Chole Bhature', 'Pure Veg', 12.00, 'Punjabi-style spiced chickpeas paired with fluffy fried bhature.', '/images/food_24.png', TRUE),
  (25, 'Penne Arrabbiata', 'Pasta', 11.00, 'Al dente penne tossed in a fiery garlic-chili tomato sauce.', '/images/food_25.png', TRUE),
  (26, 'Spaghetti Aglio e Olio', 'Pasta', 10.00, 'Garlic-infused olive oil, chili flakes, and parsley over spaghetti with a lemon lift.', '/images/food_26.png', TRUE),
  (27, 'Fettuccine Alfredo', 'Pasta', 12.00, 'Rich parmesan cream sauce coating ribbons of fettuccine.', '/images/food_27.png', TRUE),
  (28, 'Pesto Basil Pasta', 'Pasta', 11.00, 'Fragrant basil pesto, pine nuts, and parmesan with a hint of lemon zest.', '/images/food_28.png', TRUE),
  (29, 'Veg Hakka Noodles', 'Noodles', 10.00, 'Wok-tossed noodles with crunchy veggies and a light soy-garlic kick.', '/images/food_29.png', TRUE),
  (30, 'Chicken Chow Mein', 'Noodles', 11.00, 'Stir-fried noodles with chicken, cabbage, and scallions in savory sauce.', '/images/food_30.png', TRUE),
  (31, 'Pad Thai Tofu', 'Noodles', 12.00, 'Tamarind-kissed rice noodles with tofu, sprouts, peanuts, and lime.', '/images/food_31.png', TRUE),
  (32, 'Singapore Noodles', 'Noodles', 10.00, 'Curried rice vermicelli tossed with vegetables and aromatics.', '/images/food_32.png', TRUE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  price = VALUES(price),
  description = VALUES(description),
  image_url = VALUES(image_url),
  active = VALUES(active);
