'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap, Users, ShieldCheck, HeartHandshake,
  Sparkles, Award, MapPin, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="bg-ink text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E0A526_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="container-tibeb max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-gold text-xs font-bold mb-4 border border-white/15">
            <Sparkles size={14} className="text-gold" />
            Our Mission & Story
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
            Empowering Higher Education <br />
            <span className="text-gold">Across Ethiopia</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Tibeb (meaning "Wisdom" and "Skill") was created to solve the single largest hurdle Ethiopian university students face: getting access to authentic, verified past exam papers and high-caliber mentors without unfair barriers.
          </p>
        </div>
      </section>

      {/* The Story & Problem */}
      <section className="container-tibeb max-w-5xl px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-green block">Why We Built Tibeb</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink leading-tight">
              From dorm photocopies to an intelligent digital learning campus.
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              For decades, students in Addis Ababa University, Jimma, Bahir Dar, and across Ethiopia relied on blurry, missing photocopies passed down through dormitories. Answers were frequently wrong, mathematical steps were unreadable, and rural campus students were severely disadvantaged.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              In 2024, our team of Ethiopian software engineers and university teaching assistants founded Tibeb. We set an unbreakable rule: <strong>keep every test strictly 20 ETB</strong> so any student with a simple Telebirr balance can prepare effectively and pass with confidence.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 space-y-6">
            <h3 className="font-bold text-ink text-lg">Our Core Pillars</h3>
            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-muted text-green flex items-center justify-center font-bold flex-shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-ink text-sm">Affordable for Every Student</h4>
                  <p className="mt-0.5">Strict 20 ETB pricing per test. Integrated with Telebirr and CBE Birr for friction-free access.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-ink text-sm">Detailed Step-by-Step Solutions</h4>
                  <p className="mt-0.5">Questions include clear answers and step-by-step explanations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-ink text-sm">Offline First PWA</h4>
                  <p className="mt-0.5">Built to run flawlessly on low-bandwidth Ethiopian mobile networks with full offline caching.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Ethiopian Leadership / Campuses */}
      <section className="container-tibeb max-w-5xl px-4 py-20 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-green mb-2 block">Our Presence</span>
        <h2 className="text-2xl sm:text-3xl font-black text-ink mb-4">Campuses & Student Hubs</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mb-12">
          We maintain student ambassadors and academic contributors across major Ethiopian university campuses.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          {[
            { city: 'Addis Ababa', campus: '4 Kilo & 6 Kilo', count: 'Past Exam Bank' },
            { city: 'Adama', campus: 'ASTU Main Campus', count: 'Past Exam Bank' },
            { city: 'Jimma', campus: 'Main & JIT Campus', count: 'Past Exam Bank' },
            { city: 'Bahir Dar', campus: 'Poly & Peda Campuses', count: 'Past Exam Bank' },
          ].map(hub => (
            <div key={hub.city} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-green font-bold mb-1">
                <MapPin size={12} /> {hub.city}
              </div>
              <h4 className="font-bold text-ink text-sm mb-1">{hub.campus}</h4>
              <p className="text-[11px] text-gray-400">{hub.count}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/catalog"
            className="px-6 py-3.5 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all"
          >
            Explore University Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
