# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /workdir/server
COPY pom.xml /workdir/server/pom.xml
RUN mvn dependency:go-offline

COPY src /workdir/server/src

RUN mvn --batch-mode clean compile assembly:single

FROM build AS dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD ["java", "-jar", "target/app.jar" ]

FROM eclipse-temurin:17-jre-focal
ARG DEPENDENCY=/workdir/server/target
EXPOSE 8080
COPY --from=build ${DEPENDENCY}/app.jar /app.jar
CMD java -jar /app.jar
