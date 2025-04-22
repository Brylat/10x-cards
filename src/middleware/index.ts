import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

// Publiczne ścieżki - endpointy API uwierzytelniania i strony Astro renderowane po stronie serwera
const PUBLIC_PATHS = [
  // Strony renderowane po stronie serwera
  "/login",
  "/register",
  "/reset-password",
  // Endpointy API uwierzytelniania
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/auth/logout",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  // Pomijaj sprawdzanie uwierzytelnienia dla publicznych ścieżek
  if (PUBLIC_PATHS.includes(url.pathname)) {
    // Nadal przekazujemy instancję supabase do locals
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    locals.supabase = supabase;
    return next();
  }

  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // WAŻNE: Zawsze najpierw pobieraj sesję użytkownika przed innymi operacjami
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    locals.user = {
      email: user.email || null,
      id: user.id,
    };
    locals.supabase = supabase;
  } else if (!PUBLIC_PATHS.includes(url.pathname)) {
    // Przekieruj do logowania dla chronionych tras
    return redirect("/login");
  }

  return next();
});
