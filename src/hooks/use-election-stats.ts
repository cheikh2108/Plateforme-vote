"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/env";

export function useElectionParticipation(electionId: string | null, initial: number) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    setCount(initial);
  }, [initial]);

  useEffect(() => {
    if (!hasSupabase || !electionId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`election-stats-${electionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "election_stats",
          filter: `election_id=eq.${electionId}`,
        },
        (payload) => {
          const row = payload.new as { participation_count?: number } | null;
          if (row?.participation_count != null) {
            setCount(row.participation_count);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [electionId]);

  return count;
}
