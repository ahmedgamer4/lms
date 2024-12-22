# LMS SaaS Platform

A multi-tenant Learning Management System (LMS) designed for teachers to create personalized subdomains, manage courses, engage students, and track progress. This platform is tailored for the Egyptian market and aims to empower educators with easy-to-use tools and advanced analytics.

## Features

### For Teachers

- **Custom Subdomains**: Each teacher gets a unique subdomain (e.g., `teacher-name.lms.com`).
- **Course Management**: Create, organize, and manage courses with sections, videos, and quizzes.
- **Student Management**: Track student progress and manage enrollments.
- **Analytics Dashboard**: Gain insights into student performance and course engagement.
- **Monetization**: Teachers can set prices for their courses and generate revenue.

### For Students

- **Personalized Accounts**: Separate accounts for each teacher.
- **Course Access**: Access courses via unique codes provided by teachers.
- **Interactive Learning**: Participate in quizzes, discussions, and track progress.

## Tech Stack

- **Frontend**: Next.js for a dynamic, SEO-friendly interface.
- **Backend**: NestJS with PostgreSQL for a scalable and secure API.
- **Authentication**: JWT-based authentication and Argon2 password hashing.
- **Storage**: S3-compatible storage for videos and other media.

## Installation

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lms-saas.git
   cd lms-saas
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:

@lms-saas

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/lms
```

@lms-saas/api

```bash
S3_BUCKET_NAME=your_bucket_name
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_JWT_SECRET=
REFRESH_JWT_EXPIRES_IN=
```

@lms-saas/web

```bash
BACKEND_URL=
SESSION_SECRET_KEY=
```

4. Run database migrations:
   ```bash
   cd packages/share-lib
   yarn db:generate
   yarn db:migrate
   ```
5. Start the development server:
   ```bash
   yarn dev
   ```

## Local Development with Subdomains

1. Update your `/etc/hosts` file:
   ```
   127.0.0.1 teacher1.localhost
   127.0.0.1 teacher2.localhost
   ```
2. Access the app via `teacher1.localhost:3000` or `teacher2.localhost:3000`.

## License

This project is licensed under a custom license. Non-commercial use is allowed. Commercial use is strictly prohibited without prior written permission. See the [LICENSE](./LICENSE) file for details.

## Contact

For questions or suggestions, reach out to [ahmedalseidy66@gmail.com].
