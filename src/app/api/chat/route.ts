import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import dataJson from "@/data/data.json";

let vectorStore: MemoryVectorStore | null = null;

async function initVectorStore() {
  if (vectorStore) return vectorStore;

  // 🔹 Gabungkan data per perusahaan
  const companyMap = new Map<string, string[]>();

  dataJson.forEach((item) => {
    if (!companyMap.has(item.company)) {
      companyMap.set(item.company, []);
    }
    companyMap.get(item.company)!.push(item.owner);
  });

  const docs: Document[] = [];

  for (const [company, owners] of companyMap) {
    // Dokumen kumpulan owner per perusahaan
    docs.push(
      new Document({
        pageContent: `Perusahaan ${company} dimiliki oleh: ${owners.join(", ")}.`,
        metadata: { company, owners },
      })
    );

    // Dokumen individual untuk tiap owner
    owners.forEach((owner) => {
      docs.push(
        new Document({
          pageContent: `Owner ${owner} memiliki perusahaan ${company}.`,
          metadata: { owner, company },
        })
      );
    });
  }

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: "AIzaSyA6Yv4mtqq1t00W1Bb8XhVyNUh0eBHGeAc",
    modelName: "text-embedding-004",
  });

  vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  return vectorStore;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    const store = await initVectorStore();
    const relevantDocs = await store.similaritySearch(message, 10);

    const contextText = relevantDocs.map((doc) => doc.pageContent).join("\n");

    const model = new ChatGoogleGenerativeAI({
      apiKey: "AIzaSyA6Yv4mtqq1t00W1Bb8XhVyNUh0eBHGeAc",
      model: "gemini-2.0-flash",
    });

    const prompt = `
    Here are the relations between companies and their owners:

    ${contextText}

    Question: ${message}

    Answer briefly and clearly, and mention all names if there is more than one owner.
    If the information is not in the data, answer: "Sorry, I couldn't find that information in the data."
    `;

    const response = await model.invoke(prompt);

    return NextResponse.json({ reply: response.content });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error generating response" }, { status: 500 });
  }
}
