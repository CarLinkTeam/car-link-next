# CarLink - Car Rental Application

## 📁 Project Structure

```bash
car-link-next/
├── src/
│   ├── app/                           # Main application directory (App Router)
│   │   ├── auth/                      # Authentication routes group
│   │   │   ├── login/                 # Login page
│   │   │   ├── register/              # Registration page
│   │   │   └── layout.tsx             # Shared layout for auth routes
│   │   ├── dashboard/                 # Protected routes group
│   │   │   ├── layout.tsx             # Dashboard layout (sidebar, navbar)
│   │   │   ├── page.tsx               # Main dashboard page
│   │   │   ├── profile/               # User profile
│   │   │   ├── vehicles/              # Vehicle management
│   │   │   │   ├── page.tsx           # Vehicle list
│   │   │   │   ├── [id]/              # Vehicle detail page
│   │   │   │   ├── add/               # Add vehicle page
│   │   │   │   └── edit/[id]/         # Edit vehicle page
│   │   │   └── rentals/               # Rental management
│   │   ├── access-denied/             # Access denied page
│   │   │   └── page.tsx               # Access denied with contextual messages
│   │   ├── page.tsx                   # Home page
│   │   ├── layout.tsx                 # Root layout with AuthGuard
│   │   ├── loading.tsx                # Global loading page
│   │   ├── not-found.tsx              # 404 page
│   │   └── globals.css                # Global styles
│   ├── components/                    # Reusable components
│   │   ├── ui/                        # Basic UI components
│   │   ├── forms/                     # Form components
│   │   ├── guards/                    # Authentication guards
│   │   │   └── AuthGuard.tsx          # Main authentication guard
│   │   ├── layout/                    # Layout components
│   │   └── vehicles/                  # Vehicle-specific components
│   ├── lib/                           # Utilities and configurations
│   │   ├── api/                       # API client and fetch functions
│   │   ├── utils/                     # Utility functions
│   │   ├── routes/                    # Route configurations
│   │   │   └── routes.ts              # Centralized route management
│   │   └── hooks/                     # Custom hooks
│   └── store/                         # Global state management
│       └── auth-store.ts              # Authentication store (Zustand)
├── middleware.ts                      # Next.js middleware for security
├── next.config.js                     # Next.js configuration
├── tailwind.config.js                 # Tailwind CSS configuration
└── package.json                       # Dependencies
```

## 🔐 Authentication Architecture

CarLink implements a robust authentication system with **clearly separated responsibilities** between **Middleware** (server-side) and **AuthGuard** (client-side), including intelligent access denial handling.

### 🛡️ Middleware vs AuthGuard - Key Differences

| Aspect              | **Middleware** (Server-side)           | **AuthGuard** (Client-side)               |
| ------------------- | -------------------------------------- | ----------------------------------------- |
| **🚀 Execution**    | Before any page renders                | After initial rendering                   |
| **🔍 Data Access**  | Only cookies and HTTP headers          | localStorage, sessionStorage, React state |
| **⚡ Performance**  | Ultra fast, no JavaScript required     | Requires React hydration                  |
| **🎯 Purpose**      | Security headers, route classification | Complete session verification             |
| **🔄 Redirections** | Basic optimization only                | Complete context redirections             |

---

### 🛠️ Middleware (`middleware.ts`)

**Specific Responsibilities:**

- ✅ **Security headers** on all routes
- ✅ **Route type classification** (protected, public, auth, system)
- ✅ **Basic optimization** without full state access
- ❌ **CANNOT** access localStorage/sessionStorage
- ❌ **DOES NOT** perform deep token verification

```typescript
// Example of what the middleware DOES
response.headers.set('X-Frame-Options', 'DENY')
response.headers.set('X-Route-Type', routeType)

// Example of what it CANNOT do
// const token = localStorage.getItem('token') // ❌ Doesn't work server-side
```

**Middleware Flow:**

```
1. User accesses /dashboard
2. Middleware detects: type = 'protected'
3. Adds security headers
4. Marks route as X-Auth-Required = 'true'
5. Allows to continue → AuthGuard takes control
```

---

### 🔒 AuthGuard (`src/components/guards/AuthGuard.tsx`)

**Specific Responsibilities:**

- ✅ **State hydration** from localStorage
- ✅ **Complete verification** of token + user + authentication state
- ✅ **Smart redirections** with context parameters
- ✅ **Loading UI** during verification
- ✅ **Intelligent access denial** handling
- ✅ **Logging** for debugging

```typescript
// Example of what the AuthGuard DOES
const hasValidSession = !!(token && user && isAuthenticated)
if (routeType === 'protected' && !hasValidSession) {
  // Smart redirection based on specific scenario
  if (!token) {
    router.replace(`/auth/login?reason=no-token&callbackUrl=${pathname}`)
  } else {
    router.replace(`/access-denied?reason=invalid-token`)
  }
}
```

**Enhanced AuthGuard Flow:**

```
1. Component mounts (after middleware)
2. Shows loading during hydration
3. Verifies if state is hydrated from localStorage
4. Shows verification loading during auth check
5. Performs complete session verification (token + user + isAuthenticated)
6. Smart redirection or content rendering based on result
```

## ⚙️ Environment Setup

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Development Scripts

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Linting
npm run lint
```
