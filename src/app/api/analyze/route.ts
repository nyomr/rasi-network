import { NextResponse } from "next/server";
import rawData from "@/data/data.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || "").toLowerCase();

  // Filter data sesuai pencarian (owner atau company mengandung query)
  const filtered = rawData.filter((item) => item.owner.toLowerCase().includes(query) || item.company.toLowerCase().includes(query));

  // Set untuk menghindari duplikat node
  const nodeSet = new Map<string, { id: string; label: string; type: "owner" | "company" }>();
  const links: { source: string; target: string }[] = [];

  filtered.forEach((item) => {
    if (!nodeSet.has(item.owner)) {
      nodeSet.set(item.owner, { id: item.owner, label: item.owner, type: "owner" });
    }
    if (!nodeSet.has(item.company)) {
      nodeSet.set(item.company, { id: item.company, label: item.company, type: "company" });
    }
    links.push({ source: item.owner, target: item.company });
  });

  const nodes = Array.from(nodeSet.values());

  return NextResponse.json({ nodes, links });
}
