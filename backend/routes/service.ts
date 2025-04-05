import express from "express";
import { HandleFiles } from "../controllers/service";
import { upload } from "../middlewares/multerMiddleware";

const router = express.Router();

// Passport Google authentication
router.post("/file/upload", upload.single("file"), HandleFiles);


export default router;