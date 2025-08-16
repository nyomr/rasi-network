"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import dataJson from "@/data/data.json";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface DataItem {
  owner: string;
  company: string;
}

interface Node {
  id: string;
  label: string;
  type: "owner" | "company";
}

interface Link {
  source: string;
  target: string;
}

export default function AnalyzePage() {
  const [query, setQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const graphData = useMemo(() => {
    if (!query.trim()) return { nodes: [], links: [] };

    const filtered = dataJson.filter((item) => item.owner.toLowerCase().includes(query.toLowerCase()) || item.company.toLowerCase().includes(query.toLowerCase()));

    const nodeMap = new Map<string, Node>();
    const links: Link[] = [];

    filtered.forEach((item: DataItem) => {
      if (!nodeMap.has(item.owner)) {
        nodeMap.set(item.owner, { id: item.owner, label: item.owner, type: "owner" });
      }
      if (!nodeMap.has(item.company)) {
        nodeMap.set(item.company, { id: item.company, label: item.company, type: "company" });
      }
      links.push({ source: item.owner, target: item.company });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links,
    };
  }, [query]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: chatInput }];
    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput }),
    });
    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", text: data.reply }]);
    setChatInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white relative">
      {/* Header */}
      <header className="p-4 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* <h1 className="text-xl font-bold tracking-wide text-indigo-400">Analyze Network</h1> */}
        <input
          type="text"
          placeholder="Search for an owner or company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-purple-400 transition"
        />
      </header>

      {/* Graph Area */}
      <main className="flex-1 relative">
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            graphData={graphData}
            width={typeof window !== "undefined" ? window.innerWidth : undefined}
            height={typeof window !== "undefined" ? window.innerHeight - 200 : undefined}
            nodeAutoColorBy="type"
            nodeCanvasObjectMode={() => "before"}
            nodeCanvasObject={(node, ctx) => {
              const label = node.id as string;
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, 6, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.type === "owner" ? "#60A5FA" : "#F472B6";
              ctx.fill();

              ctx.font = "12px Sans-Serif";
              ctx.fillStyle = "white";
              ctx.fillText(label, node.x! + 8, node.y! + 3);
            }}
            linkColor={() => "rgba(255,255,255,0.25)"}
            linkWidth={1.2}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">No data found. Please type in the search box.</div>
        )}
      </main>

      {/* Chat Section */}
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 p-4">
        <div className="h-40 overflow-y-auto mb-3 space-y-2 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-2xl ${m.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-700 text-gray-100 mr-auto"}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-2xl border border-gray-700 focus:outline-none focus:border-purple-400"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-purple-600 rounded-2xl text-white hover:bg-purple-700 flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition">
            <SendHorizonal size={18} /> Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
