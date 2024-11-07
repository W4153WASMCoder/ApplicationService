// Import necessary modules with types
// Common Express libs
import * as dotenv from "dotenv";
import express from "express";
import type { Application } from "express";
import http, { Server as HttpServer } from "http";
import cors from "cors";
import fs from "fs";
// for projects microservice
import project_router from "./routes/projects.js";
import project_files_router from "./routes/project_files.js";
// for users microservice
import users_router from "./routes/users.js";

// For OpenAPI
import swagger from "./swagger.js";
import type { Express } from "express";

// Middleware
import { log_init, log_close } from "./middleware/logger.js";

// Load environment variables from .env file
dotenv.config();

// Express app instantiation
const app: Application = express();

// Instantiate handlers for http and https
const httpServer: HttpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);

//Middleware Definition
app.use(log_init);
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "tokenid"],
    }),
);
app.use(express.static("./static"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// for projects microservice
app.use("/projects", project_router);
app.use("/project_files", project_files_router);
// for users microservice
app.use("/users", users_router);
swagger(app as Express);
app.use(log_close);
//End Middleware definition

//Start Server
console.log(
    "Starting up server on ports: " +
        process.env.PORT +
        ", " +
        process.env.PORTSSL,
);
httpServer.listen(process.env.PORT, () =>
    console.log("Server started listening on port: " + process.env.PORT),
);
//httpsServer.listen(process.env.PORTSSL,() => console.log('Server started listening on port: '+process.env.PORTSSL));
