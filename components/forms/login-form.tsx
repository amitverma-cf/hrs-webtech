"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Hospital } from "lucide-react";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm border-none shadow-xl bg-card/50 backdrop-blur">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Hospital className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">HRS Clinical</CardTitle>
          <p className="text-sm text-muted-foreground">Enter credentials to continue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="dr_smith"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
                required
              />
            </div>

            {error && (
              <div className="text-xs font-medium text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-shake">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20" 
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>

            <div className="text-center pt-2">
              <Link 
                href="/signup" 
                className="text-xs font-medium text-primary hover:underline underline-offset-4"
              >
                Request Access
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
