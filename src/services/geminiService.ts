import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, PlantIDResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const geminiService = {
  async identifyPlant(base64Image: string): Promise<PlantIDResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: "image/jpeg",
              },
            },
            {
              text: `Identify the plant in this photo and provide detailed care instructions. 
              Be as specific as possible. If multiple plants are visible, identify the most prominent one.
              Return the response in JSON format according to the provided schema.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plantName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            careInstructions: {
              type: Type.OBJECT,
              properties: {
                commonName: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                description: { type: Type.STRING },
                watering: { type: Type.STRING },
                sunlight: { type: Type.STRING },
                soil: { type: Type.STRING },
                temperature: { type: Type.STRING },
                fertilizing: { type: Type.STRING },
                commonIssues: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["commonName", "scientificName", "description", "watering", "sunlight", "soil", "temperature", "fertilizing", "commonIssues"]
            }
          },
          required: ["plantName", "confidence", "careInstructions"]
        }
      }
    });

    try {
      return JSON.parse(response.text) as PlantIDResult;
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("Could not identify plant. Please try another photo.");
    }
  },

  async chat(messages: ChatMessage[], systemInstruction: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text;
  }
};
