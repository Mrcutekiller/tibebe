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

export const STUDY_BUNDLES: StudyBundle[] = [];

export default function BundlesPage() {
  redirect('/catalog');
}
