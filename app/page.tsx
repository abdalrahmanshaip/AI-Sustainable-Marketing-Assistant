import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          AI-Powered Sustainability
        </div>
        <h1 className="font-brand text-[#061b31] text-5xl md:text-6xl lg:text-[56px] font-light tracking-[-1.4px] leading-[1.03] max-w-4xl mb-6">
          Generate and analyze sustainable marketing campaigns.
        </h1>
        <p className="max-w-[700px] text-[#64748d] text-lg md:text-xl font-light mb-10 leading-[1.4]">
          Empower your brand with AI-driven marketing strategies that prioritize sustainability without compromising on performance. 
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="font-brand text-base shadow-elevated hover:shadow-deep transition-shadow px-8 h-12">
            <Link href="/generate">
              Start Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-brand text-base border-border text-primary hover:bg-[#533afd]/5 h-12 px-8">
            <Link href="/history">View History</Link>
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 border-t border-border/40">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-[6px] border border-border shadow-ambient hover:shadow-standard transition-all">
            <Leaf className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-brand text-2xl font-light text-[#061b31] tracking-tight mb-3">Eco-Friendly First</h3>
            <p className="text-[#64748d] font-light leading-relaxed">Ensure every campaign highlights your commitment to the planet with AI-optimized sustainability scoring.</p>
          </div>
          <div className="p-6 bg-white rounded-[6px] border border-border shadow-ambient hover:shadow-standard transition-all">
            <Zap className="h-8 w-8 text-[#ea2261] mb-4" />
            <h3 className="font-brand text-2xl font-light text-[#061b31] tracking-tight mb-3">Instant Generation</h3>
            <p className="text-[#64748d] font-light leading-relaxed">Get ad copy, social posts, emails, and slogans in seconds. Stop staring at a blank page.</p>
          </div>
          <div className="p-6 bg-white rounded-[6px] border border-border shadow-ambient hover:shadow-standard transition-all">
            <BarChart3 className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-brand text-2xl font-light text-[#061b31] tracking-tight mb-3">Deep Analysis</h3>
            <p className="text-[#64748d] font-light leading-relaxed">Receive comprehensive breakdowns on pricing, promotion, and distribution strategies.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
