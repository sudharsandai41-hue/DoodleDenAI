
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = "AIzaSyCrSCS3Cqdj3fccLUocEaVGgw2_xfAtwX8";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        // There isn't a direct listModels on the client SDK usually, but we can try a basic generation to check if it works, or catch the error detailedly.
        // Actually, the server-side SDK has listModels, client SDK might not.
        // Let's try to just generate a simple "hello" with a few candidates to see what works.

        const modelsToTest = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-1.5-pro-001",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        for (const m of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("Test");
                console.log(`SUCCESS: ${m} is valid.`);
            } catch (e) {
                console.log(`FAILED: ${m} - ${e.message}`);
            }
        }

    } catch (error) {
        console.error("Script failed", error);
    }
}

listModels();
