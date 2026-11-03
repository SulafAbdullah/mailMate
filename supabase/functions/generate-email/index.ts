// Setup type definitions for Deno runtime in TypeScript
// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData = await req.json();
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY secret in Supabase");
    }

    const prompt = `Write an academic email with the following details:
- Student Name: ${formData.studentName}
- Student ID: ${formData.studentId}
- Recipient/Professor: ${formData.professorName}
- Course: ${formData.courseName}
- Purpose: ${formData.reasonType}
- Tone: ${formData.tone}
- Specific Details/Context: ${formData.customDetails}
- Language: ${formData.language}

Provide a well-structured academic email draft with a clear subject line and formal body.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mailmate.app",
        "X-Title": "Mailmate",
      },
      body: JSON.stringify({
        model:"nvidia/nemotron-3.5-lightning:free",
        messages: [
          {
            role: "system",
            content: "You are an expert academic communications assistant helping university students write professional emails.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter returned [${response.status}]: ${errText}`);
    }

    const aiData = await response.json();
    const draft = aiData.choices?.[0]?.message?.content || "No draft could be generated.";

    return new Response(JSON.stringify({ draft }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});