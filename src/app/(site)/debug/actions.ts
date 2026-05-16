"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fixAdminProfile(userId: string) {
  const supabase = await createClient();
  const { data: school } = await supabase.from("schools").select("id").limit(1).single();

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    school_id: school?.id ?? null,
    role: "admin",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/debug");
}

export async function promoteToAdmin(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/debug");
}
