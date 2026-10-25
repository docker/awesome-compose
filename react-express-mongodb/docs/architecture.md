# Three-Tier Todo Application Architecture

## 1. Project Overview

This project is an interactive Todo application built with React, Node.js, Express, and MongoDB. Docker Compose runs the frontend, backend, and database as separate services.

## 2. Architecture Diagram

```mermaid
flowchart TB
    U["User Browser"]
    FE["Presentation Tier<br/>React Frontend<br/>Host Port 3000"]
    BE["Application Tier<br/>Node.js + Express API<br/>Container Port 3000"]
    DB[("Data Tier<br/>MongoDB<br/>Container Port 27017")]
    VOL[("Named Volume<br/>mongo_data")]

    U -->|"HTTP: localhost:3000"| FE
    FE -->|"REST API requests"| BE
    BE -->|"MongoDB connection"| DB
    DB --- VOL

    subgraph DOCKER["Docker Compose Environment"]
        subgraph APPNET["react-express network"]
            FE
            BE
        end
        subgraph DBNET["express-mongo network"]
            BE
            DB
        end
        VOL
    end
