import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_DEMO_PASSWORD = "preview-only";

export function isDemoMode() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    return false;
  }
  if (process.env.DISABLE_DEMO_MODE === "true") return false;
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.ALLOW_DEMO_MODE !== "true") return false;
  const password = process.env.DEMO_ADMIN_PASSWORD;
  return Boolean(password && password !== DEFAULT_DEMO_PASSWORD && password.length >= 12);
}

export function demoCredentials() {
  return {
    email: process.env.DEMO_ADMIN_EMAIL || "admin@localhost",
    password: process.env.DEMO_ADMIN_PASSWORD || DEFAULT_DEMO_PASSWORD,
  };
}

export function demoSessionToken() {
  const { password } = demoCredentials();
  return createHmac("sha256", password).update("mica-portfolio-demo-admin").digest("hex");
}

export function tokensMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
