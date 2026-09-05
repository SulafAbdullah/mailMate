// src/constants/formOptions.js

// src/constants/formOptions.js

export const TONE_OPTIONS = {
  en: [
    { id: 'formal', label: 'Formal & Respectful' },
    { id: 'urgent', label: 'Time-Sensitive / Urgent' },
    { id: 'inquiry', label: 'Inquiry / Question' },
    { id: 'apologetic', label: 'Apologetic / Notice' },
  ],
  ar: [
    { id: 'formal', label: 'رسمي ومهذب' },
    { id: 'urgent', label: 'عاجل / ذو أهمية زمنية' },
    { id: 'inquiry', label: 'استفسار وتوضيح' },
    { id: 'apologetic', label: 'اعتذار / إشعار غياب' },
  ],
};

export const EMAIL_REASONS = {
  en: [
    'Assignment Extension Request',
    'Office Hours / Meeting Appointment',
    'Grade & Feedback Clarification',
    'Absence / Medical Leave Notification',
    'Letter of Recommendation Request',
    'Exam Conflict / Rescheduling Inquiry',
    'General Question / Other',
  ],
  ar: [
    'طلب تمديد موعد تسليم التكليف',
    'حجز موعد خلال الساعات المكتبية',
    'استفسار وتوضيح حول الدرجة / التقييم',
    'إشعار بالغياب / عذر طبي',
    'طلب خطاب توصية (تزكية)',
    'تعارض في مواعيد الاختبارات',
    'سؤال عام / استفسار آخر',
  ],
};

export const REASON_HINTS = {
  en: {
    'Assignment Extension Request': 'Mention the specific assignment name, original due date, proposed new deadline, and reason.',
    'Office Hours / Meeting Appointment': 'State your preferred days/times and 1-2 specific questions to discuss.',
    'Grade & Feedback Clarification': 'Mention the assessment name and specific points you would like to review.',
    'Absence / Medical Leave Notification': 'State the date(s) of absence, class topic, and note if medical report is attached.',
    'Letter of Recommendation Request': 'Include target program/scholarship and upcoming deadline.',
    'Exam Conflict / Rescheduling Inquiry': 'Specify the conflicting courses and dates.',
    'General Question / Other': 'Summarize your core question in 1-2 sentences.',
  },
  ar: {
    'طلب تمديد موعد تسليم التكليف': 'اذكر اسم التكليف، الموعد الأصلي، الموعد المقترح للتسليم، وسبب التأخير.',
    'حجز موعد خلال الساعات المكتبية': 'حدد الأيام والأوقات المناسبة لك وموضوع النقاش باختصار.',
    'استفسار وتوضيح حول الدرجة / التقييم': 'اذكر اسم الاختبار أو التكليف والنقاط التي تود مراجعتها.',
    'إشعار بالغياب / عذر طبي': 'اذكر تاريخ الغياب، المحاضرة، وهل أرفقت التقرير الطبي.',
    'طلب خطاب توصية (تزكية)': 'اذكر الجهة أو البرنامج الأكاديمي المستهدف وموعد التقديم النهائي.',
    'تعارض في مواعيد الاختبارات': 'حدد المقررات المتعارضة ومواعيد الاختبارات.',
    'سؤال عام / استفسار آخر': 'لخص استفسارك بوضوح في جملة أو جملتين.',
  },
};