# Customer Service API Documentation

## Overview

The Customer Service is a microservice responsible for managing customer-related operations in the application. It provides APIs to retrieve and save customer information.

## API Endpoints

### Signup

- **Endpoint:** `/api/auth/signup`
- **Method:** `POST`
- **Description:** Registers a new user in the system.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
  ```
- **Response:**
  - **201 Created:** User successfully registered.
  - **400 Bad Request:** Validation errors.

### Login

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **200 OK:** Returns JWT token.
  - **401 Unauthorized:** Invalid credentials.

### Get Customer

- **Endpoint:** `/api/customers/:id`
- **Method:** `GET`
- **Description:** Retrieves customer information by ID.
- **Response:**
  - **200 OK:** Returns customer data.
  - **404 Not Found:** Customer not found.

### Save Customer

- **Endpoint:** `/api/customers`
- **Method:** `POST`
- **Description:** Saves a new customer to the database.
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
  ```
- **Response:**
  - **201 Created:** Customer successfully saved.
  - **400 Bad Request:** Validation errors.

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd microservices-backend-app/customer-service
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `customer-service` directory and add the necessary environment variables.

4. **Run the service:**
   ```bash
   npm start
   ```

## Dependencies

- Express.js
- Mongoose
- JSON Web Token (JWT)

## Notes

Ensure that the authentication service is running, as this service depends on it for user authentication.
