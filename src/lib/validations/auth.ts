import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerStep1Schema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100, "Le prénom ne peut pas dépasser 100 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
});

export type RegisterStep1Input = z.infer<typeof registerStep1Schema>;

export const registerStep2Schema = z
  .object({
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une majuscule"
      )
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une minuscule"
      )
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string().min(1, "La confirmation est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterStep2Input = z.infer<typeof registerStep2Schema>;

export const registerStep3Schema = z.object({
  referralCode: z
    .string()
    .max(10, "Le code parrain ne peut pas dépasser 10 caractères")
    .optional()
    .or(z.literal("")),
  role: z.enum(["buyer", "seller", "delivery"], "Veuillez sélectionner un rôle"),
});

export type RegisterStep3Input = z.infer<typeof registerStep3Schema>;

export const registerSchema = z.object({
  firstName: registerStep1Schema.shape.firstName,
  lastName: registerStep1Schema.shape.lastName,
  email: registerStep1Schema.shape.email,
  password: registerStep2Schema.shape.password,
  referralCode: registerStep3Schema.shape.referralCode,
  role: registerStep3Schema.shape.role,
});

export type RegisterInput = z.infer<typeof registerSchema>;

export function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return Math.min(strength, 5);
}

export function getPasswordStrengthLabel(strength: number): string {
  const labels = ["Très faible", "Faible", "Moyen", "Bon", "Fort", "Très fort"];
  return labels[strength] || "Très faible";
}

export function getPasswordStrengthColor(strength: number): string {
  const colors = [
    "#B71C1C", // Très faible - rouge
    "#D32F2F", // Faible - rouge foncé
    "#F57C00", // Moyen - orange
    "#F9A825", // Bon - jaune
    "#7CB342", // Fort - vert clair
    "#1B7A3E", // Très fort - vert
  ];
  return colors[strength] || colors[0];
}
