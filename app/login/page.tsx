"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/actions/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/generate");
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div 
        className="w-full max-w-[400px] bg-white p-8 rounded-[6px] border border-[#e5edf5]"
        style={{
          boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 45px -30px, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px"
        }}
      >
        <h1 
          className="font-brand text-[26px] font-light text-[#061b31] mb-8 text-center"
          style={{ letterSpacing: "-0.26px", lineHeight: 1.12, fontFeatureSettings: '"ss01"' }}
        >
          Sign in to your account
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-[rgba(234,34,97,0.05)] border border-[rgba(234,34,97,0.2)] rounded-[4px] flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-[#ea2261] shrink-0 mt-[2px]" />
            <p className="text-[13px] text-[#ea2261] font-brand leading-relaxed" style={{ fontFeatureSettings: '"ss01"' }}>
              {error}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[#273951] text-[14px] font-brand font-normal" style={{ fontFeatureSettings: '"ss01"' }}>
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name@example.com"
                      className="border-[#e5edf5] rounded-[4px] focus-visible:ring-[#533afd] focus-visible:ring-1 focus-visible:border-[#533afd] text-[#061b31] font-brand font-normal placeholder:text-[#64748d] shadow-sm"
                      style={{ fontFeatureSettings: '"ss01"' }}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[13px] font-brand" style={{ fontFeatureSettings: '"ss01"' }} />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[#273951] text-[14px] font-brand font-normal" style={{ fontFeatureSettings: '"ss01"' }}>
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        className="border-[#e5edf5] rounded-[4px] focus-visible:ring-[#533afd] focus-visible:ring-1 focus-visible:border-[#533afd] text-[#061b31] font-brand font-normal placeholder:text-[#64748d] pr-10 shadow-sm"
                        style={{ fontFeatureSettings: '"ss01"' }}
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748d] hover:text-[#061b31] transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[13px] font-brand" style={{ fontFeatureSettings: '"ss01"' }} />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#533afd] hover:bg-[#4434d4] text-white rounded-[4px] h-10 font-brand font-normal transition-colors"
              style={{ fontFeatureSettings: '"ss01"' }}
            >
              {isLoading ? "Signing in..." : "Continue"}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-[14px] text-[#64748d] font-brand font-normal" style={{ fontFeatureSettings: '"ss01"' }}>
          Don't have an account?{" "}
          <Link href="/register" className="text-[#533afd] hover:text-[#4434d4] transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
