// **** npm Packages **** //
import express from "express";
import dotenv from "dotenv";
import HttpStatusCodes from "./constants/HttpStatusCodes";
import { Request, Response, NextFunction } from "express";

// Load env variables
dotenv.config();

// **** Initiate express app **** //
const app = express();

// Basic middleware
app.use(express.json());

// **** Test Route **** //
app.get("/api", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send("Welcome Cognihub");
    } catch (error) {
        console.error("Error Getting Signal", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: "error", message: "Internal Server Error" });
        next(error);
    }
});

// **** Start & Listen to Server **** //
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Listening on Port ${port}...🚀`);
});

// Export for testing
export default app;