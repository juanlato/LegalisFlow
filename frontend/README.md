# LegalisFlow Frontend

This is the frontend application for LegalisFlow, a multi-tenant SaaS platform for law firms built with Next.js 15.

## Technology Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Hook Form](https://react-hook-form.com/) - Form handling and validation
- [React Query](https://tanstack.com/query/latest) - Data fetching, caching, and state management
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Axios](https://axios-http.com/) - HTTP client

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Project Structure

```
frontend/
├── public/             # Static files
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── (auth)/    # Authentication routes
│   │   ├── (dashboard)/ # Protected dashboard routes
│   │   ├── api/       # API routes
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx   # Home page
│   ├── components/    # Reusable React components
│   │   ├── ui/        # UI components
│   │   ├── forms/     # Form components
│   │   └── layout/    # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and services
│   │   ├── api/       # API client and services
│   │   └── utils/     # Helper functions
│   ├── providers/     # React context providers
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
└── tailwind.config.js # Tailwind CSS configuration
```

## Features

- **Multi-tenant Architecture**: Supports multiple law firms with tenant-specific subdomains
- **Authentication**: User registration, login, and password recovery
- **Role-based Access Control**: Permission-based UI rendering
- **Dashboard**: Customizable dashboard for different user roles
- **Case Management**: Tools for managing legal cases
- **Client Management**: Client database and interaction history
- **Document Management**: Upload, store, and manage legal documents
- **Responsive Design**: Works across desktop, tablet, and mobile devices

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run Jest tests

## Debugging

### Using Chrome DevTools

1. Start the application in development mode:

   ```bash
   npm run dev
   ```

2. Open Chrome and navigate to `http://localhost:3000`
3. Open DevTools (F12 or Right-click > Inspect)
4. Use the React DevTools extension for component inspection

### Using VS Code

1. Create a launch.json file in the frontend directory:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack://_N_E/*": "${webRoot}/*"
      }
    }
  ]
}
```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Press F5 in VS Code to start debugging

## Building for Production

```bash
npm run build
npm run start
```

## Environment Variables

| Variable                    | Description                           | Default                     |
| --------------------------- | ------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`       | Backend API URL                       | `http://localhost:3001/api` |
| `NEXT_PUBLIC_APP_URL`       | Frontend application URL              | `http://localhost:3000`     |
| `NEXT_PUBLIC_TENANT_COOKIE` | Cookie name for tenant identification | `tenant`                    |

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT

Similar code found with 1 license type
