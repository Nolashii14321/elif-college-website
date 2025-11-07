# Elif College API Documentation

## Overview
The Elif College API provides endpoints for managing students, teachers, parents, admissions, and other school-related operations.

## Base URL
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting
- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Upload endpoints: 10 requests per minute

## Error Responses
All error responses follow this format:
```json
{
    "error": "Error message",
    "details": "Additional details (development only)"
}
```

## Endpoints

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "Login successful",
    "token": "jwt-token-here",
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "Admin"
    }
}
```

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Student"
}
```

### Students

#### GET /api/students
Get all students (Admin/Teacher only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "class": "Grade 10",
        "roll_number": "ST001"
    }
]
```

#### POST /api/students
Create a new student (Admin only).

**Request Body:**
```json
{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "class": "Grade 9",
    "roll_number": "ST002",
    "parent_id": 1
}
```

### Teachers

#### GET /api/teachers
Get all teachers.

**Response:**
```json
[
    {
        "id": 1,
        "name": "Dr. Smith",
        "email": "smith@example.com",
        "subject": "Mathematics",
        "qualification": "PhD"
    }
]
```

### Admissions

#### POST /api/admissions
Submit admission application.

**Request Body:**
```json
{
    "student_name": "John Doe",
    "parent_name": "Jane Doe",
    "email": "parent@example.com",
    "phone": "+1234567890",
    "class_applying": "Grade 10",
    "previous_school": "ABC School"
}
```

### Library

#### GET /api/books
Get all books.

**Response:**
```json
[
    {
        "id": 1,
        "title": "Mathematics Textbook",
        "author": "Dr. Johnson",
        "isbn": "1234567890",
        "available": true
    }
]
```

### Events

#### GET /api/events
Get all events.

**Response:**
```json
[
    {
        "id": 1,
        "title": "Annual Sports Day",
        "date": "2024-03-15",
        "description": "School sports competition",
        "location": "School Ground"
    }
]
```

### Contact

#### POST /api/contact
Send contact message.

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Admission Inquiry",
    "message": "I would like to know about admission process"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Security Features

- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection protection
- XSS protection
- CSRF protection
- Security headers
- JWT token authentication
- Role-based access control

## File Uploads

File uploads are handled with the following limits:
- Maximum file size: 10MB
- Allowed file types: Images, PDFs, Documents
- Files are stored in the `/uploads` directory

## Database Schema

The API uses MySQL with the following main tables:
- `users` - User accounts
- `students` - Student information
- `teachers` - Teacher information
- `parents` - Parent information
- `admissions` - Admission applications
- `books` - Library books
- `events` - School events
- `messages` - Communication messages


