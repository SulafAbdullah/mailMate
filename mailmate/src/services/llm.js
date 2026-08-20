// this file is responsible for interacting with the OpenRouter API to generate academic emails based on user input.

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateAcademicEmail(formData) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('API key missing. Please add VITE_OPENROUTER_API_KEY to your .env.local file.');
  }

  // System prompt enclosed in template literals (backticks)
  const systemPrompt = `You are an expert academic advisor and university communication specialist.
Your task is to write a polite, concise, and professionally structured academic email from a student to a professor/instructor based on the provided inputs.

### Instructions & Structure:
1. **Subject Line**: Must follow the exact format: Subject: [Course] - [Specific Purpose] - [Student Name] ([Student ID])
2. **Salutation**: Use formal academic titles (Dear Professor [Last Name] or Dear Dr. [Last Name]). If the title is unknown, default to Dear Professor [Last Name].
3. **Opening**: Introduce the student (Name, ID, Course/Section) and state the email's primary objective within the first two sentences.
4. **Body (1–2 concise paragraphs)**:
   - Provide necessary context concisely.
   - Include a clear call-to-action (e.g., requesting an appointment, clarification, or extension) only if asked.
5. **Sign-off**: Include a polite closing (Best regards, or Sincerely,) followed by the full student signature block (Name, Student ID, Course).

### Constraints:
- Keep the body under 150 words.
- Adapt strictly to the specified tone while preserving professional academic etiquette.
- Do not invent non-existent course policies or dates; if a detail is missing, omit it or use an intuitive placeholder.
- Output ONLY the raw email text (starting directly from "Subject:"). Do not include meta-text, markdown backticks, or intro/outro commentary.`;

  // User prompt properly enclosed in backticks
  const userPrompt = `Student Information:
- Student Name: ${formData.studentName}
- Student ID: ${formData.studentId}
- Professor / Recipient: ${formData.professorName}
- Course: ${formData.courseName}
- Purpose: ${formData.reasonType}
- Desired Tone: ${formData.tone}
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