
import { GoogleGenAI } from "@google/genai";
import { Ticket } from '../types';

// Assume import.meta.env is configured in the environment (Vite)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY || "" });

export const analyzeTicketWithGemini = async (ticket: Ticket): Promise<string> => {
  if (!API_KEY) {
    return "Error: La clave de API de Gemini no está configurada. La funcionalidad de IA está deshabilitada.";
  }

  try {
    const model = 'gemini-2.0-flash';

    const prompt = `
      Eres un experto en mejora continua y análisis de procesos de negocio. Analiza el siguiente ticket de requerimiento y proporciona una respuesta estructurada en formato Markdown. La respuesta debe incluir:
      1.  **Resumen del Problema:** Una breve descripción del problema y su contexto.
      2.  **Análisis de Causa Raíz Potencial:** Basado en la descripción, sugiere posibles causas raíz. Puedes usar las categorías de Ishikawa (Método, Mano de obra, Máquina, Material, Medio ambiente, Medición) como guía si aplica.
      3.  **Plan de Acción Sugerido:** Propón los siguientes 3 a 5 pasos concretos para abordar el problema, incluyendo el objetivo de cada paso (ej: "Realizar reunión de levantamiento para definir alcance", "Mapear proceso actual para identificar cuellos de botella").

      ---
      **DATOS DEL TICKET:**

      **Título:** ${ticket.title}
      **Descripción:** ${ticket.description}
      **Impacto Declarado:** ${ticket.impacto}
      **Categoría:** ${ticket.categoria}
      **Área:** ${ticket.area}
      ---
    `;

    const response = await genAI.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      return `Error al contactar el servicio de IA: ${error.message}`;
    }
    return "Ocurrió un error desconocido al contactar el servicio de IA.";
  }
};
