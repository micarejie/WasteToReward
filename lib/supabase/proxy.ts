import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isDemoMode, demoSessionToken } from "@/lib/demo/mode";
import { isSupabaseConfigured, supabaseKey } from "@/lib/site";
import { safeNextPath } from "@/lib/utils";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicAdminRoute =
    pathname.startsWith("/admin/login") || pathname.startsWith("/admin/update-password");

  if (!isSupabaseConfigured()) {
    if (!isDemoMode()) {
      if (isAdminRoute && !isPublicAdminRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.search = "error=unconfigured";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    const signedIn = request.cookies.get("demo_admin")?.value === demoSessionToken();
    if (isAdminRoute && !isPublicAdminRoute && !signedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", safeNextPath(pathname));
      return NextResponse.redirect(url);
    }
    if (pathname === "/admin/login" && signedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
      },
    },
  });

  let userId: string | undefined;
  try {
    const { data } = await supabase.auth.getClaims();
    userId = data?.claims?.sub;
  } catch {
    userId = undefined;
  }

  if (isAdminRoute && !isPublicAdminRoute && !userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", safeNextPath(pathname));
    return redirectWithSession(url, supabaseResponse);
  }

  return supabaseResponse;
}

function redirectWithSession(url: URL, supabaseResponse: NextResponse) {
  const redirect = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirect.cookies.set(cookie);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = supabaseResponse.headers.get(header);
    if (value) redirect.headers.set(header, value);
  }
  return redirect;
}
