// **** npm Packages **** //
import express from "express";
import dotenv from "dotenv";
import HttpStatusCodes from "./constants/HttpStatusCodes";
import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { handleSocketConnection } from "./api/socketHandler";

// Load env variables
dotenv.config();

// **** Initiate express app **** //
const app = express();

// **** Create HTTP Server **** //
const httpServer = createServer(app); // Required for Socket.IO

// **** Initialize Socket.IO connection **** //
const io = new Server(httpServer, {
    cors: {
        origin: "*",
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


// **** Start & Listen to Server **** //
const port = process.env.PORT;
httpServer.listen(port, () => {
    console.log(`Server Listening on Port ${port}...🚀`);
});

// Export for testing
export { app, io };