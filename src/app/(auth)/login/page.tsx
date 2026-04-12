"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
    }

    setIsLoading(false);
  }

  return (
    <div
      className="rounded-[20px] bg-white p-8"
      style={{
        boxShadow: "0 0 0 1px rgba(44,36,32,0.06), 0 8px 24px rgba(44,36,32,0.10)",
      }}
    >
      {/* Titre */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Connectez-vous
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Accédez à votre compte AfriMarket
        </p>
      </div>

      {/* Formulaire */}
      <form action={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="votre@email.com"
            className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all"
            style={{
              height: "48px",
              backgroundColor: "#FAFAF8",
              border: "1px solid #E8ECE6",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "2px solid #1B7A3E";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid #E8ECE6";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-[10px] border px-4 text-sm outline-none transition-all"
            style={{
              height: "48px",
              backgroundColor: "#FAFAF8",
              border: "1px solid #E8ECE6",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "2px solid #1B7A3E";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,122,62,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid #E8ECE6";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Error */}
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

        {/* Bouton Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl font-semibold text-white transition-colors disabled:opacity-50"
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
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">ou</span>
        </div>
      </div>

      {/* Link to Register */}
      <p className="text-center text-sm text-gray-600">
        Pas encore de compte?{" "}
        <Link
          href="/register"
          className="font-semibold transition-colors hover:underline"
          style={{ color: "#1B7A3E" }}
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
