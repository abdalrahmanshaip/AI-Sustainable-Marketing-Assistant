"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Leaf, Mail, MessageSquare, Megaphone, AlertCircle, Info, Copy, Check } from "lucide-react";
import { generateCampaign, analyzeCampaign, saveCampaign } from "@/actions/campaign";
import { toast } from "sonner";

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaignData, setCampaignData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setCampaignData(null);
    setAnalysisData(null);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      productName: formData.get("product") as string,
      targetAudience: formData.get("audience") as string,
      goal: formData.get("goal") as string,
      budget: formData.get("budget") as string,
      sustainabilityLevel: formData.get("sustainability") as string,
      additionalInfo: formData.get("additionalInfo") as string,
    };

    try {
      const generated = await generateCampaign(data);
      setCampaignData(generated);
      
      const analysis = await analyzeCampaign(generated);
      setAnalysisData(analysis);

      await saveCampaign(data.productName, data.goal, generated, analysis);
      toast.success("Campaign Generated", {
        description: "Your sustainable marketing campaign has been created successfully.",
      });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to generate campaign.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return { text: "text-[#108c3d]", bg: "bg-[#15be53]" };
    if (score >= 50) return { text: "text-[#9b6829]", bg: "bg-[#9b6829]" };
    return { text: "text-[#ea2261]", bg: "bg-[#ea2261]" };
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="max-w-6xl mx-auto py-12 px-4 flex flex-col lg:flex-row gap-10">
        
      {/* Form Section */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div>
          <h1 className="font-brand text-3xl font-light text-[#061b31] tracking-tight mb-2">Create Campaign</h1>
          <p className="text-[#64748d] font-light">Fill out the details below to generate a new sustainable marketing campaign.</p>
        </div>

        {error && (
          <div className="p-4 bg-[#ea2261]/10 border border-[#ea2261]/30 rounded-[6px] flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#ea2261] shrink-0 mt-0.5" />
            <p className="text-sm text-[#ea2261]">{error}</p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-5 bg-white p-6 rounded-[6px] border border-border shadow-ambient">
          <div className="space-y-2">
            <Label htmlFor="product" className="text-[#273951] font-medium flex items-center gap-1.5">
              Product Name
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-[#64748d]/60 hover:text-[#061b31] transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The main name of the product or service you are promoting.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input name="product" id="product" placeholder="e.g. EcoBottle" required className="focus-visible:ring-primary/20 focus-visible:border-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience" className="text-[#273951] font-medium flex items-center gap-1.5">
              Target Audience
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-[#64748d]/60 hover:text-[#061b31] transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Who is this campaign for? Be as specific as possible.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input name="audience" id="audience" placeholder="e.g. Eco-conscious millennials" required className="focus-visible:ring-primary/20 focus-visible:border-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="text-[#273951] font-medium flex items-center gap-1.5">
              Campaign Goal
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-[#64748d]/60 hover:text-[#061b31] transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The primary objective you want to achieve with this marketing push.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select name="goal" required>
              <SelectTrigger id="goal" className="focus:ring-primary/20 focus:border-primary py-2 [&_[data-description]]:hidden">
                <SelectValue placeholder="Select a goal" className="py-3"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness" className="cursor-pointer">
                  <div className="flex flex-col py-1 text-left">
                    <span className="font-medium text-[#061b31]">Brand Awareness</span>
                    <span data-description className="text-[11px] text-[#64748d] font-normal leading-tight mt-0.5 hidden sm:block">Introduce your product to a wider audience.</span>
                  </div>
                </SelectItem>
                <SelectItem value="conversion" className="cursor-pointer">
                  <div className="flex flex-col py-1 text-left">
                    <span className="font-medium text-[#061b31]">Conversion / Sales</span>
                    <span data-description className="text-[11px] text-[#64748d] font-normal leading-tight mt-0.5 hidden sm:block">Drive immediate purchases or signups.</span>
                  </div>
                </SelectItem>
                <SelectItem value="education" className="cursor-pointer">
                  <div className="flex flex-col py-1 text-left">
                    <span className="font-medium text-[#061b31]">Customer Education</span>
                    <span data-description className="text-[11px] text-[#64748d] font-normal leading-tight mt-0.5 hidden sm:block">Inform customers about eco-features.</span>
                  </div>
                </SelectItem>
                <SelectItem value="retention" className="cursor-pointer">
                  <div className="flex flex-col py-1 text-left">
                    <span className="font-medium text-[#061b31]">Retention</span>
                    <span data-description className="text-[11px] text-[#64748d] font-normal leading-tight mt-0.5 hidden sm:block">Keep existing customers engaged and loyal.</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-[#273951] font-medium flex items-center gap-1.5">
              Budget (Optional)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-[#64748d]/60 hover:text-[#061b31] transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your estimated marketing budget. Leave blank if unknown.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input name="budget" id="budget" type="number" placeholder="e.g. 5000" className="focus-visible:ring-primary/20 focus-visible:border-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sustainability" className="text-[#273951] font-medium flex items-center gap-1.5">
              Sustainability Level
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-[#64748d]/60 hover:text-[#061b31] transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>How eco-friendly is this product currently? Honest levels help generate better suggestions.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select name="sustainability" required>
              <SelectTrigger id="sustainability" className="focus:ring-primary/20 focus:border-primary [&_[data-description]]:hidden">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" className="cursor-pointer">
                  <div className="flex flex-col py-0.5 text-left">
                    <span className="font-medium text-[#061b31]">Low</span>
                    <span data-description className="text-[11px] text-[#64748d] font-normal leading-tight mt-0.5 hidden sm:block">Basic eco-friendly practices. Just starting out.</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium" className="cursor-pointer">
                  <div className="flex flex-col py-0.5 text-left">
                    <span className="font-medium text-[#061b31]">Medium</span>
                    <span data-description className="text-[11px] text-[#64748d] font-normal leading-tight mt-0.5 hidden sm:block">Solid efforts. Uses sustainable materials.</span>
                  </div>
                </SelectItem>
                <SelectItem value="high" className="cursor-pointer">
                  <div className="flex flex-col py-0.5 text-left">
                    <span className="font-medium text-[#061b31]">High</span>
                    <span data-description className="text-[11px] text-[#64748d] font-normal leading-tight mt-0.5 hidden sm:block">Industry leader. Fully sustainable lifecycle.</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-[#273951] font-medium flex items-center gap-1.5">
              Additional Information (Optional)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-[#64748d]/60 hover:text-[#061b31] transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Any extra details, brand guidelines, or specific angles you want the AI to include.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea 
              name="additionalInfo" 
              id="additionalInfo" 
              placeholder="e.g. We want to emphasize that our packaging is 100% compostable and we donate 1% to ocean cleanup." 
              className="focus-visible:ring-primary/20 focus-visible:border-primary min-h-[100px] resize-y" 
            />
          </div>

          <Button type="submit" className="w-full font-brand shadow-standard hover:shadow-elevated transition-shadow" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Campaign"}
          </Button>
        </form>
      </div>

      {/* Result Section */}
      <div className="w-full lg:w-2/3">
        {!isGenerating && !campaignData && (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-[#362baa]/30 rounded-[8px] bg-secondary/30 text-center p-8">
            <Leaf className="h-12 w-12 text-[#64748d]/40 mb-4" />
            <h3 className="font-brand text-xl font-light text-[#273951] mb-2">No Campaign Generated</h3>
            <p className="text-[#64748d] max-w-sm">Fill out the form and click generate to see your AI-powered sustainable marketing campaign.</p>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
            <Skeleton className="h-[150px] rounded-xl w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
          </div>
        )}

        {campaignData && analysisData && !isGenerating && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Score */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-white p-6 rounded-[8px] border border-border shadow-standard">
              <div>
                <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">Campaign Generated</Badge>
                <h2 className="font-brand text-3xl font-light text-[#061b31] tracking-tight mb-2">
                  &quot;{campaignData.slogan as string}&quot;
                </h2>
                <p className="text-[#64748d]">Campaign assets and sustainability analysis successfully generated.</p>
              </div>
              
              <div className="flex flex-col items-end min-w-[120px]">
                <div className="text-right mb-2">
                  <span className="text-sm font-medium text-[#273951] uppercase tracking-wider block mb-1">Sustainability Score</span>
                  <div className="flex items-end justify-end gap-1">
                    <span className={`font-brand text-4xl font-light ${getScoreColor(analysisData.score).text} tabular-nums`}>{analysisData.score}</span>
                    <span className="text-[#64748d] pb-1">/100</span>
                  </div>
                </div>
                <Progress value={analysisData.score} className={`h-2 w-full [&>div]:${getScoreColor(analysisData.score).bg}`} />
                <span className={`text-xs ${getScoreColor(analysisData.score).text} mt-2 flex items-center font-medium`}>
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {analysisData.score >= 75 ? 'Good standing' : analysisData.score >= 50 ? 'Needs Improvement' : 'Critical Action Needed'}
                </span>
              </div>
            </div>

            {/* Campaign Assets */}
            <div className="space-y-4">
              <h3 className="font-brand text-xl font-light text-[#061b31] border-b pb-2">Campaign Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-ambient hover:shadow-standard transition-shadow border-border">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base flex items-center text-[#061b31]"><Megaphone className="h-4 w-4 mr-2 text-primary" /> Ad Copy</CardTitle>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/50" onClick={() => handleCopy(campaignData.ad_copy, 'ad_copy')}>
                      {copiedField === 'ad_copy' ? <Check className="h-4 w-4 text-[#108c3d]" /> : <Copy className="h-4 w-4 text-[#64748d]" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#64748d] leading-relaxed">
                      {campaignData.ad_copy}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-ambient hover:shadow-standard transition-shadow border-border">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base flex items-center text-[#061b31]"><MessageSquare className="h-4 w-4 mr-2 text-[#ea2261]" /> Social Post</CardTitle>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/50" onClick={() => handleCopy(campaignData.social_post, 'social_post')}>
                      {copiedField === 'social_post' ? <Check className="h-4 w-4 text-[#108c3d]" /> : <Copy className="h-4 w-4 text-[#64748d]" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#64748d] leading-relaxed">
                      {campaignData.social_post}
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-ambient hover:shadow-standard transition-shadow border-border">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base flex items-center text-[#061b31]"><Mail className="h-4 w-4 mr-2 text-primary" /> Email Campaign</CardTitle>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/50" onClick={() => handleCopy(campaignData.email, 'email')}>
                      {copiedField === 'email' ? <Check className="h-4 w-4 text-[#108c3d]" /> : <Copy className="h-4 w-4 text-[#64748d]" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#64748d] leading-relaxed whitespace-pre-wrap">
                      {campaignData.email}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Analysis & Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <h3 className="font-brand text-xl font-light text-[#061b31] border-b pb-2">Strategic Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="font-medium text-[#273951] w-28 shrink-0 text-sm mt-0.5">Product</div>
                    <div className="text-sm text-[#64748d]">{analysisData.product}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-medium text-[#273951] w-28 shrink-0 text-sm mt-0.5">Pricing</div>
                    <div className="text-sm text-[#64748d]">{analysisData.pricing}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-medium text-[#273951] w-28 shrink-0 text-sm mt-0.5">Promotion</div>
                    <div className="text-sm text-[#64748d]">{analysisData.promotion}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-medium text-[#273951] w-28 shrink-0 text-sm mt-0.5">Distribution</div>
                    <div className="text-sm text-[#64748d]">{analysisData.distribution}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-brand text-xl font-light text-[#061b31] border-b pb-2">Improvement Suggestions</h3>
                <ul className="space-y-3 text-sm text-[#64748d]">
                  {analysisData.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#ea2261] mr-2 text-lg leading-none">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
    </TooltipProvider>
  );
}
