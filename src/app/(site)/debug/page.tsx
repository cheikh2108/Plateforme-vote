import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/data/elections";
import { fixAdminProfile, promoteToAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = await getCurrentUserRole();

  let exactProfile = null;
  let rpcRole = null;
  let rpcError = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    exactProfile = data;

    // Test RPC directement
    const { data: rpc, error } = await supabase.rpc("get_my_role");
    rpcRole = rpc;
    rpcError = error?.message ?? null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-10">
      <h1 className="text-2xl font-bold">Diagnostic de session</h1>

      <div className="space-y-2 rounded-xl bg-muted p-4">
        <p><strong>Statut :</strong> {user ? "Connecté ✅" : "Déconnecté ❌"}</p>
        {user && <p><strong>Email :</strong> {user.email}</p>}
        {user && <p><strong>User ID :</strong> <code className="text-xs">{user.id}</code></p>}
      </div>

      <div className="space-y-2 rounded-xl bg-muted p-4">
        <p><strong>Rôle via getCurrentUserRole() :</strong>{" "}
          <code className="rounded bg-black/10 px-2 py-0.5">{role ?? "null"}</code>
        </p>
        <p><strong>Rôle via RPC get_my_role() :</strong>{" "}
          <code className="rounded bg-black/10 px-2 py-0.5">{rpcRole ?? "null"}</code>
        </p>
        {rpcError && (
          <p className="text-red-600"><strong>Erreur RPC :</strong> {rpcError}
            {rpcError.includes("not exist") && (
              <span className="ml-2 font-bold">→ Exécute la migration SQL ci-dessous !</span>
            )}
          </p>
        )}
        <p><strong>Profil brut (table profiles) :</strong></p>
        <pre className="rounded bg-black/80 p-4 text-xs text-green-400">
          {JSON.stringify(exactProfile, null, 2) ?? "null — profil introuvable"}
        </pre>
      </div>

      {/* Bloc SQL à copier si RPC manque */}
      {rpcError?.includes("not exist") && (
        <div className="rounded-xl border border-yellow-400 bg-yellow-50 p-4 text-sm">
          <p className="mb-2 font-bold text-yellow-800">⚠️ Fonction SQL manquante</p>
          <p className="mb-3 text-yellow-700">Copie et exécute ce SQL dans Supabase → SQL Editor :</p>
          <pre className="overflow-x-auto rounded bg-black p-3 text-xs text-green-300">{`create or replace function public.get_my_role()
returns text language sql security definer stable
set search_path = public as $$
  select role::text from public.profiles
  where id = auth.uid() limit 1;
$$;
grant execute on function public.get_my_role() to authenticated;
grant execute on function public.get_my_role() to anon;`}</pre>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {user && exactProfile && exactProfile.role !== "admin" && (
          <form action={async () => {
            "use server";
            await promoteToAdmin(user.id);
          }}>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
            >
              Promouvoir ce compte en Admin
            </button>
          </form>
        )}

        {user && !exactProfile && (
          <form action={async () => {
            "use server";
            await fixAdminProfile(user.id);
          }}>
            <button
              type="submit"
              className="w-full rounded-xl bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700"
            >
              Créer le profil Admin (profil manquant)
            </button>
          </form>
        )}

        <a href="/admin-login" className="text-blue-500 underline">
          Aller sur la page de connexion Admin
        </a>
        <a href="/admin" className="text-blue-500 underline">
          Tester l&apos;accès Admin
        </a>
      </div>
    </div>
  );
}
