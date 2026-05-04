"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function SignOutButton() {
  const handleSignOut = async () => {
    toast.success("Signed out successfully!");
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="font-brand" 
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}
