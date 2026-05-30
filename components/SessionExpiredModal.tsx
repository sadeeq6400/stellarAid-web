"use client";

import { useEffect, useState, useCallback } from "react";
import { LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";
import {
  onSessionExpired,
  resolvePendingRequests,
  rejectPendingRequests,
  setIsRefreshing,
} from "@/lib/auth/sessionExpiry";

export function SessionExpiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuthStore();
  const { error: toastError, success: toastSuccess, warning } = useToast();

  useEffect(() => {
    onSessionExpired(() => {
      warning("Session expired. Please sign in to continue.");
      setEmail(user?.email ?? "");
      setIsOpen(true);
    });
  }, [user, warning]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPassword("");
    setIsRefreshing(false);
    rejectPendingRequests();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const { user: freshUser, token, refreshToken } = response.data;
      login(freshUser, token, refreshToken);
      resolvePendingRequests(token);
      toastSuccess("Signed in. Resuming where you left off.");
      setIsOpen(false);
      setPassword("");
    } catch {
      toastError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, toastSuccess, toastError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm mx-4">
        <Card className="p-6 shadow-2xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Session Expired</h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Your session has expired. Sign in again to continue — your unsaved work is safe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
            <Button type="submit" fullWidth isLoading={isLoading} className="mt-1">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In &amp; Continue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
