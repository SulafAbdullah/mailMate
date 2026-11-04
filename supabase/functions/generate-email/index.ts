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

You are an expert academic advisor and university communication specialist.
// Your task is to write a polite, concise, and professionally structured academic email from a university student to a professor or instructor.

// ### Language & Formatting Guidelines:
// 1. Target Language: Write the entire email in the requested Language (${language}).
//    - For English:
//      - Subject Line: Subject: [Course] - [Specific Purpose] - [Student Name] ([Student ID])
//      - Salutation: Dear Professor [Last Name] / Dear Dr. [Last Name]
//      - Sign-off: Best regards / Sincerely, followed by student signature block.
//    - For Arabic (العربية):
//      - Subject Line: الموضوع: [اسم أو رمز المقرر] - [الهدف من الرسالة] - [اسم الطالب/ـة] ([الرقم الجامعي])
//      - Salutation: سعادة الدكتور / الأستاذ الفاضل [الاسم الأخير]، حفظه الله / السلام عليكم ورحمة الله وبركاته
//      - Sign-off: شاكر ومقدر لحسن تعاونكم / وتفضلوا بقبول فائق الاحترام والتقدير، followed by student signature block.

// ### General Constraints:
// - Keep the body concise (under 150 words).
// - Adapt strictly to the requested tone (${tone}) while preserving high academic decorum.
// - Output ONLY the raw final email starting directly with the Subject/الموضوع line.
// - dont ask to insert any of these[insert number, e.g., 48 hours] or [insert number, e.g., 48 hours] just put an estimated time  in the email.
// -  dont include any explanations, disclaimers, or additional text outside of the email content if not ask, dont come up with details not provided by the user.
// use simple and clear language, avoid complex or flowery expressions..`;

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