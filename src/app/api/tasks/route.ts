import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import type { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

// ─── Config ────────────────────────────────────────────────────────────────────

const GENERAL_DB_ID = '242f098f-a71b-81b5-a553-e653205c5459';
const TECH_DB_ID = '242f098f-a71b-8110-9085-df6079919513';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type TaskType = '🥋 Dojo' | '📋   Présentation' | '💻 Set-up' | '📍 Task';
export type TaskStatus = 'To do' | 'In Progress' | 'Done' | 'Bac rouge';
export type TeamValue =
  | 'Product Management'
  | 'Customer Success'
  | 'Sales'
  | 'Tech'
  | 'Product design'
  | 'HR'
  | 'SDR'
  | 'ALL';

export type GeneralTimeline =
  | 'Jour 1'
  | 'Semaine 1'
  | 'Semaine 2'
  | 'Semaine 3'
  | 'Semaine 4 et +'
  | 'post attribution  8 mois après arrivée';

export type TechTimeline = 'Semaine 1' | 'Semaine 2' | 'Semaine 3' | 'Semaine 4' | 'Mois 2';

export type NormalizedTimeline =
  | 'Jour 1'
  | 'Semaine 1'
  | 'Semaine 2'
  | 'Semaine 3'
  | 'Semaine 4+'
  | 'Mois 2'
  | 'Post-attribution';

export interface Task {
  id: string;
  url: string;
  name: string;
  type: TaskType | null;
  timeline: NormalizedTimeline | null;
  team: TeamValue[];
  duration: number | null;
  status: TaskStatus | null;
  board: 'general' | 'tech';
}

// ─── Timeline normalisation ─────────────────────────────────────────────────────

function normalizeTimeline(raw: string, board: 'general' | 'tech'): NormalizedTimeline | null {
  if (board === 'general') {
    const map: Record<string, NormalizedTimeline> = {
      'Jour 1': 'Jour 1',
      'Semaine 1': 'Semaine 1',
      'Semaine 2': 'Semaine 2',
      'Semaine 3': 'Semaine 3',
      'Semaine 4 et +': 'Semaine 4+',
      'post attribution  8 mois après arrivée': 'Post-attribution',
    };
    return map[raw] ?? null;
  } else {
    const map: Record<string, NormalizedTimeline> = {
      'Semaine 1': 'Semaine 1',
      'Semaine 2': 'Semaine 2',
      'Semaine 3': 'Semaine 3',
      'Semaine 4': 'Semaine 4+',
      'Mois 2': 'Mois 2',
    };
    return map[raw] ?? null;
  }
}

// ─── Timeline sort order ────────────────────────────────────────────────────────

const TIMELINE_ORDER: NormalizedTimeline[] = [
  'Jour 1',
  'Semaine 1',
  'Semaine 2',
  'Semaine 3',
  'Semaine 4+',
  'Mois 2',
  'Post-attribution',
];

// ─── Notion page → Task ─────────────────────────────────────────────────────────

function parseNotionPage(page: PageObjectResponse, board: 'general' | 'tech'): Task {
  const props = page.properties;

  // Name
  const nameArr =
    props['Name']?.type === 'title' ? props['Name'].title : [];
  const name = nameArr.map((t: { plain_text: string }) => t.plain_text).join('');

  // Type
  const typeSelect = props['Type']?.type === 'select' ? props['Type'].select : null;
  const type = (typeSelect?.name ?? null) as TaskType | null;

  // Timeline
  const timelineSelect = props['Timeline']?.type === 'select' ? props['Timeline'].select : null;
  const timelineRaw = timelineSelect?.name ?? null;
  const timeline = timelineRaw ? normalizeTimeline(timelineRaw, board) : null;

  // Statut
  const statutSelect = props['Statut']?.type === 'select' ? props['Statut'].select : null;
  const status = (statutSelect?.name ?? null) as TaskStatus | null;

  // Team (multi-select)
  const teamMulti = props['Team']?.type === 'multi_select' ? props['Team'].multi_select : [];
  const team = teamMulti.map((t: { name: string }) => t.name) as TeamValue[];

  // Durée prévue
  const dureeNumber = props['Durée prévue']?.type === 'number' ? props['Durée prévue'].number : null;

  return {
    id: page.id,
    url: page.url,
    name,
    type,
    timeline,
    team,
    duration: dureeNumber ?? null,
    status,
    board,
  };
}

// ─── Fetch from Notion ──────────────────────────────────────────────────────────

async function fetchNotionDB(notion: Client, dbId: string, board: 'general' | 'tech'): Promise<Task[]> {
  const tasks: Task[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: dbId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (page.object === 'page' && 'properties' in page) {
        tasks.push(parseNotionPage(page as PageObjectResponse, board));
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return tasks;
}

// ─── Demo data ──────────────────────────────────────────────────────────────────

function getDemoTasks(): Task[] {
  return [
    // ── Général — Jour 1 — ALL ──────────────────────────────────────────────────
    {
      id: '242f098fa71b81a688fdd75d7d3aaf99',
      url: 'https://www.notion.so/242f098fa71b81a688fdd75d7d3aaf99',
      name: 'Infos utiles !',
      type: '📍 Task',
      timeline: 'Jour 1',
      team: ['ALL'],
      duration: 15,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b8109b733e9afb982bbf9',
      url: 'https://www.notion.so/242f098fa71b8109b733e9afb982bbf9',
      name: 'Découvrir l\'organigramme Graneet',
      type: '📍 Task',
      timeline: 'Jour 1',
      team: ['ALL'],
      duration: 15,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b811087aaec36ec6c13fb',
      url: 'https://www.notion.so/242f098fa71b811087aaec36ec6c13fb',
      name: 'Mise en place signature mail',
      type: '💻 Set-up',
      timeline: 'Jour 1',
      team: ['ALL'],
      duration: 2,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b816db863c59977cd2580',
      url: 'https://www.notion.so/242f098fa71b816db863c59977cd2580',
      name: 'Rejoindre le Slack de Point 9',
      type: '📍 Task',
      timeline: 'Jour 1',
      team: ['ALL'],
      duration: 10,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81f8ba09fe83c6cd1f78',
      url: 'https://www.notion.so/242f098fa71b81f8ba09fe83c6cd1f78',
      name: 'Découverte de la page Life@Graneet',
      type: '📍 Task',
      timeline: 'Jour 1',
      team: ['ALL'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Semaine 1 — ALL ───────────────────────────────────────────────
    {
      id: '242f098fa71b81fea147f3f5349d1835',
      url: 'https://www.notion.so/242f098fa71b81fea147f3f5349d1835',
      name: 'Fais ta première #synchrohebdo',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['ALL'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81f6bc78fdd00bb96831',
      url: 'https://www.notion.so/242f098fa71b81f6bc78fdd00bb96831',
      name: 'Déclare chaque semaine dans Lucca tes jours de TT/Présence au bureau',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['ALL'],
      duration: 15,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b8132a0a5c8eed8baf95c',
      url: 'https://www.notion.so/242f098fa71b8132a0a5c8eed8baf95c',
      name: 'En autonomie : Fonctionnement du Support',
      type: '🥋 Dojo',
      timeline: 'Semaine 1',
      team: ['ALL'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81188f81dcfeb0d995c2',
      url: 'https://www.notion.so/242f098fa71b81188f81dcfeb0d995c2',
      name: '05 : Session Concurrence',
      type: '📋   Présentation',
      timeline: 'Semaine 1',
      team: ['ALL'],
      duration: 60,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Semaine 1 — équipes spécifiques ───────────────────────────────
    {
      id: '242f098fa71b81dd9b44c335c810a8d3',
      url: 'https://www.notion.so/242f098fa71b81dd9b44c335c810a8d3',
      name: '[CSM/AE only] Crée ton compte démo avant l\'atelier 5bis',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['Customer Success', 'Sales'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81d3a912ea6f065033d7',
      url: 'https://www.notion.so/242f098fa71b81d3a912ea6f065033d7',
      name: 'Faire ton premier 1:1 avec ton manager',
      type: '📋   Présentation',
      timeline: 'Semaine 1',
      team: ['Customer Success'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81afaca5e9d7e4243087',
      url: 'https://www.notion.so/242f098fa71b81afaca5e9d7e4243087',
      name: 'Les rituels produits',
      type: '📋   Présentation',
      timeline: 'Semaine 1',
      team: ['Product Management', 'Product design'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b812587dce92b0d1ae883',
      url: 'https://www.notion.so/242f098fa71b812587dce92b0d1ae883',
      name: 'Prise en main des ressources produit',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['Product Management', 'Product design'],
      duration: null,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Semaine 2 — ALL ───────────────────────────────────────────────
    {
      id: '242f098fa71b816d839fc0c35f555003',
      url: 'https://www.notion.so/242f098fa71b816d839fc0c35f555003',
      name: 'Assister à un point d\'onboarding client',
      type: '📋   Présentation',
      timeline: 'Semaine 2',
      team: ['ALL'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81a38420f00b82c318c7',
      url: 'https://www.notion.so/242f098fa71b81a38420f00b82c318c7',
      name: 'Aller plus loin sur le BTP',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['ALL'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81c389b1d6f5aa6bc695',
      url: 'https://www.notion.so/242f098fa71b81c389b1d6f5aa6bc695',
      name: 'Découvre la politique de Télétravail de Graneet',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['ALL'],
      duration: 15,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Semaine 2 — équipes spécifiques ───────────────────────────────
    {
      id: '242f098fa71b811fb19dfa063a14cdae',
      url: 'https://www.notion.so/242f098fa71b811fb19dfa063a14cdae',
      name: 'S\'assurer qu\'on connaît la boîte à outils de Graneet et de son équipe',
      type: '🥋 Dojo',
      timeline: 'Semaine 2',
      team: ['Customer Success', 'Product Management', 'Product design'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b8181a128cedc7d35e2df',
      url: 'https://www.notion.so/242f098fa71b8181a128cedc7d35e2df',
      name: '1er cold call',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['Sales', 'SDR'],
      duration: 15,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b8190a8ffee94054fd86c',
      url: 'https://www.notion.so/242f098fa71b8190a8ffee94054fd86c',
      name: 'Setup Aircall',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['Customer Success'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b8192b384f431ee1dd348',
      url: 'https://www.notion.so/242f098fa71b8192b384f431ee1dd348',
      name: 'Setup Aircall - SALES',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['Sales'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81f092c4e963c6a153e8',
      url: 'https://www.notion.so/242f098fa71b81f092c4e963c6a153e8',
      name: 'Comment booker un RDV Sales',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['Sales'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '342f098fa71b807583e5ce959d4b05f6',
      url: 'https://www.notion.so/342f098fa71b807583e5ce959d4b05f6',
      name: 'Duplique ton compte démo',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['Sales'],
      duration: 5,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b819e8342df807a603168',
      url: 'https://www.notion.so/242f098fa71b819e8342df807a603168',
      name: '[CSM only] Prise en main de Vitally',
      type: '📋   Présentation',
      timeline: 'Semaine 2',
      team: ['Customer Success'],
      duration: 60,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81ecac29e2f75ad42424',
      url: 'https://www.notion.so/242f098fa71b81ecac29e2f75ad42424',
      name: 'Participer à 2 présentations de specs',
      type: '📍 Task',
      timeline: 'Semaine 2',
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Semaine 3 — ALL ───────────────────────────────────────────────
    {
      id: '2aff098fa71b80f297f0cd457efe76f7',
      url: 'https://www.notion.so/2aff098fa71b80f297f0cd457efe76f7',
      name: 'A few key presentations',
      type: '📍 Task',
      timeline: 'Semaine 3',
      team: ['ALL'],
      duration: null,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Semaine 3 — équipes spécifiques ───────────────────────────────
    {
      id: '242f098fa71b81b9bcdde9476b796af3',
      url: 'https://www.notion.so/242f098fa71b81b9bcdde9476b796af3',
      name: 'Dojo - Intégration de données clients',
      type: '🥋 Dojo',
      timeline: 'Semaine 3',
      team: ['Customer Success'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b812e9842d280fd2f88e6',
      url: 'https://www.notion.so/242f098fa71b812e9842d280fd2f88e6',
      name: 'Role play - Excel & Legacy',
      type: '🥋 Dojo',
      timeline: 'Semaine 3',
      team: ['Sales'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b811b803ce7340a6c2760',
      url: 'https://www.notion.so/242f098fa71b811b803ce7340a6c2760',
      name: 'Graneet QUIZ [Devis]',
      type: '🥋 Dojo',
      timeline: 'Semaine 3',
      team: ['Product Management', 'Product design', 'Customer Success', 'Sales'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b810ab1eefe0af5c99654',
      url: 'https://www.notion.so/242f098fa71b810ab1eefe0af5c99654',
      name: '[CSM only] Paramètre ton n° de portable Aircall + finir setup Vitally et Hubspot',
      type: '💻 Set-up',
      timeline: 'Semaine 3',
      team: ['Customer Success'],
      duration: 30,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Semaine 4+ ────────────────────────────────────────────────────
    {
      id: '242f098fa71b8174a27dee56e1541f25',
      url: 'https://www.notion.so/242f098fa71b8174a27dee56e1541f25',
      name: '[Back-Office 4] Faire des requêtes SQL simples',
      type: '🥋 Dojo',
      timeline: 'Semaine 4+',
      team: ['Customer Success', 'Product Management', 'Tech'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '242f098fa71b81c7a5c5f3c5945c4e03',
      url: 'https://www.notion.so/242f098fa71b81c7a5c5f3c5945c4e03',
      name: 'Préparer un contrat',
      type: '🥋 Dojo',
      timeline: 'Semaine 4+',
      team: ['Sales'],
      duration: null,
      status: 'To do',
      board: 'general',
    },

    // ── Général — Sans timeline — Product Management & Design ───────────────────
    {
      id: '294f098fa71b80d18a5cf77384b3d130',
      url: 'https://www.notion.so/294f098fa71b80d18a5cf77384b3d130',
      name: 'Product Training - Module Planning',
      type: '📋   Présentation',
      timeline: null,
      team: ['Product Management', 'Product design'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '294f098fa71b80049d41d702ecb43561',
      url: 'https://www.notion.so/294f098fa71b80049d41d702ecb43561',
      name: 'Product Training - Module Ventes',
      type: '📋   Présentation',
      timeline: null,
      team: ['Product Management', 'Product design'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '294f098fa71b80ea8fb7c1259b3bf577',
      url: 'https://www.notion.so/294f098fa71b80ea8fb7c1259b3bf577',
      name: 'Product Training - Module Devis',
      type: '📋   Présentation',
      timeline: null,
      team: ['Product Management', 'Product design'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '294f098fa71b80218640fc7318b419f7',
      url: 'https://www.notion.so/294f098fa71b80218640fc7318b419f7',
      name: 'Product Training - Module Comptabilité',
      type: '📋   Présentation',
      timeline: null,
      team: ['Product Management', 'Product design'],
      duration: null,
      status: 'To do',
      board: 'general',
    },
    {
      id: '294f098fa71b80309448c081f2d93ebb',
      url: 'https://www.notion.so/294f098fa71b80309448c081f2d93ebb',
      name: 'Product Training - Module Achats',
      type: '📋   Présentation',
      timeline: null,
      team: ['Product Management', 'Product design'],
      duration: null,
      status: 'To do',
      board: 'general',
    },

    // ── Tech — Semaine 1 ────────────────────────────────────────────────────────
    {
      id: '242f098fa71b81f588bafa2e946c7897',
      url: 'https://www.notion.so/242f098fa71b81f588bafa2e946c7897',
      name: 'Présentation des objectifs et des 1-to-1 sur l\'onboarding',
      type: '📋   Présentation',
      timeline: 'Semaine 1',
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },
    {
      id: '242f098fa71b817fb1dae545764adad4',
      url: 'https://www.notion.so/242f098fa71b817fb1dae545764adad4',
      name: 'Installation fonctionnelle du projet',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },
    {
      id: '242f098fa71b814aaf60fa8fc4db0a01',
      url: 'https://www.notion.so/242f098fa71b814aaf60fa8fc4db0a01',
      name: 'Installation des principales applications',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },
    {
      id: '242f098fa71b8173874af1a9d5e1063d',
      url: 'https://www.notion.so/242f098fa71b8173874af1a9d5e1063d',
      name: 'Présentation des standards du flow de dev + Identification des premiers tickets',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },
    {
      id: '242f098fa71b81218112c521103cf9ad',
      url: 'https://www.notion.so/242f098fa71b81218112c521103cf9ad',
      name: 'Accès aux DB des différents environnements',
      type: '📍 Task',
      timeline: 'Semaine 1',
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },

    // ── Tech — Semaine 2 ────────────────────────────────────────────────────────
    {
      id: '242f098fa71b811f905be62c2c501dfc',
      url: 'https://www.notion.so/242f098fa71b811f905be62c2c501dfc',
      name: 'Présentation du Git flow et des features flags',
      type: '📋   Présentation',
      timeline: 'Semaine 2',
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },

    // ── Tech — Sans timeline ────────────────────────────────────────────────────
    {
      id: '242f098fa71b819eb9ebe17bf09ea299',
      url: 'https://www.notion.so/242f098fa71b819eb9ebe17bf09ea299',
      name: 'Communication de l\'équipe technique (Gitlab / Slack / Notion / Discord)',
      type: '📍 Task',
      timeline: null,
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },
    {
      id: '242f098fa71b81ab9539f6c62635ae2b',
      url: 'https://www.notion.so/242f098fa71b81ab9539f6c62635ae2b',
      name: 'Présentation de l\'authentification (Auth0)',
      type: '📋   Présentation',
      timeline: null,
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },
    {
      id: '242f098fa71b81f7a1c7edc10d288085',
      url: 'https://www.notion.so/242f098fa71b81f7a1c7edc10d288085',
      name: 'Présentation et explications sommaires sur les entités',
      type: '📋   Présentation',
      timeline: null,
      team: ['Tech'],
      duration: null,
      status: 'To do',
      board: 'tech',
    },
  ];
}

// ─── Route handler ──────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const team = searchParams.get('team') ?? '';

  try {
    let tasks: Task[];

    if (!process.env.NOTION_API_KEY) {
      // Return demo data when no API key is configured
      tasks = getDemoTasks();
    } else {
      const notion = new Client({ auth: process.env.NOTION_API_KEY });

      const [generalTasks, techTasks] = await Promise.all([
        fetchNotionDB(notion, GENERAL_DB_ID, 'general'),
        team === 'Tech' ? fetchNotionDB(notion, TECH_DB_ID, 'tech') : Promise.resolve([]),
      ]);

      tasks = [...generalTasks, ...techTasks];
    }

    // Sort by timeline order then name
    tasks.sort((a, b) => {
      const aIdx = a.timeline ? TIMELINE_ORDER.indexOf(a.timeline) : 999;
      const bIdx = b.timeline ? TIMELINE_ORDER.indexOf(b.timeline) : 999;
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.name.localeCompare(b.name, 'fr');
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('[/api/tasks] Error:', error);
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: 'Impossible de charger les tâches.', details: message },
      { status: 500 }
    );
  }
}
