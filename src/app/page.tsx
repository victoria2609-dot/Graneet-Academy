'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AcademyHeader from '../components/AcademyHeader';
import { MODULE_LIST } from '../lib/brand';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  calendar: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="6" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 12h24" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 3v6M22 3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="22" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="23" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="23" r="1.5" fill="currentColor"/>
    </svg>
  ),
  hexagon: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M16 12L22 15.5V22.5L16 26L10 22.5V15.5L16 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  ),
  people: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 26c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="22" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M22 19c3.314 0 6 2.686 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

function getModuleStatus(mod: typeof MODULE_LIST[number]): 'available' | 'done' {
  if (typeof window === 'undefined') return 'available';
  if (mod.id === 'onboarding') {
    const progress = localStorage.getItem('graneet_progress');
    if (!progress) return 'available';
    try {
      const map = JSON.parse(progress);
      const doneCount = Object.values(map).filter((v) => v === 'Done').length;
      if (doneCount > 0 && doneCount === Object.keys(map).length) return 'done';
    } catch { /* */ }
    return 'available';
  }
  if (mod.id === 'value-propositions') {
    return localStorage.getItem('graneet_vp_done') === 'true' ? 'done' : 'available';
  }
  if (mod.id === 'disc') {
    return localStorage.getItem('graneet_disc_done') === 'true' ? 'done' : 'available';
  }
  return 'available';
}

function getGlobalProgress(): { done: number; total: number } {
  if (typeof window === 'undefined') return { done: 0, total: 3 };
  let done = 0;
  for (const mod of MODULE_LIST) {
    if (getModuleStatus(mod) === 'done') done++;
  }
  return { done, total: 3 };
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 3 });

  useEffect(() => {
    setMounted(true);
    setProgress(getGlobalProgress());
  }, []);

  const pct = Math.round((progress.done / progress.total) * 100);

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F0' }}>
      <AcademyHeader />

      {/* Hero */}
      <section className="academy-hero">
        <div className="max-w-5xl mx-auto px-6">
          <span className="academy-hero-tag">Formation interne</span>
          <h1 className="academy-hero-title">
            Bienvenue sur <strong>Graneet Academy</strong>
          </h1>
          <p className="academy-hero-desc">
            Tout ce dont tu as besoin pour monter en compétences, découvrir nos produits et devenir un expert Graneet.
          </p>
        </div>
      </section>

      {/* Progress strip */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl border px-6 py-4 flex items-center justify-between gap-4" style={{ borderColor: '#DDD5C8' }}>
          <span className="text-sm font-medium" style={{ color: '#141414' }}>Progression globale</span>
          <div className="flex-1 mx-4">
            <div className="w-full h-2 rounded-full" style={{ background: '#EDEBE6' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: mounted ? `${pct}%` : '0%', background: '#122428' }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#122428' }}>
            {mounted ? progress.done : 0} / {progress.total} modules complétés
          </span>
        </div>
      </div>

      {/* Modules grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODULE_LIST.map((mod) => {
            const status = mounted ? getModuleStatus(mod) : 'available';
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="academy-card group"
              >
                <div className="academy-card-top" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="academy-card-number">{mod.number}</span>
                    <span className="academy-card-icon" style={{ color: '#122428' }}>
                      {MODULE_ICONS[mod.icon]}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#141414' }}>
                    {mod.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#5A6672' }}>
                    {mod.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`academy-status ${status === 'done' ? 'academy-status-done' : 'academy-status-new'}`}>
                      {status === 'done' ? 'Complété' : 'Disponible'}
                    </span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <path d="M4.167 10h11.666M10.833 5l5 5-5 5" stroke="#122428" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="academy-footer">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-xs" style={{ color: 'rgba(245,245,240,0.5)' }}>
          <span>&copy; 2026 Graneet — Usage interne uniquement</span>
          <div className="flex gap-4">
            <span>Support</span>
            <span>Confidentialité</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
