import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCampaigns } from "@/actions/campaign";
import { DeleteButton } from "@/components/delete-button";
import { Skeleton } from "@/components/ui/skeleton";


interface CampaignItem {
  _id: string;
  product: string;
  goal: string;
  createdAt: string;
  analysis: {
    score: number;
  };
}

import { Suspense } from "react";

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-brand text-3xl font-light text-[#061b31] tracking-tight mb-2">Campaign History</h1>
          <p className="text-[#64748d] font-light">Review and manage your previously generated sustainable campaigns.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#64748d]" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-9 focus-visible:ring-primary/20 bg-white"
            />
          </div>
          <Button asChild className="shrink-0 font-brand shadow-ambient">
            <Link href="/generate">
              <PlusCircle className="mr-2 h-4 w-4" /> New
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<CampaignsSkeleton />}>
        <CampaignList />
      </Suspense>
    </div>
  );
}

async function CampaignList() {
  const campaigns = await getCampaigns();

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-[#108c3d] bg-[rgba(21,190,83,0.1)] border-[#15be53]/30";
    if (score >= 50) return "text-[#9b6829] bg-[#9b6829]/10 border-[#9b6829]/30";
    return "text-[#ea2261] bg-[#ea2261]/10 border-[#ea2261]/30";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg bg-secondary/30">
        <p className="text-[#64748d] mb-4">No campaigns found.</p>
        <Button asChild variant="outline">
          <Link href="/generate">Create Your First Campaign</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {campaigns.map((camp: CampaignItem) => (
        <Link href={`/history/${camp._id}`} key={camp._id} className="block">
          <Card className="shadow-ambient hover:shadow-standard transition-all duration-200 border-border cursor-pointer group">
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-brand text-lg font-medium text-[#061b31] group-hover:text-primary transition-colors">
                    {camp.product}
                  </h3>
                  <Badge variant="outline" className="text-xs font-normal text-[#64748d] capitalize">
                    {camp.goal}
                  </Badge>
                </div>
                <p className="text-sm text-[#64748d] font-mono tabular-nums">
                  Generated on {formatDate(camp.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-xs text-[#64748d] uppercase tracking-wider mb-1">Score</span>
                  <Badge variant="outline" className={`font-brand tabular-nums text-sm border ${getScoreColor(camp.analysis.score)}`}>
                    {camp.analysis.score}/100
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1">
                  <DeleteButton id={camp._id.toString()} />
                  <div className="flex items-center justify-center h-10 w-10 shrink-0 text-[#64748d] group-hover:bg-primary/5 group-hover:text-primary transition-colors rounded-md">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function CampaignsSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="shadow-ambient border-border">
          <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex flex-col items-start sm:items-end gap-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
