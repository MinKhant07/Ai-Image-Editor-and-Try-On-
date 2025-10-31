import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { ImageFile } from '../utils/fileUtils';

const getGeneratedImage = (response: GenerateContentResponse): string | null => {
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }
    return null;
}

const getAiClient = (apiKey: string) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is required.");
    }
    return new GoogleGenAI({ apiKey });
}

export const editImageWithPrompt = async (
  image: ImageFile,
  prompt: string,
  apiKey: string,
  aspectRatio: string
): Promise<string> => {
    const ai = getAiClient(apiKey);
    
    // A more descriptive prompt to guide the AI for better results.
    let detailedPrompt = `As an expert photo editor, please edit the following image based on this instruction: "${prompt}". It's crucial to maintain the original image's overall style, quality, and composition, applying only the specific change requested.`;

    if (aspectRatio && aspectRatio !== 'original') {
        detailedPrompt += ` The final output image must have a ${aspectRatio} aspect ratio.`;
    }

    detailedPrompt += " The output should be the final edited image.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: detailedPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const generatedImageBase64 = getGeneratedImage(response);
    if (!generatedImageBase64) {
        throw new Error("Failed to generate image from response. The model may have refused the request.");
    }
    return `data:image/png;base64,${generatedImageBase64}`;
};

export const performVirtualTryOn = async (
  characterImage: ImageFile,
  clothingImage: ImageFile,
  apiKey: string
): Promise<string> => {
    const ai = getAiClient(apiKey);
    const prompt = "Generate an image of the character from the first image wearing the clothes from the second image. The final image should only show the character wearing the clothes, maintaining the character's original pose and background as much as possible. Focus on a realistic depiction of the clothing on the character.";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: characterImage.base64,
                mimeType: characterImage.mimeType,
              },
            },
            {
              inlineData: {
                data: clothingImage.base64,
                mimeType: clothingImage.mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

    const generatedImageBase64 = getGeneratedImage(response);
    if (!generatedImageBase64) {
        throw new Error("Failed to generate image from response. The model may have refused the request.");
    }
    return `data:image/png;base64,${generatedImageBase64}`;
};