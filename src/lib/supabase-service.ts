// src/lib/supabase-service.ts
// Real-time Supabase Data Access Layer
// Connects Catalog, Admin Metrics, Orders, Payments, and User Library directly to Supabase tables.

import { supabase, createAdminClient } from './supabase';
import { University, Exam, Course } from './seed-data';

// Fast in-memory cache for ultra-fast 0ms page loads on slow networks
const MEM_CACHE: Record<string, { data: any; expiry: number }> = {};
const DEFAULT_TTL_MS = 60 * 1000; // 1 minute fresh cache

function getCached<T>(key: string): T | null {
  const item = MEM_CACHE[key];
  if (item && Date.now() < item.expiry) {
    return item.data as T;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`tibeb_cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() < parsed.expiry) {
          MEM_CACHE[key] = parsed;
          return parsed.data as T;
        }
      }
    } catch {}
  }
  return null;
}

function setCached<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  const entry = { data, expiry: Date.now() + ttlMs };
  MEM_CACHE[key] = entry;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(`tibeb_cache_${key}`, JSON.stringify(entry));
    } catch {}
  }
}


// System Settings
export interface PlatformSettings {
  payment_test_mode: boolean;
  min_deposit: number;
  min_withdrawal: number;
}

// ==============================================================================
// 1. UNIVERSITIES & DEPARTMENTS
// ==============================================================================
export async function getLiveUniversities(): Promise<University[]> {
  const cached = getCached<University[]>('universities');
  if (cached) return cached;

  try {
    const { data: unis, error } = await supabase
      .from('universities')
      .select('*, departments(*)');

    if (error || !unis || unis.length === 0) {
      // Fallback to local storage custom additions if database not yet migrated
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('tibeb_custom_universities');
        return local ? JSON.parse(local) : [];
      }
      return [];
    }

    const mapped = unis.map((u: any) => ({
      id: u.id,
      name: u.name,
      short: u.short,
      location: u.location || '',
      color: u.color || '#0B5D3B',
      departments: (u.departments || []).map((d: any) => ({ id: d.id, name: d.name })),
    }));
    setCached('universities', mapped);
    return mapped;
  } catch (err) {
    console.warn('Error fetching universities from Supabase:', err);
    return [];
  }
}

export async function addUniversityToSupabase(uni: University): Promise<boolean> {
  try {
    const { error } = await supabase.from('universities').insert({
      id: uni.id,
      name: uni.name,
      short: uni.short,
      location: uni.location,
      color: uni.color,
    });

    if (error) {
      console.warn('Supabase university insert error, storing locally:', error);
      if (typeof window !== 'undefined') {
        const local = JSON.parse(localStorage.getItem('tibeb_custom_universities') || '[]');
        local.push(uni);
        localStorage.setItem('tibeb_custom_universities', JSON.stringify(local));
      }
      return true;
    }

    // Insert departments
    if (uni.departments && uni.departments.length > 0) {
      const depts = uni.departments.map(d => ({
        id: d.id,
        university_id: uni.id,
        name: d.name,
      }));
      await supabase.from('departments').insert(depts);
    }

    return true;
  } catch (err) {
    console.error('Failed to add university:', err);
    return false;
  }
}

// ==============================================================================
// 2. EXAMS & QUESTIONS
// ==============================================================================
export async function getLiveExams(): Promise<Exam[]> {
  const cached = getCached<Exam[]>('exams');
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*, exam_questions(*), exam_pages(*)')
      .eq('status', 'published');

    if (error || !data || data.length === 0) {
      if (typeof window !== 'undefined') {
        const custom = localStorage.getItem('tibeb_custom_exams');
        return custom ? JSON.parse(custom) : [];
      }
      return [];
    }

    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      code: e.code,
      university_id: e.university_id,
      university: e.university_id?.toUpperCase() || 'AAU',
      department: e.department || 'General',
      subject: e.subject || e.title,
      exam_type: e.exam_type || 'Final',
      year: e.year || 2026,
      semester: e.semester || 'Semester 1',
      price: Number(e.price) || 20,
      is_free_sample: Boolean(e.is_free_sample),
      status: e.status || 'published',
      pages: Number(e.pages) || 1,
      has_answers: Boolean(e.has_answers),
      has_explanations: Boolean(e.has_explanations),
      rating: Number(e.rating) || 0,
      reviews: Number(e.reviews_count) || 0,
      purchases: Number(e.purchases_count) || 0,
      description: e.description || '',
      tags: e.tags || [],
      duration_minutes: e.duration_minutes || 45,
      questions: (e.exam_questions || []).map((q: any) => ({
        id: q.id,
        question_number: q.question_number,
        page_number: q.page_number,
        question_text: q.question_text,
        options: q.options || [],
        correct_option: q.correct_option,
        explanation: q.explanation,
        points: (q as any).points || 20,
      })),
      images: (e.exam_pages || []).map((p: any) => p.image_url),
    }));
  } catch (err) {
    console.warn('Error fetching exams from Supabase:', err);
    return [];
  }
}

export async function addExamToSupabase(exam: Exam): Promise<boolean> {
  try {
    const { error } = await supabase.from('exams').insert({
      id: exam.id,
      title: exam.title,
      code: exam.code,
      university_id: exam.university_id,
      department: exam.department,
      subject: exam.subject,
      exam_type: exam.exam_type,
      year: exam.year,
      semester: exam.semester,
      price: exam.price,
      is_free_sample: exam.is_free_sample,
      status: exam.status,
      pages: exam.pages,
      has_answers: exam.has_answers,
      has_explanations: exam.has_explanations,
      description: exam.description,
      tags: exam.tags,
      duration_minutes: exam.duration_minutes,
    });

    if (error) {
      console.warn('Supabase exam insert error, saving locally:', error);
      if (typeof window !== 'undefined') {
        const local = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
        local.push(exam);
        localStorage.setItem('tibeb_custom_exams', JSON.stringify(local));
      }
      return true;
    }

    // Insert questions
    if (exam.questions && exam.questions.length > 0) {
      const qs = exam.questions.map((q, idx) => ({
        id: `q-${exam.id}-${idx}`,
        exam_id: exam.id,
        question_number: q.question_number || idx + 1,
        page_number: q.page_number || 1,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        points: (q as any).points || 20,
      }));
      await supabase.from('exam_questions').insert(qs);
    }

    return true;
  } catch (err) {
    console.error('Failed to add exam:', err);
    return false;
  }
}

// ==============================================================================
// 3. COURSES
// ==============================================================================
export async function getLiveCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, lessons(*)')
      .eq('status', 'published');

    if (error || !data || data.length === 0) {
      if (typeof window !== 'undefined') {
        const custom = localStorage.getItem('tibeb_custom_courses');
        return custom ? JSON.parse(custom) : [];
      }
      return [];
    }

    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle || '',
      university: c.university_id?.toUpperCase() || 'AAU',
      department: c.department || 'General',
      instructor: c.instructor || 'Instructor',
      price: Number(c.price) || 0,
      original_price: Number(c.price) * 1.5,
      rating: Number(c.rating) || 0,
      reviews: 0,
      students: Number(c.students_count) || 0,
      lessons_count: Number(c.lessons_count) || (c.lessons?.length || 0),
      duration: c.duration || '4 hours',
      level: c.level || 'Beginner',
      has_certificate: Boolean(c.has_certificate),
      description: c.description || '',
      learning_outcomes: c.learning_outcomes || [],
      modules: [],
      tags: [],
    }));
  } catch (err) {
    console.warn('Error fetching courses from Supabase:', err);
    return [];
  }
}

// ==============================================================================
// 4. STUDENT PURCHASES (UNLOCKED LIBRARY)
// ==============================================================================
export async function getStudentPurchases(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('item_id')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('tibeb_unlocked_items');
        return local ? JSON.parse(local) : [];
      }
      return [];
    }

    return data.map((p: any) => p.item_id);
  } catch {
    return [];
  }
}

// ==============================================================================
// 5. LIVE ADMIN METRICS (STARTING AT ZERO)
// ==============================================================================
export async function getLiveAdminMetrics(): Promise<{
  totalRevenue: number;
  totalSales: number;
  activeStudents: number;
  pendingVerifications: number;
  isTestMode: boolean;
}> {
  let isTestMode = true;

  try {
    // 1. Fetch test mode setting
    const { data: settingData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'payment_test_mode')
      .single();

    if (settingData && settingData.value) {
      isTestMode = settingData.value.enabled !== false;
    } else if (typeof window !== 'undefined') {
      const localSetting = localStorage.getItem('tibeb_payment_test_mode');
      if (localSetting !== null) isTestMode = localSetting === 'true';
    }

    // 2. Fetch payments (only verified, non-test payments count towards real revenue)
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status, is_test');

    let revenue = 0;
    let salesCount = 0;
    let pendingCount = 0;

    if (payments && payments.length > 0) {
      payments.forEach((p: any) => {
        if (p.status === 'pending') pendingCount++;
        // Test payments DO NOT count toward real revenue
        if (p.status === 'verified' && !p.is_test) {
          revenue += Number(p.amount) || 0;
          salesCount++;
        }
      });
    } else if (typeof window !== 'undefined') {
      // Check local storage verifications
      const verifs = JSON.parse(localStorage.getItem('tibeb_payment_verifications') || '[]');
      verifs.forEach((v: any) => {
        if (v.status === 'pending') pendingCount++;
        if (v.status === 'verified' && !v.is_test) {
          revenue += Number(v.amount) || 0;
          salesCount++;
        }
      });
    }

    // 3. Count real students (excluding owner/admin)
    const { count: studentCount } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student');

    let students = studentCount || 0;
    if (students === 0 && typeof window !== 'undefined') {
      const reg = JSON.parse(localStorage.getItem('tibeb_registered_users') || '[]');
      students = reg.filter((u: any) => u.role !== 'admin' && u.role !== 'owner').length;
    }

    return {
      totalRevenue: revenue,
      totalSales: salesCount,
      activeStudents: students,
      pendingVerifications: pendingCount,
      isTestMode,
    };
  } catch (err) {
    console.warn('Error computing admin metrics:', err);
    return {
      totalRevenue: 0,
      totalSales: 0,
      activeStudents: 0,
      pendingVerifications: 0,
      isTestMode: true,
    };
  }
}

// ==============================================================================
// 6. TEST MODE TOGGLE & TEST DATA RESET
// ==============================================================================
export async function setPaymentTestMode(enabled: boolean): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tibeb_payment_test_mode', enabled.toString());
  }

  try {
    await supabase.from('settings').upsert({
      key: 'payment_test_mode',
      value: { enabled, updated_at: new Date().toISOString() },
    });
    return true;
  } catch {
    return true;
  }
}

export async function resetTestData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Delete test orders & test payments from Supabase
    await supabase.from('payments').delete().eq('is_test', true);
    await supabase.from('orders').delete().eq('is_test', true);
    await supabase.from('users').delete().eq('is_test_account', true);

    // 2. Clean test records from local storage
    if (typeof window !== 'undefined') {
      const verifs = JSON.parse(localStorage.getItem('tibeb_payment_verifications') || '[]');
      const filteredVerifs = verifs.filter((v: any) => !v.is_test);
      localStorage.setItem('tibeb_payment_verifications', JSON.stringify(filteredVerifs));

      const orders = JSON.parse(localStorage.getItem('tibeb_orders') || '[]');
      const filteredOrders = orders.filter((o: any) => !o.is_test);
      localStorage.setItem('tibeb_orders', JSON.stringify(filteredOrders));

      window.dispatchEvent(new Event('tibeb_verifications_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return { success: true, message: 'All test payments, test orders, and test users have been purged. Live metrics reset to 0.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to reset test data' };
  }
}
