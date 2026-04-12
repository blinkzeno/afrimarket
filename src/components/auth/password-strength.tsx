"use client";

import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from "@/lib/validations/auth";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password);
  const label = getPasswordStrengthLabel(strength);
  const color = getPasswordStrengthColor(strength);

  // Calculer le pourcentage de remplissage
  const percentage = (strength / 5) * 100;

  return (
    <div className="mt-2 space-y-1">
      {/* Barre de force */}
      <div className="flex h-1.5 w-full gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="h-full flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                index < strength
                  ? color
                  : "#E8ECE6",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color }}
        >
          {password.length > 0 ? label : "Entrez un mot de passe"}
        </span>
        <span className="text-xs text-[#C5C0BB]">
          {password.length > 0 ? `${strength}/5` : ""}
        </span>
      </div>

      {/* Critères */}
      <ul className="space-y-0.5 pt-1">
        <CriteriaItem met={password.length >= 8} label="Au moins 8 caractères" />
        <CriteriaItem met={/[A-Z]/.test(password)} label="Une majuscule" />
        <CriteriaItem met={/[a-z]/.test(password)} label="Une minuscule" />
        <CriteriaItem met={/[0-9]/.test(password)} label="Un chiffre" />
      </ul>
    </div>
  );
}

function CriteriaItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className="flex items-center gap-1.5 text-xs">
      <span
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-200"
        style={{
          backgroundColor: met ? "#1B7A3E" : "#E8ECE6",
          color: met ? "white" : "#C5C0BB",
        }}
      >
        {met ? "✓" : "•"}
      </span>
      <span className={met ? "text-[#1B7A3E]" : "text-[#C5C0BB]"}>
        {label}
      </span>
    </li>
  );
}
