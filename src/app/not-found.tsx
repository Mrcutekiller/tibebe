import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 text-center">
      <div className="mb-8">
        <div
          className="text-9xl font-black leading-none"
          style={{ background: 'linear-gradient(135deg, var(--color-green), var(--color-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          404
        </div>
      </div>

      <h1 className="text-2xl font-bold text-ink mb-3">Page not found</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        The page you're looking for doesn't exist. It may have been moved or removed.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn btn-green btn-lg">
          ← Go Home
        </Link>
        <Link href="/catalog" className="btn btn-outline btn-lg">
          Browse Exams
        </Link>
      </div>

      {/* Decorative */}
      <div className="mt-12 text-6xl opacity-30 animate-float">📚</div>
    </div>
  );
}
