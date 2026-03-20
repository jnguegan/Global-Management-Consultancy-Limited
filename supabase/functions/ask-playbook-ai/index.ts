import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: corsHeaders }
      );
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const { question, articleText, lang } = await req.json();

    if (!question || !articleText) {
      return new Response(
        JSON.stringify({ error: "Missing question or articleText" }),
        { status: 400, headers: corsHeaders }
      );
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

    console.log("Incoming AI request");
    console.log("Question:", question);
    console.log("Lang:", lang);
    console.log("Article length:", articleText.length);

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

    console.log("OpenAI FULL RESPONSE:", openaiData);

    if (!openaiRes.ok) {
      console.error("OpenAI ERROR:", openaiData);

      return new Response(
        JSON.stringify({
          error: openaiData?.error?.message || "OpenAI request failed",
          debug: openaiData
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    const answer = openaiData?.choices?.[0]?.message?.content?.trim();

    return new Response(
      JSON.stringify({
        answer:
          answer ||
          "The article does not contain enough information to answer this question."
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error("Function error:", error);

    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
