"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations/auth";

export async function registerAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  referralCode?: string;
  role: "buyer" | "seller" | "delivery";
}) {
  const supabase = await createClient();

  // Validation avec Zod
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return {
      error: result.error.issues.map((e: { message: string }) => e.message).join(", "),
    };
  }

  // Vérifier le code parrain si fourni
  let referredById: string | null = null;
  if (data.referralCode && data.referralCode.trim() !== "") {
    const { data: referrer, error: referrerError } = await supabase
      .from("users")
      .select("id")
      .eq("referral_code", data.referralCode.trim().toUpperCase())
      .single();

    if (referrerError || !referrer) {
      return { error: "Code parrain invalide" };
    }
    referredById = referrer.id;
  }

  // Créer l'utilisateur avec Supabase Auth
  const { error: signUpError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        first_name: result.data.firstName,
        last_name: result.data.lastName,
        role: result.data.role,
        referred_by_id: referredById,
      },
    },
  });

  if (signUpError) {
    // Traduction des erreurs courantes
    let errorMsg = signUpError.message;
    if (errorMsg.includes("User already registered")) {
      errorMsg = "Un compte existe déjà avec cet email. Veuillez vous connecter.";
    } else if (errorMsg.includes("email_address_invalid")) {
      errorMsg = "Format d'email invalide.";
    } else if (errorMsg.includes("password")) {
      errorMsg = "Le mot de passe est trop faible.";
    }
    return { error: errorMsg };
  }

  // Le trigger handle_new_user créera automatiquement le profil
  return { success: true };
}
