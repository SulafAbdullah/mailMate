// this file is responsible for interacting with the OpenRouter API to generate academic emails based on user input.

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateAcademicEmail(formData) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('API key missing. Please add VITE_OPENROUTER_API_KEY to your .env.local file.');
  }

  // System prompt that forces strict, professional academic structure
  const systemPrompt = `
You are an expert academic advisor and communication specialist.
Your task is to write a well-structured, polite, and concise academic email from a university student to a professor or instructor.

Guidelines:
1. Include a clear, professional Subject line formatted as: Subject: [Course] - [Purpose] - [Student Name] (Student ID)
2. Use a formal, respectful salutation (e.g., Dear Professor [Last Name] or Dear Dr. [Last Name]).
3. State the student's name, ID, and enrolled course in the first paragraph.
4. Clearly state the purpose, context, and requested action concisely.
5. Reflect the specified tone accurately.
6. Provide a polite closing and professional sign-off with student details.
7. Return ONLY the final email text (Subject + Body). Do not include conversational filler like "Here is your email:".
`;

  const userPrompt = `
Student Information:
- Student Name: ${formData.studentName}
- Student ID: ${formData.studentId}
- Professor / Recipient: ${formData.professorName}
- Course: ${formData.courseName}
- Purpose: ${formData.reasonType}
- Desired Tone: ${formData.tone}
- Context & Details: ${formData.customDetails}
`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173', // Optional for OpenRouter rankings
      'X-Title': 'MailMate',
    },
    body: JSON.stringify({
      // We use a free tier model on OpenRouter:
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