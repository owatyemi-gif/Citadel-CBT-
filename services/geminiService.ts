
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Level } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches a list of standardized curriculum topics for a specific subject and level.
 */
export async function fetchCurriculumTopics(
  level: Level,
  subject: string
): Promise<string[]> {
  const model = "gemini-3-pro-preview";
  const curriculum = level === Level.SSS ? "WAEC and JAMB" : "BECE (Junior WAEC)";
  
  const prompt = `
    Act as a curriculum expert for West African secondary education. 
    List exactly 20 major, technical topics for the subject "${subject}" under the "${curriculum}" curriculum.
    Return the response as a simple JSON array of strings.
    Example: ["Calculus", "Organic Chemistry", "Wole Soyinka's Prose"]
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse topics", e);
    return ["General Review", "Introduction to " + subject, "Advanced Concepts"];
  }
}

/**
 * Generates technical quiz questions based on a specific curriculum topic.
 */
export async function generateQuizQuestions(
  level: Level,
  subject: string,
  topic: string,
  count: number = 100
): Promise<Question[]> {
  const model = "gemini-3-pro-preview";
  const curriculumContext = level === Level.SSS ? "WAEC and JAMB Curriculum" : "BECE (Junior WAEC) Curriculum";
  
  const prompt = `
    Generate exactly ${count} technical multiple-choice questions for ${level} level students on the subject "${subject}" specifically focusing on the topic "${topic}".
    
    CURRICULUM SOURCE: Use the official ${curriculumContext} requirements for this topic.
    
    DIFFICULTY LEVEL: Advanced/Technical/Hard. These questions must be rigorous, testing deep application and critical thinking.
    
    REQUIREMENTS: 
    1. For computational subjects (Maths, Physics, Chem, Basic Tech), the 'explanation' MUST show rigorous step-by-step mathematical workings.
    2. For theoretical subjects (English, Govt, CRK, etc.), provide deep analytical reasoning.
    3. Ensure 4 options (A, B, C, D) per question.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The technical question text." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Exactly 4 multiple choice options."
            },
            correctAnswerIndex: { 
              type: Type.INTEGER, 
              description: "The 0-based index of the correct answer." 
            },
            explanation: { 
              type: Type.STRING, 
              description: "Rigorous step-by-step workings or deep analysis." 
            }
          },
          required: ["text", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  const rawJson = response.text.trim();
  const parsed: any[] = JSON.parse(rawJson);

  return parsed.map((item, index) => ({
    id: `q-${Date.now()}-${index}`,
    ...item
  }));
}
