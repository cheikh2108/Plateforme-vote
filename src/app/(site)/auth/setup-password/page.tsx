import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SetupPasswordForm } from "./setup-password-form";

export const dynamic = "force-dynamic";

export default async function SetupPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/vote";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/vote");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center">
      <div className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
        <SetupPasswordForm nextPath={nextPath} />
      </div>
    </div>
  );
}