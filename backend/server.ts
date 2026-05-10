// **** npm Packages **** //
import cors from "cors";
import express from "express";
import HttpStatusCodes from "./constants/HttpStatusCodes";
import { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import process from "process";
import { handleSocketConnection } from "./api/socketHandler";
import { CLIENT_URI, PORT } from "./constants/constant";
import serviceRoute from "./routes/service";


// **** Initiate express app **** //
const app = express();

// **** Create HTTP Server **** //
const httpServer = createServer(app);

// **** Initialize Socket.IO connection **** //
const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URI,
        methods: ["GET", "POST"],
    },
});

// ** Handle Socket.IO Events ** //
handleSocketConnection(io);

app.use(
    cors({
        origin: CLIENT_URI,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
    }),
);

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
app.use("/api/v1/service", serviceRoute);


// **** Start & Listen **** //
function startServer(): void {
    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
}

startServer();

// Export for testing
export { app, io };
