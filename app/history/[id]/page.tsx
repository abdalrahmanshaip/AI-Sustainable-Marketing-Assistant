import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Mail, MessageSquare, Megaphone, ArrowLeft } from "lucide-react";
import { getCampaign } from "@/actions/campaign";
import { CopyButton } from "@/components/copy-button";

export const dynamic = "force-dynamic";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, `params` should be awaited if they are asynchronous, but typical synchronous dynamic routes in Next.js 14/15 pass params directly unless defined as Promise. We'll use await to be safe with Next.js 15 breaking changes.
  const resolvedParams = await params;
  const campaign = await getCampaign(resolvedParams.id);

  if (!campaign) {
    notFound();
  }

  const { product, goal, campaign: campaignData, analysis: analysisData, createdAt } = campaign;

  const getScoreColor = (score: number) => {
    if (score >= 75) return { text: "text-[#108c3d]", bg: "bg-[#15be53]" };
    if (score >= 50) return { text: "text-[#9b6829]", bg: "bg-[#9b6829]" };
    return { text: "text-[#ea2261]", bg: "bg-[#ea2261]" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      
      <div>
        <Button asChild variant="ghost" className="mb-4 text-[#64748d] hover:text-[#061b31]">
          <Link href="/history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
          </Link>
        </Button>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header & Score */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-white p-6 rounded-[8px] border border-border shadow-standard">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">{product}</Badge>
              <Badge variant="outline" className="text-xs font-normal text-[#64748d] capitalize">{goal}</Badge>
            </div>
            <h2 className="font-brand text-3xl font-light text-[#061b31] tracking-tight mb-2">
              &quot;{campaignData.slogan}&quot;
            </h2>
            <p className="text-[#64748d]">Generated on {formatDate(createdAt)}.</p>
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
                <CopyButton text={campaignData.ad_copy} />
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
                <CopyButton text={campaignData.social_post} />
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
                <CopyButton text={campaignData.email} />
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

    </div>
  );
}
