# ElevanceNet Auth System


## Features
- User signup with email, password, firstName, lastName
- Privacy and terms agreement required
- Password complexity enforced (8-12 chars, upper/lower/number/symbol, not previous or name)
- Duplicate email check
- OTP sent to email for verification (expires in 30s, max 5 attempts)
- Email verification required before login
- JWT authentication, cookies set on verification
- All responses in standard JSON format
- User activity logging (Winston)
- Config via `.env` (see `.env.example`)
- Scalable, RESTful, GDPR compliant
## Folder Structure
```
src/
  app.js
  config/
    .env.example
    index.js
  controllers/
    authController.js
  domain/
    models/
      User.js
      Otp.js
  infrastructure/
    repositories/
      userRepository.js
      otpRepository.js
  routes/
    authRoutes.js
  services/
    authService.js
    emailService.js
  utils/
    logger.js
    passwordUtils.js
    responseFormatter.js
```

## Setup Instructions
1. Copy `.env.example` to `.env` and fill in required values.
2. Install dependencies:
   ```bash
   npm install express mongoose winston nodemailer jsonwebtoken cookie-parser dotenv
   ```
3. Start the server:
   ```bash
   node src/app.js
   ```

## API Endpoints
### POST /auth/signup
- Body: `{ firstName, lastName, email, password, agreedToPrivacy, agreedToTerms }`
- Returns: `{ success, message, data, errors, meta }`

### POST /auth/verify
- Body: `{ userId, otp }`
- Returns: `{ success, message, data, errors, meta }`

## Notes
- OTP expires in 30 seconds, max 5 attempts
- Unverified users cannot log in
- All user activities are logged
- Passwords are encrypted with SHA-256
- JWT secret and SMTP credentials must be set in `.env`

## Deployment
- Backend: Vercel/AWS
- Frontend: Netlify (React.js)

## License
MIT
