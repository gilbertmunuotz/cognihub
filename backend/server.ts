// **** npm Packages **** //
import express from "express";
import dotenv from "dotenv";
import HttpStatusCodes from "./constants/HttpStatusCodes";
import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import mongoose from "mongoose";
import { handleSocketConnection } from "./api/socketHandler";
import process from "process";
import authRoutes from "./routes/auth";
import { CLIENT_URI } from "./constants/constant";

 
// **** Load env variables **** //
dotenv.config();


// **** Connect to MongoDB **** //
async function connectToMongo() {
    try {
        const URI = process.env.MONGODB_URI;
        if (!URI) throw new Error("MONGODB_URI is not defined in environment variables");
        await mongoose.connect(URI, {
            connectTimeoutMS: 10000,        // Connection timeout after 10 seconds
            socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
            maxPoolSize: 10,                // Limit connection pool size
            retryWrites: true,              // Retry failed writes
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Propagate error to stop server startup
    }
}


// **** Initiate express app **** //
const app = express();

// **** Create HTTP Server **** //
const httpServer = createServer(app); // Required for Socket.IO

// **** Initialize Socket.IO connection **** //
const io = new Server(httpServer, {
    cors: {
        origin: `${CLIENT_URI}`, // Specify allowed origin
        methods: ["GET", "POST"]
    }
});

// ** Handle Socket.IO Events ** //
handleSocketConnection(io);

// Basic middleware
app.use(express.json());

// **** Test Route **** //
app.get("/api", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send("Welcome Cognihub!");
    } catch (error) {
        console.error("Error Getting Signal", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: "error", message: "Internal Server Error" });
        next(error);
    }
});

// **** Define Routes Here **** //
app.use("/api/v1/auth", authRoutes);

// **** Start & Listen to Server **** //
async function startServer() {
    try {
        await connectToMongo();
        const port = process.env.PORT;
        httpServer.listen(port, () => {
            console.log(`Server Listening on Port ${port}...🚀`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Exit with failure code
    }
}


// **** Start the application **** //
startServer();


// Export for testing
export { app, io };