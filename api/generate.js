// api/generate.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read the key from the backend environment (NOT prefixed with VITE_)
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { studentName, studentId, professorName, courseName, reasonType, tone, language, customDetails } = req.body;

  const systemPrompt = `You are an expert academic advisor and university communication specialist.
Your task is to write a polite, concise, and professionally structured academic email from a university student to a professor or instructor.

### Language & Formatting Guidelines:
1. Target Language: Write the entire email in the requested Language (${language}).
   - For English:
     - Subject Line: Subject: [Course] - [Specific Purpose] - [Student Name] ([Student ID])
     - Salutation: Dear Professor [Last Name] / Dear Dr. [Last Name]
     - Sign-off: Best regards / Sincerely, followed by student signature block.
   - For Arabic (العربية):
     - Subject Line: الموضوع: [اسم أو رمز المقرر] - [الهدف من الرسالة] - [اسم الطالب/ـة] ([الرقم الجامعي])
     - Salutation: سعادة الدكتور / الأستاذ الفاضل [الاسم الأخير]، حفظه الله / السلام عليكم ورحمة الله وبركاته
     - Sign-off: شاكر ومقدر لحسن تعاونكم / وتفضلوا بقبول فائق الاحترام والتقدير، followed by student signature block.

### General Constraints:
- Keep the body concise (under 150 words).
- Adapt strictly to the requested tone (${tone}) while preserving high academic decorum.
- Output ONLY the raw final email starting directly with the Subject/الموضوع line.
- dont ask to insert any of these[insert number, e.g., 48 hours] or [insert number, e.g., 48 hours] just put an estimated time  in the email.
-  dont include any explanations, disclaimers, or additional text outside of the email content if not ask, dont come up with details not provided by the user.
use simple and clear language, avoid complex or flowery expressions.`;


  const userPrompt = `Student Information:
- Student Name: ${studentName}
- Student ID: ${studentId}
- Professor / Recipient: ${professorName}
- Course: ${courseName}
- Purpose: ${reasonType}
- Desired Tone: ${tone}
- Language: ${language}
- Context & Details: ${customDetails}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vercel.com',
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
      return res.status(response.status).json({
        error: errorData?.error?.message || `OpenRouter API failed with status ${response.status}`,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No draft generated.';

    return res.status(200).json({ draft: content });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error occurred.' });
  }
}