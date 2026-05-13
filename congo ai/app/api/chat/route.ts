import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  const provider = process.env.AI_PROVIDER ?? "groq";

  const model =
    process.env.AI_MODEL ??
    (provider === "openrouter"
      ? "meta-llama/llama-3.1-8b-instruct"
      : "llama3-8b-8192");

  const apiKey =
    provider === "openrouter"
      ? process.env.OPENROUTER_API_KEY
      : process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Cle API manquante." },
      { status: 500 }
    );
  }

  const endpoint =
    provider === "openrouter"
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(provider === "openrouter"
        ? {
            "HTTP-Referer":
              process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
            "X-Title": "Congo IA",
          }
        : {}),
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "Tu es Congo IA, un assistant utile, moderne, precis et chaleureux. Reponds en francais par defaut.",
        },
        ...messages,
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Erreur lors de la generation IA." },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json({
    message: data.choices?.[0]?.message?.content ?? "",
  });
}
