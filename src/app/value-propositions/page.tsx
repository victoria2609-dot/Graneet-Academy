'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AcademyHeader from '../../components/AcademyHeader';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface ModuleDef {
  id: string;
  week: string;
  month: string | null;
  tag: { label: string; cls: string };
  title: string;
  breadcrumb: string;
  content: string;
}

const MODULES: ModuleDef[] = [
  { id: 'm1', week: 'S1\u20132', month: 'Mois 1 \u2014 Fondations', tag: { label: '\ud83c\udfd7\ufe0f Contexte BTP', cls: 'tag-gray' }, title: 'Comprendre nos clients\u00a0: la PME du BTP', breadcrumb: 'Mois 1 \u00b7 Semaines 1\u20132', content: 'intro_btp' },
  { id: 'm2', week: 'S3\u20134', month: null, tag: { label: '\ud83d\udee1\ufe0f Rentabilit\u00e9 chantier', cls: 'tag-green' }, title: 'Prot\u00e9ger les marges chantier en temps r\u00e9el', breadcrumb: 'Mois 1 \u00b7 Semaines 3\u20134', content: 'rentabilite' },
  { id: 'm3', week: 'S5\u20136', month: null, tag: { label: '\ud83d\udccb Devis & Commercial', cls: 'tag-blue' }, title: 'Gagner en efficacit\u00e9 sur le chiffrage et la gestion commerciale', breadcrumb: 'Mois 1 \u00b7 Semaines 5\u20136', content: 'devis' },
  { id: 'm4', week: 'S7\u20138', month: 'Mois 2 \u2014 Ma\u00eetrise', tag: { label: '\ud83d\udcb6 Facturation', cls: 'tag-gold' }, title: 'Facturer juste et am\u00e9liorer la tr\u00e9sorerie', breadcrumb: 'Mois 2 \u00b7 Semaines 7\u20138', content: 'facturation' },
  { id: 'm5', week: 'S9\u201310', month: null, tag: { label: '\ud83d\uded2 Achats & Planning', cls: 'tag-orange' }, title: "Contr\u00f4ler les achats et planifier la main d\u2019\u0153uvre", breadcrumb: 'Mois 2 \u00b7 Semaines 9\u201310', content: 'achats' },
  { id: 'm6', week: 'S11\u201312', month: null, tag: { label: '\ud83c\udfaf Pitch & Situations', cls: 'tag-purple' }, title: 'Mise en situation r\u00e9elle CS & Sales', breadcrumb: 'Mois 2 \u00b7 Semaines 11\u201312', content: 'pitch' },
];

/* ------------------------------------------------------------------ */
/*  SVG helpers                                                        */
/* ------------------------------------------------------------------ */

const GraneetLogo = ({ width = 150, height = 32, fill = '#F2EFE6' }: { width?: number; height?: number; fill?: string }) => (
  <svg width={width} height={height} viewBox="0 0 426 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M416.984 62.6414C416.984 67.1416 418.859 69.6617 422.877 69.6617H426.002V77.2219H421.538C411.717 77.2219 407.967 71.4617 407.967 63.5415V37.9807H400.914V30.6005H407.967V19.8001L416.984 15.75V30.6005H425.912V37.9807H416.984V62.6414Z" fill={fill} />
    <path d="M398.101 63.3685C395.511 72.9988 387.655 78.309 377.031 78.309C363.282 78.309 354.086 68.3187 354.086 53.6482C354.086 39.6078 363.728 29.4375 376.941 29.4375C392.922 29.4375 398.726 42.1279 398.815 54.7283V56.4383H362.925C363.639 65.3486 369.174 70.7488 376.941 70.7488C382.655 70.7488 387.476 68.4987 389.083 63.3685H398.101ZM363.014 49.5081H389.708C388.994 42.1279 384.887 36.8177 376.941 36.8177C369.085 36.8177 364.085 41.9479 363.014 49.5081Z" fill={fill} />
    <path d="M349.304 63.3685C346.715 72.9988 338.858 78.309 328.234 78.309C314.485 78.309 305.289 68.3187 305.289 53.6482C305.289 39.6078 314.931 29.4375 328.145 29.4375C344.126 29.4375 349.929 42.1279 350.018 54.7283V56.4383H314.128C314.842 65.3486 320.377 70.7488 328.145 70.7488C333.858 70.7488 338.679 68.4987 340.287 63.3685H349.304ZM314.217 49.5081H340.911C340.197 42.1279 336.09 36.8177 328.145 36.8177C320.288 36.8177 315.288 41.9479 314.217 49.5081Z" fill={fill} />
    <path d="M259.523 77.139V30.6075H268.63V39.0678C271.04 33.7576 275.326 29.4375 282.468 29.4375C294.521 29.4375 299.074 37.4477 299.074 47.5281V77.139H289.968V49.0581C289.968 41.3179 287.021 37.3577 280.683 37.3577C274.076 37.3577 268.719 43.0279 268.719 54.9083V77.139H259.523Z" fill={fill} />
    <path d="M212.474 44.7342C213.546 37.624 219.438 29.3438 231.491 29.3438C247.65 29.3438 250.507 39.5141 250.507 48.1543V67.0549C250.507 70.565 250.775 74.6151 251.221 77.1352H241.668C241.49 75.1552 241.49 73.2651 241.49 71.015V69.035H241.401C240.061 72.7251 236.222 78.3053 226.402 78.3053C215.688 78.3053 210.242 71.465 210.242 64.4448C210.242 51.3944 226.312 50.6744 233.098 49.5044C239.079 48.5143 241.401 47.0743 241.401 43.2042C241.401 39.3341 237.829 36.814 231.669 36.814C226.402 36.814 222.473 39.8741 221.402 44.7342H212.474ZM219.349 64.2648C219.349 68.315 222.92 71.015 228.455 71.015C235.062 71.015 241.579 66.7849 241.579 55.5346V49.8644C240.597 52.6545 238.365 55.2645 229.526 56.7946C223.009 58.0546 219.349 59.9447 219.349 64.2648Z" fill={fill} />
    <path d="M195.364 30.6059V39.6062C197.775 32.946 202.417 30.3359 209.203 30.3359V39.0662C208.756 39.0662 206.703 39.1562 205.364 39.5162C200.453 40.3262 195.454 42.7563 195.454 55.5367V77.1374H186.258V30.6059H195.364Z" fill={fill} />
    <path d="M148.795 51.755V44.0148H177.453L176.65 77.1358H169.954L169.418 66.5154C166.293 73.6257 159.954 78.6658 148.259 78.6658C127.814 78.6658 116.922 62.6453 116.922 45.0048C116.922 27.3642 128.35 11.3438 149.33 11.3438C165.49 11.3438 174.15 21.064 177.096 32.0444H167.454C165.222 24.8442 160.044 19.534 149.33 19.534C134.242 19.534 126.564 31.7744 126.564 45.0048C126.564 58.2352 134.063 70.4756 148.616 70.4756C158.883 70.4756 168.168 65.1654 168.704 51.665L148.795 51.755Z" fill={fill} />
    <path d="M27.2287 65.1302H0V51.7072H24.3455C25.3004 51.7072 26.2248 51.3242 26.8982 50.6385L49.5235 27.8075C51.3905 25.9235 53.9249 24.8672 56.5633 24.8672H83.7858V38.2903H59.4465C58.4915 38.2903 57.5672 38.6733 56.8938 39.3589L34.2685 62.1899C32.4014 64.0739 29.8671 65.1302 27.2287 65.1302Z" fill="#52B788" />
    <path d="M13.9266 38.2925H0V24.8756H11.0433C11.9983 24.8756 12.9226 24.4926 13.596 23.807L37.1885 0L46.5912 9.4882L20.9602 35.3522C19.0993 37.2362 16.5649 38.2925 13.9266 38.2925Z" fill="#52B788" />
    <path d="M46.598 90.0035L37.1953 80.5153L62.8263 54.6513C64.6934 52.7672 67.2277 51.7109 69.8661 51.7109H83.7926V65.1278H72.7494C71.7944 65.1278 70.87 65.5108 70.1967 66.1965L46.598 90.0035Z" fill="#52B788" />
  </svg>
);

const CheckIcon = ({ size = 10, stroke = '#0C1410' }: { size?: number; stroke?: string }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5L8 3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckTickIcon = () => (
  <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="#0C1410" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  CSS-IN-JS STYLES (matching the prototype exactly)                  */
/* ------------------------------------------------------------------ */

const cssVars = {
  dark: '#0C1410',
  dark2: '#131B17',
  dark3: '#1A2420',
  green: '#1B4332',
  greenMid: '#2D6A4F',
  greenLight: '#52B788',
  greenPale: '#D8F3DC',
  cream: '#F2EFE6',
  cream2: '#E8E4DA',
  gold: '#EDD94C',
  goldBg: '#FFFBE6',
  goldDark: '#A08600',
  redSoft: '#FEE2E2',
  redText: '#991B1B',
  gray: '#6B7280',
  white: '#FFFFFF',
  r: '14px',
  rSm: '8px',
  shadow: '0 2px 16px rgba(12,20,16,.10)',
  shadowLg: '0 8px 48px rgba(12,20,16,.18)',
};

/* ------------------------------------------------------------------ */
/*  MODULE CONTENT COMPONENTS                                          */
/* ------------------------------------------------------------------ */

/* -- Shared sub-components for content -- */

function QuizBlock({ question, subtitle, options, feedbackId, feedbackText, quizState, onQuiz }: {
  question: string;
  subtitle?: string;
  options: { text: string; correct: boolean }[];
  feedbackId: string;
  feedbackText: string;
  quizState: Record<string, { answered: boolean; selectedIdx: number; correct: boolean }>;
  onQuiz: (feedbackId: string, idx: number, correct: boolean) => void;
}) {
  const state = quizState[feedbackId];
  return (
    <div style={{ background: cssVars.dark, borderRadius: cssVars.r, padding: '30px 34px', marginBottom: 18 }}>
      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.1rem', color: cssVars.white, marginBottom: 8, letterSpacing: '-.01em' }}>{question}</h3>
      {subtitle && <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginBottom: 20, lineHeight: 1.6 }}>{subtitle}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((opt, i) => {
          let bg = 'rgba(255,255,255,.05)';
          let border = '1.5px solid rgba(255,255,255,.1)';
          let color = 'rgba(255,255,255,.7)';
          let pointer: React.CSSProperties['pointerEvents'] = 'auto';
          if (state?.answered) {
            pointer = 'none';
            if (i === state.selectedIdx) {
              if (state.correct) {
                bg = 'rgba(82,183,136,.15)';
                border = `1.5px solid ${cssVars.greenLight}`;
                color = cssVars.greenPale;
              } else {
                bg = 'rgba(239,68,68,.1)';
                border = '1.5px solid #EF4444';
                color = '#FCA5A5';
              }
            }
          }
          return (
            <button key={i} onClick={() => onQuiz(feedbackId, i, opt.correct)} style={{
              background: bg, border, borderRadius: 10, padding: '12px 16px', fontSize: '.83rem',
              color, cursor: 'pointer', transition: 'all .16s', textAlign: 'left' as const,
              fontFamily: "'DM Sans',sans-serif", pointerEvents: pointer,
            }}>{opt.text}</button>
          );
        })}
      </div>
      {state?.answered && (
        <div style={{
          marginTop: 14, padding: '13px 17px', borderRadius: 8, fontSize: '.81rem', lineHeight: 1.6,
          background: state.correct ? 'rgba(82,183,136,.12)' : 'rgba(239,68,68,.1)',
          color: state.correct ? cssVars.greenPale : '#FCA5A5',
          animation: 'fadeIn .3s ease',
        }} dangerouslySetInnerHTML={{ __html: feedbackText }} />
      )}
    </div>
  );
}

function ScenarioBlock({ label, context, question, choices, resultId, scenarioState, onScenario }: {
  label: string;
  context: string;
  question: string;
  choices: { text: string; result: 'ok' | 'ko' }[];
  resultId: string;
  scenarioState: Record<string, { answered: boolean; selectedIdx: number; correct: boolean }>;
  onScenario: (resultId: string, idx: number, result: 'ok' | 'ko') => void;
}) {
  const state = scenarioState[resultId];
  const okText = "\u2705 Exactement ! Tu actives la bonne value proposition et tu proposes une action concr\u00e8te. C'est comme \u00e7a qu'on construit la confiance.";
  const koText = "\u274c Cette r\u00e9ponse n'exploite pas la value proposition Graneet. Essaie de connecter le probl\u00e8me du client \u00e0 ce que Graneet peut r\u00e9soudre.";
  return (
    <div style={{ background: cssVars.white, borderRadius: cssVars.r, border: '1px solid rgba(0,0,0,.07)', padding: '26px 30px', marginBottom: 18, boxShadow: cssVars.shadow }}>
      <p style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: cssVars.gray, marginBottom: 10 }}>{label}</p>
      <div style={{ background: cssVars.cream2, borderRadius: 8, padding: '13px 17px', marginBottom: 16, fontSize: '.84rem', color: '#374151', lineHeight: 1.65, borderLeft: `3px solid ${cssVars.greenLight}` }} dangerouslySetInnerHTML={{ __html: context }} />
      <p style={{ fontSize: '.84rem', fontWeight: 600, marginBottom: 13, color: cssVars.dark }}>{question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {choices.map((c, i) => {
          let bg = cssVars.cream2;
          let border = '1.5px solid transparent';
          let color = '#374151';
          let pointer: React.CSSProperties['pointerEvents'] = 'auto';
          if (state?.answered) {
            pointer = 'none';
            if (i === state.selectedIdx) {
              if (state.correct) {
                border = `1.5px solid ${cssVars.greenLight}`;
                bg = cssVars.greenPale;
                color = cssVars.green;
              } else {
                border = '1.5px solid #EF4444';
                bg = cssVars.redSoft;
                color = cssVars.redText;
              }
            }
          }
          return (
            <button key={i} onClick={() => onScenario(resultId, i, c.result)} style={{
              background: bg, border, borderRadius: 9, padding: '12px 16px', fontSize: '.82rem',
              color, cursor: 'pointer', transition: 'all .15s', textAlign: 'left' as const,
              fontFamily: "'DM Sans',sans-serif", pointerEvents: pointer,
            }}>{c.text}</button>
          );
        })}
      </div>
      {state?.answered && (
        <div style={{
          marginTop: 13, padding: '11px 15px', borderRadius: 8, fontSize: '.8rem', lineHeight: 1.6,
          background: state.correct ? cssVars.greenPale : cssVars.redSoft,
          color: state.correct ? cssVars.green : cssVars.redText,
          animation: 'fadeIn .3s ease',
        }}>{state.correct ? okText : koText}</div>
      )}
    </div>
  );
}

function ChecklistItem({ text, checked, onToggle }: { text: string; checked: boolean; onToggle: () => void }) {
  return (
    <li onClick={onToggle} style={{
      display: 'flex', alignItems: 'flex-start', gap: 11,
      background: checked ? cssVars.greenPale : cssVars.white,
      border: `1px solid ${checked ? cssVars.greenLight : 'rgba(0,0,0,.07)'}`,
      borderRadius: 9, padding: '12px 15px', cursor: 'pointer', transition: 'all .15s',
      boxShadow: '0 1px 4px rgba(0,0,0,.04)', listStyle: 'none',
    }}>
      <div style={{
        width: 19, height: 19, borderRadius: 5,
        border: `1.5px solid ${checked ? cssVars.greenLight : 'rgba(0,0,0,.2)'}`,
        background: checked ? cssVars.greenLight : 'transparent',
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s', marginTop: 1,
      }}>
        <span style={{ opacity: checked ? 1 : 0, transition: 'opacity .15s' }}><CheckTickIcon /></span>
      </div>
      <div style={{ fontSize: '.82rem', lineHeight: 1.55, color: '#374151' }} dangerouslySetInnerHTML={{ __html: text }} />
    </li>
  );
}

/* Shared style blocks */
const Divider = () => <div style={{ height: 1, background: 'rgba(0,0,0,.07)', margin: '24px 0' }} />;
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.22rem', color: cssVars.dark, marginBottom: 16, letterSpacing: '-.01em' }}>{children}</div>
);
const IntroText = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: '.89rem', lineHeight: 1.75, color: '#374151', marginBottom: 18 }}>{children}</p>
);
const QuoteBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: cssVars.dark, borderRadius: cssVars.r, padding: '22px 28px', marginBottom: 16 }}>
    <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.08rem', color: cssVars.white, lineHeight: 1.45, letterSpacing: '-.01em' }}>{children}</p>
  </div>
);
const PainCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: cssVars.r, padding: '20px 26px', marginBottom: 14 }}>
    <span style={{ fontSize: '1.3rem', marginBottom: 8, display: 'block' }}>{"\ud83d\ude2e\u200d\ud83d\udca8"}</span>
    <p style={{ fontSize: '.86rem', lineHeight: 1.7, color: '#92400E' }}>{children}</p>
  </div>
);
const BenefitCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: cssVars.r, padding: '20px 26px', marginBottom: 14 }}>
    <p style={{ fontSize: '.86rem', lineHeight: 1.7, color: '#166534' }}>{children}</p>
  </div>
);
const EmotionCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: cssVars.r, padding: '18px 24px', marginBottom: 14 }}>
    <p style={{ fontSize: '.86rem', lineHeight: 1.7, color: '#1E40AF' }}>{children}</p>
  </div>
);
const NaCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: cssVars.redSoft, border: '1px solid #FECACA', borderRadius: cssVars.rSm, padding: '13px 17px', marginBottom: 9, display: 'flex', alignItems: 'flex-start', gap: 9 }}>
    <p style={{ fontSize: '.78rem', lineHeight: 1.6, color: cssVars.redText }}>{children}</p>
  </div>
);
const Card = ({ children, label, dotColor }: { children: React.ReactNode; label?: string; dotColor?: string }) => (
  <div style={{ background: cssVars.white, borderRadius: cssVars.r, border: '1px solid rgba(0,0,0,.07)', padding: '26px 30px', marginBottom: 18, boxShadow: cssVars.shadow }}>
    {label && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.67rem', fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
        {dotColor && <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }} />}
        <span style={{ color: cssVars.gray }}>{label}</span>
      </div>
    )}
    {children}
  </div>
);
const CardH4 = ({ children }: { children: React.ReactNode }) => (
  <h4 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: 9, color: cssVars.dark }}>{children}</h4>
);
const CardP = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: '.87rem', lineHeight: 1.7, color: '#374151' }}>{children}</p>
);
const Pill = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: gold ? cssVars.goldBg : cssVars.greenPale,
    color: gold ? cssVars.goldDark : cssVars.green,
    fontSize: '.72rem', fontWeight: 600, padding: '4px 11px', borderRadius: 100,
  }}>{children}</span>
);
const TwoCol = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>
);

/* ------------------------------------------------------------------ */
/*  CONTENT RENDERERS (per module)                                     */
/* ------------------------------------------------------------------ */

function ContentIntroBtp({ quizState, onQuiz }: { quizState: Record<string, any>; onQuiz: (id: string, idx: number, correct: boolean) => void }) {
  return (
    <>
      <IntroText>Avant de parler de Graneet, il faut comprendre <strong>qui sont nos clients</strong> et ce qu&apos;ils vivent au quotidien. C&apos;est la base de tout bon discours commercial ou CS.</IntroText>
      <SectionTitle>Le monde des PME du BTP</SectionTitle>
      <TwoCol>
        <Card label="Leur quotidien" dotColor="#60A5FA">
          <CardP>Un dirigeant de PME BTP g&egrave;re <strong>plusieurs chantiers simultan&eacute;ment</strong> : chiffrage, commandes fournisseurs, suivi des &eacute;quipes, facturation client... le tout souvent en mobilit&eacute; entre bureau et chantiers.</CardP>
        </Card>
        <Card label="Leur douleur principale" dotColor="#EF4444">
          <CardP>Ils ne savent pas si leurs chantiers sont rentables <strong>tant qu&apos;ils ne sont pas termin&eacute;s</strong>. Quand la compta leur dit qu&apos;un chantier a perdu de l&apos;argent, il est trop tard pour r&eacute;agir.</CardP>
        </Card>
      </TwoCol>
      <Card label="Ce qu'ils utilisent avant Graneet" dotColor={cssVars.gold}>
        <CardP>Excel, comptabilit&eacute; mensuelle, outils de devis isol&eacute;s, WhatsApp pour coordonner. <strong>Aucune vision centralis&eacute;e et en temps r&eacute;el.</strong></CardP>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
          <Pill>Excel {"\ud83d\udcca"}</Pill>
          <Pill>EBP / Sage</Pill>
          <Pill>Batappli</Pill>
          <Pill>Papier {"\ud83d\udcc4"}</Pill>
          <Pill>WhatsApp</Pill>
        </div>
      </Card>
      <Divider />
      <SectionTitle>Les 6 modules Graneet</SectionTitle>
      <TwoCol>
        <Card><CardH4>{"\ud83d\udccb"} Devis</CardH4><CardP>Chiffrage rapide, biblioth&egrave;ques de prix, continuit&eacute; vers la production.</CardP></Card>
        <Card><CardH4>{"\ud83d\udcb6"} Facturation & Encaissement</CardH4><CardP>Situations de travaux, factures, suivi des r&egrave;glements clients.</CardP></Card>
        <Card><CardH4>{"\ud83d\uded2"} Achats</CardH4><CardP>Commandes fournisseurs, bons de livraison, suivi budg&eacute;taire.</CardP></Card>
        <Card><CardH4>{"\ud83d\udcc5"} Planning</CardH4><CardP>Affectation des &eacute;quipes, suivi des heures, co&ucirc;t r&eacute;el MO.</CardP></Card>
        <Card><CardH4>{"\ud83d\udcca"} Reporting / Rentabilit&eacute;</CardH4><CardP>Suivi en temps r&eacute;el des marges par chantier et par entreprise.</CardP></Card>
        <Card><CardH4>{"\ud83d\uddc2\ufe0f"} Pr&eacute;-comptabilit&eacute;</CardH4><CardP>Centralisation des documents, export vers la compta.</CardP></Card>
      </TwoCol>
      <Divider />
      <SectionTitle>Quiz de d&eacute;marrage</SectionTitle>
      <QuizBlock
        question="Quel est le principal probl\u00e8me de nos clients avant Graneet ?"
        subtitle="Choisis la meilleure r\u00e9ponse."
        options={[
          { text: "Ils n'ont pas acc\u00e8s \u00e0 des logiciels de devis", correct: false },
          { text: "Ils n'ont pas de vision en temps r\u00e9el de la rentabilit\u00e9 de leurs chantiers", correct: true },
          { text: "Ils ne savent pas comment facturer leurs clients", correct: false },
          { text: "Ils n'ont pas assez de chantiers", correct: false },
        ]}
        feedbackId="q1f"
        feedbackText="\u2705 <strong>Exactement !</strong> La rentabilit\u00e9 en temps r\u00e9el est notre promesse centrale. Nos clients d\u00e9couvrent souvent trop tard \u2014 via la comptabilit\u00e9 \u2014 qu'un chantier a perdu de l'argent. Graneet leur permet de le voir en direct et de corriger la trajectoire."
        quizState={quizState}
        onQuiz={onQuiz}
      />
    </>
  );
}

function ContentRentabilite({ quizState, onQuiz, scenarioState, onScenario, checkState, onToggleCheck }: {
  quizState: Record<string, any>; onQuiz: (id: string, idx: number, correct: boolean) => void;
  scenarioState: Record<string, any>; onScenario: (id: string, idx: number, result: 'ok' | 'ko') => void;
  checkState: Record<string, boolean>; onToggleCheck: (id: string) => void;
}) {
  const checklistItems = [
    { id: 'r1', text: '<strong>Suivi recettes vs d\u00e9penses en temps r\u00e9el</strong> \u2014 S\u2019assurer que le client est factur\u00e9 plus vite que les d\u00e9penses engag\u00e9es.' },
    { id: 'r2', text: '<strong>Pilotage budg\u00e9taire</strong> \u2014 Comparer d\u00e9bours\u00e9s r\u00e9els vs chiffrage initial, donner des objectifs aux conducteurs de travaux.' },
    { id: 'r3', text: '<strong>Vue agr\u00e9g\u00e9e de tous les chantiers</strong> \u2014 Trier par marge pour se concentrer sur les chantiers \u00e0 risque lors des r\u00e9unions.' },
    { id: 'r4', text: '<strong>Analyse post-chantier</strong> \u2014 Marge brute finale et d\u00e9penses par type de d\u00e9bours \u00e0 la cl\u00f4ture.' },
  ];
  return (
    <>
      <IntroText>C&apos;est la <strong>value proposition c&oelig;ur</strong> de Graneet. Celle que tu dois ma&icirc;triser en premier et pouvoir restituer dans toutes les situations.</IntroText>
      <SectionTitle>{"\ud83d\udee1\ufe0f"} La proposition de valeur</SectionTitle>
      <QuoteBox>&ldquo;Prot&eacute;ger vos <em style={{ fontStyle: 'italic', color: cssVars.gold }}>marges chantier</em> en suivant leur &eacute;volution en direct &mdash; et r&eacute;agir tant qu&apos;il est encore temps.&rdquo;</QuoteBox>
      <PainCard><strong>Le pain :</strong> Les dirigeants BTP pilotent plusieurs chantiers en parall&egrave;le mais la remont&eacute;e d&apos;info pour calculer la rentabilit&eacute; est complexe. La plupart font leur analyse en comptabilit&eacute; mensuelle ou dans des Excels chronophages. Quand ils voient qu&apos;un chantier perd de l&apos;argent, <strong>il est souvent trop tard pour agir.</strong></PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>Le b&eacute;n&eacute;fice :</strong> Avoir une <strong>vue en temps r&eacute;el</strong> de la rentabilit&eacute; de chaque chantier dans un outil unique. Responsabiliser les conducteurs de travaux en leur donnant acc&egrave;s &agrave; ces indicateurs.</BenefitCard>
      <EmotionCard>{"\ud83e\udde0"} <strong>&Eacute;motion vis&eacute;e :</strong> Gain de <strong>s&eacute;r&eacute;nit&eacute;</strong> et de <strong>contr&ocirc;le</strong> pour le dirigeant &mdash; il pilote avec confiance, il ne subit plus.</EmotionCard>
      <Divider />
      <SectionTitle>Ce que Graneet permet concr&egrave;tement</SectionTitle>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, padding: 0 }}>
        {checklistItems.map(item => (
          <ChecklistItem key={item.id} text={item.text} checked={!!checkState[item.id]} onToggle={() => onToggleCheck(item.id)} />
        ))}
      </ul>
      <Divider />
      <SectionTitle>Ce que Graneet ne fait pas encore {"\ud83d\udeab"}</SectionTitle>
      <NaCard>{"\ud83d\udeab"} <strong>Marge nette :</strong> Graneet ne permet pas encore d&apos;imputer les frais g&eacute;n&eacute;raux sur un chantier pour calculer la marge nette.</NaCard>
      <NaCard>{"\ud83d\udeab"} <strong>Pr&eacute;visionnel :</strong> Pas encore de projection de marge d&apos;atterrissage future &mdash; Graneet donne une vision &agrave; l&apos;instant T.</NaCard>
      <Divider />
      <SectionTitle>Mise en situation CS</SectionTitle>
      <ScenarioBlock
        label="Sc\u00e9nario"
        context={'Lors d\u2019un appel de suivi, ton client te dit : <em>\u00abOn vient de cl\u00f4turer un chantier et on s\u2019est rendu compte qu\u2019on avait perdu 8\u00a0000\u20ac dessus. On aurait voulu le savoir plus t\u00f4t.\u00bb</em>'}
        question="Comment tu r\u00e9agis ?"
        choices={[
          { text: "\u00abJe suis d\u00e9sol\u00e9, \u00e7a arrive parfois dans le BTP.\u00bb", result: 'ko' },
          { text: "\u00abC'est exactement le probl\u00e8me que le suivi de rentabilit\u00e9 Graneet r\u00e9sout. Je t'explique comment param\u00e9trer les budgets chantier pour voir \u00e7a en direct \u00e0 l'avenir ?\u00bb", result: 'ok' },
          { text: "\u00abTu devrais faire une analyse comptable plus fr\u00e9quente.\u00bb", result: 'ko' },
        ]}
        resultId="sc1r"
        scenarioState={scenarioState}
        onScenario={onScenario}
      />
      <QuizBlock
        question="Quelle \u00e9motion principale vise cette value prop ?"
        options={[
          { text: "Excitation", correct: false },
          { text: "S\u00e9r\u00e9nit\u00e9 et contr\u00f4le", correct: true },
          { text: "Surprise", correct: false },
          { text: "Fiert\u00e9", correct: false },
        ]}
        feedbackId="q2f"
        feedbackText="\u2705 <strong>S\u00e9r\u00e9nit\u00e9 et contr\u00f4le.</strong> Le dirigeant n'est plus dans le flou \u2014 il pilote en temps r\u00e9el avec confiance, et peut d\u00e9l\u00e9guer en responsabilisant ses \u00e9quipes."
        quizState={quizState}
        onQuiz={onQuiz}
      />
    </>
  );
}

function ContentDevis({ quizState, onQuiz }: { quizState: Record<string, any>; onQuiz: (id: string, idx: number, correct: boolean) => void }) {
  return (
    <>
      <IntroText>Trois value propositions li&eacute;es au module Devis &mdash; fondamentales pour les &eacute;quipes <strong>Sales et CS</strong> qui accompagnent des entreprises en phase commerciale.</IntroText>
      <SectionTitle>{"\ud83d\udccb"} VP 1 &mdash; Efficacit&eacute; sur le chiffrage</SectionTitle>
      <QuoteBox>&ldquo;Gagnez en efficacit&eacute; et productivit&eacute; dans la <em style={{ fontStyle: 'italic', color: cssVars.gold }}>production de devis</em> pour am&eacute;liorer votre relation commerciale.&rdquo;</QuoteBox>
      <PainCard><strong>Pain :</strong> Les entreprises BTP passent un temps consid&eacute;rable &agrave; chiffrer manuellement. Les erreurs de calcul, la recopie depuis des Excels, l&apos;absence de biblioth&egrave;que de prix centralis&eacute;e ralentissent la production. Un devis rendu en retard peut faire perdre un march&eacute;.</PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> Produire des devis <strong>plus vite et avec moins d&apos;erreurs</strong> gr&acirc;ce aux biblioth&egrave;ques de prix et &agrave; la r&eacute;utilisation. Passer plus de temps &agrave; vendre qu&apos;&agrave; chiffrer.</BenefitCard>
      <Divider />
      <SectionTitle>{"\ud83d\udd17"} VP 2 &mdash; Continuit&eacute; devis &rarr; chantier</SectionTitle>
      <QuoteBox>&ldquo;Assurer une continuit&eacute; de la <em style={{ fontStyle: 'italic', color: cssVars.gold }}>protection de marge</em> entre le chiffrage du devis et le suivi de production.&rdquo;</QuoteBox>
      <PainCard><strong>Pain :</strong> Le chiffrage du devis et le suivi de chantier vivent dans deux outils diff&eacute;rents. Quand le chantier d&eacute;marre, les hypoth&egrave;ses de marges initiales sont perdues.</PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> La marge th&eacute;orique calcul&eacute;e dans le devis devient le <strong>budget de r&eacute;f&eacute;rence du chantier</strong>. Les conducteurs de travaux partent avec un cap clair et mesurable.</BenefitCard>
      <Divider />
      <SectionTitle>{"\ud83d\udcc8"} VP 3 &mdash; Suivi des opportunit&eacute;s commerciales</SectionTitle>
      <QuoteBox>&ldquo;Gagner en visibilit&eacute; sur ses opportunit&eacute;s de vente et <em style={{ fontStyle: 'italic', color: cssVars.gold }}>optimiser son processus commercial.</em>&rdquo;</QuoteBox>
      <PainCard><strong>Pain :</strong> Difficile de savoir o&ugrave; en sont tous les devis envoy&eacute;s, quels sont les taux de conversion, quels chantiers sont les plus rentables. Les d&eacute;cisions commerciales se prennent &agrave; l&apos;instinct.</PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> Pipeline commercial clair, suivi de l&apos;avancement de chaque devis, analyse du taux de transformation, priorisation des opportunit&eacute;s les plus prometteuses.</BenefitCard>
      <Divider />
      <QuizBlock
        question={'Un prospect te dit : "On met 3 jours \u00e0 produire un devis complexe." Quelle value prop activer ?'}
        options={[
          { text: "La rentabilit\u00e9 chantier en temps r\u00e9el", correct: false },
          { text: "L'efficacit\u00e9 sur la production de devis \u2014 biblioth\u00e8ques de prix, r\u00e9utilisation, rapidit\u00e9", correct: true },
          { text: "La facturation et la conformit\u00e9", correct: false },
        ]}
        feedbackId="q3f"
        feedbackText="\u2705 <strong>Exactement.</strong> Le chiffrage lent est un pain direct \u2014 montre-lui comment les biblioth\u00e8ques de prix et la r\u00e9utilisation divisent le temps de production de devis."
        quizState={quizState}
        onQuiz={onQuiz}
      />
    </>
  );
}

function ContentFacturation({ quizState, onQuiz, scenarioState, onScenario }: {
  quizState: Record<string, any>; onQuiz: (id: string, idx: number, correct: boolean) => void;
  scenarioState: Record<string, any>; onScenario: (id: string, idx: number, result: 'ok' | 'ko') => void;
}) {
  return (
    <>
      <IntroText>Deux value propositions autour de la facturation &mdash; tr&egrave;s importantes pour <strong>CS</strong> (accompagnement) et <strong>Sales</strong> (conformit&eacute; et tr&eacute;sorerie).</IntroText>
      <SectionTitle>{"\ud83d\udcb6"} VP 1 &mdash; Facturer juste, &ecirc;tre pay&eacute; plus vite</SectionTitle>
      <QuoteBox>&ldquo;Prot&eacute;ger votre rentabilit&eacute; en facturant de mani&egrave;re <em style={{ fontStyle: 'italic', color: cssVars.gold }}>juste</em> vos chantiers &mdash; en r&eacute;duisant les erreurs et en am&eacute;liorant vos d&eacute;lais de r&egrave;glement.&rdquo;</QuoteBox>
      <PainCard><strong>Pain :</strong> La facturation BTP par situations de travaux est complexe. Les erreurs sur les montants, les oublis de facturation et les aller-retours clients allongent les d&eacute;lais de paiement et fragilisent la tr&eacute;sorerie.</PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> Facturer avec pr&eacute;cision depuis l&apos;avancement r&eacute;el du chantier. R&eacute;duire les litiges et &ecirc;tre pay&eacute; plus vite.</BenefitCard>
      <Divider />
      <SectionTitle>{"\ud83d\udcb0"} VP 2 &mdash; Am&eacute;liorer la position de tr&eacute;sorerie</SectionTitle>
      <QuoteBox>&ldquo;Am&eacute;liorer votre position de tr&eacute;sorerie en assurant un <em style={{ fontStyle: 'italic', color: cssVars.gold }}>suivi pr&eacute;cis des r&egrave;glements</em> clients et d&eacute;caissements.&rdquo;</QuoteBox>
      <PainCard><strong>Pain :</strong> Les PME BTP portent souvent la tr&eacute;sorerie de leurs chantiers &mdash; elles d&eacute;pensent avant d&apos;&ecirc;tre pay&eacute;es. Les impay&eacute;s et retards de r&egrave;glement sont fr&eacute;quents et difficiles &agrave; suivre.</PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> Vue claire des factures en attente, r&egrave;glements re&ccedil;us et impay&eacute;s. Savoir exactement quand relancer et combien on attend.</BenefitCard>
      <EmotionCard>{"\ud83e\udde0"} <strong>&Eacute;motion :</strong> R&eacute;duction du <strong>stress li&eacute; &agrave; la tr&eacute;sorerie</strong> &mdash; le dirigeant sait &agrave; tout moment ce qui lui est d&ucirc; et peut anticiper ses besoins de financement.</EmotionCard>
      <Divider />
      <SectionTitle>Mise en situation CS</SectionTitle>
      <ScenarioBlock
        label="Sc\u00e9nario"
        context={'Ton client te contacte : <em>\u00abJ\u2019ai un client qui conteste ma derni\u00e8re situation de travaux. Il dit que j\u2019ai surfactur\u00e9 une ligne. Je ne sais m\u00eame plus comment j\u2019ai calcul\u00e9.\u00bb</em>'}
        question="Comment tu l'aides ?"
        choices={[
          { text: "\u00abTu devrais appeler ton client pour trouver un accord \u00e0 l'amiable.\u00bb", result: 'ko' },
          { text: "\u00abDans Graneet, ta situation est calcul\u00e9e depuis l'avancement r\u00e9el du chantier \u2014 tu peux lui montrer la tra\u00e7abilit\u00e9 compl\u00e8te de chaque ligne et d\u00e9fendre ta facture avec des donn\u00e9es.\u00bb", result: 'ok' },
          { text: "\u00abIl faudra peut-\u00eatre faire un avoir pour \u00e9viter le conflit.\u00bb", result: 'ko' },
        ]}
        resultId="sc2r"
        scenarioState={scenarioState}
        onScenario={onScenario}
      />
      <QuizBlock
        question="Quel est le lien entre facturation et rentabilit\u00e9 chantier ?"
        options={[
          { text: "Ce sont deux sujets compl\u00e8tement s\u00e9par\u00e9s", correct: false },
          { text: "Si tu factures moins que ce que tu as d\u00e9pens\u00e9, ta marge s'effondre \u2014 la facturation juste prot\u00e8ge directement ta rentabilit\u00e9", correct: true },
          { text: "La rentabilit\u00e9 d\u00e9pend uniquement des achats, pas de la facturation", correct: false },
        ]}
        feedbackId="q4f"
        feedbackText="\u2705 <strong>Exact !</strong> Facturer avec pr\u00e9cision et rapidit\u00e9, c'est prot\u00e9ger directement sa marge. C'est un argument puissant \u00e0 utiliser en d\u00e9mo."
        quizState={quizState}
        onQuiz={onQuiz}
      />
    </>
  );
}

function ContentAchats({ quizState, onQuiz }: { quizState: Record<string, any>; onQuiz: (id: string, idx: number, correct: boolean) => void }) {
  return (
    <>
      <IntroText>Les achats et le planning repr&eacute;sentent une part &eacute;norme des co&ucirc;ts d&apos;un chantier. Ces value props sont souvent sous-estim&eacute;es dans le discours commercial &mdash; c&apos;est un angle diff&eacute;renciateur fort.</IntroText>
      <SectionTitle>{"\ud83d\uded2"} VP 1 &mdash; Centraliser et contr&ocirc;ler les achats</SectionTitle>
      <QuoteBox>&ldquo;Centralisez vos factures d&apos;achats pour avoir une vision compl&egrave;te en temps r&eacute;el de votre <em style={{ fontStyle: 'italic', color: cssVars.gold }}>rentabilit&eacute; de chantier et d&apos;entreprise.</em>&rdquo;</QuoteBox>
      <PainCard><strong>Pain :</strong> Les factures fournisseurs arrivent en d&eacute;calage, sont saisies manuellement en comptabilit&eacute;, et ne sont pas rattach&eacute;es aux chantiers en temps r&eacute;el. Impossible de savoir ce qu&apos;on a vraiment d&eacute;pens&eacute; sur un chantier avant la cl&ocirc;ture comptable.</PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> Toutes les d&eacute;penses (mat&eacute;riaux, sous-traitance, MO) rattach&eacute;es aux chantiers en temps r&eacute;el. La vision de rentabilit&eacute; devient imm&eacute;diatement plus pr&eacute;cise et fiable.</BenefitCard>
      <Divider />
      <SectionTitle>{"\ud83d\udcc5"} VP 2 &mdash; Planifier et suivre la main d&apos;&oelig;uvre</SectionTitle>
      <QuoteBox>&ldquo;Planifier et anticiper la main d&apos;&oelig;uvre sur vos chantiers pour gagner en <em style={{ fontStyle: 'italic', color: cssVars.gold }}>visibilit&eacute; sur vos ressources.</em>&rdquo;</QuoteBox>
      <PainCard><strong>Pain :</strong> Planification des &eacute;quipes sur tableaux blancs, WhatsApp ou Excel. Les heures r&eacute;ellement travaill&eacute;es ne remontent pas automatiquement pour alimenter le suivi de rentabilit&eacute;.</PainCard>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> Planifier les &eacute;quipes, suivre les heures, conna&icirc;tre le <strong>co&ucirc;t r&eacute;el de la main d&apos;&oelig;uvre</strong> par chantier &mdash; et pr&eacute;parer la saisie en paie.</BenefitCard>
      <Divider />
      <SectionTitle>{"\ud83d\uddc2\ufe0f"} VP 3 &mdash; Centraliser et partager les documents</SectionTitle>
      <QuoteBox>&ldquo;Centralisez tous vos documents sur une seule plateforme pour <em style={{ fontStyle: 'italic', color: cssVars.gold }}>fluidifier la collaboration.</em>&rdquo;</QuoteBox>
      <BenefitCard>{"\ud83d\ude0d"} <strong>B&eacute;n&eacute;fice :</strong> Plus de recherche dans des dossiers &eacute;parpill&eacute;s. Tous les documents li&eacute;s &agrave; un chantier (devis, factures, BL, plans) accessibles par toute l&apos;&eacute;quipe depuis un seul endroit.</BenefitCard>
      <Divider />
      <QuizBlock
        question="Pourquoi les achats sont-ils critiques pour la rentabilit\u00e9 chantier ?"
        options={[
          { text: "Parce que les fournisseurs demandent souvent des d\u00e9lais de paiement courts", correct: false },
          { text: "Parce qu'ils repr\u00e9sentent une grande part des co\u00fbts, et s'ils ne sont pas rattach\u00e9s en temps r\u00e9el aux chantiers, la vision de rentabilit\u00e9 est fauss\u00e9e", correct: true },
          { text: "Parce que la TVA sur les achats est compliqu\u00e9e \u00e0 g\u00e9rer", correct: false },
        ]}
        feedbackId="q5f"
        feedbackText="\u2705 <strong>Parfait.</strong> Mat\u00e9riaux + sous-traitance + main d'\u0153uvre = la majorit\u00e9 des co\u00fbts d'un chantier. Sans les rattacher en temps r\u00e9el, le suivi de rentabilit\u00e9 est une illusion."
        quizState={quizState}
        onQuiz={onQuiz}
      />
    </>
  );
}

function ContentPitch({ quizState, onQuiz, scenarioState, onScenario }: {
  quizState: Record<string, any>; onQuiz: (id: string, idx: number, correct: boolean) => void;
  scenarioState: Record<string, any>; onScenario: (id: string, idx: number, result: 'ok' | 'ko') => void;
}) {
  return (
    <>
      <IntroText>Tu as maintenant toutes les value propositions en t&ecirc;te. Ce module final te met en situation r&eacute;elle &mdash; comme si tu &eacute;tais face &agrave; un prospect Sales ou un client CS exigeant.</IntroText>
      <SectionTitle>{"\ud83c\udfaf"} Les grands principes du pitch Graneet</SectionTitle>
      <TwoCol>
        <Card><CardH4>Pain &rarr; Solution &rarr; &Eacute;motion</CardH4><CardP>Toujours commencer par valider le pain du client avant de parler de fonctionnalit&eacute;s. Pr&eacute;senter le b&eacute;n&eacute;fice concret. Terminer sur l&apos;&eacute;motion ressentie.</CardP></Card>
        <Card><CardH4>Ne jamais vendre des features</CardH4><CardP>Graneet n&apos;est pas &ldquo;un logiciel de devis et facturation&rdquo;. C&apos;est <strong>&ldquo;votre outil pour prot&eacute;ger vos marges et piloter vos chantiers avec s&eacute;r&eacute;nit&eacute;.&rdquo;</strong></CardP></Card>
      </TwoCol>
      <Divider />
      <SectionTitle>Mise en situation &mdash; Sales</SectionTitle>
      <ScenarioBlock
        label="Sc\u00e9nario 1 \u00b7 Objection Excel"
        context={'Un dirigeant BTP (15 salari\u00e9s, 3M\u20ac CA) te dit lors d\u2019une d\u00e9mo : <em>\u00abExcel c\u2019est bien, \u00e7a fait 20 ans que \u00e7a marche. Pourquoi je changerais ?\u00bb</em>'}
        question="Quelle est la meilleure r\u00e9ponse ?"
        choices={[
          { text: "\u00abParce que Graneet est plus moderne et plus simple pour vos \u00e9quipes terrain.\u00bb", result: 'ko' },
          { text: "\u00abExcel c'est bien pour stocker de l'information, mais est-ce qu'il vous dit aujourd'hui, en temps r\u00e9el, si votre chantier de l'avenue Foch est en train de perdre de l'argent ? Graneet, oui.\u00bb", result: 'ok' },
          { text: "\u00abExcel c'est risqu\u00e9, vous pouvez perdre vos fichiers.\u00bb", result: 'ko' },
        ]}
        resultId="sc3r"
        scenarioState={scenarioState}
        onScenario={onScenario}
      />
      <ScenarioBlock
        label="Sc\u00e9nario 2 \u00b7 R\u00e9engagement CS"
        context={'Un client CS te dit apr\u00e8s 2 mois d\u2019utilisation : <em>\u00abJe ne comprends pas bien \u00e0 quoi sert la partie Reporting, je n\u2019y vais jamais.\u00bb</em>'}
        question="Comment tu r\u00e9engages ce client ?"
        choices={[
          { text: "\u00abC'est normal, c'est une partie avanc\u00e9e, ne t'en pr\u00e9occupe pas.\u00bb", result: 'ko' },
          { text: "\u00abC'est en fait la partie la plus importante de Graneet \u2014 c'est l\u00e0 que tu peux voir en temps r\u00e9el si tes chantiers sont rentables. Je te propose une session ensemble pour param\u00e9trer ton premier suivi de marge ?\u00bb", result: 'ok' },
          { text: "\u00abTu peux regarder notre documentation en ligne, c'est bien expliqu\u00e9.\u00bb", result: 'ko' },
        ]}
        resultId="sc4r"
        scenarioState={scenarioState}
        onScenario={onScenario}
      />
      <Divider />
      <SectionTitle>{"\ud83c\udfc1"} R&eacute;capitulatif &mdash; Les 8 value propositions Graneet</SectionTitle>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {[
            { pill: '\ud83d\udee1\ufe0f Rentabilit\u00e9', text: 'Prot\u00e9ger les marges chantier en temps r\u00e9el', gold: false },
            { pill: '\ud83d\udccb Chiffrage', text: 'Gagner en efficacit\u00e9 sur la production de devis', gold: false },
            { pill: '\ud83d\udd17 Continuit\u00e9', text: 'Lier le devis au suivi de chantier (marge th\u00e9orique \u2192 r\u00e9elle)', gold: false },
            { pill: '\ud83d\udcc8 Pipeline', text: 'Suivre et optimiser les opportunit\u00e9s commerciales', gold: false },
            { pill: '\ud83d\udcb6 Facturation', text: 'Facturer juste, \u00eatre pay\u00e9 plus vite', gold: true },
            { pill: '\ud83d\udcb0 Tr\u00e9sorerie', text: 'Ma\u00eetriser les r\u00e8glements et r\u00e9duire les impay\u00e9s', gold: true },
            { pill: '\ud83d\uded2 Achats', text: 'Centraliser et contr\u00f4ler les d\u00e9penses fournisseurs', gold: true },
            { pill: '\ud83d\udcc5 Planning', text: 'Planifier la MO, conna\u00eetre le co\u00fbt r\u00e9el par chantier', gold: true },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Pill gold={item.gold}>{item.pill}</Pill>
              <span style={{ fontSize: '.83rem', color: '#374151' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </Card>
      <QuizBlock
        question="Quiz final \u2014 La phrase qui r\u00e9sume Graneet"
        subtitle="Laquelle r\u00e9sume le mieux notre positionnement ?"
        options={[
          { text: "Un logiciel de devis et facturation pour les artisans BTP", correct: false },
          { text: "Un ERP BTP qui g\u00e8re toute la comptabilit\u00e9 de l'entreprise", correct: false },
          { text: "La plateforme qui permet aux dirigeants de PME BTP de prot\u00e9ger leur rentabilit\u00e9 et de piloter leurs chantiers avec s\u00e9r\u00e9nit\u00e9", correct: true },
          { text: "Un outil de planning pour les conducteurs de travaux", correct: false },
        ]}
        feedbackId="qf"
        feedbackText="\ud83c\udfc6 <strong>Exactement !</strong> Pas un outil de saisie \u2014 une plateforme de pilotage qui prot\u00e8ge ce qui compte le plus : la marge. Tu es pr\u00eat(e) \u00e0 en parler avec conviction !"
        quizState={quizState}
        onQuiz={onQuiz}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOBAL CSS (injected via <style>)                                  */
/* ------------------------------------------------------------------ */

const globalCSS = `
@keyframes loadBar { from { width: 0 } to { width: 100% } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes bounce { from { transform: translateY(0) } to { transform: translateY(-12px) } }

.vp-loading-out { opacity: 0 !important; pointer-events: none !important; }
.vp-sidebar::-webkit-scrollbar { width: 4px; }
.vp-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

.vp-btn-start:hover { background: #EDD94C !important; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(237,217,76,.22); }
.vp-btn-start:hover svg { transform: translateX(5px); }

.vp-sb-item:hover { background: rgba(255,255,255,.04); }
.vp-quiz-opt:hover { background: rgba(255,255,255,.09) !important; border-color: rgba(255,255,255,.2) !important; }
.vp-scenario-choice:hover { border-color: #52B788 !important; background: #D8F3DC !important; }
.vp-check-item:hover { border-color: #52B788 !important; }
.vp-btn-nav:hover { border-color: #2D6A4F !important; color: #2D6A4F !important; }
.vp-btn-nav.primary:hover { background: #2D6A4F !important; border-color: #2D6A4F !important; color: #FFFFFF !important; }
`;

/* ------------------------------------------------------------------ */
/*  MAIN PAGE COMPONENT                                                */
/* ------------------------------------------------------------------ */

export default function ValuePropositionsPage() {
  /* -- screens: 'loading' | 'welcome' | 'app' | 'congrats' -- */
  const [screen, setScreen] = useState<'loading' | 'welcome' | 'app' | 'congrats'>('loading');
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());

  /* interactive state */
  const [quizState, setQuizState] = useState<Record<string, { answered: boolean; selectedIdx: number; correct: boolean }>>({});
  const [scenarioState, setScenarioState] = useState<Record<string, { answered: boolean; selectedIdx: number; correct: boolean }>>({});
  const [checkState, setCheckState] = useState<Record<string, boolean>>({});

  /* loading animation */
  useEffect(() => {
    const t1 = setTimeout(() => {
      setScreen('welcome');
    }, 1600);
    return () => clearTimeout(t1);
  }, []);

  /* set localStorage when all done */
  useEffect(() => {
    if (done.size === MODULES.length && done.size > 0) {
      localStorage.setItem('graneet_vp_done', 'true');
    }
  }, [done]);

  const handleQuiz = useCallback((feedbackId: string, idx: number, correct: boolean) => {
    setQuizState(prev => ({ ...prev, [feedbackId]: { answered: true, selectedIdx: idx, correct } }));
  }, []);

  const handleScenario = useCallback((resultId: string, idx: number, result: 'ok' | 'ko') => {
    setScenarioState(prev => ({ ...prev, [resultId]: { answered: true, selectedIdx: idx, correct: result === 'ok' } }));
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setCheckState(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const loadModule = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  const markDoneAndNext = useCallback((idx: number) => {
    setDone(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    if (idx === MODULES.length - 1) {
      setScreen('congrats');
    } else {
      setCurrent(idx + 1);
    }
  }, []);

  const pct = Math.round(done.size / MODULES.length * 100);
  const m = MODULES[current];
  const isFirst = current === 0;
  const isLast = current === MODULES.length - 1;

  /* -- tag color mapping -- */
  const tagStyles: Record<string, React.CSSProperties> = {
    'tag-gray': { background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.4)' },
    'tag-green': { background: 'rgba(82,183,136,.12)', color: cssVars.greenLight },
    'tag-blue': { background: 'rgba(96,165,250,.12)', color: '#93C5FD' },
    'tag-gold': { background: 'rgba(237,217,76,.12)', color: cssVars.gold },
    'tag-orange': { background: 'rgba(251,146,60,.12)', color: '#FDB172' },
    'tag-purple': { background: 'rgba(167,139,250,.12)', color: '#C4B5FD' },
  };

  /* -- render module content -- */
  const renderContent = () => {
    const props = { quizState, onQuiz: handleQuiz, scenarioState, onScenario: handleScenario, checkState, onToggleCheck: toggleCheck };
    switch (m.content) {
      case 'intro_btp': return <ContentIntroBtp quizState={quizState} onQuiz={handleQuiz} />;
      case 'rentabilite': return <ContentRentabilite {...props} />;
      case 'devis': return <ContentDevis quizState={quizState} onQuiz={handleQuiz} />;
      case 'facturation': return <ContentFacturation quizState={quizState} onQuiz={handleQuiz} scenarioState={scenarioState} onScenario={handleScenario} />;
      case 'achats': return <ContentAchats quizState={quizState} onQuiz={handleQuiz} />;
      case 'pitch': return <ContentPitch quizState={quizState} onQuiz={handleQuiz} scenarioState={scenarioState} onScenario={handleScenario} />;
      default: return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />

      {/* ===== LOADING SCREEN ===== */}
      {screen === 'loading' && (
        <div style={{
          position: 'fixed', inset: 0, background: cssVars.dark, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', zIndex: 9999, transition: 'opacity .7s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, animation: 'fadeUp .6s ease both' }}>
            <GraneetLogo />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,.06)' }}>
            <div style={{ height: '100%', background: cssVars.greenLight, animation: 'loadBar 1.5s ease forwards' }} />
          </div>
        </div>
      )}

      {/* ===== WELCOME SCREEN ===== */}
      {screen === 'welcome' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AcademyHeader />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flex: 1, background: cssVars.dark }}>
            {/* Left */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '52px 60px', position: 'relative', overflow: 'hidden',
            }}>
              {/* Gradient orbs */}
              <div style={{ content: "''", position: 'absolute', width: 700, height: 700, background: 'radial-gradient(circle,rgba(82,183,136,.10) 0%,transparent 65%)', top: -280, right: -200, borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{ content: "''", position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle,rgba(237,217,76,.07) 0%,transparent 65%)', bottom: -150, left: -150, borderRadius: '50%', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                <GraneetLogo width={140} height={30} />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(82,183,136,.10)', border: '1px solid rgba(82,183,136,.18)',
                  color: cssVars.greenLight, fontSize: '.68rem', fontWeight: 700,
                  padding: '5px 14px', borderRadius: 100, letterSpacing: '.08em',
                  textTransform: 'uppercase' as const, marginBottom: 28,
                }}>{"\ud83d\udce2"} Formation Value Proposition</div>

                <h1 style={{
                  fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(2.4rem,4.5vw,3.8rem)',
                  color: cssVars.white, lineHeight: 1.06, letterSpacing: '-.025em', marginBottom: 22,
                }}>Bienvenue chez<br /><em style={{ fontStyle: 'italic', color: cssVars.gold }}>Graneet</em> {"\ud83d\udc8e"}</h1>

                <div style={{
                  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: cssVars.r, padding: '22px 26px', marginBottom: 36, maxWidth: 500,
                }}>
                  <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.91rem', lineHeight: 1.75 }}>
                    Nous sommes ravis de te voir rejoindre l&apos;aventure !<br /><br />
                    Voici un <strong style={{ color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>parcours progressif sur 2 mois</strong> qui te permettra de mieux comprendre notre environnement et notre solution &mdash; et surtout de savoir en parler avec conviction face &agrave; nos clients et prospects.
                  </p>
                </div>

                <button
                  className="vp-btn-start"
                  onClick={() => { setScreen('app'); loadModule(0); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: cssVars.greenLight, color: cssVars.dark, border: 'none',
                    padding: '15px 32px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif",
                    fontSize: '.88rem', fontWeight: 700, cursor: 'pointer', transition: 'all .22s',
                    letterSpacing: '-.005em',
                  }}
                >
                  Commencer le parcours
                  <ArrowRight />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 36, position: 'relative', zIndex: 1 }}>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.9rem', color: cssVars.white, letterSpacing: '-.03em', lineHeight: 1 }}>8</div>
                  <div style={{ fontSize: '.69rem', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginTop: 4 }}>Value Props</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.9rem', color: cssVars.white, letterSpacing: '-.03em', lineHeight: 1 }}>2</div>
                  <div style={{ fontSize: '.69rem', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginTop: 4 }}>Mois</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.9rem', color: cssVars.white, letterSpacing: '-.03em', lineHeight: 1 }}>6</div>
                  <div style={{ fontSize: '.69rem', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginTop: 4 }}>Modules</div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div style={{
              width: 380, minWidth: 380, background: cssVars.dark2,
              borderLeft: '1px solid rgba(255,255,255,.06)', display: 'flex',
              flexDirection: 'column', padding: '52px 32px', overflowY: 'auto',
            }}>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.05rem', fontWeight: 400, color: cssVars.white, marginBottom: 28 }}>
                Ton parcours en un coup d&apos;&oelig;il
              </h3>

              {/* Month 1 */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: cssVars.greenLight }} />
                  <span style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.35)' }}>Mois 1 &mdash; Fondations</span>
                </div>
                {[
                  { week: 'S1\u20132', title: 'Comprendre nos clients BTP', sub: 'Leurs douleurs, leur quotidien, leurs enjeux' },
                  { week: 'S3\u20134', title: 'Rentabilit\u00e9 chantier', sub: 'Notre value prop c\u0153ur \u2014 prot\u00e9ger les marges' },
                  { week: 'S5\u20136', title: 'Devis & Gestion commerciale', sub: 'Chiffrer vite, mieux convertir' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 8, marginBottom: 5, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)' }}>
                    <div style={{ fontSize: '.64rem', fontWeight: 700, color: cssVars.greenLight, textTransform: 'uppercase' as const, letterSpacing: '.06em', minWidth: 46, paddingTop: 2 }}>{item.week}</div>
                    <div>
                      <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.75)', marginBottom: 1 }}>{item.title}</div>
                      <div style={{ fontSize: '.69rem', color: 'rgba(255,255,255,.28)', lineHeight: 1.4 }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Month 2 */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: cssVars.gold }} />
                  <span style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.35)' }}>Mois 2 &mdash; Ma&icirc;trise</span>
                </div>
                {[
                  { week: 'S7\u20138', title: 'Facturation & Tr\u00e9sorerie', sub: 'Conformit\u00e9, d\u00e9lais, impay\u00e9s' },
                  { week: 'S9\u201310', title: 'Achats & Planning', sub: "Contr\u00f4le des d\u00e9penses, main d'\u0153uvre" },
                  { week: 'S11\u201312', title: 'Pitch & Mise en situation', sub: 'Sc\u00e9narios r\u00e9els CS & Sales' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 8, marginBottom: 5, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)' }}>
                    <div style={{ fontSize: '.64rem', fontWeight: 700, color: cssVars.gold, textTransform: 'uppercase' as const, letterSpacing: '.06em', minWidth: 46, paddingTop: 2 }}>{item.week}</div>
                    <div>
                      <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.75)', marginBottom: 1 }}>{item.title}</div>
                      <div style={{ fontSize: '.69rem', color: 'rgba(255,255,255,.28)', lineHeight: 1.4 }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== APP SCREEN ===== */}
      {screen === 'app' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AcademyHeader />
          <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
            {/* Sidebar */}
            <div className="vp-sidebar" style={{
              width: 272, minWidth: 272, background: cssVars.dark, display: 'flex',
              flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
            }}>
              <div style={{ padding: '26px 22px 20px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <GraneetLogo width={110} height={23} />
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'rgba(237,217,76,.09)', border: '1px solid rgba(237,217,76,.18)',
                  color: cssVars.gold, fontSize: '.63rem', fontWeight: 700,
                  padding: '3px 10px', borderRadius: 100, letterSpacing: '.07em',
                  textTransform: 'uppercase' as const,
                }}>Value Props &middot; 2 mois</div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: '.67rem', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>Progression</span>
                    <strong style={{ fontSize: '.72rem', color: cssVars.greenLight }}>{pct}%</strong>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,.07)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: `linear-gradient(90deg,${cssVars.greenLight},${cssVars.gold})`, borderRadius: 2, transition: 'width .6s ease', width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <nav style={{ flex: 1, padding: '12px 0' }}>
                {MODULES.map((mod, i) => {
                  // section title
                  const showSection = i === 0 || (mod.month !== null && mod.month !== MODULES[i - 1]?.month);
                  const isActive = i === current;
                  const isDone = done.has(i);
                  return (
                    <React.Fragment key={mod.id}>
                      {showSection && mod.month && (
                        <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: '.11em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.18)', padding: '8px 22px 4px' }}>
                          {mod.month}
                        </div>
                      )}
                      <div
                        className="vp-sb-item"
                        onClick={() => loadModule(i)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 16px 9px 22px', cursor: 'pointer', transition: 'all .14s',
                          borderLeft: `2px solid ${isActive ? cssVars.greenLight : 'transparent'}`,
                          background: isActive ? 'rgba(82,183,136,.07)' : 'transparent',
                          userSelect: 'none',
                        }}
                      >
                        <div style={{
                          width: 17, height: 17, borderRadius: '50%',
                          border: `1.5px solid ${isDone ? cssVars.greenLight : 'rgba(255,255,255,.18)'}`,
                          background: isDone ? cssVars.greenLight : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          transition: 'all .18s',
                        }}>
                          <span style={{ opacity: isDone ? 1 : 0, transition: 'opacity .18s' }}><CheckIcon /></span>
                        </div>
                        <span style={{
                          fontSize: '.75rem', lineHeight: 1.35, flex: 1,
                          color: isDone ? 'rgba(255,255,255,.3)' : isActive ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.45)',
                          fontWeight: isActive ? 500 : 400,
                        }}>{mod.title}</span>
                        <span style={{ fontSize: '.59rem', color: cssVars.greenLight, fontWeight: 700, flexShrink: 0 }}>{mod.week}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </nav>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, overflowY: 'auto', background: cssVars.cream }}>
              {/* Module header */}
              <div style={{ background: cssVars.dark, padding: '40px 52px 36px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ content: "''", position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle,rgba(82,183,136,.09) 0%,transparent 65%)', top: -150, right: -80, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '.67rem', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 10 }}>{m.breadcrumb}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
                    <div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        borderRadius: 100, padding: '3px 12px', fontSize: '.63rem', fontWeight: 700,
                        letterSpacing: '.07em', textTransform: 'uppercase' as const, marginBottom: 10,
                        ...tagStyles[m.tag.cls],
                      }}>{m.tag.label}</div>
                      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: cssVars.white, lineHeight: 1.12, letterSpacing: '-.02em' }}>{m.title}</h2>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: 8, padding: '10px 18px', textAlign: 'center' as const, flexShrink: 0,
                    }}>
                      <div style={{ fontSize: '.6rem', textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'rgba(255,255,255,.3)', marginBottom: 2 }}>Semaine</div>
                      <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.5rem', color: cssVars.greenLight, lineHeight: 1 }}>{m.week}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module body */}
              <div style={{ padding: '40px 52px 60px', maxWidth: 860 }}>
                {renderContent()}
              </div>

              {/* Module nav */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '22px 52px', background: cssVars.white, borderTop: '1px solid rgba(0,0,0,.07)',
              }}>
                <button
                  className="vp-btn-nav"
                  onClick={() => loadModule(current - 1)}
                  disabled={isFirst}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: '1.5px solid rgba(0,0,0,.12)', background: 'transparent',
                    padding: '10px 20px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif",
                    fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .17s',
                    color: cssVars.dark, opacity: isFirst ? 0.3 : 1, pointerEvents: isFirst ? 'none' : 'auto',
                  }}
                >{"\u2190"} Pr&eacute;c&eacute;dent</button>
                <span style={{ fontSize: '.73rem', color: cssVars.gray }}>{current + 1} / {MODULES.length}</span>
                <button
                  className="vp-btn-nav primary"
                  onClick={() => markDoneAndNext(current)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: cssVars.greenLight, borderColor: cssVars.greenLight,
                    border: `1.5px solid ${cssVars.greenLight}`,
                    padding: '10px 20px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif",
                    fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .17s',
                    color: cssVars.dark,
                  }}
                >{isLast ? 'Terminer \ud83c\udfc6' : 'Suivant \u2192'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CONGRATS SCREEN ===== */}
      {screen === 'congrats' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AcademyHeader />
          <div style={{
            background: cssVars.dark, flex: 1, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center' as const, maxWidth: 540, padding: '40px 24px' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: 24, animation: 'bounce 1s ease infinite alternate' }}>{"\ud83c\udfc6"}</span>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '2.6rem', color: cssVars.white, letterSpacing: '-.03em', marginBottom: 14 }}>
                Parcours <em style={{ fontStyle: 'italic', color: cssVars.gold }}>termin&eacute; !</em>
              </h2>
              <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.93rem', lineHeight: 1.75, marginBottom: 32 }}>
                Tu ma&icirc;trises maintenant l&apos;ensemble des value propositions Graneet. Tu es pr&ecirc;t(e) &agrave; les utiliser en d&eacute;mo, en onboarding client, et pour convaincre les prospects les plus exigeants. Bienvenue dans l&apos;&eacute;quipe !
              </p>
              <button
                onClick={() => setScreen('welcome')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: cssVars.greenLight, color: cssVars.dark, border: 'none',
                  padding: '14px 28px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif",
                  fontSize: '.88rem', fontWeight: 700, cursor: 'pointer', transition: 'all .2s',
                }}
              >{"\u21a9"} Recommencer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
