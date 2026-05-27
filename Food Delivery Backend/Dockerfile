# Use an official Maven image to build the app
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use a lightweight JRE image to run the app
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Expose the port (change if your app uses a different port)
EXPOSE 8080
# Use environment variable for port if provided by Render
ENV PORT=8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
