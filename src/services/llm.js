// // this file is responsible for interacting with the OpenRouter API to generate academic emails based on user input.

// // src/services/llm.js

// export async function generateAcademicEmail(formData) {
//   const response = await fetch('/api/generate', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(formData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.error || 'Failed to generate email draft.');
//   }

//   return data.draft;
// }

// src/services/llm.js

// This file is responsible for interacting with the Supabase Edge Function to generate academic emails based on user input.
// src/services/llm.js
// src/services/llm.js
import { supabase } from './supabaseClient';

export async function generateAcademicEmail(formData) {
  const { data, error } = await supabase.functions.invoke('generate-email', {
    body: formData,
  });

  if (error) {
    let errorDetail = error.message;

    // Check if Supabase passed along the raw response in error.context
    if (error.context) {
      try {
        // Read the body stream ONCE as plain text
        const rawBody = await error.context.text();

        try {
          // Attempt to parse JSON if returned by the Edge Function
          const parsed = JSON.parse(rawBody);
          errorDetail = parsed.error || parsed.message || rawBody;
        } catch {
          // If not JSON, use the raw text message
          if (rawBody) errorDetail = rawBody;
        }
      } catch (streamErr) {
        console.warn('Could not read error context stream:', streamErr);
      }
    }

    console.error('Edge Function invocation error:', errorDetail);
    throw new Error(errorDetail || 'Failed to generate email draft.');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.draft;
}