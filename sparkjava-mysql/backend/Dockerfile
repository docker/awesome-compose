FROM maven:3.5-jdk-8-alpine AS build
COPY pom.xml .
RUN mvn --batch-mode dependency:resolve
COPY src/ src
RUN mvn --batch-mode clean compile assembly:single

FROM openjdk:8-jre-alpine3.7
EXPOSE 8080
COPY --from=build target/app.jar /app.jar
CMD java -jar /app.jar
