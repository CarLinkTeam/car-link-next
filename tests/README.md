# E2E Testing

## Prerequisites

**⚠️ IMPORTANT**: Before running the tests, make sure you have:

1. **Backend running** on port 3000 with seeded data
2. **Frontend running** on port 3001 (starts automatically)

## Steps to Execute

### 1. Start the Backend

```bash
# In the backend directory
npm run start:dev
```

### 2. Apply the Seed (if not already applied)

```bash
# In the backend
npm run seed
```

### 3. Run the Tests

```bash
# All tests
npm run test:e2e
```

## Included Tests

### 🔐 Login (`tests/auth/login.spec.ts`)

1. **Successful Login** – `admin@carlink.com` / `admin123`
2. **Failed Login** – Incorrect credentials

### 📝 Registration (`tests/auth/register.spec.ts`)

1. **Successful Registration** – `new.user@carlink.com` with valid data
2. **Failed Registration** – Duplicate email (`admin@carlink.com`)

### 🚫 Error Pages (`tests/pages/error-pages.spec.ts`)

1. **404 Page** – Navigation to a non-existent route
2. **Restricted Access** – OWNER user trying to access `/dashboard/admin`

## Test Data

Tests use backend seed data:

### Existing Users

- **Admin**: `admin@carlink.com` / `admin123`
- **Owner**: `owner1@carlink.com` / `owner` (for restricted access test)
- **Tenant**: `client1@carlink.com` / `client`

### New Users (for successful registration)

- **Email**: `new.user@carlink.com`
- **Data**: Unique name, location, phone number

## Specific Test Cases

### 🔍 404 Page

- **Route**: `/random-non-existent-404-route`
- **Checks**: 404 message, navigation buttons, useful links

### 🚨 Restricted Access

- **Scenario**: OWNER user → `/dashboard/admin`
- **Checks**: Access denied message, redirection to `/access-denied`
