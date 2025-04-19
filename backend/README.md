# LegalisFlow Backend

This is the backend API for LegalisFlow, a multi-tenant SaaS platform for law firms built with NestJS.

## Technology Stack

- [NestJS](https://nestjs.com/) - Progressive Node.js framework for building server-side applications
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [JWT](https://jwt.io/) - JSON Web Token for authentication
- [Swagger](https://swagger.io/) - API documentation
- [Jest](https://jestjs.io/) - Testing framework
- [Class Validator](https://github.com/typestack/class-validator) - Validation library
- [Passport](https://www.passportjs.org/) - Authentication middleware

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher

### Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory based on `.env.example`:

```
# Application
PORT=3001
NODE_ENV=development
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=legalisflow

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_TIME=1d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRATION_TIME=7d

# Email
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=user@example.com
MAIL_PASSWORD=password
MAIL_FROM=noreply@legalisflow.com
```

3. Set up the database:

```bash
npm run typeorm:run
```

### Development

Start the development server:

```bash
npm run start:dev
```

The API will be available at http://localhost:3001/api.

## Project Structure

```
backend/
├── src/
│   ├── app.module.ts           # Main application module
│   ├── main.ts                 # Entry point
│   ├── common/                 # Common utilities, decorators, and filters
│   │   ├── decorators/         # Custom decorators
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Authentication guards
│   │   ├── interceptors/       # Request/response interceptors
│   │   └── middleware/         # Custom middleware
│   ├── config/                 # Application configuration
│   ├── modules/                # Feature modules
│   │   ├── auth/               # Authentication module
│   │   ├── users/              # Users module
│   │   ├── tenants/            # Tenants module
│   │   ├── roles/              # Roles module
│   │   ├── permissions/        # Permissions module
│   │   ├── cases/              # Cases module
│   │   ├── clients/            # Clients module
│   │   └── documents/          # Documents module
│   └── database/               # Database configuration and migrations
│       ├── migrations/         # TypeORM migrations
│       └── seeds/              # Seed data
└── test/                       # Test files
```

## API Endpoints

The API follows RESTful conventions. Main endpoints include:

- **Auth**: `/api/auth` - Authentication endpoints
- **Users**: `/api/users` - User management
- **Tenants**: `/api/tenants` - Tenant management
- **Roles**: `/api/roles` - Role management
- **Permissions**: `/api/permissions` - Permission management
- **Cases**: `/api/cases` - Case management
- **Clients**: `/api/clients` - Client management
- **Documents**: `/api/documents` - Document management

Full API documentation is available via Swagger at:
```
http://localhost:3001/api/docs
```

## Multi-tenancy Implementation

The application uses a database-per-tenant model:
- The `x-tenant-subdomain` header is required for most API endpoints
- A middleware extracts and validates the tenant from this header
- Database connections are managed dynamically based on the tenant
- Support for common database operations across all tenants

## Available Scripts

- `npm run build` - Build the application
- `npm run format` - Format code with Prettier
- `npm run start` - Start the application in production mode
- `npm run start:dev` - Start the application in development mode
- `npm run start:debug` - Start the application in debug mode
- `npm run lint` - Lint the code with ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run typeorm` - Run TypeORM commands
- `npm run typeorm:run` - Run database migrations
- `npm run typeorm:generate` - Generate a new migration
- `npm run seed` - Seed the database with initial data

## Debugging

### Using NestJS Debug Mode

```bash
npm run start:debug
```

### Using VS Code

1. Create a launch.json file in the backend directory:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "args": ["${workspaceFolder}/src/main.ts"],
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register", "-r", "tsconfig-paths/register"],
      "sourceMaps": true,
      "envFile": "${workspaceFolder}/.env",
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

2. Press F5 in VS Code to start debugging

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## Database Management

### Migrations

Create a new migration:

```bash
npm run typeorm:generate -- -n MigrationName
```

Run migrations:

```bash
npm run typeorm:run
```

### Seeds

Seed the database with initial data:

```bash
npm run seed
```

## Deployment

1. Build the application:

```bash
npm run build
```

2. Set environment variables for production
3. Start the application:

```bash
npm run start:prod
```

## Docker Support

A `Dockerfile` is provided for containerization:

```bash
docker build -t legalisflow-backend .
docker run -p 3001:3001 legalisflow-backend
```

## License

MIT
