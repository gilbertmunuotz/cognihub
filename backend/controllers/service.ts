import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { RequestBody } from "../interfaces/interface";
import { OLLAMA_URL } from "../constants/constant";
import axios from 'axios';


// (DESC) Get info
async function AnalyzeInfo(req: Request, res: Response, next: NextFunction): Promise<void> {

    // Destructure Request Body and explicitly type it
    const { model, prompt }: RequestBody = req.body;

    // Validate required fields
    if (!model || !prompt) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            status: "Error",
            message: "Model and prompt are required.!"
        });
    }

    try {
        // Send request to Ollama API
        const ollamaResponse = await axios.post(OLLAMA_URL, {
            model: model,
            prompt: prompt
        });


        // Process the streaming response
        const responseData = ollamaResponse.data;
        const lines = responseData.split("\n");
        let finalResponse = "";

        // Iterate over each line
        for (const line of lines) {
            // Skip empty lines
            if (line.trim() === "") continue;
            try {
                // Parse the JSON string into an object
                const json = JSON.parse(line)
                if (json.response) {
                    // Append the response field
                    finalResponse += json.response;
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }

        // Send back AI-generated response
        res.status(HttpStatusCodes.OK).json({
            status: "Success",
            data: finalResponse
        })

    } catch (error) {
        console.error("Error Occured");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Error",
            message: "Failed to process request"
        });
    }
}


export { AnalyzeInfo };