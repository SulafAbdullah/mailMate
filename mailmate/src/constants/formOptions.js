// src/constants/formOptions.js

/**
 * Tone options available for email generation.
 * Each tone provides a short description to guide the AI prompt later.
 */
export const TONE_OPTIONS = [
  {
    id: 'formal_polite',
    label: 'Formal & Respectful',
    description: 'Standard academic etiquette for professors and department heads.',
  },
  {
    id: 'urgent',
    label: 'Time-Sensitive / Urgent',
    description: 'Direct and prompt for impending deadlines or immediate schedule conflicts.',
  },
  {
    id: 'inquiry',
    label: 'Inquiry / Question',
    description: 'Polite and focused on asking for clarification or feedback.',
  },
  {
    id: 'apologetic',
    label: 'Apologetic / Notice',
    description: 'Professional explanation for absences, missed deadlines, or unforeseen circumstances.',
  },
];

/**
 * Common academic email categories and reasons.
 */
export const EMAIL_REASONS = [
  'Assignment Extension Request',
  'Office Hours / Meeting Appointment',
  'Grade & Feedback Clarification',
  'Absence / Medical Leave Notification',
  'Letter of Recommendation Request',
  'Exam Conflict / Rescheduling Inquiry',
  'Course Registration / Prerequisite Override',
  'General Question / Other',
];

/**
 * Helper templates / default placeholders based on selected reason.
 * Useful for giving students hints on what context to include.
 */
export const REASON_HINTS = {
  'Assignment Extension Request': 'Mention the specific assignment name, original due date, proposed new deadline, and reason for delay.',
  'Office Hours / Meeting Appointment': 'State your preferred days/times and 1-2 specific topics or questions you want to discuss.',
  'Grade & Feedback Clarification': 'Mention the exam/assignment name and specific questions or rubrics you would like to review together.',
  'Absence / Medical Leave Notification': 'State the date(s) of absence, class topic missed, and note if medical documentation is attached.',
  'Letter of Recommendation Request': 'Include target program/scholarship, deadline, relevant course grades, and attached CV/resume.',
  'Exam Conflict / Rescheduling Inquiry': 'Specify the conflicting exam dates, course names, and relevant university scheduling policies.',
  'Course Registration / Prerequisite Override': 'Include section numbers, prerequisites completed, and graduation timeline context.',
  'General Question / Other': 'Summarize your core question clearly in 1-2 sentences.',
};