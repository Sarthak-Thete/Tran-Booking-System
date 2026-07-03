# RailBook — Full Stack Train Booking App

## Project Structure

```
TrainBookingApp.jsx          ← Beautiful React frontend (Bootstrap 5)

railbook/                    ← Spring Boot backend
├── pom.xml
└── src/main/
    ├── java/com/railbook/
    │   ├── RailBookApplication.java     ← Entry point
    │   ├── CorsConfig.java              ← Allow React to call the API
    │   ├── model/
    │   │   ├── User.java
    │   │   ├── Train.java
    │   │   └── Booking.java
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   ├── TrainRepository.java
    │   │   └── BookingRepository.java
    │   ├── service/
    │   │   ├── AuthService.java
    │   │   ├── TrainService.java
    │   │   ├── BookingService.java
    │   │   └── DataSeeder.java          ← Auto-seeds DB on first run
    │   ├── controller/
    │   │   ├── AuthController.java
    │   │   ├── TrainController.java
    │   │   └── BookingController.java
    │   └── dto/
    │       └── Dto.java                 ← All request/response objects
    └── resources/
        └── application.properties       ← DB config here
```

---

## Step 1 — Set up MySQL

```sql
-- Run in MySQL Workbench or terminal
CREATE DATABASE railbook_db;
```

---

## Step 2 — Configure the database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/railbook_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD   ← change this
```

---

## Step 3 — Run the Spring Boot backend

```bash
cd railbook
mvn spring-boot:run
```

The server starts at **http://localhost:8080**

On first run, `DataSeeder` auto-creates all tables and inserts sample trains + users.

---

## Step 4 — Run the React frontend

Copy `TrainBookingApp.jsx` into your React project, then:

```bash
npm install
npm start
```

The frontend auto-detects if the API is reachable.
If it isn't, it runs in **demo mode** with local data.

---

## API Reference

### Auth
| Method | URL | Body | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/login` | `{username, password}` | Login |
| POST | `/api/auth/register` | `{name, username, email, password}` | Register |

### Trains
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/trains` | All trains |
| GET | `/api/trains/search?from=Mumbai&to=Delhi` | Search trains |
| POST | `/api/trains` | Add train (admin) |
| DELETE | `/api/trains/{id}` | Remove train (admin) |

### Bookings
| Method | URL | Body | Description |
|--------|-----|------|-------------|
| POST | `/api/bookings` | `{userId, trainId, travelDate, passengers}` | Book ticket |
| GET | `/api/bookings/pnr/{pnr}` | — | PNR status |
| GET | `/api/bookings/user/{userId}` | — | User's bookings |
| GET | `/api/bookings` | — | All bookings (admin) |

---

## Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| rahul | pass123 | User |
| priya | pass123 | User |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Bootstrap 5 + Bootstrap Icons |
| Backend | Java 17 + Spring Boot 3 |
| Database | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |
| Build | Maven |
