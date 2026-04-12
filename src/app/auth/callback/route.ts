import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Session créée avec succès, rediriger vers le dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Erreur lors de l'échange du code
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // Pas de code fourni
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Code de confirmation manquant")}`
  );
}
