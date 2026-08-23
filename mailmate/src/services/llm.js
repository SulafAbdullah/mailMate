// this file is responsible for interacting with the OpenRouter API to generate academic emails based on user input.

// src/services/ai.js

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateAcademicEmail(formData) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('API key missing. Please add VITE_OPENROUTER_API_KEY to your .env.local file.');
  }

  const systemPrompt = `You are an expert academic advisor and university communication specialist.
Your task is to write a polite, concise, and professionally structured academic email from a university student to a professor or instructor.

### Language & Formatting Guidelines:
1. **Target Language**: Write the entire email in the requested Language (${formData.language}).
   - **For English**:
     - Subject Line: Subject: [Course] - [Specific Purpose] - [Student Name] ([Student ID])
     - Salutation: Dear Professor [Last Name] / Dear Dr. [Last Name]
     - Sign-off: Best regards / Sincerely, followed by student signature block.
   - **For Arabic (العربية)**:
     - Subject Line: الموضوع: [اسم أو رمز المقرر] - [الهدف من الرسالة] - [اسم الطالب/ـة] ([الرقم الجامعي])
     - Salutation: سعادة الدكتور / الأستاذ الفاضل [الاسم الأخير]، حفظه الله / السلام عليكم ورحمة الله وبركاته
     - Sign-off: شاكر ومقدر لحسن تعاونكم / وتفضلوا بقبول فائق الاحترام والتقدير، followed by student signature block (الاسم، الرقم الجامعي، المقرر).

### General Constraints:
- Keep the body concise (under 150 words).
- Adapt strictly to the requested tone (${formData.tone}) while preserving high academic decorum and respect.
- Do not make up non-existent course policies or dates.
- Output ONLY the raw final email starting directly with the Subject/الموضوع line. Do not include markdown code fences, meta-commentary, or introductory remarks.`;

  const userPrompt = `Student Information:
- Student Name: ${formData.studentName}
- Student ID: ${formData.studentId}
- Professor / Recipient: ${formData.professorName}
- Course: ${formData.courseName}
- Purpose: ${formData.reasonType}
- Desired Tone: ${formData.tone}
- Language: ${formData.language}
- Context & Details: ${formData.customDetails}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'MailMate',
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated.';
}