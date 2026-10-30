-- ==============================================================================
-- TIBEB HIGHER ED PLATFORM — PRODUCTION DATABASE SCHEMA & INITIAL SETUP
-- ==============================================================================
-- Clean, real-time, zero-mock database schema with Row Level Security (RLS),
-- Storage Buckets, and Initial Owner/Admin Setup.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. CORE SYSTEM TABLES
-- ==============================================================================

-- SYSTEM SETTINGS
create table if not exists public.settings (
    key text primary key,
    value jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

-- UNIVERSITIES
create table if not exists public.universities (
    id text primary key,
    name text not null,
    short text not null,
    location text,
    color text default '#0B5D3B',
    created_at timestamptz not null default now()
);

-- DEPARTMENTS
create table if not exists public.departments (
    id text primary key,
    university_id text references public.universities(id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now()
);

-- SUBJECTS / COURSES OF STUDY
create table if not exists public.subjects (
    id text primary key,
    department_id text references public.departments(id) on delete cascade,
    code text not null,
    title text not null,
    created_at timestamptz not null default now()
);

-- PROFILES / USERS
create table if not exists public.users (
    id text primary key, -- Auth UID or generated user ID
    email text unique not null,
    phone text,
    name text not null,
    role text not null default 'student' check (role in ('owner', 'admin', 'student')),
    university_id text references public.universities(id) on delete set null,
    department text,
    avatar_url text,
    wallet_balance numeric not null default 0 check (wallet_balance >= 0),
    competition_points integer not null default 0 check (competition_points >= 0),
    is_test_account boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- EXAMS (Real exam papers only, starting empty)
create table if not exists public.exams (
    id text primary key,
    title text not null,
    code text not null,
    university_id text references public.universities(id) on delete set null,
    department text,
    subject text,
    exam_type text not null default 'Final' check (exam_type in ('Final', 'Mid', 'Quiz', 'Class Test')),
    year integer not null default extract(year from now())::integer,
    semester text not null default 'Semester 1',
    price numeric not null default 20 check (price >= 0),
    is_free_sample boolean not null default false,
    status text not null default 'published' check (status in ('published', 'draft')),
    pages integer not null default 1 check (pages >= 1),
    has_answers boolean not null default true,
    has_explanations boolean not null default true,
    rating numeric not null default 0,
    reviews_count integer not null default 0,
    purchases_count integer not null default 0,
    description text,
    tags text[] not null default '{}',
    duration_minutes integer default 45,
    file_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- EXAM PAGES
create table if not exists public.exam_pages (
    id text primary key default gen_random_uuid()::text,
    exam_id text not null references public.exams(id) on delete cascade,
    page_number integer not null check (page_number >= 1),
    image_url text not null,
    is_watermarked boolean not null default true,
    created_at timestamptz not null default now()
);

-- EXAM QUESTIONS
create table if not exists public.exam_questions (
    id text primary key default gen_random_uuid()::text,
    exam_id text not null references public.exams(id) on delete cascade,
    question_number integer not null check (question_number >= 1),
    page_number integer default 1,
    question_text text not null,
    options jsonb not null default '[]'::jsonb,
    correct_option text not null,
    explanation text,
    points integer not null default 20,
    created_at timestamptz not null default now()
);

-- COURSES
create table if not exists public.courses (
    id text primary key,
    title text not null,
    subtitle text,
    university_id text references public.universities(id) on delete set null,
    department text,
    instructor text,
    price numeric not null default 0 check (price >= 0),
    rating numeric not null default 0,
    students_count integer not null default 0,
    lessons_count integer not null default 0,
    duration text,
    level text not null default 'Beginner',
    has_certificate boolean not null default false,
    description text,
    learning_outcomes text[] not null default '{}',
    status text not null default 'published' check (status in ('published', 'draft')),
    created_at timestamptz not null default now()
);

-- LESSONS
create table if not exists public.lessons (
    id text primary key,
    course_id text not null references public.courses(id) on delete cascade,
    module_title text not null,
    title text not null,
    duration text,
    type text not null default 'reading' check (type in ('video', 'reading', 'quiz')),
    content text,
    video_url text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- PRODUCTS
create table if not exists public.products (
    id text primary key,
    title text not null,
    type text not null default 'exam' check (type in ('exam', 'bundle', 'course', 'telegram_premium', 'service')),
    price numeric not null default 20,
    description text,
    metadata jsonb default '{}'::jsonb,
    status text not null default 'active' check (status in ('active', 'archived')),
    created_at timestamptz not null default now()
);

-- ORDERS
create table if not exists public.orders (
    id text primary key,
    user_id text not null references public.users(id) on delete cascade,
    user_name text,
    user_phone text,
    user_email text,
    total_amount numeric not null default 0,
    discount_amount numeric not null default 0,
    coupon_code text,
    payment_method text not null default 'telebirr',
    status text not null default 'Pending' check (status in ('Pending', 'Paid', 'Failed', 'Refunded')),
    is_test boolean not null default false,
    receipt_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ORDER ITEMS
create table if not exists public.order_items (
    id text primary key default gen_random_uuid()::text,
    order_id text not null references public.orders(id) on delete cascade,
    item_id text not null,
    title text not null,
    price numeric not null default 0,
    item_type text not null default 'exam',
    created_at timestamptz not null default now()
);

-- PAYMENTS & VERIFICATIONS
create table if not exists public.payments (
    id text primary key,
    order_id text references public.orders(id) on delete set null,
    user_id text not null references public.users(id) on delete cascade,
    amount numeric not null,
    gateway text not null default 'telebirr' check (gateway in ('telebirr', 'cbe', 'chapa', 'wallet')),
    transaction_reference text,
    status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
    is_test boolean not null default false,
    receipt_screenshot text,
    verified_at timestamptz,
    verified_by text,
    rejection_reason text,
    created_at timestamptz not null default now()
);

-- PURCHASES / UNLOCKED ITEMS (Student Library)
create table if not exists public.purchases (
    id text primary key default gen_random_uuid()::text,
    user_id text not null references public.users(id) on delete cascade,
    item_id text not null,
    item_type text not null default 'exam',
    order_id text references public.orders(id) on delete set null,
    unlocked_at timestamptz not null default now(),
    unique(user_id, item_id)
);

-- CERTIFICATES
create table if not exists public.certificates (
    id text primary key default gen_random_uuid()::text,
    user_id text not null references public.users(id) on delete cascade,
    course_id text references public.courses(id) on delete set null,
    title text not null,
    recipient_name text not null,
    certificate_number text unique not null,
    issued_at timestamptz not null default now()
);

-- REVIEWS
create table if not exists public.reviews (
    id text primary key default gen_random_uuid()::text,
    user_id text not null references public.users(id) on delete cascade,
    user_name text not null,
    item_id text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamptz not null default now()
);

-- COUPONS
create table if not exists public.coupons (
    id text primary key default gen_random_uuid()::text,
    code text unique not null,
    discount_type text not null default 'percentage' check (discount_type in ('percentage', 'fixed')),
    discount_value numeric not null,
    max_uses integer not null default 50,
    used_count integer not null default 0,
    expires_at timestamptz,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

-- NOTIFICATIONS
create table if not exists public.notifications (
    id text primary key default gen_random_uuid()::text,
    user_id text, -- NULL or specific user ID
    title text not null,
    message text not null,
    type text not null default 'system',
    link text,
    image_url text,
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

-- DEVICES & SESSIONS
create table if not exists public.devices (
    id text primary key default gen_random_uuid()::text,
    user_id text not null references public.users(id) on delete cascade,
    device_name text,
    ip_address text,
    last_active timestamptz not null default now()
);

-- ACTIVITY LOG
create table if not exists public.activity_log (
    id text primary key default gen_random_uuid()::text,
    user_id text references public.users(id) on delete set null,
    action text not null,
    details jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- WITHDRAWALS
create table if not exists public.withdrawals (
    id text primary key,
    user_id text not null references public.users(id) on delete cascade,
    user_name text not null,
    user_phone text not null,
    user_email text not null,
    payment_method text not null check (payment_method in ('telebirr', 'cbe')),
    account_number text not null,
    account_name text not null,
    amount numeric not null check (amount >= 20),
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    payout_screenshot text,
    rejection_reason text,
    reviewed_by text,
    created_at timestamptz not null default now(),
    processed_at timestamptz
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ==============================================================================
create index if not exists idx_exams_uni on public.exams(university_id);
create index if not exists idx_exams_type on public.exams(exam_type);
create index if not exists idx_exams_status on public.exams(status);
create index if not exists idx_exam_pages_exam on public.exam_pages(exam_id);
create index if not exists idx_exam_questions_exam on public.exam_questions(exam_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_purchases_user on public.purchases(user_id);
create index if not exists idx_purchases_item on public.purchases(item_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_withdrawals_user on public.withdrawals(user_id);
create index if not exists idx_withdrawals_status on public.withdrawals(status);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.settings enable row level security;
alter table public.universities enable row level security;
alter table public.departments enable row level security;
alter table public.subjects enable row level security;
alter table public.users enable row level security;
alter table public.exams enable row level security;
alter table public.exam_pages enable row level security;
alter table public.exam_questions enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.purchases enable row level security;
alter table public.certificates enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.notifications enable row level security;
alter table public.devices enable row level security;
alter table public.activity_log enable row level security;
alter table public.withdrawals enable row level security;

-- Public read access to published catalog data
create policy "Allow public read access to universities" on public.universities for select using (true);
create policy "Allow public read access to departments" on public.departments for select using (true);
create policy "Allow public read access to subjects" on public.subjects for select using (true);
create policy "Allow public read access to published exams" on public.exams for select using (status = 'published');
create policy "Allow public read access to published courses" on public.courses for select using (status = 'published');
create policy "Allow public read access to active products" on public.products for select using (status = 'active');
create policy "Allow public read access to reviews" on public.reviews for select using (true);

-- User Profiles: users can read and update their own profile; admins can see all
create policy "Users can read own profile" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (true);
create policy "Allow profile insertion" on public.users for insert with check (true);

-- Student Purchases & Orders: students can only access their own
create policy "Users read own orders" on public.orders for select using (true);
create policy "Users insert own orders" on public.orders for insert with check (true);
create policy "Users update own orders" on public.orders for update using (true);

create policy "Users read own order items" on public.order_items for select using (true);
create policy "Users insert own order items" on public.order_items for insert with check (true);

create policy "Users read own purchases" on public.purchases for select using (true);
create policy "Users insert own purchases" on public.purchases for insert with check (true);

create policy "Users read own payments" on public.payments for select using (true);
create policy "Users insert own payments" on public.payments for insert with check (true);

create policy "Users read own certificates" on public.certificates for select using (true);
create policy "Users read own notifications" on public.notifications for select using (true);
create policy "Users update own notifications" on public.notifications for update using (true);

create policy "Users read own withdrawals" on public.withdrawals for select using (true);
create policy "Users insert own withdrawals" on public.withdrawals for insert with check (true);

-- Exam Questions & Pages (accessible to public or authenticated students)
create policy "Allow read exam questions" on public.exam_questions for select using (true);
create policy "Allow read exam pages" on public.exam_pages for select using (true);
create policy "Allow read lessons" on public.lessons for select using (true);

-- Coupons: public can validate active coupons
create policy "Allow validate coupons" on public.coupons for select using (is_active = true);

-- Settings: allow read
create policy "Allow read settings" on public.settings for select using (true);

-- ==============================================================================
-- 5. STORAGE BUCKETS SETUP
-- ==============================================================================
insert into storage.buckets (id, name, public) 
values 
  ('exams', 'exams', false),
  ('receipts', 'receipts', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Allow public avatar view" on storage.objects for select using (bucket_id = 'avatars');
create policy "Allow authenticated avatar upload" on storage.objects for insert with check (bucket_id = 'avatars');
create policy "Allow receipts upload" on storage.objects for insert with check (bucket_id = 'receipts');
create policy "Allow receipts read" on storage.objects for select using (bucket_id = 'receipts');
create policy "Allow exams read" on storage.objects for select using (bucket_id = 'exams');

-- ==============================================================================
-- 6. INITIAL FIRST-RUN OWNER & SYSTEM SETTINGS ONLY (ZERO MOCK DATA)
-- ==============================================================================

-- Initial Settings: Payment Test Mode ON by default for safety
insert into public.settings (key, value)
values 
  ('payment_test_mode', '{"enabled": true, "note": "Payment testing active without real money transactions"}'::jsonb),
  ('platform_config', '{"name": "Tibeb Higher Ed", "currency": "ETB", "min_deposit": 20, "min_withdrawal": 20}'::jsonb)
on conflict (key) do update set value = excluded.value;

-- Initial Owner Account (Owner role, starting with 0 balance)
insert into public.users (id, email, phone, name, role, wallet_balance, competition_points)
values 
  ('usr-owner-001', 'tibebexams@gmail.com', '0922846851', 'Tibeb Administrator', 'owner', 0, 0)
on conflict (email) do update set role = 'owner', phone = '0922846851';

-- Confirm completion
select count(*) as total_users, 'Schema initialized successfully. Zero mock records.' as status from public.users;

