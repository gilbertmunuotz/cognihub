// **** npm Packages **** //
import express from "express";
import dotenv from "dotenv";
import HttpStatusCodes from "./constants/HttpStatusCodes";
import { Request, Response, NextFunction } from "express";
import ServiceRoute from "./routes/service";
import { Server } from "socket.io";
import { createServer } from "http";

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
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("message", (data) => {
        console.log(`Received Message: ${data}`);
        socket.emit("response", `You sent: ${data}`);
    })

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
})

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

//Define Routes Here
app.use('/api/v1/service', ServiceRoute); // Service Related Route

// **** Start & Listen to Server **** //
const port = process.env.PORT;
httpServer.listen(port, () => {
    console.log(`Server Listening on Port ${port}...🚀`);
});

// Export for testing
export { app, io };