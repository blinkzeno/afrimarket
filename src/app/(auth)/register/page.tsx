"use client";

import { useState } from "react";
import Link from "next/link";
import { Stepper } from "@/components/auth/stepper";
import { PasswordStrength } from "@/components/auth/password-strength";
import { registerAction } from "./actions";
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
} from "@/lib/validations/auth";

const steps = ["Identité", "Sécurité", "Rôle"];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Données du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    role: "buyer" as "buyer" | "seller" | "delivery",
  });

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user types
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validateStep(step: number): boolean {
    setFieldErrors({});
    setError("");

    if (step === 0) {
      const result = registerStep1Schema.safeParse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = String(issue.path[0]);
          errors[field] = issue.message;
        });
        setFieldErrors(errors);
        return false;
      }
    }

    if (step === 1) {
      const result = registerStep2Schema.safeParse({
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = String(issue.path[0]);
          errors[field] = issue.message;
        });
        setFieldErrors(errors);
        return false;
      }
    }

    if (step === 2) {
      const result = registerStep3Schema.safeParse({
        referralCode: formData.referralCode,
        role: formData.role,
      });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = String(issue.path[0]);
          errors[field] = issue.message;
        });
        setFieldErrors(errors);
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setError("");
    setFieldErrors({});
  }

  async function handleSubmit() {
    if (!validateStep(2)) return;

    setIsLoading(true);
    setError("");

    const result = await registerAction({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      referralCode: formData.referralCode || undefined,
      role: formData.role,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div
        className="rounded-[20px] bg-white p-8"
        style={{
          boxShadow: "0 0 0 1px rgba(44,36,32,0.06), 0 8px 24px rgba(44,36,32,0.10)",
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(27, 122, 62, 0.1)" }}
          >
            <svg
              className="h-8 w-8"
              style={{ color: "#1B7A3E" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Inscription réussie!
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl px-6 py-2.5 font-semibold text-white transition-colors"
            style={{ backgroundColor: "#1B7A3E" }}
          >
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[20px] bg-white p-8"
      style={{
        boxShadow: "0 0 0 1px rgba(44,36,32,0.06), 0 8px 24px rgba(44,36,32,0.10)",
      }}
    >
      {/* Stepper */}
      <div className="mb-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Titre */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {currentStep === 0 && "Vos informations"}
          {currentStep === 1 && "Créez votre mot de passe"}
          {currentStep === 2 && "Finalisez votre inscription"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {currentStep === 0 && "Étape 1 sur 3"}
          {currentStep === 1 && "Étape 2 sur 3"}
          {currentStep === 2 && "Étape 3 sur 3"}
        </p>
      </div>

      {/* Étape 1: Identité */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Jean"
                className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all"
                style={{
                  height: "48px",
                  backgroundColor: "#FAFAF8",
                  border: fieldErrors.firstName
                    ? "2px solid #B71C1C"
                    : "1px solid #E8ECE6",
                }}
                onFocus={(e) => {
                  if (!fieldErrors.firstName) {
                    e.currentTarget.style.border = "2px solid #1B7A3E";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = fieldErrors.firstName
                    ? "2px solid #B71C1C"
                    : "1px solid #E8ECE6";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-xs text-[#B71C1C]">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Dupont"
                className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all"
                style={{
                  height: "48px",
                  backgroundColor: "#FAFAF8",
                  border: fieldErrors.lastName
                    ? "2px solid #B71C1C"
                    : "1px solid #E8ECE6",
                }}
                onFocus={(e) => {
                  if (!fieldErrors.lastName) {
                    e.currentTarget.style.border = "2px solid #1B7A3E";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = fieldErrors.lastName
                    ? "2px solid #B71C1C"
                    : "1px solid #E8ECE6";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-xs text-[#B71C1C]">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="jean.dupont@email.com"
              className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all"
              style={{
                height: "48px",
                backgroundColor: "#FAFAF8",
                border: fieldErrors.email
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6",
              }}
              onFocus={(e) => {
                if (!fieldErrors.email) {
                  e.currentTarget.style.border = "2px solid #1B7A3E";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = fieldErrors.email
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-[#B71C1C]">{fieldErrors.email}</p>
            )}
          </div>

          <button
            onClick={nextStep}
            className="mt-4 w-full rounded-xl font-semibold text-white transition-colors"
            style={{
              height: "44px",
              backgroundColor: "#1B7A3E",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#156B34";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1B7A3E";
            }}
          >
            Continuer
          </button>
        </div>
      )}

      {/* Étape 2: Mot de passe */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all"
              style={{
                height: "48px",
                backgroundColor: "#FAFAF8",
                border: fieldErrors.password
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6",
              }}
              onFocus={(e) => {
                if (!fieldErrors.password) {
                  e.currentTarget.style.border = "2px solid #1B7A3E";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = fieldErrors.password
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <PasswordStrength password={formData.password} />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-[#B71C1C]">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all"
              style={{
                height: "48px",
                backgroundColor: "#FAFAF8",
                border: fieldErrors.confirmPassword
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6",
              }}
              onFocus={(e) => {
                if (!fieldErrors.confirmPassword) {
                  e.currentTarget.style.border = "2px solid #1B7A3E";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = fieldErrors.confirmPassword
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-[#B71C1C]">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={prevStep}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Retour
            </button>
            <button
              onClick={nextStep}
              className="flex-1 rounded-xl font-semibold text-white transition-colors"
              style={{
                height: "44px",
                backgroundColor: "#1B7A3E",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#156B34";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1B7A3E";
              }}
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {/* Étape 3: Rôle et parrainage */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Je suis un
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "buyer", label: "Acheteur", icon: "🛒" },
                { value: "seller", label: "Vendeur", icon: "🏪" },
                { value: "delivery", label: "Livreur", icon: "🚚" },
              ].map((role) => (
                <button
                  key={role.value}
                  onClick={() => updateField("role", role.value)}
                  className="flex flex-col items-center gap-2 rounded-xl border p-4 transition-all"
                  style={{
                    borderColor:
                      formData.role === role.value ? "#1B7A3E" : "#E8ECE6",
                    backgroundColor:
                      formData.role === role.value
                        ? "rgba(27, 122, 62, 0.05)"
                        : "white",
                  }}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color:
                        formData.role === role.value ? "#1B7A3E" : "#6B7280",
                    }}
                  >
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
            {fieldErrors.role && (
              <p className="mt-1 text-xs text-[#B71C1C]">{fieldErrors.role}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Code parrain (optionnel)
            </label>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => updateField("referralCode", e.target.value.toUpperCase())}
              placeholder="ABCDEF"
              className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all uppercase"
              style={{
                height: "48px",
                backgroundColor: "#FAFAF8",
                border: fieldErrors.referralCode
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6",
              }}
              onFocus={(e) => {
                if (!fieldErrors.referralCode) {
                  e.currentTarget.style.border = "2px solid #1B7A3E";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = fieldErrors.referralCode
                  ? "2px solid #B71C1C"
                  : "1px solid #E8ECE6";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {fieldErrors.referralCode && (
              <p className="mt-1 text-xs text-[#B71C1C]">{fieldErrors.referralCode}</p>
            )}
          </div>

          {/* Global Error */}
          {error && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(183, 28, 28, 0.08)",
                color: "#B71C1C",
                border: "1px solid rgba(183, 28, 28, 0.2)",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={prevStep}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Retour
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 rounded-xl font-semibold text-white transition-colors disabled:opacity-50"
              style={{
                height: "44px",
                backgroundColor: "#1B7A3E",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#156B34";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1B7A3E";
              }}
            >
              {isLoading ? "Inscription..." : "Créer mon compte"}
            </button>
          </div>
        </div>
      )}

      {/* Link to Login */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Déjà un compte?{" "}
        <Link
          href="/login"
          className="font-semibold transition-colors hover:underline"
          style={{ color: "#1B7A3E" }}
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
