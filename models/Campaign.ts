import mongoose, { Schema, model, models } from "mongoose";

const CampaignSchema = new Schema({
  sessionId: { type: String, required: true },
  product: { type: String, required: true },
  goal: { type: String, required: true },
  campaign: {
    ad_copy: { type: String, required: true },
    social_post: { type: String, required: true },
    email: { type: String, required: true },
    slogan: { type: String, required: true },
  },
  analysis: {
    score: { type: Number, required: true },
    product: { type: String, required: true },
    pricing: { type: String, required: true },
    promotion: { type: String, required: true },
    distribution: { type: String, required: true },
    suggestions: { type: [String], required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Campaign = models.Campaign || model("Campaign", CampaignSchema);

export default Campaign;
