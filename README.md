For Email Service Provider Selection we use smtplib python library with below configuration
smtp_server = "smtp.gmail.com"
smtp_port = 465 # For SSL
sender_email = "your_email@gmail.com"
receiver_email = "receiver_email@example.com"
password = "your_app_password"
Sender email and password should be stored in the configuration file in code



# API end point for password reset
/auth/password-reset
accepts password and return redirection for login screen

#OTP Expiry Duration
OTP Expiry Duration should be standard of 30 second. OTP can be stored in the DB
table schema
id              BIGSERIAL PRIMARY KEY,
user_id         BIGINT NOT NULL,
otp_hash        VARCHAR(255) NOT NULL,
purpose         VARCHAR(50) NOT NULL,
channel         VARCHAR(20) NOT NULL,
expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
consumed_at     TIMESTAMP WITH TIME ZONE,
attempts        SMALLINT NOT NULL DEFAULT 0,
max_attempts    SMALLINT NOT NULL DEFAULT 5,
created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

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


#Validation Rules for Profile Attributes
use the standard approch so it give the best.

#Profile Picture Upload Specifications
upload to local file storage so keep it in project only

#API Endpoints for Editing Work, Location, Social Links, Profile Picture, and Bio
use it same as sturcture as  post API but it should be put 




