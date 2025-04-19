LegalisFlow is a multi-tenant SaaS application for law firms built with a modern tech stack. The application features a NestJS backend API and a Next.js frontend.

## Technology Stack

### Backend
- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [JWT](https://jwt.io/) - Authentication
- [Swagger](https://swagger.io/) - API documentation

### Frontend
- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [React Query](https://tanstack.com/query/latest) - Data fetching and state management
- [Radix UI](https://www.radix-ui.com/) - UI components

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/LegalisFlow.git
cd LegalisFlow
```

2. Install dependencies (root, backend, and frontend):

```bash
npm run install:all
```

3. Configure database and environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the values with your PostgreSQL credentials

## Running the Application

Start both frontend and backend concurrently:

```bash
npm start
```

This will start:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### Running Separately

#### Backend
```bash
cd backend
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

## Debugging

### Visual Studio Code

1. Create a `.vscode/launch.json` file in the root directory with the following content:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/main.ts",
      "preLaunchTask": "tsc: watch - backend/tsconfig.json",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "console": "integratedTerminal"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ],
  "compounds": [
    {
      "name": "Full Stack: Backend + Frontend",
      "configurations": ["Debug Backend", "Debug Frontend"]
    }
  ]
}
```

2. Create a `.vscode/tasks.json` file:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "typescript",
      "tsconfig": "backend/tsconfig.json",
      "option": "watch",
      "problemMatcher": ["$tsc-watch"],
      "group": "build",
      "label": "tsc: watch - backend/tsconfig.json"
    }
  ]
}
```

3. Now you can debug both applications simultaneously by:
   - Starting the frontend with `cd frontend && npm run dev`
   - Using VSCode's debug tool to attach to the backend
   - Or use the "Full Stack: Backend + Frontend" compound configuration

## Project Structure

```
.gitignore
docker-compose.yml
package.json
backend/                  # NestJS API application
  .env                    # Environment variables
  src/
    main.ts              # Entry point
    app.module.ts        # Main application module
    modules/             # Feature modules
      users/             # Users module
      roles/             # Roles module
      tenants/           # Tenants module
      permissions/       # Permissions module
    shared/              # Shared code (middleware, etc.)
frontend/                # Next.js web application
  .env.local             # Environment variables
  src/
    app/                 # Next.js app router
    lib/                 # Shared utilities and API clients
    components/          # React components
```

## Multi-tenancy

This application implements a multi-tenant architecture:
- Each tenant has its own subdomain
- The backend validates tenant access using the `x-tenant-subdomain` header
- Users, roles, and permissions are all scoped to specific tenants

## API Documentation

API documentation is available via Swagger at:
```
http://localhost:3001/api/docs
```

## License

MIT