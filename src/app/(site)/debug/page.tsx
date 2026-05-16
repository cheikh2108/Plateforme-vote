import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/data/elections";
import { fixAdminProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = await getCurrentUserRole();

  let exactProfile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    exactProfile = data;
  }

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Diagnostic de session</h1>
      
      <div className="bg-muted p-4 rounded-xl space-y-2">
        <p><strong>Status :</strong> {user ? "Connecté ✅" : "Déconnecté ❌"}</p>
        {user && <p><strong>Email actuel :</strong> {user.email}</p>}
        {user && <p><strong>User ID :</strong> {user.id}</p>}
      </div>

      <div className="bg-muted p-4 rounded-xl space-y-2">
        <p><strong>Rôle calculé par Next.js :</strong> <code className="bg-black/10 px-2 py-1 rounded">{role ?? "null"}</code></p>
        <p><strong>Données brutes de la table Profiles :</strong></p>
        <pre className="text-xs bg-black/80 text-green-400 p-4 rounded">
          {JSON.stringify(exactProfile, null, 2)}
        </pre>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        {user && !exactProfile && (
          <form action={async () => {
            "use server";
            await fixAdminProfile(user.id);
          }}>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold w-full">
              RÉPARER MON PROFIL (Créer le profil Admin)
            </button>
          </form>
        )}
        <a href="/admin-login" className="text-blue-500 underline">Aller sur la page de connexion Admin</a>
        <a href="/admin" className="text-blue-500 underline">Forcer l'entrée dans l'Admin</a>
      </div>
    </div>
  );
}