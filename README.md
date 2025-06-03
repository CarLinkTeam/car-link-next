# CAR LINK - Next.js Implementation

Modern vehicle rental web application built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**. It provides a complete rental management experience with robust authentication, role-based authorization, and an elegant user interface.

## Authors

> - Alejandro Londoño Bermúdez - A00395978
> - Juan David Colonia Aldana - A00395956
> - Miguel Ángel Gonzalez Arango - A00395687

## Implemented Features

### Authentication and Authorization System

- **JWT Authentication** with secure tokens
- **Role-based system** (ADMIN, OWNER, TENANT)
- **Security middleware** with header validation
- **Intelligent AuthGuard** with state hydration
- **Persistent session management** with localStorage
- **Role-based route protection**

### User Management

- **User registration** with form validation (Zod)
- **Role promotion** (TENANT → OWNER)
- **Editable user profile**
- **Account deletion** with confirmation
- **Personal information management**

### Vehicle Management

- **Vehicle catalog** with search and filters
- **Image upload** with Cloudinary integration
- **Detailed information** (specifications, conditions, availability)
- **Detail view** with image gallery
- **Pagination** and real-time search

### Rental System

- **Rental requests** with date selection
- **Request management** for owners
- **Rental states** (pending, confirmed, cancelled, completed)
- **Filters and search** in requests
- **Request confirmation/rejection**
- **Automatic cost calculation**

### Reports and Statistics

- **Rental reports** with data visualization
- **Income reports** for owners
- **Popular vehicles** with metrics
- **PDF report export**
- **Screenshot generation** with html2canvas

### User Interface

- **Responsive design** with Tailwind CSS
- **Smooth animations** and transitions
- **Reusable components** (Button, Alert, Modal, etc.)
- **Modern theme** with gradients and glass effects
- **Optimized loading states**
- **Error handling** with custom pages

## Technical Architecture

### State Management (Zustand)

The project uses **Zustand** for global state management with multiple specialized stores:

```typescript
// Authentication Store - User authentication and session
// User Rentals Store - User rental data
// Vehicle Details Store - Vehicle information and details
// Rental Store - General rental state management
```

**State characteristics:**

- **Automatic persistence** with localStorage
- **Safe client-side hydration**
- **Optimized selectors** to prevent re-renders
- **Custom middleware** for error handling

### Authentication System

#### Server-side Middleware

- **Server-side execution** before rendering
- **Route classification** (protected, public, auth, system)
- **Security headers** applied globally
- **Basic optimization** without client state access

#### Client-side AuthGuard

- **Complete client-side verification**
- **Intelligent state hydration**
- **Contextual redirections** based on error type
- **Loading UI** during verification
- **Role and permission handling**

#### Route Configuration

```typescript
export const AUTH_ROUTES_CONFIG = {
  ROLE_PROTECTED: {
    ADMIN: ['/dashboard/admin'],
    OWNER: ['/dashboard/requests'],
  },
  PROTECTED: ['/dashboard'],
  AUTH: ['/auth/login', '/auth/register'],
  PUBLIC: ['/'],
}
```

### Custom Hooks

The application uses specialized hooks for specific functionalities:

```typescript
// Vehicle Management
useVehicles() // Vehicle listing and search
useVehicle() // Specific vehicle details
useVehicleUnavailability() // Unavailable dates

// User Management
useUserProfile() // User profile
usePromoteToOwner() // Role promotion
useUpdateProfile() // Profile updates
useDeleteUser() // Account deletion

// Rental Management
useUserRentals() // User rentals
useOwnerRentals() // Owner rentals
useReviews() // Review system

// Utilities
useAutoRefresh() // Auto-refresh data
useToggle() // Toggle state helper
useEntity() // Generic CRUD operations
```

## Project Structure

```
car-link-next/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── access-denied/             # Access denied page
│   │   ├── auth/                      # Authentication routes
│   │   │   ├── login/                 # Login page
│   │   │   ├── register/              # Registration page
│   │   │   └── layout.tsx             # Auth layout
│   │   ├── dashboard/                 # Main dashboard
│   │   │   ├── admin/                 # Admin panel
│   │   │   ├── profile/               # User profile
│   │   │   ├── rentals/               # Rental management
│   │   │   ├── reports/               # Reports and statistics
│   │   │   │   ├── rentals/           # Rental reports
│   │   │   │   ├── income/            # Income reports
│   │   │   │   └── popular-vehicles/  # Popular vehicles
│   │   │   ├── requests/              # Rental requests
│   │   │   ├── vehicles/              # Vehicle management
│   │   │   └── layout.tsx             # Dashboard layout
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout with AuthGuard
│   │   ├── loading.tsx                # Global loading page
│   │   ├── not-found.tsx              # 404 page
│   │   └── page.tsx                   # Landing page
│   ├── components/                    # Reusable components
│   │   ├── guards/                    # Authentication guards
│   │   └── ui/                        # UI components
│   ├── hooks/                         # Custom hooks
│   ├── lib/                           # Utilities and configurations
│   │   ├── api/                       # API client and functions
│   │   ├── routes/                    # Route configuration
│   │   ├── types/                     # TypeScript types
│   │   ├── utils/                     # Utility functions
│   │   └── validations/               # Validation schemas (Zod)
│   └── store/                         # State management (Zustand)
│       ├── auth-store.ts              # Authentication store
│       ├── user-rentals-store.ts      # User rentals store
│       ├── vehicle-details-store.ts   # Vehicle details store
│       ├── rental-store.ts            # General rental store
├── tests/                             # E2E Tests (Playwright)
│   ├── auth/                          # Authentication tests
│   ├── pages/                         # Page tests
│   └── README.md                      # Test documentation
├── middleware.ts                      # Next.js middleware
├── jest.config.js                     # Jest configuration
├── playwright.config.ts               # Playwright configuration
└── package.json                       # Dependencies and scripts
```

## Technologies Used

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Static typing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Zustand** - Global state management

### Forms and Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Validator integration

### External Services

- **Cloudinary** - Image management
- **next-cloudinary** - Next.js integration

### Utilities

- **Axios** - HTTP client
- **React Icons** - Icon library
- **clsx** & **tailwind-merge** - CSS utilities
- **html2canvas** & **jsPDF** - PDF generation

### Testing

- **Jest** - Unit testing
- **@testing-library/react** - Component testing
- **Playwright** - E2E testing

## Setup and Execution

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Backend API** running on port 3000

### Environment Variables

Create a `.env.local` file based on the template:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd car-link-next

# Install dependencies
npm install

# Configure environment variables
cp .template.env .env.local
# Edit .env.local with your values
```

### Development Execution

```bash
# Run in development mode (port 3001)
npm run dev

# Build for production
npm run build

# Run in production
npm start

# Linting
npm run lint
```

**Important:** The application runs on port **3001** by default, as the backend uses port 3000.

## Testing

### Unit Tests (Jest)

The project includes comprehensive unit tests for Zustand stores:

```bash
# Run all unit tests
npm test

# Run in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test files:**

- Authentication store tests
- User rentals store tests
- Vehicle details store tests
- Rental store tests

### E2E Tests (Playwright)

**E2E Requirements:**

1. Backend running on port 3000 with seeded data
2. Frontend starts automatically on port 3001

```bash
# Setup
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with visual interface
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run with visible browser
npm run test:e2e:headed

# Run specific tests
npm run test:e2e:auth      # Authentication
npm run test:e2e:login     # Login only
npm run test:e2e:register  # Registration only
npm run test:e2e:errors    # Error pages
npm run test:e2e:profile   # User profiles
npm run test:e2e:rental    # Rental process
```

**Included test cases:**

#### Authentication

- Successful and failed login
- User registration
- Form validation

#### System Pages

- Custom 404 page
- Role-based restricted access
- Intelligent redirections

#### Profile Management

- OWNER profile visualization
- TENANT → OWNER promotion
- Role-differentiated interfaces

#### Rental Process

- Vehicle navigation and selection
- Filters and search
- Detailed request information

Check the test documentation for detailed E2E test information.

## Security

### Security Implementations

- **Security headers** applied by middleware
- **JWT token validation** on every request
- **CSRF protection** through custom headers
- **Input validation** with Zod schemas
- **Data sanitization** before processing
- **Secure file management** with Cloudinary

### Security Middleware

```typescript
// Security middleware implementation
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}
```

## Main Dependencies

### Production

- `next`: Main framework
- `react` & `react-dom`: UI library
- `zustand`: State management
- `axios`: HTTP client
- `react-hook-form`: Form management
- `zod`: Schema validation
- `next-cloudinary`: Image management
- `tailwind-merge` & `clsx`: CSS utilities
- `react-icons`: Icon library
- `html2canvas` & `jspdf`: PDF generation

### Development

- `typescript`: Static typing
- `tailwindcss`: CSS framework
- `eslint`: Code linting
- `jest`: Unit testing framework
- `@testing-library/react`: Component testing
- `@playwright/test`: E2E testing
