"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, PenTool, History, Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-6 w-6 text-[#061b31]" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col gap-6 mt-8">
          <Link 
            href="/" 
            onClick={() => setOpen(false)}
            className="flex items-center space-x-2 mb-4"
          >
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-brand font-light text-[#061b31] text-xl tracking-tight">
              Marketing AI
            </span>
          </Link>
          
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              onClick={() => setOpen(false)}
              className="flex items-center text-lg font-medium text-[#273951] hover:text-primary transition-colors"
            >
              <Home className="h-5 w-5 mr-3"/>
              Home
            </Link>
            <Link 
              href="/generate" 
              onClick={() => setOpen(false)}
              className="flex items-center text-lg font-medium text-[#273951] hover:text-primary transition-colors"
            >
              <PenTool className="h-5 w-5 mr-3" />
              Generate
            </Link>
            {isLoggedIn && (
              <Link 
                href="/history" 
                onClick={() => setOpen(false)}
                className="flex items-center text-lg font-medium text-[#273951] hover:text-primary transition-colors"
              >
                <History className="h-5 w-5 mr-3" />
                History
              </Link>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
