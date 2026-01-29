
import { GoogleGenAI } from "@google/genai";

export const generateBirthdayMessage = async (name: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write an incredibly romantic, sweet, and poetic birthday wish for a girl named ${name}. 
                 Keep it soulful, elegant, and heartfelt. Mention how special she is. 
                 Keep it around 80-100 words. Format as a letter.`,
      config: {
        temperature: 0.9,
      },
    });
    return response.text || "Happy Birthday, Sifat! You mean the world to me.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `To my dearest ${name}, on your special day, I want you to know how much you are loved. Every moment with you is a gift. Happy Birthday!`;
  }
};
