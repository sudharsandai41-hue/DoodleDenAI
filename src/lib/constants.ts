
export const USER_PROMPT_TEMPLATE = `
Command: Generate a photorealistic image.
Context:
1. Base Room: See Image 1 (Blueprint/Structure).
2. Style Reference: See Image 2 (Mood Board/Vibe).
3. User Request: "{prompt}"

Instruction:
Render the "Base Room" with the exact style of the "Style Reference".
- STRUCTURAL INTEGRITY: You must keep the walls, floor, ceiling, and windows exactly as they are in the Base Room. Do not changethe perspective.
- STYLE TRANSFER: Apply the colors, materials, furniture style, and lighting vibe from the Style Reference.
- OUTPUT: A high-quality, photorealistic image of the finished room.
`;

export const AI_INSTRUCTIONS = `
ROLE: Advanced AI Architect & Interior Designer.
TASK: Multimodal Image Synthesis (Structure + Style).
STRICT RULES:
1.  **Architecture**: The first image is the GROUND TRUTH for geometry. Do not hallucinate new walls or windows.
2.  **Style**: The second image is the GROUND TRUTH for aesthetics.
3.  **Output**: Generate the final image directly. Do not describe it.
`;

export const EDIT_USER_PROMPT_TEMPLATE = `
Command: Edit this image.
Context:
1. Base Image: See Image 1.
2. Mask: See Image 2 (Optional).
3. Request: "{prompt}"

Instruction:
Modify the image according to the request.
- If masked, only change the masked region.
- Keep lighting and perspective consistent.
- Output the modified image.
`;

export const EDIT_AI_INSTRUCTIONS = `
ROLE: Expert Image Editor.
TASK: In-painting / Generative Edit.
STRICT RULES:
1.  **Consistency**: Edited areas must match the surrounding pixels (noise, light, blur).
2.  **Fidelity**: Do not distort the unmasked parts.
3.  **Output**: Generate the final image directly.
`;
