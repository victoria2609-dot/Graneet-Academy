'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GraneetLogo from './GraneetLogo';

const BREADCRUMBS: Record<string, string> = {
  '/onboarding': 'Ton onboarding',
  '/value-propositions': 'Value propositions',
  '/disc': 'DISC',
};

export default function AcademyHeader() {
  const pathname = usePathname();
  const breadcrumb = BREADCRUMBS[pathname];
  const isHome = pathname === '/';

  return (
    <header className="academy-header">
      <div className="academy-header-inner">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <GraneetLogo color="#F5F5F0" height={24} />
            <span className="academy-header-divider" />
            <span className="academy-header-label">Academy</span>
          </Link>
        </div>

        {breadcrumb && !isHome && (
          <nav className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,245,240,0.6)' }}>
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: '#F5F5F0' }}>{breadcrumb}</span>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <div className="academy-avatar">GA</div>
        </div>
      </div>
    </header>
  );
}
