import Link from "next/link";
import { LayoutDashboard, PenTool, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-brand font-light text-[#061b31] text-xl tracking-tight hidden md:inline-block">
              Marketing AI
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="flex items-center text-sm font-medium text-[#273951] hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/generate" className="flex items-center text-sm font-medium text-[#273951] hover:text-primary transition-colors">
              <PenTool className="h-4 w-4 mr-2" />
              Generate
            </Link>
            <Link href="/history" className="flex items-center text-sm font-medium text-[#273951] hover:text-primary transition-colors">
              <History className="h-4 w-4 mr-2" />
              History
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="font-brand shadow-ambient hover:shadow-standard transition-all">
            <Link href="/generate">Start now</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
