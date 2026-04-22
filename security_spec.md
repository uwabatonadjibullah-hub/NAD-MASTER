# Security Specification - NAD MASTER

## 1. Data Invariants
- A `ScheduleBlock` must belong to the authenticated user (`userId == auth.uid`).
- A `Goal` status can only transition from `active` to `completed` or `failed`.
- Users can only read and write their own data.
- AI `ChatMessage` metadata cannot be modified by the user once written by the system.
- `createdAt` timestamps are immutable after creation.

## 2. The Dirty Dozen Payloads (Target: DENIED)

### 1. Identity Spoofing (Write to another user's schedule)
```json
{
  "path": "users/victim_uid/schedule/block1",
  "data": { "userId": "victim_uid", "title": "Stolen Slot" }
}
```

### 2. Forbidden Field Injection (Add 'isAdmin' to profile)
```json
{
  "path": "users/my_uid",
  "data": { "isAdmin": true, "uid": "my_uid", "email": "me@example.com" }
}
```

### 3. Identity Theft (Change owner in Quran progress)
```json
{
  "path": "users/my_uid/quranProgress/main",
  "data": { "userId": "another_uid" }
}
```

### 4. Shadow Update (Inject ghost field into Goal)
```json
{
  "path": "users/my_uid/goals/goal1",
  "data": { "status": "completed", "verifiedByAdmin": true }
}
```

### 5. ID Poisoning (Massive string as blockId)
`users/my_uid/schedule/[1.5KB string]`

### 6. Relational Sync Bypass (Orphaned schedule block)
Create schedule block for a non-existent user.

### 7. Terminal State Reversion (Change 'failed' goal to 'active')
```json
{
  "path": "users/my_uid/goals/goal1",
  "op": "update",
  "existing": { "status": "failed" },
  "incoming": { "status": "active" }
}
```

### 8. PII Leak (Read another user's private profile)
`get users/private_uid`

### 9. Time Spoofing (Manual createdAt)
```json
{
  "path": "users/my_uid/goals/goal1",
  "data": { "createdAt": "2020-01-01T00:00:00Z" }
}
```

### 10. Type Confusion (Number as title)
```json
{
  "path": "users/my_uid/goals/goal1",
  "data": { "title": 12345 }
}
```

### 11. Empty Write (Bypass required fields)
```json
{
  "path": "users/my_uid/schedule/block1",
  "data": { "userId": "my_uid" }
}
```

### 12. Query Scraping (List all users)
`list /users`

## 3. Test Runner (Mock)
(This will be implemented in the final `firestore.rules.test.ts` during development).
