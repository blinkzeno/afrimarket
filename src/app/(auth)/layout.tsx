import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#1B7A3E" }}
            >
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">AfriMarket</span>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
