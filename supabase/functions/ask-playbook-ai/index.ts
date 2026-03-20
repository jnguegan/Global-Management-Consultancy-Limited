import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { question, articleText, lang } = await req.json();

    if (!question || !articleText) {
      return new Response(JSON.stringify({ error: "Missing question or articleText" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const languageInstruction =
      lang === "fr"
        ? "Answer in French."
        : lang === "es"
        ? "Answer in Spanish."
        : "Answer in English.";

    const prompt = `
You are an AI study assistant for a FIFA Football Agent Exam preparation platform.

Only answer using the article content provided below.
If the answer is not clearly supported by the article, say so briefly.
Be accurate, concise, and educational.
${languageInstruction}

User question:
${question}

Article content:
${articleText}
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You answer only from the provided regulation/playbook text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2
      })
    });

    const openaiData = await openaiRes.json();
    const answer =
      openaiData?.choices?.[0]?.message?.content ||
      "No answer returned.";

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
