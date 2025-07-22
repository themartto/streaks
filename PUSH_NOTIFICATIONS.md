# Streak Reminder Push Notification System

## Overview

This document outlines the implementation of a streak reminder system that sends push notifications to users when they are at risk of losing their streak (24 hours after last activity). The system leverages GCP services and Firebase for reliable, scalable notification delivery.

## High-Level Components

 - Cloud Scheduler - Triggers daily streak checks

 - Cloud Functions - Processes streak data and sends notifications

 - Firestore - Stores user notification preferences and tracking data

 - Firebase Cloud Messaging (FCM) - Handles push notification delivery

 - Existing Streak API - Provides streak status data

## Data Flow

```
Cloud Scheduler → Cloud Function → Streak API → Risk Assessment → FCM → User Device
```

## Technical Implementation

1. Cloud Scheduler Configuration
Create a scheduled job that runs daily at optimal times (e.g., 6 PM local time for users).
 - Use multiple scheduled jobs for different time zones to respect user preferences for notification timing.

2. Cloud Function Implementation
 - The function should fetch user data from API and check if the user is at risk of losing their streak for the given date, if yes send push notification.
 - The function should process users data in batches to handle large user bases efficiently.
 - The function should keep track of processed users to avoid duplicates for the same day.
 - The function should send push notifications to users via FCM and log the response.

 example API data response:

 ```
{
  "activitiesToday": 2,
  "total": 13,
  "days": [
    { "date": "2024-02-03", "activities": 1, "state": "COMPLETED" },
    { "date": "2024-02-04", "activities": 1, "state": "COMPLETED" },
    { "date": "2024-02-05", "activities": 1, "state": "COMPLETED" },
    { "date": "2024-02-06", "activities": 0, "state": "AT_RISK" },
    { "date": "2024-02-07", "activities": 2, "state": "SAVED" },
    { "date": "2024-02-08", "activities": 0, "state": "INCOMPLETE" },
    { "date": "2024-02-09", "activities": 0, "state": "INCOMPLETE" }
  ]
}
 ```

3. Data Models

NotificationHistory
```
{
  type: "streak_risk",
  sentAt: timestamp,
  success: true,
  fcmResponse: "message_id",
  createdAt: timestamp
}
```

4. Deployment

 - The function should be deployed to Cloud Functions with appropriate permissions and scaling settings.
 - The Cloud Scheduler job should be configured to trigger the function at the desired time.

## Architecture Decisions

1. Cloud Scheduler vs. Firestore Triggers

Choice: Cloud Scheduler with HTTP trigger
Reason: Provides better control over execution timing and batch processing. Firestore triggers would fire for each user update, leading to inefficient resource usage.

2. Batch Processing

Choice: Process users in batches of 50
Reason: Prevents overwhelming the streak API while maintaining reasonable processing speed.

3. Notification Cooldown

Choice: 24-hour cooldown period
Reason: Prevents spam while ensuring users get reminded if they remain at risk the next day.

4. Firebase Admin SDK vs. FCM REST API

Choice: Firebase Admin SDK
Reason: Better error handling, automatic token management, and integrated Firebase ecosystem.

## Challenges to be considered

1. Invalid FCM Tokens

Challenge: Tokens become invalid when users uninstall apps
Solution: Handle messaging/registration-token-not-registered errors and clean up invalid tokens

2. Time Zone Handling

Challenge: Users in different time zones need notifications at appropriate times
Solution:

Store user timezone preferences
Create multiple Cloud Scheduler jobs for different time zones
Use UTC for all internal calculations

3. Function Cold Starts

Challenge: Cold starts may cause timeouts for large user bases
Solution:

Set minimum instances to 1 for critical hours
Optimize function initialization
Consider using Cloud Run for better cold start performance

4. Concurrent Executions

Challenge: Multiple function instances processing the same users
Solution: Use Firestore transactions for notification history writes
