'use client';

import { useState, useEffect, useCallback } from 'react';
import AcademyHeader from '../../components/AcademyHeader';
import type { Task, NormalizedTimeline, TeamValue, TaskStatus } from '../api/tasks/route';

// ─── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY_USER = 'graneet_user';
const STORAGE_KEY_PROGRESS = 'graneet_progress';

const TEAMS = [
  'Tech',
  'Product Management',
  'Product design',
  'Customer Success',
  'Sales',
  'HR',
  'SDR',
] as const;

type Team = (typeof TEAMS)[number];

interface UserData {
  prenom: string;
  equipe: string;
  poste?: string;
}

const ALL_TIMELINES: NormalizedTimeline[] = [
  'Jour 1',
  'Semaine 1',
  'Semaine 2',
  'Semaine 3',
  'Semaine 4+',
  'Mois 2',
];

const TIMELINE_LABELS: Record<NormalizedTimeline, string> = {
  'Jour 1': 'Jour 1',
  'Semaine 1': 'Semaine 1',
  'Semaine 2': 'Semaine 2',
  'Semaine 3': 'Semaine 3',
  'Semaine 4+': 'Semaine 4+',
  'Mois 2': 'Mois 2',
  'Post-attribution': 'Post',
};

const STATUS_CYCLE: TaskStatus[] = ['To do', 'In Progress', 'Done'];

const TEAM_COLORS: Record<string, { bg: string; text: string }> = {
  Tech: { bg: '#EAF0EE', text: '#1A2A27' },
  'Product Management': { bg: '#FAF5FF', text: '#6B21A8' },
  'Product design': { bg: '#FDF2F8', text: '#9D174D' },
  'Customer Success': { bg: '#EAF2EF', text: '#1B6B52' },
  Sales: { bg: '#FFF7ED', text: '#C2410C' },
  HR: { bg: '#FEFCE8', text: '#A16207' },
  SDR: { bg: '#F0F9FF', text: '#0369A1' },
};

type ProgressMap = Record<string, TaskStatus>;

// ─── Helper components ──────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string | null }) {
  if (!type) return null;
  let cls = 'badge-dojo';
  if (type.includes('Présentation')) cls = 'badge-presentation';
  else if (type.includes('Set-up')) cls = 'badge-setup';
  else if (type.includes('Task')) cls = 'badge-task';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {type}
    </span>
  );
}

function StatusButton({
  status,
  onClick,
}: {
  status: TaskStatus;
  onClick: () => void;
}) {
  const styles: Record<TaskStatus, { bg: string; text: string; label: string }> = {
    'To do': { bg: 'var(--status-todo-bg)', text: 'var(--status-todo-text)', label: 'À faire' },
    'In Progress': { bg: 'var(--status-inprogress-bg)', text: 'var(--status-inprogress-text)', label: 'En cours' },
    Done: { bg: 'var(--status-done-bg)', text: 'var(--status-done-text)', label: 'Terminé ✓' },
    'Bac rouge': { bg: '#FFF5F5', text: '#C53030', label: 'Bac rouge' },
  };

  const s = styles[status] ?? styles['To do'];

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:opacity-80 active:scale-95 cursor-pointer select-none"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.text}22` }}
      title="Cliquer pour changer le statut"
    >
      {status === 'Done' && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {status === 'In Progress' && (
        <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ background: 'var(--status-inprogress-text)' }} />
      )}
      {s.label}
    </button>
  );
}

function TaskCard({
  task,
  status,
  onStatusChange,
}: {
  task: Task;
  status: TaskStatus;
  onStatusChange: (taskId: string, next: TaskStatus) => void;
}) {
  const handleToggle = () => {
    const currentIdx = STATUS_CYCLE.indexOf(status);
    const next = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
    onStatusChange(task.id, next);
  };

  const isDone = status === 'Done';

  return (
    <div
      className={`card p-4 flex flex-col sm:flex-row sm:items-start gap-3 transition-all duration-200 ${isDone ? 'opacity-60' : ''}`}
    >
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={task.type} />
          {task.board === 'tech' && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: '#EAF2EF', color: '#1B4D3E', border: '1px solid #C0DAD3' }}
            >
              Tech
            </span>
          )}
        </div>

        <h3
          className={`text-sm font-semibold leading-snug ${isDone ? 'line-through' : ''}`}
          style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}
        >
          {task.url && task.url !== '#' ? (
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'inherit' }}
            >
              {task.name}
            </a>
          ) : (
            task.name
          )}
        </h3>

        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {task.duration !== null && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 3v3l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {task.duration < 1
                ? `${task.duration * 60} min`
                : task.duration === 1
                ? '1 h'
                : `${task.duration} h`}
            </span>
          )}
          {task.url && task.url !== '#' && (
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M4.5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V6.5M7 1h3m0 0v3m0-3L4.5 6.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Ouvrir dans Notion
            </a>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <StatusButton status={status} onClick={handleToggle} />
      </div>
    </div>
  );
}

// ─── Welcome Form ───────────────────────────────────────────────────────────────

function WelcomeForm({ onComplete }: { onComplete: (user: UserData) => void }) {
  const [prenom, setPrenom] = useState('');
  const [equipe, setEquipe] = useState<Team | ''>('');
  const [poste, setPoste] = useState('');
  const [errors, setErrors] = useState<{ prenom?: string; equipe?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { prenom?: string; equipe?: string } = {};
    if (!prenom.trim()) newErrors.prenom = 'Ton prénom est requis.';
    if (!equipe) newErrors.equipe = 'Veuillez sélectionner ton équipe.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    const userData: UserData = {
      prenom: prenom.trim(),
      equipe: equipe as Team,
      poste: poste.trim() || undefined,
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));

    setTimeout(() => {
      onComplete(userData);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col lg:flex-row" style={{ background: 'var(--background)' }}>
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(145deg, #0A1614 0%, #1A2A27 55%, #2D4A45 100%)' }}
      >
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-10" style={{ background: 'white' }} />

        <div className="relative z-10 flex flex-col items-center gap-8 text-white text-center max-w-md">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight text-balance">
              Bienvenue dans<br />l&apos;aventure Graneet&nbsp;🚀
            </h1>
            <p className="text-lg opacity-80 leading-relaxed text-balance">
              Ton parcours d&apos;intégration personnalisé t&apos;attend. Découvre l&apos;entreprise, l&apos;équipe et tes outils — à ton rythme.
            </p>
          </div>

          <div className="w-full space-y-3 mt-4">
            {[
              { icon: '🗂️', text: 'Parcours adapté à ton équipe' },
              { icon: '✅', text: 'Suivi de progression en temps réel' },
              { icon: '📚', text: 'Ressources et formations intégrées' },
              { icon: '🤝', text: 'Rencontrez vos collègues dès le Jour 1' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium opacity-90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
              Commençons&nbsp;! 🎉
            </h2>
            <p className="text-base" style={{ color: 'var(--text-muted)' }}>
              Quelques infos pour personnaliser ton parcours d&apos;intégration.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label htmlFor="prenom" className="label">
                Prénom <span style={{ color: '#E53E3E' }}>*</span>
              </label>
              <input
                id="prenom"
                type="text"
                value={prenom}
                onChange={(e) => {
                  setPrenom(e.target.value);
                  if (errors.prenom) setErrors((prev) => ({ ...prev, prenom: undefined }));
                }}
                placeholder="Ex : Marie"
                className="input-field"
                autoComplete="given-name"
                autoFocus
              />
              {errors.prenom && (
                <p className="mt-1.5 text-sm font-medium" style={{ color: '#E53E3E' }}>
                  {errors.prenom}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="equipe" className="label">
                Équipe <span style={{ color: '#E53E3E' }}>*</span>
              </label>
              <div className="relative">
                <select
                  id="equipe"
                  value={equipe}
                  onChange={(e) => {
                    setEquipe(e.target.value as Team | '');
                    if (errors.equipe) setErrors((prev) => ({ ...prev, equipe: undefined }));
                  }}
                  className="input-field appearance-none pr-10"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Sélectionne ton équipe…</option>
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#718096" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {errors.equipe && (
                <p className="mt-1.5 text-sm font-medium" style={{ color: '#E53E3E' }}>
                  {errors.equipe}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="poste" className="label">
                Poste{' '}
                <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                  (optionnel)
                </span>
              </label>
              <input
                id="poste"
                type="text"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                placeholder="Ex : Développeur Full Stack"
                className="input-field"
                autoComplete="organization-title"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base mt-2"
              style={isLoading ? { opacity: 0.7, cursor: 'not-allowed', transform: 'none', boxShadow: 'none' } : {}}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Chargement…
                </>
              ) : (
                <>
                  Démarrer mon parcours
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.167 10h11.666M10.833 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            Tes données sont stockées uniquement dans ton navigateur.{' '}
            <span className="font-medium">Aucune donnée n&apos;est transmise à nos serveurs.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [activeTimeline, setActiveTimeline] = useState<NormalizedTimeline>('Jour 1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setMounted(true);

    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (!storedUser) {
      setShowForm(true);
      setLoading(false);
      return;
    }

    let parsedUser: UserData;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      setShowForm(true);
      setLoading(false);
      return;
    }

    if (!parsedUser.prenom || !parsedUser.equipe) {
      setShowForm(true);
      setLoading(false);
      return;
    }

    setUser(parsedUser);

    const storedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (storedProgress) {
      try {
        setProgress(JSON.parse(storedProgress));
      } catch { /* ignore */ }
    }

    fetch(`/api/tasks?team=${encodeURIComponent(parsedUser.equipe)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then((data: { tasks: Task[] }) => {
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les tâches. Veuillez réessayer.');
        setLoading(false);
      });
  }, []);

  const handleFormComplete = (userData: UserData) => {
    setUser(userData);
    setShowForm(false);
    setLoading(true);

    fetch(`/api/tasks?team=${encodeURIComponent(userData.equipe)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then((data: { tasks: Task[] }) => {
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les tâches. Veuillez réessayer.');
        setLoading(false);
      });
  };

  const handleStatusChange = useCallback((taskId: string, next: TaskStatus) => {
    setProgress((prev) => {
      const updated = { ...prev, [taskId]: next };
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    setUser(null);
    setTasks([]);
    setProgress({});
    setShowForm(true);
  };

  const getTaskStatus = useCallback(
    (task: Task): TaskStatus => {
      return progress[task.id] ?? task.status ?? 'To do';
    },
    [progress]
  );

  const visibleTasks = tasks.filter((task) => {
    if (!user) return false;
    const teamMatch =
      task.team.includes('ALL' as TeamValue) ||
      task.team.includes(user.equipe as TeamValue);
    if (!teamMatch) return false;
    return task.timeline === activeTimeline;
  });

  const availableTimelines = ALL_TIMELINES.filter((tl) => {
    if (tl === 'Mois 2' && user?.equipe !== 'Tech') return false;
    return true;
  });

  const userTasks = tasks.filter((task) => {
    if (!user) return false;
    return (
      task.team.includes('ALL' as TeamValue) ||
      task.team.includes(user.equipe as TeamValue)
    );
  });

  const doneTasks = userTasks.filter((t) => getTaskStatus(t) === 'Done').length;
  const totalTasks = userTasks.length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const teamStyle = user ? TEAM_COLORS[user.equipe] ?? { bg: '#F1F5F9', text: '#475569' } : null;

  if (!mounted) return null;

  // Show welcome form if no user
  if (showForm) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <AcademyHeader />
        <WelcomeForm onComplete={handleFormComplete} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <AcademyHeader />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--primary)' }}>
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Chargement de ton parcours…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <AcademyHeader />
        <div className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <div className="text-center max-w-sm space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Oups, quelque chose s&apos;est mal passé
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {error}
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary text-sm">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <AcademyHeader />

      {/* ── Sub-header with user info + progress ── */}
      <div
        className="sticky top-[56px] z-30 border-b"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                Bonjour {user?.prenom}&nbsp;👋
              </h1>
              {user?.poste && (
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {user.poste}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {user && teamStyle && (
              <span
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: teamStyle.bg, color: teamStyle.text }}
              >
                {user.equipe}
              </span>
            )}
            <button onClick={handleLogout} className="btn-ghost text-xs" title="Se déconnecter">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Progression globale
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
              {doneTasks}/{totalTasks} tâches — {progressPct}&nbsp;%
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Timeline tabs ── */}
      <div
        className="sticky top-[164px] z-20 border-b"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1.5 py-3 overflow-x-auto scrollbar-hide">
            {availableTimelines.map((tl) => {
              const isActive = activeTimeline === tl;
              const taskCount = tasks.filter((t) => {
                if (!user) return false;
                const teamMatch =
                  t.team.includes('ALL' as TeamValue) ||
                  t.team.includes(user.equipe as TeamValue);
                return teamMatch && t.timeline === tl;
              }).length;

              return (
                <button
                  key={tl}
                  onClick={() => setActiveTimeline(tl)}
                  className={`timeline-tab flex items-center gap-1.5 ${isActive ? 'timeline-tab-active' : 'timeline-tab-inactive'}`}
                >
                  {TIMELINE_LABELS[tl]}
                  {taskCount > 0 && (
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                      style={
                        isActive
                          ? { background: 'rgba(255,255,255,0.25)', color: 'white' }
                          : { background: 'var(--border)', color: 'var(--text-secondary)' }
                      }
                    >
                      {taskCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Task list ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {TIMELINE_LABELS[activeTimeline]}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {visibleTasks.length === 0
                ? 'Aucune tâche pour cette période'
                : `${visibleTasks.length} tâche${visibleTasks.length > 1 ? 's' : ''}`}
            </p>
          </div>
          {visibleTasks.length > 0 && (
            <div className="text-right">
              <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                {visibleTasks.filter((t) => getTaskStatus(t) === 'Done').length} /{' '}
                {visibleTasks.length} terminée{visibleTasks.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {visibleTasks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Rien à faire ici !
            </h3>
            <p className="text-sm text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Aucune tâche n&apos;est prévue pour ton équipe durant cette période.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleTasks.map((task) => (
              <div key={task.id} style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <TaskCard
                  task={task}
                  status={getTaskStatus(task)}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        )}

        <div className="h-16" />
      </main>
    </div>
  );
}
