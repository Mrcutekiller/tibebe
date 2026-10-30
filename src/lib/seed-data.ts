// src/lib/seed-data.ts — Clean production definitions with ZERO fake/demo data
// All actual data is fetched live from Supabase tables

export interface University {
  id: string;
  name: string;
  short: string;
  location: string;
  color: string;
  departments: { id: string; name: string }[];
}

export interface Question {
  id: string;
  question_number: number;
  page_number?: number;
  question_text: string;
  options: { key: string; text: string }[];
  correct_option: string;
  explanation: string;
  formula?: string;
  topic?: string;
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  university_id: string;
  university: string;
  department: string;
  subject: string;
  exam_type: 'Final' | 'Mid' | 'Quiz' | 'Class Test';
  year: number;
  semester: string;
  price: number; // strictly 20 ETB
  is_free_sample: boolean;
  status: 'published' | 'draft';
  pages: number;
  has_answers: boolean;
  has_explanations: boolean;
  rating: number;
  reviews: number;
  purchases: number;
  description: string;
  tags: string[];
  duration_minutes?: number;
  images?: string[];
  questions?: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
  video_url?: string;
  summary?: string;
  content?: string;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  university: string;
  department: string;
  instructor: string;
  price: number;
  original_price: number;
  rating: number;
  reviews: number;
  students: number;
  lessons_count: number;
  lessons?: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  has_certificate: boolean;
  description: string;
  learning_outcomes: string[];
  modules: CourseModule[];
  tags: string[];
}

export interface TelegramPremiumPlan {
  id: string;
  name: string;
  duration: string;
  months: number;
  price: number;
  original_price: number;
  discount_percent: number;
  badge?: string;
  popular?: boolean;
  description: string;
  delivery: string;
  features: string[];
}

// ==============================================================================
// ZERO MOCK RECORDS — STARTING CLEAN FROM 0
// ==============================================================================

// All universities are added by Owner/Admin via Admin Portal and stored in Supabase
export const UNIVERSITIES: University[] = [];

// All exams are uploaded by Owner/Admin via Admin Portal and stored in Supabase
export const EXAMS: Exam[] = [];

// All courses are added by Owner/Admin via Admin Portal and stored in Supabase
export const COURSES: Course[] = [];

// All bundles start empty until created by Admin
export const BUNDLES: any[] = [];

// Telegram Premium Service Pricing (Official 3, 6, 12 Months Tiers)
export const TELEGRAM_PREMIUM_PLANS: TelegramPremiumPlan[] = [
  {
    id: 'tg-3m',
    name: 'Telegram Premium 3 Months',
    duration: '3 Months',
    months: 3,
    price: 1850,
    original_price: 2450,
    discount_percent: 24,
    badge: 'Popular',
    popular: true,
    description: '3-month Telegram Premium membership delivered directly to your username via Telebirr or CBE.',
    delivery: 'Instant (5-15 mins via @username)',
    features: [
      '4 GB file uploads (books, exam PDFs, high-res videos)',
      'Faster download speed for university files',
      'Voice-to-text audio message transcription',
      'Exclusive star reaction badges & premium stickers',
      'Zero ads in channels & public groups',
      'Real-time automated chat translations'
    ]
  },
  {
    id: 'tg-6m',
    name: 'Telegram Premium 6 Months',
    duration: '6 Months',
    months: 6,
    price: 3600,
    original_price: 4900,
    discount_percent: 26,
    badge: 'Recommended',
    popular: false,
    description: 'Full semester 6-month Telegram Premium access for high-speed file sharing and study materials.',
    delivery: 'Instant (5-15 mins via @username)',
    features: [
      '180 days uninterrupted Telegram Premium',
      'Instant activation directly to your @handle',
      'Max download bandwidth for course materials',
      'Voice note speech-to-text with one tap',
      'Star badge + custom reactive emojis',
      'Zero advertising anywhere on Telegram',
      'Priority customer support via Telegram'
    ]
  },
  {
    id: 'tg-12m',
    name: 'Telegram Premium 1 Year (12 Months)',
    duration: '12 Months',
    months: 12,
    price: 7190,
    original_price: 9900,
    discount_percent: 28,
    badge: 'Best Value 👑',
    popular: false,
    description: 'Complete 1-year Telegram Premium subscription. Pay with Telebirr and enjoy all year round.',
    delivery: 'Instant (5-15 mins via @username)',
    features: [
      '365 days full Telegram Premium membership',
      '4 GB upload limit for all videos & large files',
      'Infinite cloud storage for notes & documents',
      'Exclusive profile icons, colors & star badges',
      'Automatic audio transcription in chats',
      'VIP Telegram concierge activation guarantee'
    ]
  }
];

export const PRODUCTS = TELEGRAM_PREMIUM_PLANS.map(plan => ({
  id: plan.id,
  name: plan.name,
  subtitle: plan.description,
  price: plan.price,
  original_price: plan.original_price,
  category: 'Telegram Premium',
  stock: 999,
  rating: 0,
  reviews: 0,
  description: plan.description,
  images: [],
  sizes: [plan.duration],
  variants: ['Direct @Username Gift / Activation'],
  delivery_days: plan.delivery,
  specifications: plan.features.map(f => ({ label: 'Feature', value: f }))
}));
