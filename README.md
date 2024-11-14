# Project Management Service

This project is a TypeScript-based Express application that interacts with both a User Service and a Project Service. It provides endpoints for managing users, projects, and project files.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- Running instances of:
  - **User Service** (default at `http://localhost:8081`)
  - **Project Service** (default at `http://localhost:8080`)

## Getting Started

### 1. Set Up Environment Variables

Create a `.env` file in the `webserver` directory and add the following configuration:

```env
USER_SERVICE_URL="http://localhost:8081"
PROJECT_SERVICE_URL="http://localhost:8080"
CORS_ORIGIN="http://localhost:3000"
PORT=8000
```

Ensure the URLs match where your User and Project Services are running.

### 2. Start Dependencies

Make sure that both the **User Service** and **Project Service** are running. This service depends on these services for handling user authentication and project data.

### 3. Install Dependencies

Navigate to the `webserver` directory and install dependencies:

```bash
npm install
```

### 4. Build the Project

To compile TypeScript files, run:

```bash
npm run build
```

The compiled JavaScript files will be located in the `dist/` folder.

### 5. Run the Application

- **Production:** Run the compiled code with Node.js:
  ```bash
  npm start
  ```

- **Development:** Use `ts-node-dev` for hot-reloading in development:
  ```bash
  npm run dev
  ```

### 6. Access the API

Once running, the app will be accessible at `http://localhost:8000` (or the port specified in your `.env` file).

## Project Structure

- `./app.ts`: Main application file
- `./middleware/pagination.ts`: Middleware for pagination
- `./middleware/auth.ts`: Middleware for user authentication
- `./lib/hateoas.ts`: Helper functions for implementing HATEOAS principles
- `./routes/projects.ts`: Routes for project management
- `./routes/project_files.ts`: Routes for managing project files
- `./routes/users.ts`: Routes for managing users
- `./services/user_service.ts`: Service for handling interactions with the User Service
- `./services/project_service.ts`: Service for handling interactions with the Project Service
- `./swagger.ts`: Swagger setup for API documentation

## Additional Scripts

- **Build**: `npm run build` - Compiles TypeScript to JavaScript.
- **Start**: `npm start` - Runs the compiled app in production.
- **Dev**: `npm run dev` - Starts the app in development mode with hot-reloading.

## License

See `LICENSE` file for license details.
