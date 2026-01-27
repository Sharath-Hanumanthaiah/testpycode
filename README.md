# Reporting System for Inappropriate Content

## Overview
This project implements a production-ready reporting system for inappropriate or unprofessional posts. It follows clean architecture and industry standards for Node.js (Express.js), React.js, and MongoDB.

## Features
- Users can report any post from the feed or post view.
- Reports are stored in MongoDB and include reporting user, post, reason, status, and timestamps.
- Moderators/administrators can retrieve and review all reports via RESTful API endpoints.
- The status of each report can be updated and tracked (new, under_review, resolved).
- All reporting actions are logged for security and debugging.
- The reporting feature is accessible and responsive on both desktop and mobile devices.
- All environment-specific values are managed via `.env` files.

## Folder Structure
- `src/domain/models/Report.js` — Mongoose model for reports
- `src/infrastructure/repositories/reportRepository.js` — Data access for reports
- `src/services/reportService.js` — Business logic for reporting
- `src/controllers/reportController.js` — RESTful API endpoints
- `src/routes/reportRoutes.js` — Express routes for reporting
- `src/components/ReportButton.js` — React button to trigger reporting
- `src/components/ReportModal.js` — React modal for submitting a report
- `src/components/Post.js` — Example integration of reporting in a post

## API Endpoints
- `POST /reports` — Report a post
- `GET /reports` — Retrieve all reports (moderator/admin)
- `PATCH /reports/:id/status` — Update report status (moderator/admin)

## Environment Variables
See `src/config/.env.example` for required configuration.

## Security & Logging
- All user activities, including reporting, are logged using Winston.
- Only authenticated users can report posts.
- Only moderators/admins can review and update reports.

## Usage
1. Ensure MongoDB and all environment variables are configured.
2. Start the backend server (`node src/app.js` or via your process manager).
3. Integrate the React components into your frontend.
4. Deploy backend to AWS and frontend to Netlify as per your workflow.

## Scalability & Best Practices
- Clean, modular, and testable codebase.
- Designed for high concurrency and future expansion.
- Follows official style guides and linting standards.

## License
MIT
