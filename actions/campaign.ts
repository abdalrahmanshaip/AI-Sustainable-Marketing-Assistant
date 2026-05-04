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
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

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
  additionalInfo?: string;
}) {
  const prompt = `You are a sustainability marketing copywriter.
Generate a marketing campaign.

CONTEXT:
- Product/Service: ${data.productName}
- Target Audience: ${data.targetAudience}
- Goal: ${data.goal}
- Sustainability Focus: ${data.sustainabilityLevel}
${data.additionalInfo ? `- Additional Info: ${data.additionalInfo}` : ""}

CONSTRAINTS (KEEP IT SHORT):
1. Ad Copy: Max 2 sentences. Highlight value and sustainability.
2. Social Post: Short, engaging, 1 emoji, clear CTA.
3. Email: Max 3 short paragraphs (Hook, Value, CTA).
4. Slogan: Catchy, max 7 words.
5. Ethics: No greenwashing. Be honest.

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
  const prompt = `You are a Sustainability Marketing Analyst.
Evaluate this campaign:
${JSON.stringify(campaign, null, 2)}

CONSTRAINTS (KEEP IT VERY SHORT):
1. Score (0-100): Objective sustainability score.
2. Product/Pricing/Promotion/Distribution: Max 1 short sentence each analyzing eco-impact/ethics.
3. Suggestions: Exactly 2 actionable suggestions, max 1 sentence each.

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
  const prompt = `You are a sustainability marketing copywriter.
Revise this campaign to be more sustainable and ethical.

CURRENT CAMPAIGN:
${JSON.stringify(campaign, null, 2)}

CONSTRAINTS (KEEP IT SHORT):
1. Ad Copy: Max 2 sentences. More eco-friendly.
2. Social Post: Short, engaging, no greenwashing.
3. Email: Max 3 short paragraphs. Better sustainability focus.
4. Slogan: Catchy, max 7 words.

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
import { auth } from "@/auth";

export async function saveCampaign(product: string, goal: string, campaign: any, analysis: any) {
  try {
    await connectDB();
    
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const newCampaign = await Campaign.create({
      userId,
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
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) {
    return []; // No session, no history
  }

  const query = { userId };

  try {
    await connectDB();
    const campaigns = await Campaign.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(campaigns));
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
}

export async function getCampaign(id: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const query = { _id: id, userId };

  try {
    await connectDB();
    const campaign = await Campaign.findOne(query).lean();
    return JSON.parse(JSON.stringify(campaign));
  } catch (error) {
    console.error("Failed to fetch campaign:", error);
    return null;
  }
}

import { revalidatePath } from "next/cache";

export async function deleteCampaign(id: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const query = { _id: id, userId };

    await connectDB();
    await Campaign.deleteOne(query);
    
    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete campaign:", error);
    return { success: false, error: "Failed to delete campaign" };
  }
}
