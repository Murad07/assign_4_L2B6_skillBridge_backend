# API Endpoints

This document provides a comprehensive list of all API endpoints for the application, organized by module.

---

## Authentication (`/auth`)

| Method | Endpoint          | Access      | Description                          |
| :----- | :---------------- | :---------- | :----------------------------------- |
| `GET`  | `/me`             | Authenticated | Get the current user's profile information. |
| `POST` | `/sign-up/email`  | Public      | Register a new user via email and password. |
| `POST` | `/sign-in/email`  | Public      | Sign in a user with email and password. |
| `ALL`  | `/*`              | Public      | Handles other authentication-related actions like callbacks. |

---

## Categories (`/categories`)

| Method   | Endpoint | Access | Description                                 |
| :------- | :------- | :----- | :------------------------------------------ |
| `GET`    | `/`      | Public | Get a list of all course categories.        |
| `GET`    | `/:id`   | Public | Get details of a single category by its ID. |
| `POST`   | `/`      | Admin  | Create a new category.                      |
| `PATCH`  | `/:id`   | Admin  | Update the details of an existing category. |
| `DELETE` | `/:id`   | Admin  | Delete a category (soft delete).            |

---

## Tutors (`/tutor`)

| Method  | Endpoint                 | Access | Description                                           |
| :------ | :----------------------- | :----- | :---------------------------------------------------- |
| `GET`   | `/`                      | Public | Get a list of all approved tutors.                    |
| `GET`   | `/:id`                   | Public | Get the profile of a single tutor by their ID.        |
| `POST`  | `/profile`               | Tutor  | Create a new profile for a tutor.                     |
| `GET`   | `/profile/me`            | Tutor  | Get the profile of the currently authenticated tutor. |
| `PATCH` | `/profile`               | Tutor  | Update the profile of the currently authenticated tutor. |
| `PATCH` | `/availability`          | Tutor  | Update the availability schedule for a tutor.         |
| `GET`   | `/sessions/my-sessions`  | Tutor  | Get a list of all sessions for the authenticated tutor. |
| `GET`   | `/admin/pending`         | Admin  | Get a list of all tutors awaiting approval.           |
| `PATCH` | `/admin/:id/approve`     | Admin  | Approve a tutor's profile.                            |
| `PATCH` | `/admin/:id/reject`      | Admin  | Reject a tutor's profile.                             |

---

## Bookings (`/bookings`)

| Method | Endpoint | Access               | Description                                  |
| :----- | :------- | :------------------- | :------------------------------------------- |
| `POST` | `/`      | Student              | Create a new booking for a session.          |
| `GET`  | `/`      | Student, Tutor       | Get a list of bookings for the current user. |
| `GET`  | `/admin` | Admin                | Get a list of all bookings for all users.    |
| `GET`  | `/:id`   | Student, Tutor, Admin| Get details of a single booking by its ID.   |
| `PATCH`| `/:id/status`| Student, Tutor       | Update booking status (Student can cancel, Tutor can complete). |

---

## Reviews (`/reviews`)

| Method | Endpoint    | Access                | Description                             |
| :----- | :---------- | :-------------------- | :-------------------------------------- |
| `GET`  | `/:tutorId` | Authenticated         | Get all reviews for a specific tutor.   |
| `POST` | `/`         | Student               | Create a new review for a completed booking. |

---

## User Management (`/admin/users`)

| Method  | Endpoint | Access | Description                                      |
| :------ | :------- | :----- | :----------------------------------------------- |
| `GET`   | `/`      | Admin  | Get a list of all users in the system.           |
| `GET`   | `/:id`   | Admin  | Get details of a single user by their ID.        |
| `PATCH` | `/:id`   | Admin  | Update the status (e.g., active, suspended) of a user. |

---

## User Profiles (`/users`)

| Method  | Endpoint  | Access         | Description                               |
| :------ | :-------- | :------------- | :---------------------------------------- |
| `PATCH` | `/profile`| Student, Tutor | Update the profile of the current user.   |

---
