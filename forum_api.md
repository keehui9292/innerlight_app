# Forum API Documentation

This document provides comprehensive information about the Forum API endpoints.

## Base URL
```
https://yourdomain.com/api/v1/{subdomain}
```

## Authentication
Protected endpoints require Bearer token authentication:
```
Authorization: Bearer {your_access_token}
```

## Response Format
All API responses follow this standard format:

### Success Response
```json
{
    "success": true,
    "message": "Success message",
    "data": {
        // Response data
    }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error information" // Only in debug mode
}
```

## Pagination
List endpoints use Laravel pagination format:
```json
{
    "success": true,
    "data": {
        "data": [...], // Array of items
        "current_page": 1,
        "first_page_url": "...",
        "from": 1,
        "last_page": 5,
        "last_page_url": "...",
        "links": [...],
        "next_page_url": "...",
        "path": "...",
        "per_page": 20,
        "prev_page_url": null,
        "to": 20,
        "total": 100
    }
}
```

---

## Public Endpoints (No Authentication Required)

### 1. Get Admin Announcements

Retrieve all admin announcements (pinned topics).

**Endpoint:** `GET /forum/announcements`

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
{
    "success": true,
    "message": "Announcements retrieved successfully",
    "data": {
        "data": [
            {
                "id": "uuid",
                "title": "Important Announcement",
                "content": "Announcement content...",
                "slug": "important-announcement-abc123",
                "status": "active",
                "is_pinned": true,
                "view_count": 150,
                "comment_count": 12,
                "created_at": "2024-01-15T10:30:00.000000Z",
                "updated_at": "2024-01-15T10:30:00.000000Z",
                "last_activity_at": "2024-01-16T14:20:00.000000Z",
                "user": {
                    "id": "user-uuid",
                    "name": "Admin User"
                },
                "category": {
                    "id": "category-uuid",
                    "name": "General"
                }
            }
        ],
        "current_page": 1,
        "per_page": 20,
        "total": 5
    }
}
```

**Example Request:**
```bash
curl -X GET "https://yourdomain.com/api/v1/innerlight/forum/announcements" \
  -H "Accept: application/json"
```

---

### 2. Get Forum Topics

Retrieve all forum topics excluding announcements.

**Endpoint:** `GET /forum/topics`

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
{
    "success": true,
    "message": "Topics retrieved successfully",
    "data": {
        "data": [
            {
                "id": "uuid",
                "title": "How to get started?",
                "content": "I'm new here and wondering...",
                "slug": "how-to-get-started-def456",
                "status": "active",
                "is_pinned": false,
                "view_count": 45,
                "comment_count": 8,
                "comments_count": 8, // Active comments count
                "created_at": "2024-01-15T10:30:00.000000Z",
                "updated_at": "2024-01-15T10:30:00.000000Z",
                "last_activity_at": "2024-01-16T14:20:00.000000Z",
                "user": {
                    "id": "user-uuid",
                    "name": "John Doe"
                },
                "category": {
                    "id": "category-uuid",
                    "name": "Questions"
                }
            }
        ],
        "current_page": 1,
        "per_page": 20,
        "total": 150
    }
}
```

**Example Request:**
```bash
curl -X GET "https://yourdomain.com/api/v1/innerlight/forum/topics?page=2" \
  -H "Accept: application/json"
```

---

### 3. Get Topic Details

Get detailed information about a specific topic and increment its view count.

**Endpoint:** `GET /forum/topics/{topicId}`

**Parameters:**
- `topicId` (required): UUID of the topic

**Response:**
```json
{
    "success": true,
    "message": "Topic details retrieved successfully",
    "data": {
        "id": "uuid",
        "title": "How to get started?",
        "content": "I'm new here and wondering how to begin my journey...",
        "slug": "how-to-get-started-def456",
        "status": "active",
        "is_pinned": false,
        "view_count": 46, // Incremented by 1
        "comment_count": 8,
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z",
        "last_activity_at": "2024-01-16T14:20:00.000000Z",
        "user": {
            "id": "user-uuid",
            "name": "John Doe"
        },
        "category": {
            "id": "category-uuid",
            "name": "Questions"
        }
    }
}
```

**Example Request:**
```bash
curl -X GET "https://yourdomain.com/api/v1/innerlight/forum/topics/550e8400-e29b-41d4-a716-446655440000" \
  -H "Accept: application/json"
```

**Error Responses:**
- `404`: Topic not found or not active

---

### 4. Get Topic Comments

Get paginated comments for a specific topic. Returns first 10 comments by default, then paginated.

**Endpoint:** `GET /forum/topics/{topicId}/comments`

**Parameters:**
- `topicId` (required): UUID of the topic
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
{
    "success": true,
    "message": "Topic comments retrieved successfully",
    "data": {
        "data": [
            {
                "id": "comment-uuid",
                "content": "Great question! Here's what I think...",
                "topic_id": "topic-uuid",
                "parent_id": null, // Top-level comment
                "status": "active",
                "created_at": "2024-01-15T11:00:00.000000Z",
                "updated_at": "2024-01-15T11:00:00.000000Z",
                "user": {
                    "id": "user-uuid",
                    "name": "Jane Smith"
                },
                "replies": [
                    {
                        "id": "reply-uuid",
                        "content": "Thanks for the advice!",
                        "topic_id": "topic-uuid",
                        "parent_id": "comment-uuid",
                        "status": "active",
                        "created_at": "2024-01-15T11:30:00.000000Z",
                        "updated_at": "2024-01-15T11:30:00.000000Z",
                        "user": {
                            "id": "user-uuid",
                            "name": "John Doe"
                        }
                    }
                ]
            }
        ],
        "current_page": 1,
        "per_page": 10,
        "total": 8
    }
}
```

**Example Request:**
```bash
curl -X GET "https://yourdomain.com/api/v1/innerlight/forum/topics/550e8400-e29b-41d4-a716-446655440000/comments?page=1" \
  -H "Accept: application/json"
```

**Error Responses:**
- `404`: Topic not found or not active

---

## Protected Endpoints (Authentication Required)

### 5. Create New Topic

Create a new forum topic. Requires authentication.

**Endpoint:** `POST /forum/topics`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "My New Topic",
    "content": "This is the content of my topic...",
    "category_id": "category-uuid"
}
```

**Validation Rules:**
- `title`: Required, string, max 255 characters
- `content`: Required, string
- `category_id`: Required, must exist in forum_categories table

**Response:**
```json
{
    "success": true,
    "message": "Topic created successfully",
    "data": {
        "id": "new-topic-uuid",
        "title": "My New Topic",
        "content": "This is the content of my topic...",
        "slug": "my-new-topic-ghi789",
        "category_id": "category-uuid",
        "user_id": "user-uuid",
        "website_id": "website-uuid",
        "status": "active",
        "is_pinned": false,
        "view_count": 0,
        "comment_count": 0,
        "created_at": "2024-01-16T10:00:00.000000Z",
        "updated_at": "2024-01-16T10:00:00.000000Z",
        "last_activity_at": "2024-01-16T10:00:00.000000Z",
        "category": {
            "id": "category-uuid",
            "name": "General Discussion"
        },
        "user": {
            "id": "user-uuid",
            "name": "John Doe"
        }
    }
}
```

**Example Request:**
```bash
curl -X POST "https://yourdomain.com/api/v1/innerlight/forum/topics" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Topic",
    "content": "This is the content of my topic...",
    "category_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Error Responses:**
- `401`: Authentication required
- `400`: Invalid category (category doesn't exist or belong to website)
- `422`: Validation errors

---

### 6. Create Comment

Add a comment to a topic or reply to an existing comment. Requires authentication.

**Endpoint:** `POST /forum/topics/{topicId}/comments`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "content": "This is my comment...",
    "parent_id": null // Optional: UUID of parent comment for replies
}
```

**Validation Rules:**
- `content`: Required, string, max 10,000 characters
- `parent_id`: Optional, must exist in forum_comments table and belong to the topic

**Response:**
```json
{
    "success": true,
    "message": "Comment posted successfully",
    "data": {
        "id": "new-comment-uuid",
        "content": "This is my comment...",
        "topic_id": "topic-uuid",
        "user_id": "user-uuid",
        "parent_id": null,
        "status": "active",
        "created_at": "2024-01-16T11:00:00.000000Z",
        "updated_at": "2024-01-16T11:00:00.000000Z",
        "user": {
            "id": "user-uuid",
            "name": "John Doe"
        }
    }
}
```

**Example Request (Top-level comment):**
```bash
curl -X POST "https://yourdomain.com/api/v1/innerlight/forum/topics/550e8400-e29b-41d4-a716-446655440000/comments" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my comment on this topic..."
  }'
```

**Example Request (Reply to comment):**
```bash
curl -X POST "https://yourdomain.com/api/v1/innerlight/forum/topics/550e8400-e29b-41d4-a716-446655440000/comments" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my reply to the above comment...",
    "parent_id": "parent-comment-uuid"
  }'
```

**Error Responses:**
- `401`: Authentication required
- `404`: Topic not found or not active
- `403`: Topic is closed for comments
- `400`: Invalid parent comment
- `422`: Validation errors

---

## Additional Protected Endpoints

### 7. Get My Topics

Get topics created by the authenticated user.

**Endpoint:** `GET /forum/my-topics`

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response:**
Similar to "Get Forum Topics" but filtered by authenticated user.

### 8. Update Topic

Update an existing topic (only by topic creator).

**Endpoint:** `PUT /forum/topics/{topic}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

### 9. Delete Topic

Delete a topic (only by topic creator).

**Endpoint:** `DELETE /forum/topics/{topic}`

**Headers:**
```
Authorization: Bearer {token}
```

### 10. Report Post

Report inappropriate content.

**Endpoint:** `POST /forum/posts/{post}/report`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Data Models

### Topic Model
```json
{
    "id": "uuid",
    "title": "string",
    "content": "text",
    "slug": "string (auto-generated)",
    "category_id": "uuid",
    "user_id": "uuid",
    "website_id": "uuid",
    "status": "active|blocked|closed",
    "is_pinned": "boolean",
    "view_count": "integer",
    "comment_count": "integer",
    "report_count": "integer",
    "auto_blocked": "boolean",
    "admin_note": "string",
    "last_activity_at": "timestamp",
    "created_at": "timestamp",
    "updated_at": "timestamp"
}
```

### Comment Model
```json
{
    "id": "uuid",
    "content": "text",
    "original_content": "text",
    "topic_id": "uuid",
    "user_id": "uuid",
    "parent_id": "uuid (nullable)",
    "status": "active|hidden|removed",
    "report_count": "integer",
    "auto_hidden": "boolean",
    "admin_note": "string",
    "edited_at": "timestamp",
    "created_at": "timestamp",
    "updated_at": "timestamp"
}
```

### Category Model
```json
{
    "id": "uuid",
    "name": "string",
    "description": "text",
    "color": "string",
    "sort_order": "integer",
    "is_active": "boolean",
    "website_id": "uuid",
    "created_at": "timestamp",
    "updated_at": "timestamp"
}
```

---

## Status Codes

- `200`: Success
- `201`: Created successfully
- `400`: Bad request (invalid data)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (access denied)
- `404`: Not found
- `422`: Validation errors
- `500`: Server error

---

## Rate Limiting

API endpoints may be subject to rate limiting. Check response headers:
- `X-RateLimit-Limit`: Requests per minute allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when rate limit resets

---

## CORS Support

All public endpoints support CORS with preflight requests. The API accepts requests from any origin for public endpoints.

---

## Usage Flow Example

1. **Get announcements**: `GET /forum/announcements`
2. **Get topics list**: `GET /forum/topics`
3. **Click on a topic**: `GET /forum/topics/{id}`
4. **View comments**: `GET /forum/topics/{id}/comments`
5. **Load more comments**: `GET /forum/topics/{id}/comments?page=2`
6. **Create new topic** (auth required): `POST /forum/topics`
7. **Comment on topic** (auth required): `POST /forum/topics/{id}/comments`

This documentation covers all the forum API endpoints with comprehensive examples and details for implementation.