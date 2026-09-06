// this file is responsible for interacting with the OpenRouter API to generate academic emails based on user input.

// src/services/ai.js

export async function generateAcademicEmail(formData) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate email draft.');
  }

  return data.draft;
}