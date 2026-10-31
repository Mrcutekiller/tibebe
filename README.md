# Tibeb — Higher Education Platform (Ethiopia)

Past exam tests for Ethiopian university students, and official Telegram Premium.

---

## 🌐 Custom Domain Setup Guide (Vercel)

Follow these steps to connect your custom domain (e.g., `tibeb.et`, `tibebexams.com`):

### 1. Add Domain in Vercel
1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Select your `tibeb` project.
3. Navigate to **Settings** > **Domains**.
4. Enter your custom domain (e.g. `tibebexams.com` or `app.tibeb.et`) and click **Add**.
5. Choose whether to redirect `www.tibebexams.com` to `tibebexams.com` (recommended).

### 2. Configure DNS Records with Your Domain Registrar
Add the DNS records displayed in Vercel:

| Type | Name / Host | Value / Target | TTL |
|------|-------------|----------------|-----|
| **A** | `@` (root) | `76.76.21.21` | Automatic / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 3600 |

*For subdomains (e.g. `app.tibeb.et`):*
| Type | Name / Host | Value / Target | TTL |
|------|-------------|----------------|-----|
| **CNAME** | `app` | `cname.vercel-dns.com` | Automatic / 3600 |

### 3. Set Canonical App URL in Vercel Environment Variables
In **Project Settings** > **Environment Variables**, set:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```
This automatically configures canonical SEO URLs, Open Graph link previews, and sitemaps.

---

## 🛠️ Tech Stack & Security
- **Framework**: Next.js 16 (App Router, Turbopack, Standalone SSR/PWA)
- **Database & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS)
- **Payments**: Telebirr & CBE with server-side webhook signature verification
- **Offline Mode**: Service Worker with dorm caching and `/offline.html` fallback
