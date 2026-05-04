import Link from "next/link";
import { LayoutDashboard, PenTool, History, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import SignOutButton from "./SignOutButton";
import MobileNav from "./MobileNav";

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2 md:gap-10">
          <MobileNav isLoggedIn={isLoggedIn} />
          
          <Link href="/" className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-brand font-light text-[#061b31] text-xl tracking-tight hidden md:inline-block">
              Marketing AI
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="flex items-center text-sm font-medium text-[#273951] hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/generate" className="flex items-center text-sm font-medium text-[#273951] hover:text-primary transition-colors">
              <PenTool className="h-4 w-4 mr-2" />
              Generate
            </Link>
            {isLoggedIn && (
              <Link href="/history" className="flex items-center text-sm font-medium text-[#273951] hover:text-primary transition-colors">
                <History className="h-4 w-4 mr-2" />
                History
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-[#273951]">
                {session?.user?.image ? (
                  <img src={session?.user?.image} alt="Avatar" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
                ) : (
                  <UserCircle className="h-6 w-6" />
                )}
                <span className="hidden lg:inline-block">{session?.user?.name}</span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className="font-brand hidden sm:flex">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          <Button asChild size="sm" className="font-brand shadow-ambient hover:shadow-standard transition-all">
            <Link href={isLoggedIn ? "/generate" : "/login"}>Start now</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
