# Makanak Backend API Documentation

This document describes the REST APIs implemented for the Makanak system.
The system is role-based and supports Students, Landlords, and Admins.

---

## 🔐 Authentication

### POST /api/auth/register
**Role:** Student / Landlord / Admin  
**Description:** Register a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student | landlord | admin"
}
