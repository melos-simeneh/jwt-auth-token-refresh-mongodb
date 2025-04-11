# JWT Authentication API - Node.js & Express

This is a Node.js and Express application providing JWT authentication functionality. It supports user registration, login, token refreshing, and user management with secure JWT-based authentication.

This project also integrates Swagger UI for interactive API documentation and easy testing.

## Features

- **JWT Authentication**: Login, signup, refresh tokens, and secure access with JWT.

- **User Management**: View, update, and delete user profiles.

- **Token-based Session**: Access and refresh tokens for session management.

- **Swagger Documentation**: Interactive API docs to explore and test the API.

## API Endpoints

### Authentication Routes

#### 1. POST /api/auth/signup

Register a new user.

**Request Body**:

``` json
{
"username": "string",  // 3 to 30 characters, alphanumeric or underscores
"password": "string"   // 8 to 26 characters
}
```

**Responses**:

- **201 Created**: User successfully created.
- **400 Bad Request**: Validation error.
- **409 Conflict**: Username already exists.
- **422 Unprocessable Entity**: Validation error.

#### 2. POST /api/auth/login

Login an existing user.

**Request Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Responses**:

- **200 OK**: Successfully logged in with access and refresh tokens.

- **400 Bad Request**: Validation error.

- **401 Unauthorized**: Invalid credentials.

- **422 Unprocessable Entity**: Validation error.

### 3. POST /api/auth/refresh-token

Refresh the access token.

**Responses**:

- **200 OK**: Access token refreshed.
- **400 Bad Request**: Invalid refresh token.
- **401 Unauthorized**: Unauthorized request.
- **422 Unprocessable Entity**: Validation error.

### 4. POST /api/auth/refresh-token-with-body

Refresh the access token.

**Responses**:

- **200 OK**: Access token refreshed.
- **400 Bad Request**: Invalid refresh token.
- **401 Unauthorized**: Unauthorized request.
- **422 Unprocessable Entity**: Validation error.
- **500 server error**: Internal Server error.

#### 5. POST /api/auth/logout-with-body

Log out the user by invalidating the refresh token.

**Responses**:

- **200 OK**: User successfully logged out.
- **422 Unprocessable Entity**: Validation error.
- **500 server error**: Internal Server error.

#### 6. POST /api/auth/logout-with-body

Log out the user by invalidating the refresh token.

**Responses**:

- **200 OK**: User successfully logged out.
- **422 Unprocessable Entity**: Validation error.
- **500 server error**: Internal Server error.

### User Management Routes

#### 1. GET /api/users

Retrieve the currently authenticated user's details.

**Security**: Bearer Token required.

**Responses**:

- **200 OK**: User details retrieved successfully.

- **401 Unauthorized**: Invalid or missing token.

- **404 Not Found**: User not found.

### 2. PUT /api/users

Update the currently authenticated user's details.

**Security**: Bearer Token required.

**Request Body**:

```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

**Responses**:

- **200 OK**: User updated successfully.
- **400 Bad Request**: Invalid input.
- **401 Unauthorized**: Invalid or missing token.

- **404 Not Found**: User not found.

#### 3. DELETE /api/users

Delete the currently authenticated user's account.

**Security**: Bearer Token required.

**Responses**:

- **200 OK**: User deleted successfully.
- **401 Unauthorized**: Invalid or missing token.
- **404 Not Found**: User not found.

## Security

### JWT Authentication

**Bearer Token**: Access tokens are used for authenticating API requests.

**Refresh Token**: Used to obtain new access tokens without requiring re-authentication.

### Authentication Middleware

The `auth` middleware is used to secure routes by verifying the presence of a valid access token.

## Swagger API Documentation

Interactive API documentation is available using **Swagger UI**. It allows you to explore the available endpoints, see request/response details, and even test the API directly from the UI.

- **Swagger UI**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

Swagger is automatically set up using `swagger-jsdoc` and `swagger-ui-express`.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/melos-simeneh/jwt-auth-token-refresh-mongodb.git
cd jwt-auth-token-refresh-mongodb
```

### 2. Install dependencies

Run the following command to install required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a .env file in the root of the project and add the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_DB_URL=mongodb://localhost:27017/auth_db
SALT=10
ACCESS_TOKEN_SECRET=youraccesssecret
REFRESH_TOKEN_SECRET=yourrefreshsecret
```

### 4. Start the server

Run the following command to start the server:

```bash
npm start
```

The application will be available at [http://localhost:5000](http://localhost:5000).

### 5. Access Swagger UI

After starting the server, you can access the API documentation at  [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## Contact Information

API Support: [https://melos-simeneh.vercel.app](https://melos-simeneh.vercel.app)
Email: [melos.simeneh@gmail.com](melos.simeneh@gmail.com)
