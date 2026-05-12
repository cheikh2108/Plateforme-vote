"use client";

import { Printer } from "lucide-react";
import type { Candidate } from "@/types/database";
import { Button } from "@/components/ui/button";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type Props = {
  electionTitle: string;
  candidates: Candidate[];
  breakdown: { candidate_id: string; votes: number }[];
  participation: number;
};

export function ExportResultsButton({
  electionTitle,
  candidates,
  breakdown,
  participation,
}: Props) {
  const total = breakdown.reduce((acc, row) => acc + row.votes, 0);

  function handlePrint() {
    const rows = breakdown
      .map((row) => {
        const label = escapeHtml(
          candidates.find((c) => c.id === row.candidate_id)?.display_name ?? "Liste",
        );
        const pct = total ? Math.round((row.votes / total) * 1000) / 10 : 0;
        return `<tr><td style="padding:8px;border-bottom:1px solid #e5e5e5">${label}</td><td style="padding:8px;border-bottom:1px solid #e5e5e5">${row.votes}</td><td style="padding:8px;border-bottom:1px solid #e5e5e5">${pct}%</td></tr>`;
      })
      .join("");

    const safeTitle = escapeHtml(electionTitle);
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"/><title>${safeTitle}</title>
      <style>body{font-family:system-ui;padding:32px;color:#111}table{width:100%;border-collapse:collapse}th{text-align:left;padding:8px;border-bottom:1px solid #ccc}</style>
      </head><body>
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#666">Rapport agrégé</p>
      <h1 style="font-size:28px;margin:12px 0">${safeTitle}</h1>
      <p style="color:#666;font-size:14px">Participation : ${participation} · Bulletins : ${total}</p>
      <table style="margin-top:24px"><thead><tr><th>Liste</th><th>Voix</th><th>%</th></tr></thead><tbody>${rows}</tbody></table>
      <p style="margin-top:32px;font-size:11px;color:#777">Document à usage institutionnel — ne pas diffuser hors circuits officiels.</p>
      <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>`;

    const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1100");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="rounded-full"
      onClick={handlePrint}
      disabled={breakdown.length === 0}
    >
      <Printer className="mr-2 size-4" aria-hidden />
      Export PDF
    </Button>
  );
}
