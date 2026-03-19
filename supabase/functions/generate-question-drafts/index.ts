import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function classifyArticleNumber(articleNumber: string): string {
  const v = String(articleNumber || "").trim();

  if (/^\d+$/.test(v)) return "plain_numeric";
  if (/^\d+\.\d+$/.test(v)) return "numeric_decimal";
  if (/^\d+\.\d+\.[a-zA-Z]+$/.test(v)) return "decimal_letter";
  if (/^\d+[a-zA-Z]+$/.test(v)) return "named_article";
  if (/^\d+[a-zA-Z]+\.\d+$/.test(v)) return "named_article_decimal";
  if (/^\d+[a-zA-Z]+\.\d+\.[a-zA-Z]+$/.test(v)) return "named_decimal_letter";

  return "other";
}

function getBaseArticleFamily(articleNumber: string): string {
  const v = String(articleNumber || "").trim();
  const match = v.match(/^\d+[a-zA-Z]*/);
  return match ? match[0] : v;
}

function buildGeneratorPrompt(params: {
  regulationCode: string;
  articleNumber: string;
  articleTitleEn: string;
  articleText: string;
  correctPosition: 1 | 2 | 3 | 4;
}) {
  return `
You are generating exam-quality FIFA Football Agent Exam practice questions.

Your task:
Create exactly 1 high-quality multiple-choice question based only on the regulation article provided.

Rules:
- Return JSON only
- Do not return markdown
- Do not return explanation outside the JSON
- Do not invent legal rules not supported by the source article
- The question must be based on the supplied article
- The question should be exam-quality and scenario-based where possible
- The question must be clear, professional, and similar in style to a real FIFA exam preparation question
- Generate English, French, and Spanish together
- Create exactly 4 answer options
- Exactly 1 option must be correct
- Distractors must be plausible
- Do not use "all of the above" or "none of the above"
- Keep the three languages aligned in meaning
- difficulty must be one of: easy, medium, hard
- question_type must be "standard"
- The correct answer must be placed at option position ${params.correctPosition}
- Do not change that correct answer position
- The options must use sort_order values 1, 2, 3, and 4 exactly
- Only the option at position ${params.correctPosition} may have "is_correct": true
- All other options must have "is_correct": false

Return exactly this JSON shape:

{
  "question_text_en": "...",
  "question_text_fr": "...",
  "question_text_es": "...",
  "explanation_en": "...",
  "explanation_fr": "...",
  "explanation_es": "...",
  "difficulty": "medium",
  "scenario_type": "...",
  "question_type": "standard",
  "options": [
    {
      "option_text_en": "...",
      "option_text_fr": "...",
      "option_text_es": "...",
      "is_correct": ${params.correctPosition === 1 ? "true" : "false"},
      "sort_order": 1
    },
    {
      "option_text_en": "...",
      "option_text_fr": "...",
      "option_text_es": "...",
      "is_correct": ${params.correctPosition === 2 ? "true" : "false"},
      "sort_order": 2
    },
    {
      "option_text_en": "...",
      "option_text_fr": "...",
      "option_text_es": "...",
      "is_correct": ${params.correctPosition === 3 ? "true" : "false"},
      "sort_order": 3
    },
    {
      "option_text_en": "...",
      "option_text_fr": "...",
      "option_text_es": "...",
      "is_correct": ${params.correctPosition === 4 ? "true" : "false"},
      "sort_order": 4
    }
  ]
}

Source article metadata:
- Regulation code: ${params.regulationCode}
- Article number: ${params.articleNumber}
- Article title (EN): ${params.articleTitleEn}

Source article text:
${params.articleText}

Important:
- Base the question on the source article only
- If the article is too short or too vague to support a good exam question, still return valid JSON, but make the question as careful and text-grounded as possible
- Do not mention the article text directly in the options unless necessary
`;
}

function getCorrectPosition(questionIndex: number): 1 | 2 | 3 | 4 {
  const positions: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
  return positions[questionIndex % 4];
}

type GeneratedDraft = {
  question_text_en: string;
  question_text_fr: string;
  question_text_es: string;
  explanation_en: string | null;
  explanation_fr: string | null;
  explanation_es: string | null;
  difficulty: "easy" | "medium" | "hard";
  scenario_type: string | null;
  question_type: string;
  options: Array<{
    option_text_en: string;
    option_text_fr: string;
    option_text_es: string;
    is_correct: boolean;
    sort_order: 1 | 2 | 3 | 4;
  }>;
};

type RegulationRow = {
  id: string;
  code: string;
  slug: string | null;
  name_en: string | null;
  name_fr: string | null;
  name_es: string | null;
  version_label: string | null;
};

type RegulationArticleRow = {
  id: string;
  regulation_id: string;
  article_number: string;
  article_key: string | null;
  page_number: number | null;
  title_en: string | null;
  title_fr: string | null;
  title_es: string | null;
  preview_en: string | null;
  preview_fr: string | null;
  preview_es: string | null;
  sort_order: number | null;
};

type RegulationArticleCandidateRow = RegulationArticleRow & {
  question_drafts: Array<{ count: number }>;
};

async function generateDraftWithOpenAI(prompt: string): Promise<GeneratedDraft> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "generated_draft",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              question_text_en: { type: "string" },
              question_text_fr: { type: "string" },
              question_text_es: { type: "string" },
              explanation_en: { type: ["string", "null"] },
              explanation_fr: { type: ["string", "null"] },
              explanation_es: { type: ["string", "null"] },
              difficulty: {
                type: "string",
                enum: ["easy", "medium", "hard"]
              },
              scenario_type: {
                type: ["string", "null"]
              },
              question_type: {
                type: "string",
                enum: ["standard"]
              },
              options: {
                type: "array",
                minItems: 4,
                maxItems: 4,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    option_text_en: { type: "string" },
                    option_text_fr: { type: "string" },
                    option_text_es: { type: "string" },
                    is_correct: { type: "boolean" },
                    sort_order: {
                      type: "integer",
                      enum: [1, 2, 3, 4]
                    }
                  },
                  required: [
                    "option_text_en",
                    "option_text_fr",
                    "option_text_es",
                    "is_correct",
                    "sort_order"
                  ]
                }
              }
            },
            required: [
              "question_text_en",
              "question_text_fr",
              "question_text_es",
              "explanation_en",
              "explanation_fr",
              "explanation_es",
              "difficulty",
              "scenario_type",
              "question_type",
              "options"
            ]
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const messageItem = result?.output?.find((item: any) => item?.type === "message");
  const textItem = messageItem?.content?.find((item: any) => item?.type === "output_text");
  const outputText = textItem?.text;

  if (!outputText) {
    throw new Error(`No structured output returned from OpenAI. Raw result: ${JSON.stringify(result)}`);
  }

  return JSON.parse(outputText) as GeneratedDraft;
}

function getPriorityRank(regulationCode: string, articleNumber: string): number {
  const rootArticle = parseInt(String(articleNumber).split(".")[0], 10);

  if (Number.isNaN(rootArticle)) return 999;

  // Prioritize the most tested FFAR articles
  if (regulationCode === "FFAR") {
    if ([12, 13, 14, 15, 16].includes(rootArticle)) return 0;
  }

  return 1;
}

function resolveTopicId(regulationCode: string, articleNumber: string): number | null {
  const article = String(articleNumber || "").trim();
  const rootArticle = parseInt(article.split(".")[0], 10);

  if (regulationCode === "FFAR") {
    // Topic 11 = minors
    if (rootArticle === 13) return 11;

    // Topic 9 = service-fees-commissions
    if (
      [
        "14",
        "14.1",
        "14.2",
        "14.3",
        "14.10",
        "14.11",
        "14.12",
        "14.13",
        "15"
      ].includes(article)
    ) {
      return 9;
    }

    // Topic 10 = conflicts-of-interest
    if (
      [
        "1.2.c",
        "12.8",
        "12.8.a",
        "12.9",
        "12.9.a",
        "12.9.b",
        "12.9.c",
        "12.10",
        "16",
        "19"
      ].includes(article)
    ) {
      return 10;
    }

    // Existing broad FFAR mappings
    if (rootArticle === 12) return 2; // representation-agreements
    if ([10, 11, 17, 18].includes(rootArticle)) return 4; // general FFAR / guard-like bucket
    return 1; // ffar-basics
  }

  if (regulationCode === "RSTP") return 5;
  if (regulationCode === "STATUTES") return 6;
  if (regulationCode === "FCE") return 7;
  if (regulationCode === "FDC") return 8;
  if (regulationCode === "GUARDIANS") return 4;

  return null;
}

function canGenerateMoreFromArticle(existingCount: number): boolean {
  return existingCount < 3;
}

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let requestBody: any = {};
    try {
      requestBody = await req.json();
    } catch {
      requestBody = {};
    }

    const batchSize = Math.max(1, Math.min(Number(requestBody.batchSize ?? 2), 10));

    const requestedRegulationCodes: string[] = Array.isArray(requestBody.regulationCodes)
      ? requestBody.regulationCodes
          .map((v: unknown) => String(v).trim().toUpperCase())
          .filter(Boolean)
      : [];

    const regulationCodes =
      requestedRegulationCodes.length > 0 ? requestedRegulationCodes : ["FFAR"];

      const requestedArticleNumbers: string[] = Array.isArray(requestBody.articleNumbers)
  ? requestBody.articleNumbers
      .map((v: unknown) => String(v).trim())
      .filter(Boolean)
  : [];

    const { data: regulationsData, error: regulationsError } = await supabase
      .from("regulations")
      .select(`
        id,
        code,
        slug,
        name_en,
        name_fr,
        name_es,
        version_label
      `)
      .in("code", regulationCodes);

    if (regulationsError) {
      throw new Error(`Regulations query failed: ${JSON.stringify(regulationsError)}`);
    }

    if (!regulationsData || regulationsData.length === 0) {
      throw new Error(`No regulations found for codes: ${regulationCodes.join(", ")}`);
    }

    const regulationRows = regulationsData as RegulationRow[];
    const regulationIds = regulationRows.map((r) => r.id);

    const summary: Array<{
      regulation_code: string;
      article_number: string;
      regulation_article_id: string;
      inserted_draft_id: number;
    }> = [];

    for (let i = 0; i < batchSize; i += 1) {
   let articlesQuery = supabase
  .from("regulation_articles")
  .select(`
    id,
    regulation_id,
    article_number,
    article_key,
    page_number,
    title_en,
    title_fr,
    title_es,
    preview_en,
    preview_fr,
    preview_es,
    sort_order,
    question_drafts(count)
  `)
  .eq("is_active", true)
  .in("regulation_id", regulationIds);

if (requestedArticleNumbers.length > 0) {
  articlesQuery = articlesQuery.in("article_number", requestedArticleNumbers);
}

const { data: articles, error: articlesError } = await articlesQuery
  .order("sort_order", { ascending: true, nullsFirst: false })
  .order("article_number", { ascending: true });

if (articlesError) {
  throw new Error(`Article query failed: ${JSON.stringify(articlesError)}`);
}

if (!articles || articles.length === 0) {
  throw new Error("No active articles found");
}
const selectedArticle = (articles as RegulationArticleCandidateRow[])
  .map((article) => ({
    ...article,
    draftCount: article.question_drafts?.[0]?.count ?? 0
  }))
  .filter((article) => article.draftCount < 3)
  .sort((a, b) => {
    if (a.draftCount !== b.draftCount) {
      return a.draftCount - b.draftCount;
    }

    const regulationA = regulationRows.find((r) => r.id === a.regulation_id);
    const regulationB = regulationRows.find((r) => r.id === b.regulation_id);

    const codeA = regulationA?.code || "";
    const codeB = regulationB?.code || "";

    const priorityA = getPriorityRank(codeA, a.article_number);
    const priorityB = getPriorityRank(codeB, b.article_number);

    if (priorityA !== priorityB) return priorityA - priorityB;

    const sortA = a.sort_order ?? 999999;
    const sortB = b.sort_order ?? 999999;

    if (sortA !== sortB) return sortA - sortB;

    return a.article_number.localeCompare(b.article_number);
  })[0] ?? null;

if (!selectedArticle) {
  break;
}

console.log(
  `Trying ${selectedArticle.article_number} | type=${classifyArticleNumber(selectedArticle.article_number)} | family=${getBaseArticleFamily(selectedArticle.article_number)} | id=${selectedArticle.id}`
);


      const regulation =
        regulationRows.find((r) => r.id === selectedArticle!.regulation_id) || null;

      if (!regulation) {
        throw new Error("No regulation found for selected article");
      }

      const resolvedTopicId = resolveTopicId(regulation.code, selectedArticle.article_number);

      if (!resolvedTopicId) {
        throw new Error(
          `No topic mapping found for regulation ${regulation.code} article ${selectedArticle.article_number}`
        );
      }

      const { count: existingDraftCount, error: existingDraftCountError } = await supabase
        .from("question_drafts")
        .select("*", { count: "exact", head: true });

      if (existingDraftCountError) {
        throw new Error(`Draft count query failed: ${JSON.stringify(existingDraftCountError)}`);
      }

      const correctPosition = getCorrectPosition(existingDraftCount || 0);

      const prompt = buildGeneratorPrompt({
        regulationCode: regulation.code,
        articleNumber: selectedArticle.article_number,
        articleTitleEn: selectedArticle.title_en || "",
        articleText: selectedArticle.preview_en || "",
        correctPosition
      });

      console.log(`Generating question for ${selectedArticle.article_number}`);
      const draft = await generateDraftWithOpenAI(prompt);

      const normalizedDraft: GeneratedDraft = {
        ...draft,
        options: draft.options
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((option) => ({
            ...option,
            is_correct: option.sort_order === correctPosition
          }))
      };

      const { count: existingForArticleCount, error: existingForArticleCountError } = await supabase
        .from("question_drafts")
        .select("*", { count: "exact", head: true })
        .eq("regulation_article_id", selectedArticle.id);

      if (existingForArticleCountError) {
        throw new Error(`Existing article draft count failed: ${JSON.stringify(existingForArticleCountError)}`);
      }

      if ((existingForArticleCount || 0) >= 3) {
  console.log(`Skipping article ${selectedArticle.article_number} because it already has ${existingForArticleCount} drafts.`);
  continue;
  }

      const { data: insertedDraft, error: draftInsertError } = await supabase
        .from("question_drafts")
        .insert({
          topic_id: resolvedTopicId,
          regulation_id: selectedArticle.regulation_id,
          regulation_article_id: selectedArticle.id,
          regulation_code: regulation.code,
          article_number: selectedArticle.article_number,
          source_article_title: selectedArticle.title_en || null,
          source_article_text: selectedArticle.preview_en || "",
          question_text_en: normalizedDraft.question_text_en,
          question_text_fr: normalizedDraft.question_text_fr,
          question_text_es: normalizedDraft.question_text_es,
          explanation_en: normalizedDraft.explanation_en,
          explanation_fr: normalizedDraft.explanation_fr,
          explanation_es: normalizedDraft.explanation_es,
          difficulty: normalizedDraft.difficulty || "medium",
          scenario_type: normalizedDraft.scenario_type,
          draft_status: "pending",
          article_question_index: (existingForArticleCount || 0) + 1,
          generator_prompt_version: "v1",
          generation_model: "gpt-4.1-mini",
          generation_version: "article-traversal-v2",
          reference_article: selectedArticle.article_number,
          reference_title: selectedArticle.title_en || null,
          reference_preview_en: selectedArticle.preview_en || null,
          reference_preview_fr: selectedArticle.preview_fr || null,
          reference_preview_es: selectedArticle.preview_es || null,
          reference_page: selectedArticle.page_number || null,
          question_type: normalizedDraft.question_type || "standard",
          source_regulation_id: selectedArticle.regulation_id,
          source_article: selectedArticle.article_number,
          source_page: selectedArticle.page_number || null,
          reference_article_key: selectedArticle.article_key || null
        })
        .select()
        .single();

      if (draftInsertError) {
        throw new Error(`Draft insert failed: ${JSON.stringify(draftInsertError)}`);
      }

      const optionsPayload = normalizedDraft.options.map((option) => ({
        question_draft_id: insertedDraft.id,
        option_text_en: option.option_text_en,
        option_text_fr: option.option_text_fr,
        option_text_es: option.option_text_es,
        is_correct: option.is_correct,
        sort_order: option.sort_order
      }));

      const { error: optionsInsertError } = await supabase
        .from("question_draft_options")
        .insert(optionsPayload);

      if (optionsInsertError) {
        throw new Error(`Draft options insert failed: ${JSON.stringify(optionsInsertError)}`);
      }

      const { error: referenceInsertError } = await supabase
        .from("question_draft_references")
        .insert({
          question_draft_id: insertedDraft.id,
          regulation_article_id: selectedArticle.id,
          is_primary: true,
          sort_order: 1
        });

      if (referenceInsertError) {
        throw new Error(`Draft reference insert failed: ${JSON.stringify(referenceInsertError)}`);
      }

      summary.push({
        regulation_code: regulation.code,
        article_number: selectedArticle.article_number,
        regulation_article_id: selectedArticle.id,
        inserted_draft_id: insertedDraft.id
      });
    }

    return new Response(
      JSON.stringify(
        {
          message: "batch generation complete",
          batchSizeRequested: batchSize,
          regulationCodes,
          generatedCount: summary.length,
          summary
        },
        null,
        2
      ),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});