import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/login/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Récupérer les infos du profil
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-1 text-gray-600">
              Bienvenue, {profile?.first_name || user.email}!
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Déconnexion
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Informations du compte
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rôle</span>
                <span className="font-medium text-gray-900">{profile?.role || "buyer"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Code parrain</span>
                <span className="font-medium text-gray-900">{profile?.referral_code || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Solde</span>
                <span className="font-medium text-gray-900">
                  {profile?.wallet_balance || "0.00"} FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Session active
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID Utilisateur</span>
                <span className="font-medium text-gray-900">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confirmé</span>
                <span className="font-medium text-gray-900">
                  {user.email_confirmed_at ? "Oui" : "Non"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dernière connexion</span>
                <span className="font-medium text-gray-900">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString("fr-FR")
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
