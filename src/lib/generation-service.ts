
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { USER_PROMPT_TEMPLATE, AI_INSTRUCTIONS, EDIT_USER_PROMPT_TEMPLATE, EDIT_AI_INSTRUCTIONS } from './constants';

const GEMINI_API_KEY = "AIzaSyCrSCS3Cqdj3fccLUocEaVGgw2_xfAtwX8";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

function base64ToPart(base64Data: string, mimeType: string = 'image/png') {
    return {
        inlineData: {
            data: base64Data,
            mimeType
        }
    };
}

function extractionImageOrText(result: any): { image: string | null, text: string } {
    const candidate = result.response.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
        return { image: null, text: '' };
    }

    let image = null;
    let text = '';

    for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
            text += part.text;
        }
    }

    return { image, text };
}

export async function generateStyledImage(
    prompt: string,
    baseRoomBase64: string,
    moodBoardBase64?: string
): Promise<{ image: string | null, text: string }> {

    try {
        // Fallback to 'gemini-1.5-flash' (User's "Nano Banana") for reliability
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings
        });

        const imageParts = [base64ToPart(baseRoomBase64)];
        if (moodBoardBase64) {
            imageParts.push(base64ToPart(moodBoardBase64));
        }

        const fullPrompt = USER_PROMPT_TEMPLATE.replace("{prompt}", prompt);

        const result = await model.generateContent([
            AI_INSTRUCTIONS,
            fullPrompt,
            ...imageParts
        ]);

        return extractionImageOrText(result);

    } catch (error) {
        console.error("generateStyledImage failed:", error);
        throw error;
    }
}

export async function performGenerativeEdit(
    prompt: string,
    baseImageBase64: string,
    maskBase64?: string
): Promise<{ image: string | null, text: string }> {

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings
        });

        const imageParts = [base64ToPart(baseImageBase64)];
        if (maskBase64) {
            imageParts.push(base64ToPart(maskBase64));
        }

        const fullPrompt = EDIT_USER_PROMPT_TEMPLATE.replace("{prompt}", prompt);

        const result = await model.generateContent([
            EDIT_AI_INSTRUCTIONS,
            fullPrompt,
            ...imageParts
        ]);

        return extractionImageOrText(result);

    } catch (error) {
        console.error("performGenerativeEdit failed:", error);
        throw error;
    }
}
