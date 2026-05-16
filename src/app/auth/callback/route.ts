import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const otpType = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const rawNext = requestUrl.searchParams.get("next") ?? "/vote";
  const nextPath = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/vote";

  if (!code && !tokenHash) {
    return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
  }

  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
    }
  } else if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });
    if (error) {
      return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
    }
  } else {
    return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
  }

  const setupPasswordUrl = new URL("/auth/setup-password", requestUrl.origin);
  setupPasswordUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(setupPasswordUrl);
}
