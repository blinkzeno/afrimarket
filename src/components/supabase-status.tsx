"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SupabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus("error");
          setMessage(error.message);
        } else {
          setStatus("connected");
          setMessage("Connected to Supabase!");
        }
      } catch (err) {
        setStatus("error");
        setMessage(String(err));
      }
    }

    checkConnection();
  }, []);

  const statusColors = {
    loading: "bg-yellow-500",
    connected: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className={`h-3 w-3 rounded-full ${statusColors[status]} animate-pulse`} />
      <div>
        <p className="font-medium text-sm">
          Supabase: {status === "loading" ? "Connecting..." : status}
        </p>
        {message && <p className="text-xs text-zinc-500">{message}</p>}
      </div>
    </div>
  );
}
