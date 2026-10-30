'use client';

import { redirect } from 'next/navigation';

export interface StudyBundle {
  id: string;
  title: string;
  tagline: string;
  university: string;
  department: string;
  semester: string;
  badge: string;
  price: number;
  originalPrice: number;
  savings: string;
  rating: number;
  students: number;
  features: string[];
  itemsCount: {
    exams: number;
    courses: number;
    sheets: number;
  };
  highlightColor: string;
}

export const STUDY_BUNDLES: StudyBundle[] = [
  {
    id: 'bundle-freshman-eng',
    title: 'AAU Freshmen Pre-Engineering Exam Pack',
    tagline: 'Complete 1st Year Semester I & II exam prep kit.',
    university: 'AAU (4 Kilo)',
    department: 'Pre-Engineering / Technology',
    semester: 'Year 1 (Semester 1 & 2)',
    badge: 'Most Popular',
    price: 150,
    originalPrice: 280,
    savings: 'Save 46%',
    rating: 4.9,
    students: 1420,
    features: [
      '8 Verified Past Final & Midterm Exams with full answer keys',
      'Downloadable Comprehensive Engineering Formula Cheat Sheets (PDF)',
      'Unlimited access to interactive mock exam simulator with live timer'
    ],
    itemsCount: { exams: 8, courses: 0, sheets: 4 },
    highlightColor: '#0B5D3B'
  },
  {
    id: 'bundle-cs-core',
    title: 'Computer Science Core Exam Bundle',
    tagline: 'Data Structures, Algorithms, Discrete Math & Database Systems.',
    university: 'Universal (AAU, JU, BDU, ASTU)',
    department: 'Computer Science & Software Eng',
    semester: 'Year 2 & 3',
    badge: 'High Yield',
    price: 190,
    originalPrice: 350,
    savings: 'Save 45%',
    rating: 4.9,
    students: 980,
    features: [
      '10 Past Exam Papers with verified C++ & Python code solutions',
      'Relational Database Normalization & SQL Exam Guide',
      'Offline-ready PDF notes optimized for low-bandwidth mobile reading'
    ],
    itemsCount: { exams: 10, courses: 0, sheets: 5 },
    highlightColor: '#12202B'
  }
];

export default function BundlesPage() {
  redirect('/catalog');
}
