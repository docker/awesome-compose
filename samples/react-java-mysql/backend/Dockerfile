FROM maven:3.5-jdk-9 AS build
COPY pom.xml .
RUN mvn --batch-mode dependency:resolve
COPY . .
RUN mvn --batch-mode package
RUN cp target/*jar target/app.jar

FROM openjdk:9-jre
VOLUME /tmp
COPY --from=build target/app.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
