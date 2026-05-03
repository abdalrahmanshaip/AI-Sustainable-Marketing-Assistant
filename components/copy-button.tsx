"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/50" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4 text-[#108c3d]" /> : <Copy className="h-4 w-4 text-[#64748d]" />}
    </Button>
  );
}
