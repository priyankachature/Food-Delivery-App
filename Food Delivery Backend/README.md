# Food Delivery Backend (Spring Boot + MySQL)

## STS Import

1. Open Spring Tool Suite.
2. `File` -> `Import` -> `Maven` -> `Existing Maven Projects`.
3. Select the `food-delivery-backend` directory and finish import.

## Run Locally

1. Ensure MySQL is running.
2. Create/update credentials as env vars if needed:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET` (minimum 32 chars)
3. Start app:
   - STS: Run `FoodDeliveryApplication`
   - CLI: `mvn spring-boot:run`

Default API base: `http://localhost:8080/api`
