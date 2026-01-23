For Email Service Provider Selection we use smtplib python library with below configuration
smtp_server = "smtp.gmail.com"
smtp_port = 465 # For SSL
sender_email = "your_email@gmail.com"
receiver_email = "receiver_email@example.com"
password = "your_app_password"
Sender email and password should be stored in the configuration file in code


# API end point for password reset
/auth/password-reset

#OTP Expiry Duration
OTP Expiry Duration should be standard of 30 second. OTP can be stored in the DB

#Password Encryption Algorithm
we will use SHA-2(SHA-256) for password encription

#Password Reset Flow Details
we will send OPT for email and ask user to enter the OTP in our portal and ask him to use give new password and confirm password to reset

#JWT Token Expiry Duration
30 mins will expiry time for JWT

#Password Complexity Requirements
Length: Minimum of 8-12 characters, with 14+ or longer passphrases recommended.
Character Types: Combination of uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#$%^&* etc.).
Uniqueness: Password must not match previous passwords and should be unique to the account.
Avoidance: Not containing account names, real names, or dictionary words.