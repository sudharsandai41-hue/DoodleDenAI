import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCrSCS3Cqdj3fccLUocEaVGgw2_xfAtwX8";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Usually listModels is on the genAI instance or similar manager, 
        // but the SDK structure might vary. 
        // Attempting to simply print what models are available via standard fetch if SDK doesn't expose listModels easily 
        // or just rely on the error to guide us? 
        // Actually, the SDK doesn't always expose listModels directly in the browser-focused imports.
        // Let's use the fetch approach in node for certainty.
    } catch (e) { }
}

// Cleaner fetch approach
async function fetchModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log("AVAILABLE MODELS:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

fetchModels();
