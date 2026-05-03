"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import crypto from "crypto";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  // Using gemini-pro as a globally available fallback
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" ,});

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const textContent = result.response.text();

    if (!textContent) {
      throw new Error("Invalid response format from Gemini API");
    }

    const jsonStr = textContent.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to call Gemini API: ${error.message}`);
  }
}

export async function generateCampaign(data: {
  productName: string;
  targetAudience: string;
  goal: string;
  budget?: string;
  sustainabilityLevel: string;
}) {
  const prompt = `You are a world-class sustainability marketing expert and copywriter.
Your task is to generate a highly effective, ethical, and eco-conscious marketing campaign.

CONTEXT:
- Product/Service: ${data.productName}
- Target Audience: ${data.targetAudience}
- Campaign Goal: ${data.goal}
- Sustainability Focus Level: ${data.sustainabilityLevel}

CONSTRAINTS & SUCCESS CRITERIA:
1. Ad Copy: Must be punchy, attention-grabbing, and highlight the product's value proposition without greenwashing. Maximum 3 sentences.
2. Social Post: Must be highly engaging, platform-agnostic, include relevant emojis, and contain a clear Call-To-Action (CTA).
3. Email: Must be professional, persuasive, and structured (Hook, Value Proposition, Sustainability Impact, CTA).
4. Slogan: Must be memorable, catchy, and align with the sustainability focus.
5. Ethics: Avoid exaggerated environmental claims. Focus on transparent, authentic sustainability impact.

OUTPUT FORMAT:
You must output valid JSON only. The JSON must strictly match the following schema exactly:
{
  "ad_copy": "string",
  "social_post": "string",
  "email": "string",
  "slogan": "string"
}`;

  return await callGemini(prompt);
}

export async function analyzeCampaign(campaign: any) {
  const prompt = `You are an expert Sustainability Marketing Auditor and Analyst.
Your task is to critically evaluate a marketing campaign across four key dimensions: Product, Pricing, Promotion, and Distribution.

CAMPAIGN DETAILS:
${JSON.stringify(campaign, null, 2)}

EVALUATION CRITERIA & CONSTRAINTS:
1. Score (0-100): Assign a realistic sustainability score based on overall eco-impact and ethical marketing standards. Be objective and strict.
2. Product: Analyze the environmental impact of the product mentioned.
3. Pricing: Evaluate pricing fairness, accessibility, and transparency.
4. Promotion: Assess the ethics of the promotional strategy. Penalize any signs of greenwashing.
5. Distribution: Analyze the carbon footprint and sustainability of the implied supply chain/delivery.
6. Suggestions: Provide exactly 2 to 4 highly specific, actionable recommendations to improve the campaign's sustainability.

OUTPUT FORMAT:
You must output valid JSON only. The JSON must strictly match the following schema exactly:
{
  "score": number,
  "product": "string",
  "pricing": "string",
  "promotion": "string",
  "distribution": "string",
  "suggestions": ["string", "string"]
}`;

  return await callGemini(prompt);
}

export async function improveCampaign(campaign: any) {
  const prompt = `You are a world-class sustainability marketing expert and copywriter.
Your task is to revise and improve an existing marketing campaign to maximize its sustainability focus while maintaining high marketing effectiveness and conversion rates.

CURRENT CAMPAIGN:
${JSON.stringify(campaign, null, 2)}

CONSTRAINTS & SUCCESS CRITERIA:
1. Enhance the eco-friendly messaging and highlight tangible environmental benefits.
2. Eliminate any potential greenwashing or vague sustainability claims. Make claims specific and transparent.
3. Maintain the original tone and target audience appeal.
4. Ensure the revised ad copy, social post, email, and slogan are more compelling and ethical than the original.

OUTPUT FORMAT:
You must output valid JSON only. The JSON must strictly match the following schema exactly:
{
  "ad_copy": "string",
  "social_post": "string",
  "email": "string",
  "slogan": "string"
}`;

  return await callGemini(prompt);
}

import connectDB from "@/lib/db";
import Campaign from "@/models/Campaign";

export async function saveCampaign(product: string, goal: string, campaign: any, analysis: any) {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("sessionId")?.value;
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      // Set cookie for 1 year
      cookieStore.set("sessionId", sessionId, { maxAge: 60 * 60 * 24 * 365, httpOnly: true });
    }

    const newCampaign = await Campaign.create({
      sessionId,
      product,
      goal,
      campaign,
      analysis,
    });
    return JSON.parse(JSON.stringify(newCampaign));
  } catch (error) {
    console.error("Failed to save campaign:", error);
    throw new Error("Failed to save campaign to database");
  }
}

export async function getCampaigns() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    
    if (!sessionId) {
      return []; // No session, no history
    }

    await connectDB();
    const campaigns = await Campaign.find({ sessionId }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(campaigns));
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
}

export async function getCampaign(id: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    
    if (!sessionId) {
      return null;
    }

    await connectDB();
    const campaign = await Campaign.findOne({ _id: id, sessionId }).lean();
    return JSON.parse(JSON.stringify(campaign));
  } catch (error) {
    console.error("Failed to fetch campaign:", error);
    return null;
  }
}

import { revalidatePath } from "next/cache";

export async function deleteCampaign(id: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    
    if (!sessionId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    await Campaign.deleteOne({ _id: id, sessionId });
    
    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete campaign:", error);
    return { success: false, error: "Failed to delete campaign" };
  }
}
