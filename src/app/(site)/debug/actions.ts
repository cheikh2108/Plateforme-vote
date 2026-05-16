"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fixAdminProfile(userId: string) {
  const supabase = await createClient();
  
  // On récupère le school_id par défaut
  const { data: school } = await supabase.from("schools").select("id").limit(1).single();
  
  // On insère ou met à jour le profil
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    school_id: school?.id || null,
    role: "admin"
  });

  if (error) throw new Error(error.message);
  revalidatePath("/debug");
  return { success: true };
}
