# API Reference

This document provides a comprehensive reference for all endpoints in the Portfolio API.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Auth Endpoints

#### Register Admin

```
POST /auth/register
```

Request body:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Admin User",
    "email": "admin@example.com",
    "isAdmin": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Admin User",
    "email": "admin@example.com",
    "isAdmin": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile

```
GET /auth/profile
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Admin User",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

## Projects

### Project Endpoints

#### Get All Projects

```
GET /projects
```

Query parameters:
- `featured` (boolean): Filter by featured projects
- `limit` (number): Number of results per page (default: 10)
- `page` (number): Page number (default: 1)
- `sortBy` (string): Field to sort by (default: 'createdAt')
- `sortOrder` (string): Sort order ('asc' or 'desc', default: 'desc')

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Portfolio Website",
      "description": "My personal portfolio website built with React and Node.js",
      "technologies": ["React", "Node.js", "Express", "MongoDB"],
      "imageUrl": "https://example.com/portfolio.jpg",
      "liveUrl": "https://myportfolio.com",
      "githubUrl": "https://github.com/username/portfolio",
      "featured": true,
      "order": 0,
      "createdAt": "2023-07-15T12:00:00.000Z",
      "updatedAt": "2023-07-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Project by ID

```
GET /projects/:projectId
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Portfolio Website",
    "description": "My personal portfolio website built with React and Node.js",
    "technologies": ["React", "Node.js", "Express", "MongoDB"],
    "imageUrl": "https://example.com/portfolio.jpg",
    "liveUrl": "https://myportfolio.com",
    "githubUrl": "https://github.com/username/portfolio",
    "featured": true,
    "order": 0,
    "createdAt": "2023-07-15T12:00:00.000Z",
    "updatedAt": "2023-07-15T12:00:00.000Z",
    "averageRating": "4.5",
    "reviewsCount": 2
  }
}
```

#### Create Project (Admin only)

```
POST /projects
```

Request body:
```json
{
  "title": "Portfolio Website",
  "description": "My personal portfolio website built with React and Node.js",
  "technologies": ["React", "Node.js", "Express", "MongoDB"],
  "imageUrl": "https://example.com/portfolio.jpg",
  "liveUrl": "https://myportfolio.com",
  "githubUrl": "https://github.com/username/portfolio",
  "featured": true
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Portfolio Website",
    "description": "My personal portfolio website built with React and Node.js",
    "technologies": ["React", "Node.js", "Express", "MongoDB"],
    "imageUrl": "https://example.com/portfolio.jpg",
    "liveUrl": "https://myportfolio.com",
    "githubUrl": "https://github.com/username/portfolio",
    "featured": true,
    "order": 0,
    "createdAt": "2023-07-15T12:00:00.000Z",
    "updatedAt": "2023-07-15T12:00:00.000Z"
  }
}
```

#### Update Project (Admin only)

```
PUT /projects/:projectId
```

Request body:
```json
{
  "title": "Updated Portfolio Website",
  "featured": false
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Updated Portfolio Website",
    "description": "My personal portfolio website built with React and Node.js",
    "technologies": ["React", "Node.js", "Express", "MongoDB"],
    "imageUrl": "https://example.com/portfolio.jpg",
    "liveUrl": "https://myportfolio.com",
    "githubUrl": "https://github.com/username/portfolio",
    "featured": false,
    "order": 0,
    "createdAt": "2023-07-15T12:00:00.000Z",
    "updatedAt": "2023-07-15T12:00:00.000Z"
  }
}
```

#### Delete Project (Admin only)

```
DELETE /projects/:projectId
```

Response:
```json
{
  "success": true,
  "message": "Project removed"
}
```

## Reviews

### Review Endpoints

#### Get Reviews by Project

```
GET /reviews?projectId=:projectId
```

Query parameters:
- `projectId` (string, required): ID of the project to get reviews for
- `limit` (number): Number of results per page (default: 10)
- `page` (number): Page number (default: 1)
- `sortBy` (string): Field to sort by (default: 'createdAt')
- `sortOrder` (string): Sort order ('asc' or 'desc', default: 'desc')

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "project": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "rating": 5,
      "comment": "Amazing project! I love the design and functionality.",
      "createdAt": "2023-07-15T12:00:00.000Z",
      "updatedAt": "2023-07-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Create Review (Rate limited)

```
POST /reviews
```

Request body:
```json
{
  "project": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "rating": 5,
  "comment": "Amazing project! I love the design and functionality."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "project": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "rating": 5,
    "comment": "Amazing project! I love the design and functionality.",
    "createdAt": "2023-07-15T12:00:00.000Z",
    "updatedAt": "2023-07-15T12:00:00.000Z"
  }
}
```

#### Delete Review (Admin only)

```
DELETE /reviews/:reviewId
```

Response:
```json
{
  "success": true,
  "message": "Review removed"
}
```

## Certificates

### Certificate Endpoints

#### Get All Certificates

```
GET /certificates
```

Query parameters:
- `featured` (boolean): Filter by featured certificates
- `limit` (number): Number of results per page (default: 10)
- `page` (number): Page number (default: 1)
- `sortBy` (string): Field to sort by (default: 'order')
- `sortOrder` (string): Sort order ('asc' or 'desc', default: 'asc')

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issueDate": "2023-01-15T00:00:00.000Z",
      "expiryDate": "2026-01-15T00:00:00.000Z",
      "credentialId": "ABC123456",
      "credentialUrl": "https://aws.amazon.com/verification/123456",
      "imageUrl": "https://example.com/certificate.jpg",
      "description": "Professional level certification for AWS architecture",
      "featured": true,
      "order": 1,
      "createdAt": "2023-07-15T12:00:00.000Z",
      "updatedAt": "2023-07-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Certificate by ID

```
GET /certificates/:certificateId
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-01-15T00:00:00.000Z",
    "expiryDate": "2026-01-15T00:00:00.000Z",
    "credentialId": "ABC123456",
    "credentialUrl": "https://aws.amazon.com/verification/123456",
    "imageUrl": "https://example.com/certificate.jpg",
    "description": "Professional level certification for AWS architecture",
    "featured": true,
    "order": 1,
    "createdAt": "2023-07-15T12:00:00.000Z",
    "updatedAt": "2023-07-15T12:00:00.000Z"
  }
}
```

#### Create Certificate (Admin only)

```
POST /certificates
```

Request body:
```json
{
  "title": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issueDate": "2023-01-15",
  "expiryDate": "2026-01-15",
  "credentialId": "ABC123456",
  "credentialUrl": "https://aws.amazon.com/verification/123456",
  "imageUrl": "https://example.com/certificate.jpg",
  "description": "Professional level certification for AWS architecture",
  "featured": true,
  "order": 1
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-01-15T00:00:00.000Z",
    "expiryDate": "2026-01-15T00:00:00.000Z",
    "credentialId": "ABC123456",
    "credentialUrl": "https://aws.amazon.com/verification/123456",
    "imageUrl": "https://example.com/certificate.jpg",
    "description": "Professional level certification for AWS architecture",
    "featured": true,
    "order": 1,
    "createdAt": "2023-07-15T12:00:00.000Z",
    "updatedAt": "2023-07-15T12:00:00.000Z"
  }
}
```

#### Update Certificate (Admin only)

```
PUT /certificates/:certificateId
```

Request body:
```json
{
  "title": "Updated Certificate Title",
  "featured": false
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Updated Certificate Title",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-01-15T00:00:00.000Z",
    "expiryDate": "2026-01-15T00:00:00.000Z",
    "credentialId": "ABC123456",
    "credentialUrl": "https://aws.amazon.com/verification/123456",
    "imageUrl": "https://example.com/certificate.jpg",
    "description": "Professional level certification for AWS architecture",
    "featured": false,
    "order": 1,
    "createdAt": "2023-07-15T12:00:00.000Z",
    "updatedAt": "2023-07-15T12:00:00.000Z"
  }
}
```

#### Delete Certificate (Admin only)

```
DELETE /certificates/:certificateId
```

Response:
```json
{
  "success": true,
  "message": "Certificate removed"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error",
  "errors": "\"title\" is required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Project not found"
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "message": "Too many reviews submitted, please try again later"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Server error",
  "stack": "Error: Server error\n    at ..."
}
``` 