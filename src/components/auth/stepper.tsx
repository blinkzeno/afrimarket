"use client";

import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div key={index} className="flex flex-1 items-center">
              {/* Cercle avec numéro/check */}
              <div className="flex flex-col items-center">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: isCompleted || isCurrent ? "#1B7A3E" : "transparent",
                    border: isFuture ? "2px solid #C5C0BB" : "none",
                    color: isCompleted || isCurrent ? "white" : isFuture ? "#C5C0BB" : "white",
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {/* Label de l'étape */}
                <span
                  className="mt-1.5 text-xs font-medium"
                  style={{
                    color: isCurrent ? "#1B7A3E" : isCompleted ? "#1B7A3E" : "#C5C0BB",
                  }}
                >
                  {step}
                </span>
              </div>

              {/* Connecteur entre les étapes */}
              {index < steps.length - 1 && (
                <div
                  className="mx-2 h-0.5 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isCompleted ? "#1B7A3E" : "#E8ECE6",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
