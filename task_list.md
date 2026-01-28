# Backend Development Task List - SkillBridge

This document outlines the remaining backend tasks for the SkillBridge project, following the completion of the Authentication, Tutor, and Category modules.

## Modules Already Completed:
- [x] **Authentication Module**: User registration, login, and session management.
- [x] **Tutor Module**: CRUD for tutor profiles, searching, filtering, availability management, and admin approval.
- [x] **Category Module**: CRUD for categories (admin) and public listing/detail view.

## Remaining Tasks:

### 1. Booking Module Implementation

*   **Goal**: Enable students to book sessions, and both students/tutors to view their bookings. Admins can view all bookings.
*   **File Structure**: Create `src/app/modules/booking/` with `booking.controller.ts`, `booking.service.ts`, `booking.route.ts`, and `booking.validation.ts`.
*   **Endpoints**:
    *   [x] `POST /api/bookings`: Create new booking (Student role).
        *   Implement Zod validation for booking creation data.
        *   Controller logic to handle booking request.
        *   Service logic to create booking, including checking tutor's availability and preventing double-booking.
        *   Apply `auth(UserRole.STUDENT)` middleware.
    *   [x] `GET /api/bookings`: Get user's bookings (Student/Tutor roles).
        *   Controller logic to fetch bookings based on the authenticated user's ID (studentId or tutorId).
        *   Service logic to query bookings with relevant details (e.g., associated tutor/student, subject).
        *   Apply `auth(UserRole.STUDENT, UserRole.TUTOR)` middleware.
    *   [x] `GET /api/bookings/:id`: Get single booking details (Student/Tutor/Admin roles).
        *   Controller logic to fetch a specific booking.
        *   Service logic to ensure the authenticated user has permission to view this booking.
        *   Apply `auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN)` middleware.
    *   [x] `GET /api/admin/bookings`: Get all bookings (Admin role).
        *   Controller logic to fetch all bookings for administrative overview.
        *   Service logic to retrieve all bookings, possibly with pagination/filtering.
        *   Apply `auth(UserRole.ADMIN)` middleware.

### 2. Review Module Implementation

*   **Goal**: Allow students to leave reviews for tutors after completed sessions.
*   **File Structure**: Create `src/app/modules/review/` with `review.controller.ts`, `review.service.ts`, `review.route.ts`, and `review.validation.ts`.
*   **Endpoints**:
    *   [x] `POST /api/reviews`: Create new review (Student role).
        *   Implement Zod validation for review data (rating, comment, bookingId).
        *   Controller logic to handle review submission.
        *   Service logic to create review, ensuring it's linked to a completed booking and that only one review per booking is allowed.
        *   Update `TutorProfile`'s `rating` and `totalReviews` based on the new review.
        *   Apply `auth(UserRole.STUDENT)` middleware.

### 3. User Module Implementation (Admin & Student Profile Management)

*   **Goal**: Admin to manage all users, and students to manage their own basic profile information.
*   **File Structure**: Create `src/app/modules/user/` with `user.controller.ts`, `user.service.ts`, `user.route.ts`, and `user.validation.ts`.
*   **Endpoints**:
    *   [x] `GET /api/admin/users`: Get all users (Admin role).
        *   Controller logic to fetch a list of all users (students and tutors).
        *   Service logic to retrieve users, potentially with search/pagination.
        *   Apply `auth(UserRole.ADMIN)` middleware.
    *   [x] `PATCH /api/admin/users/:id`: Update user status (ban/unban) (Admin role).
        *   Implement Zod validation for user status update.
        *   Controller logic to change a user's status (e.g., 'ACTIVE', 'INACTIVE', 'BANNED').
        *   Service logic to update the user record in the database.
        *   Apply `auth(UserRole.ADMIN)` middleware.
    *   [x] `PATCH /api/users/profile`: Update current user's profile (Student/Tutor roles).
        *   Implement Zod validation for user profile update (e.g., name, phone).
        *   Controller logic to allow the authenticated user to update their own basic `User` information.
        *   Service logic to update the user record.
        *   Apply `auth(UserRole.STUDENT, UserRole.TUTOR)` middleware.

### 4. Cross-cutting Concerns & Integration

*   [ ] Integrate all new module routes into `src/app/routes/index.ts`.
*   [ ] Ensure robust error handling (`catchAsync`, globalErrorHandler) for all new endpoints.
*   [ ] Add appropriate Zod validation for all incoming request bodies and query parameters for new routes.
