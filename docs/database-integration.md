# Nexora Health – Database Integration

## MongoDB Atlas Setup
The project utilizes MongoDB Atlas via Mongoose ODM. Connection setup is handled in `config/db.js` using the standard `mongoose.connect()` utility, authenticated through the `.env` `MONGO_URI`.

## Schema Definitions

**1. User Schema**
- `name` (String, required)
- `email` (String, unique)
- `password` (String, hashed)
- `role` (String, enum: user/admin)
- Config: Timestamps true

**2. HealthRecord Schema**
- `userId` (ObjectId, ref: User)
- `date` (Date)
- `weight` (Number)
- `calories` (Number)
- `waterIntake` (Number)
- `sleepHours` (Number)

**3. Exercise Schema**
- `userId` (ObjectId, ref: User)
- `type` (String, enum: cardio/strength/yoga/other)
- `duration` (Number)
- `caloriesBurned` (Number)
- `intensity` (String)

**4. Goal Schema**
- `userId` (ObjectId, ref: User)
- `type` (String)
- `targetValue` (Number)
- `currentValue` (Number)
- `deadline` (Date)
- `isAchieved` (Boolean)

**5. Notification Schema**
- `userId` (ObjectId, ref: User)
- `message` (String)
- `type` (String, enum: info/warning/success)
- `isRead` (Boolean)

## Relationships Diagram
- `User` 1:N `HealthRecord`
- `User` 1:N `Exercise`
- `User` 1:N `Goal`
- `User` 1:N `Notification`
All peripheral datasets store the central `userId` referring back to the master `User` document.

## Validation Rules
Mongoose configurations enforce mandatory fields (`required: true`) and standardize categorical variables using ENUM arrays (e.g., gender, exercise types, goal metrics). 

## Seed Data Description
The `seed/seedData.js` file instantly bootstraps a development environment by erasing the DB and inserting:
- 1 Admin user
- 1 Standard user (Arjun Sharma)
- 14 days of realistic generated health records (Weight, Calories, Water, Sleep)
- Random Exercise logs and pre-configured wellness Goals.
