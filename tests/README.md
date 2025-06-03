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

# Specific test suites
npm run test:e2e:auth      # All auth tests (login + register)
npm run test:e2e:login     # Only login tests
npm run test:e2e:register  # Only register tests
npm run test:e2e:errors    # Only error pages tests
npm run test:e2e:profile   # Only profile tests
npm run test:e2e:rental    # Only rental process tests
```

## Included Tests

### 🔐 Authentication (`tests/auth/`)

#### Login (`tests/auth/login.spec.ts`)

1. **Successful Login** – `admin@carlink.com` / `admin123`
2. **Failed Login** – Incorrect credentials

#### Registration (`tests/auth/register.spec.ts`)

1. **Successful Registration** – `new.user@carlink.com` with valid data
2. **Failed Registration** – Duplicate email (`admin@carlink.com`)

### 📄 Pages (`tests/pages/`)

#### Error Pages (`tests/pages/error-pages.spec.ts`)

1. **404 Page** – Navigation to a non-existent route
2. **Restricted Access** – OWNER user trying to access `/dashboard/admin`

#### Profile Page (`tests/pages/profile.spec.ts`)

1. **OWNER User** – View personal information and vehicles
2. **TENANT Promotion** – Promote to OWNER and verify empty vehicle state
3. **TENANT Interface** – Verify UI elements before promotion

#### Rental Process (`tests/pages/rental-process.spec.ts`)

1. **Tenant Rental Request** – Tenant creates a rental request
2. **Rental Request Filters** – Verify filtering and search functionality
3. **Detailed Request Information** – Verify all required information is displayed

## Test Data

Tests use backend seed data:

### Existing Users

- **Admin**: `admin@carlink.com` / `admin123`
- **Owner1**: `propietario1@carlink.com` / `propietario` (has vehicles)
- **Owner2**: `propietario2@carlink.com` / `propietario`
- **Tenant1**: `cliente1@carlink.com` / `cliente` (for promotion tests)
- **Tenant2**: `cliente2@carlink.com` / `cliente` (for UI verification)

### New Users (for successful registration)

- **Email**: `nuevo.usuario@carlink.com`
- **Data**: Unique name, location, phone number

## Specific Test Cases

### 🔍 404 Page

- **Route**: `/ruta-inexistente-aleatoria-404`
- **Checks**: 404 message, navigation buttons, useful links

### 🚨 Restricted Access

- **Scenario**: OWNER user → `/dashboard/admin`
- **Checks**: Access denied message, redirection to `/access-denied`

### 👤 Profile Tests

#### OWNER Profile

- **User**: `propietario1@carlink.com`
- **Checks**: Personal info, OWNER role, vehicle section access, action buttons

#### TENANT Promotion

- **User**: `cliente1@carlink.com`
- **Flow**: Login → Restricted access → Promote to OWNER → Empty vehicle state
- **Checks**: Success message, role change, new permissions

#### TENANT Interface

- **User**: `cliente2@carlink.com`
- **Checks**: Profile info, TENANT role, restricted access message, no vehicle buttons

### 🚗 Rental Process Tests

#### Tenant Rental Request

- **Tenant**: `cliente1@carlink.com`
- **Flow**: Login → Select vehicle → View details → Navigation verification
- **Checks**:
  - Successful login and dashboard access
  - Vehicle listing visibility
  - Navigation to vehicle details page
  - Vehicle information display (conditions, specifications, owner info)
  - Page structure and content verification

#### Rental Request Management

- **User**: `propietario1@carlink.com` (Owner)
- **Checks**:
  - Rental requests dashboard accessibility
  - Filter functionality (All/Pending/Confirmed/Cancelled)
  - Search by vehicle make/model
  - Filter state verification using select values
  - Interface responsiveness

#### Request Information Verification

- **User**: `propietario1@carlink.com` (Owner)
- **Checks**:
  - Statistics display accuracy (Total/Pending/Confirmed/Cancelled)
  - Vehicle information completeness in request cards
  - Date range and cost information (when available)
  - Status badges and visual indicators
  - Data structure validation

### 🎯 Vehicle Detail Page Testing

- **Navigation**: Tests verify reliable navigation from vehicle cards to detail pages
- **Content Verification**: Ensures all vehicle information is properly displayed
- **Information Accuracy**: Verifies technical specifications, rental conditions, and owner details
- **UI Components**: Tests proper rendering of images, buttons, and informational sections

### 📊 Dashboard and Filtering

- **Filter States**: Verify select dropdown value changes reflect correctly
- **Search Functionality**: Text input filtering works as expected
- **Statistics Accuracy**: Dashboard counters display correct information
- **Data Presentation**: Information is properly structured and accessible
