# # Use an official OpenJDK runtime as a parent image
# FROM openjdk:17-jdk-alpine

# # Set the working directory in the container
# WORKDIR /app

# # Copy the jar file from the target directory (Maven) or build/libs (Gradle)
# ARG JAR_FILE=target/*.jar

# COPY ${JAR_FILE} app.jar

# # Expose the port on which the Spring Boot application will run
# EXPOSE 8080

# # Command to run the jar file
# ENTRYPOINT ["java", "-jar", "app.jar"]


# Use an official Maven image from Docker Hub as the build environment
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and project files to the container
COPY pom.xml .
COPY src ./src

# Build the project and package it as a JAR file
RUN mvn clean install

# Use an OpenJDK runtime image for running the application
FROM openjdk:17-jdk-slim

# Set environment variable for the port
ENV SERVER_PORT=8080

# Copy the built JAR file from the build image
COPY --from=build /app/target/*.jar app.jar

# Expose the port defined in the environment variable
EXPOSE ${SERVER_PORT}

# Run the Spring Boot application using java -jar and the environment variable for the port
ENTRYPOINT ["sh", "-c", "java -jar app.jar"]
