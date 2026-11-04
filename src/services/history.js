// src/services/history.js
// This file provides functions to fetch and delete email generation history from the Supabase database.
import { supabase } from './supabaseClient';
// Fetches the generation history for the currently authenticated user
export async function fetchUserGenerations() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return [];
  const { data, error } = await supabase
    .from('generations')
    .select('id, recipient, course_name, purpose, tone, specific_context, generated_draft, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching history:', error);
    throw error;
  }

  return data;
}
// Deletes a specific generation entry by its ID
export async function deleteGeneration(id) {
  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting generation:', error);
    throw error;
  }
}