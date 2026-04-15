'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import AcademyHeader from '../../components/AcademyHeader';

// ============================================================
// DISC COACH - Graneet Interactive Training (React Port)
// ============================================================

// --- COLORS ---
const COLORS = {
  graneetDark: '#1E2A3A',
  graneetDarkLight: '#2A3A4E',
  graneetYellow: '#E8D44D',
  graneetYellowHover: '#D4C040',
  graneetCream: '#F7F5EF',
  graneetCreamDark: '#EDE9DF',
  chatBg: '#FFFFFF',
  userBubble: '#1E2A3A',
  botBubble: '#EDE9DF',
  textMain: '#1E2A3A',
  textLight: '#5A6672',
  discRed: '#E74C3C',
  discYellow: '#E8D44D',
  discGreen: '#2ECC71',
  discBlue: '#3498DB',
};

// --- PROFILES ---
const PROFILES: Record<string, { emoji: string; name: string; color: string }> = {
  D: { emoji: '\u{1F534}', name: 'Dominant', color: COLORS.discRed },
  I: { emoji: '\u{1F7E1}', name: 'Influent', color: COLORS.discYellow },
  S: { emoji: '\u{1F7E2}', name: 'Stable', color: COLORS.discGreen },
  C: { emoji: '\u{1F535}', name: 'Consciencieux', color: COLORS.discBlue },
};

// --- TEST QUESTIONS (20) ---
const TEST_QUESTIONS = [
  "En r\u00e9union d'\u00e9quipe, tu as tendance \u00e0 :\nA. Prendre la parole rapidement pour orienter les d\u00e9cisions\nB. Animer l'\u00e9change, faire rire, lancer des id\u00e9es\nC. \u00c9couter attentivement avant de donner ton avis\nD. Pr\u00e9parer des arguments pr\u00e9cis et v\u00e9rifi\u00e9s avant d'intervenir",
  "Quand tu dois faire face \u00e0 un probl\u00e8me urgent :\nA. Tu passes directement \u00e0 l'action pour r\u00e9gler \u00e7a vite\nB. Tu brainstormes avec l'\u00e9quipe pour trouver des solutions\nC. Tu cherches d'abord comment \u00e7a affecte l'\u00e9quipe\nD. Tu analyses la situation en d\u00e9tail avant d'agir",
  "Ce que tes coll\u00e8gues appr\u00e9cient le plus chez toi :\nA. Ta capacit\u00e9 \u00e0 prendre des d\u00e9cisions rapidement\nB. Ton enthousiasme et ton \u00e9nergie communicative\nC. Ta fiabilit\u00e9 et ta disponibilit\u00e9 pour les autres\nD. Ta rigueur et la qualit\u00e9 de ton travail",
  "Face \u00e0 un d\u00e9saccord avec un coll\u00e8gue, tu :\nA. D\u00e9fends ton point de vue fermement et clairement\nB. Cherches \u00e0 d\u00e9tendre l'atmosph\u00e8re et trouver un compromis\nC. \u00c9vites le conflit et cherches une solution pour tous\nD. Pr\u00e9sentes des faits et donn\u00e9es pour \u00e9tayer ta position",
  "Tu te sens le plus \u00e0 l'aise quand :\nA. Tu as de l'autonomie et des responsabilit\u00e9s claires\nB. Tu travailles avec des gens enthousiastes et dynamiques\nC. L'ambiance est stable et tu sais \u00e0 quoi t'attendre\nD. Tu as le temps de bien faire les choses correctement",
  "Quand tu re\u00e7ois une nouvelle mission, ta r\u00e9action :\nA. Tr\u00e8s bien, c'est parti, je m'en occupe\nB. Super ! On va faire quelque chose de sympa avec \u00e7a\nC. D'accord, comment je peux aider l'\u00e9quipe l\u00e0-dedans ?\nD. Ok, j'ai besoin d'informations suppl\u00e9mentaires d'abord",
  "Lors d'un changement important dans ton travail :\nA. Tu l'accueilles comme une opportunit\u00e9 de te d\u00e9marquer\nB. Tu es enthousiaste face aux nouvelles possibilit\u00e9s\nC. Tu as besoin de temps pour t'y adapter\nD. Tu veux comprendre pourquoi et comment \u00e7a va se passer",
  "Une bonne journ\u00e9e de travail, c'est :\nA. Tu as avanc\u00e9 concr\u00e8tement sur tes objectifs\nB. Tu as eu de bonnes interactions avec l'\u00e9quipe\nC. Tout s'est d\u00e9roul\u00e9 sereinement, sans tension\nD. Tu as produit un travail dont tu es vraiment fier(e)",
  "Dans un projet d'\u00e9quipe, ton r\u00f4le naturel :\nA. Fixer les objectifs et pousser \u00e0 avancer\nB. Motiver et f\u00e9d\u00e9rer les \u00e9nergies\nC. Assurer la continuit\u00e9 et soutenir les autres\nD. V\u00e9rifier la qualit\u00e9 et la coh\u00e9rence du travail",
  "Pour convaincre quelqu'un, tu mets en avant :\nA. Les r\u00e9sultats concrets et les b\u00e9n\u00e9fices directs\nB. L'enthousiasme, les opportunit\u00e9s, la vision\nC. L'impact positif sur l'\u00e9quipe et la relation\nD. Les donn\u00e9es, les chiffres et les arguments logiques",
  "Ce qui t'\u00e9nerve le plus au travail :\nA. La lenteur et l'ind\u00e9cision\nB. Le manque d'enthousiasme et les environnements rigides\nC. Les conflits et les tensions dans l'\u00e9quipe\nD. Les erreurs \u00e9vitables et le travail fait \u00e0 la va-vite",
  "Quand tu expliques quelque chose \u00e0 un coll\u00e8gue :\nA. Tu vas droit au but, tu donnes les infos essentielles\nB. Tu racontes une anecdote ou un exemple pour illustrer\nC. Tu prends le temps de t'assurer que la personne a compris\nD. Tu expliques m\u00e9thodiquement, \u00e9tape par \u00e9tape",
  "Ton espace de travail ressemble plut\u00f4t \u00e0 :\nA. Un espace fonctionnel, l'essentiel visible et accessible\nB. Un endroit vivant, avec des post-its et objets perso\nC. Un espace ordonn\u00e9 et confortable, familier\nD. Un espace tr\u00e8s organis\u00e9 o\u00f9 chaque chose est \u00e0 sa place",
  "Face \u00e0 une deadline serr\u00e9e, tu :\nA. Acc\u00e9l\u00e8res le rythme et prends les d\u00e9cisions n\u00e9cessaires\nB. Galvanises l'\u00e9quipe pour qu'elle donne le meilleur\nC. T'assures que tout le monde est soutenu et ne craque pas\nD. \u00c9tablis un plan pr\u00e9cis pour g\u00e9rer les priorit\u00e9s",
  "Quand quelqu'un te fait un retour n\u00e9gatif :\nA. Tu l'\u00e9coutes rapidement et passes \u00e0 l'action pour corriger\nB. Tu essaies de comprendre ce que la personne ressent\nC. Tu prends le temps de dig\u00e9rer, \u00e7a peut t'affecter\nD. Tu demandes des pr\u00e9cisions concr\u00e8tes sur ce qui ne va pas",
  "En dehors du travail, tu es plut\u00f4t du genre \u00e0 :\nA. Te lancer dans des d\u00e9fis sportifs ou projets ambitieux\nB. Organiser des sorties, r\u00e9unir des amis, animer\nC. Passer du temps de qualit\u00e9 avec tes proches\nD. Te plonger dans un livre ou documentaire pour apprendre",
  "Ton rapport au temps :\nA. Le temps c'est de l'argent, tu vas vite\nB. Tu es souvent en retard, tu t'emballes facilement\nC. Tu respectes les horaires et engagements, c'est important\nD. Tu planifies en avance pour ne pas \u00eatre pris(e) au d\u00e9pourvu",
  "Pour prendre une d\u00e9cision importante :\nA. Tu d\u00e9cides vite sur la base de ton instinct et l'objectif\nB. Tu en parles autour de toi pour avoir des avis\nC. Tu prends le temps de mesurer l'impact sur les personnes\nD. Tu analyses toutes les options avant de te prononcer",
  "Ce qui te donne le plus d'\u00e9nergie au travail :\nA. Relever des d\u00e9fis et obtenir des r\u00e9sultats\nB. Les \u00e9changes humains et les projets stimulants\nC. Savoir que tu contribues au bien-\u00eatre de l'\u00e9quipe\nD. Faire un travail de qualit\u00e9 dont tu es vraiment fier(e)",
  "Si tu devais te d\u00e9crire en un mot, ce serait :\nA. D\u00e9termin\u00e9(e)\nB. Enthousiaste\nC. Fiable\nD. Rigoureux(se)"
];

// --- QUIZ QUESTIONS (5) ---
const QUIZ_QUESTIONS = [
  { q: "Un coll\u00e8gue te parle tr\u00e8s rapidement, va droit au but et n'aime pas les longues r\u00e9unions. Son profil est probablement :\nA. I - Influent\nB. D - Dominant\nC. S - Stable\nD. C - Consciencieux", answer: 'B', explanation: "C'est bien le profil D - Dominant ! Direct, rapide, orient\u00e9 r\u00e9sultats." },
  { q: "Pour convaincre un profil C, la meilleure approche :\nA. Lui raconter une belle histoire\nB. Lui montrer l'impact sur l'\u00e9quipe\nC. Lui apporter des donn\u00e9es et des faits\nD. Lui proposer des options et aller vite", answer: 'C', explanation: "Le profil C est convaincu par les donn\u00e9es, les faits et les arguments logiques." },
  { q: "Comportement d'un profil S sous pression :\nA. Il prend la d\u00e9cision seul\nB. Il \u00e9vite le conflit et met du temps \u00e0 s'adapter\nC. Il analyse les donn\u00e9es en d\u00e9tail\nD. Il mobilise l'\u00e9quipe avec enthousiasme", answer: 'B', explanation: "Le profil S, sous pression, a tendance \u00e0 \u00e9viter le conflit et a besoin de temps pour s'adapter." },
  { q: "Le DISC mesure :\nA. L'intelligence \u00e9motionnelle\nB. Les comportements observables\nC. Le niveau de comp\u00e9tences\nD. Les valeurs personnelles", answer: 'B', explanation: "Le DISC mesure les comportements observables, pas l'intelligence ni les comp\u00e9tences." },
  { q: "Vrai ou Faux : On peut avoir un seul profil DISC \u00e0 100% ?", answer: 'FAUX', explanation: "Faux ! On a toujours les 4 profils en nous, dans des proportions diff\u00e9rentes." }
];

// --- RESULT TEXTS ---
const RESULT_TEXTS: Record<string, string> = {
  D: `\u{1F534} Tu es D - Dominant

Ton superpouvoir chez Graneet : tu sais prendre des d\u00e9cisions rapides et tenir les objectifs. Tu es un moteur dans ton \u00e9quipe.

Tes 3 forces naturelles :
\u2022 Tu assumes les responsabilit\u00e9s sans h\u00e9siter
\u2022 Tu vas droit au but sans te perdre dans les d\u00e9tails
\u2022 Tu rel\u00e8ves les d\u00e9fis avec \u00e9nergie

Tes 2 points de vigilance :
\u2022 Tu peux para\u00eetre brusque ou impatient(e) sans le vouloir
\u2022 Tu as tendance \u00e0 agir avant d'avoir \u00e9cout\u00e9 tout le monde

\u{1F4A1} Ton conseil cette semaine :
Avant de trancher, pose une question ouverte \u00e0 ton interlocuteur. \u00c7a prend 30 secondes et \u00e7a change tout.`,

  I: `\u{1F7E1} Tu es I - Influent

Ton superpouvoir chez Graneet : tu sais embarquer les gens et rendre les projets enthousiasmants. Tu es un atout pour la coh\u00e9sion et la relation client.

Tes 3 forces naturelles :
\u2022 Tu communiques facilement et naturellement
\u2022 Tu donnes de l'\u00e9nergie \u00e0 ceux qui t'entourent
\u2022 Tu cr\u00e9es facilement des liens avec clients et partenaires

Tes 2 points de vigilance :
\u2022 Tu peux t'\u00e9parpiller et oublier des d\u00e9tails importants
\u2022 Tu as parfois du mal \u00e0 tenir les d\u00e9lais

\u{1F4A1} Ton conseil cette semaine :
Pour chaque r\u00e9union, note 3 points \u00e0 retenir avant d'en sortir. \u00c7a t'aidera \u00e0 garder le cap.`,

  S: `\u{1F7E2} Tu es S - Stable

Ton superpouvoir chez Graneet : tu es le ciment de l'\u00e9quipe. Fiable et constant(e), tu cr\u00e9es un environnement o\u00f9 les autres se sentent en s\u00e9curit\u00e9.

Tes 3 forces naturelles :
\u2022 Tu es toujours l\u00e0 quand l'\u00e9quipe en a besoin
\u2022 Tu \u00e9coutes vraiment, sans juger
\u2022 Tu d\u00e9samorces les tensions naturellement

Tes 2 points de vigilance :
\u2022 Tu as du mal \u00e0 dire non et exprimer tes d\u00e9saccords
\u2022 Tu peux accumuler en silence jusqu'\u00e0 saturation

\u{1F4A1} Ton conseil cette semaine :
Ose exprimer ton avis m\u00eame quand il diff\u00e8re du groupe. Ton point de vue a de la valeur.`,

  C: `\u{1F535} Tu es C - Consciencieux

Ton superpouvoir chez Graneet : tu es le garant de la qualit\u00e9. Tu \u00e9vites les erreurs co\u00fbteuses gr\u00e2ce \u00e0 ta rigueur.

Tes 3 forces naturelles :
\u2022 Tu produis un travail de haute qualit\u00e9
\u2022 Tu anticipes les probl\u00e8mes avant qu'ils arrivent
\u2022 Tu ma\u00eetrises ton domaine en profondeur

Tes 2 points de vigilance :
\u2022 Tu peux bloquer sur un d\u00e9tail et ralentir le projet
\u2022 Tu as du mal \u00e0 d\u00e9l\u00e9guer

\u{1F4A1} Ton conseil cette semaine :
80% parfait et livr\u00e9 vaut mieux que 100% parfait en retard. Parfois, avancer prime sur la perfection.`
};

// --- ADAPT TIPS ---
const ADAPT_TIPS: Record<string, Record<string, string[]>> = {
  D: {
    I: ["Laisse-lui de l'espace pour s'exprimer et proposer des id\u00e9es", "Reconnais ses contributions \u00e0 l'ambiance d'\u00e9quipe", "Accepte que tout ne soit pas ultra-structur\u00e9"],
    S: ["Ralentis ton rythme quand tu lui parles", "Pr\u00e9viens-le en amont des changements", "Demande son avis au lieu de d\u00e9cider seul(e)"],
    C: ["Donne-lui le temps d'analyser avant de d\u00e9cider", "Fournis des donn\u00e9es et des d\u00e9tails quand tu fais une demande", "Respecte son besoin de process et de rigueur"]
  },
  I: {
    D: ["Va droit au but quand tu lui parles", "Concentre-toi sur les r\u00e9sultats, pas les anecdotes", "Respecte son temps et sois concis(e)"],
    S: ["Sois attentif(ve) \u00e0 son besoin de stabilit\u00e9", "Ne change pas de plan trop souvent", "Prends le temps de l'\u00e9couter vraiment"],
    C: ["Pr\u00e9pare tes arguments avec des faits", "Sois plus structur\u00e9(e) dans tes explications", "Respecte les deadlines et les process"]
  },
  S: {
    D: ["Ne prends pas sa franchise pour de l'agressivit\u00e9", "Ose donner ton avis m\u00eame s'il est diff\u00e9rent", "Sois direct(e), il/elle appr\u00e9ciera"],
    I: ["Accepte son \u00e9nergie et son enthousiasme", "Sois ouvert(e) aux nouvelles id\u00e9es", "Participe activement aux \u00e9changes d'\u00e9quipe"],
    C: ["Respecte son besoin de pr\u00e9cision", "Donne-lui les informations dont il/elle a besoin", "Ne le/la presse pas pour une d\u00e9cision rapide"]
  },
  C: {
    D: ["Sois concis(e) et oriente vers les r\u00e9sultats", "Ne te perds pas dans les d\u00e9tails techniques d'embl\u00e9e", "Propose des solutions, pas seulement des analyses"],
    I: ["Accepte qu'il/elle soit moins structur\u00e9(e) que toi", "Montre de l'ouverture \u00e0 ses id\u00e9es cr\u00e9atives", "All\u00e8ge ton approche, pas tout besoin d'\u00eatre parfait"],
    S: ["Prends en compte l'aspect humain dans tes analyses", "Sois patient(e) et bienveillant(e) dans tes retours", "Valorise sa contribution \u00e0 la coh\u00e9sion d'\u00e9quipe"]
  }
};

// --- SCENARIOS ---
const SCENARIOS: Record<string, string> = {
  D: `Tu dois annoncer un changement de process \u00e0 ton \u00e9quipe. Deux coll\u00e8gues ne sont clairement pas d'accord et le disent.

Comment tu r\u00e9agirais naturellement ?
Et comment le DISC te sugg\u00e8re de r\u00e9agir ?

(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)`,
  I: `Tu animes une r\u00e9union de brainstorming et tu t'aper\u00e7ois qu'un coll\u00e8gue (profil C) n'a pas dit un mot depuis 20 minutes.

Comment tu r\u00e9agirais naturellement ?
Et comment le DISC te sugg\u00e8re de r\u00e9agir ?

(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)`,
  S: `Ton manager (profil D) te demande de prendre en charge un nouveau projet avec une deadline tr\u00e8s serr\u00e9e, alors que tu as d\u00e9j\u00e0 beaucoup sur ton bureau.

Comment tu r\u00e9agirais naturellement ?
Et comment le DISC te sugg\u00e8re de r\u00e9agir ?

(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)`,
  C: `Un coll\u00e8gue (profil I) te propose de lancer un nouveau process sans documentation pr\u00e9cise. "On verra au fur et \u00e0 mesure !" dit-il.

Comment tu r\u00e9agirais naturellement ?
Et comment le DISC te sugg\u00e8re de r\u00e9agir ?

(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)`
};

const SCENARIO_FEEDBACK: Record<string, string> = {
  D: `Super r\u00e9flexion ! \u{1F44F}

Ce que le DISC te sugg\u00e8re ici :
Avant d'imposer le changement, prends 5 minutes pour \u00e9couter les objections de tes coll\u00e8gues. Un profil S a besoin d'\u00eatre rassur\u00e9, un profil C veut comprendre le "pourquoi". En montrant que tu as entendu leurs pr\u00e9occupations, tu obtiendras une adh\u00e9sion bien plus forte.`,
  I: `Bonne analyse ! \u{1F44F}

Ce que le DISC te sugg\u00e8re ici :
Plut\u00f4t que de remplir le silence avec plus d'\u00e9nergie, pose une question directe mais bienveillante \u00e0 ton coll\u00e8gue C : "J'aimerais avoir ton analyse sur ce point, qu'en penses-tu ?" Les profils C ont souvent des id\u00e9es tr\u00e8s pertinentes mais ont besoin qu'on leur ouvre l'espace.`,
  S: `Tr\u00e8s bien r\u00e9fl\u00e9chi ! \u{1F44F}

Ce que le DISC te sugg\u00e8re ici :
C'est le moment d'oser dire les choses. Plut\u00f4t que d'accepter en silence, propose un \u00e9change factuel : "Je veux bien prendre ce projet, mais voici ma charge actuelle. Ensemble, priorisons." Un profil D respecte quelqu'un qui s'affirme avec des faits.`,
  C: `Excellente r\u00e9flexion ! \u{1F44F}

Ce que le DISC te sugg\u00e8re ici :
Plut\u00f4t que de bloquer le projet en exigeant une documentation parfaite d\u00e8s le d\u00e9part, propose un compromis : "OK pour avancer, mais mettons un point de contr\u00f4le dans 2 semaines pour documenter ce qui fonctionne." Tu gardes ta rigueur tout en t'adaptant au rythme du profil I.`
};

const ADVICE_MAP: Record<string, string> = {
  D: "Avant de trancher, pose une question ouverte \u00e0 ton interlocuteur.",
  I: "Pour chaque r\u00e9union, note 3 points \u00e0 retenir avant d'en sortir.",
  S: "Ose exprimer ton avis m\u00eame quand il diff\u00e8re du groupe.",
  C: "80% parfait et livr\u00e9 vaut mieux que 100% parfait en retard."
};

// --- PROGRESS MAP ---
const STEPS_PROGRESS: Record<string, [number, string]> = {
  'welcome': [2, 'Accueil'],
  'level_check': [5, 'Accueil'],
  'discovery_block1': [10, 'Th\u00e9orie'],
  'discovery_profiles': [15, 'Th\u00e9orie - Profils'],
  'discovery_profiles_next': [20, 'Th\u00e9orie - Profils'],
  'discovery_ready_test': [25, 'Th\u00e9orie'],
  'refresh_intro': [10, 'Rappel express'],
  'refresh_quiz': [20, 'Quiz m\u00e9moire'],
  'refresh_correction': [25, 'Corrections'],
  'test_intro': [28, 'Test DISC'],
  'test_q': [30, 'Test DISC'],
  'test_calc': [70, 'Calcul du profil'],
  'result': [75, 'R\u00e9sultat'],
  'adapt': [82, 'Adaptation'],
  'adapt_scenario': [86, 'Mise en pratique'],
  'quiz_intro': [88, 'Quiz final'],
  'quiz_q': [90, 'Quiz final'],
  'closing': [100, 'Termin\u00e9 !'],
};

// --- DISCOVERY PROFILE TEXTS ---
const DISCOVERY_PROFILES = [
  `\u{1F534} Profil D - Dominant

Mot-cl\u00e9 : Action
En deux mots : Direct et d\u00e9termin\u00e9

Chez Graneet, c'est souvent la personne qui prend les d\u00e9cisions rapidement, lance les projets, tient les objectifs.

Force principale : leadership, efficacit\u00e9, courage
Point de vigilance : peut sembler brusque ou impatient(e)`,

  `\u{1F7E1} Profil I - Influent

Mot-cl\u00e9 : Enthousiasme
En deux mots : Communicant et cr\u00e9atif

Chez Graneet, c'est souvent la personne qui anime les r\u00e9unions, propose des id\u00e9es, cr\u00e9e de la coh\u00e9sion.

Force principale : communication, \u00e9nergie, f\u00e9d\u00e9ration
Point de vigilance : peut s'\u00e9parpiller, oublier les d\u00e9tails`,

  `\u{1F7E2} Profil S - Stable

Mot-cl\u00e9 : Harmonie
En deux mots : Fiable et \u00e0 l'\u00e9coute

Chez Graneet, c'est souvent la personne qui est le pilier discret de l'\u00e9quipe, toujours disponible, d\u00e9samorce les tensions.

Force principale : loyaut\u00e9, \u00e9coute, fiabilit\u00e9
Point de vigilance : du mal \u00e0 s'affirmer, r\u00e9siste au changement`,

  `\u{1F535} Profil C - Consciencieux

Mot-cl\u00e9 : Pr\u00e9cision
En deux mots : Rigoureux et analytique

Chez Graneet, c'est souvent la personne qui v\u00e9rifie chaque d\u00e9tail, anticipe les probl\u00e8mes, maintient la qualit\u00e9.

Force principale : rigueur, expertise, organisation
Point de vigilance : perfectionnisme, lenteur \u00e0 d\u00e9cider`
];

// --- TYPES ---
interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  isHtml?: boolean;
}

interface ChoiceOption {
  label: string;
  value: string;
}

interface GameState {
  step: string;
  mode: string | null;
  discoveryBlock: number;
  profileIndex: number;
  testQuestion: number;
  answers: string[];
  scores: Record<string, number>;
  dominant: string | null;
  secondary: string | null;
  quizQuestion: number;
  quizScore: number;
  inputDisabled: boolean;
  inputPlaceholder: string;
  showValidationPanel: boolean;
  formSubmitted: boolean;
}

// ============================================================
// COMPONENT
// ============================================================
export default function DiscPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [choices, setChoices] = useState<ChoiceOption[]>([]);
  const [choiceCallback, setChoiceCallback] = useState<((value: string) => void) | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Accueil');
  const [showPanel, setShowPanel] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validation form state
  const [vfName, setVfName] = useState('');
  const [vfDominant, setVfDominant] = useState<string | null>(null);
  const [vfSecondary, setVfSecondary] = useState<string | null>(null);
  const [vfLevel, setVfLevel] = useState<string | null>(null);
  const [vfRating, setVfRating] = useState<number | null>(null);
  const [vfEngagement, setVfEngagement] = useState('');
  const [vfComment, setVfComment] = useState('');
  const [vfErrors, setVfErrors] = useState<Record<string, boolean>>({});
  const [starHint, setStarHint] = useState('Clique sur une \u00e9toile');
  const [successProfile, setSuccessProfile] = useState('');

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdRef = useRef(0);
  const stateRef = useRef<GameState>({
    step: 'welcome',
    mode: null,
    discoveryBlock: 0,
    profileIndex: 0,
    testQuestion: 0,
    answers: [],
    scores: { D: 0, I: 0, S: 0, C: 0 },
    dominant: null,
    secondary: null,
    quizQuestion: 0,
    quizScore: 0,
    inputDisabled: true,
    inputPlaceholder: 'Tape ta r\u00e9ponse ici...',
    showValidationPanel: false,
    formSubmitted: false,
  });
  const [inputDisabled, setInputDisabled] = useState(true);
  const [inputPlaceholder, setInputPlaceholder] = useState('Tape ta r\u00e9ponse ici...');

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping, choices]);

  // --- Helpers ---
  const addMsg = useCallback((text: string, sender: 'bot' | 'user', isHtml = false) => {
    const id = ++msgIdRef.current;
    setMessages(prev => [...prev, { id, sender, text, isHtml }]);
    return id;
  }, []);

  const updateProgress = useCallback((step: string) => {
    const info = STEPS_PROGRESS[step];
    if (!info) return;
    let pct = info[0];
    const s = stateRef.current;
    if (step === 'test_q') {
      pct = 30 + Math.round((s.testQuestion / 20) * 40);
    }
    if (step === 'quiz_q') {
      pct = 90 + Math.round((s.quizQuestion / 5) * 8);
    }
    setProgressPct(pct);
    setProgressLabel(info[1]);
  }, []);

  const botSay = useCallback((text: string, delay = 600, isHtml = false): Promise<void> => {
    return new Promise(resolve => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMsg(text, 'bot', isHtml);
        resolve();
      }, delay);
    });
  }, [addMsg]);

  const enableInput = useCallback((placeholder = 'Tape ta r\u00e9ponse ici...') => {
    setInputDisabled(false);
    setInputPlaceholder(placeholder);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const disableInput = useCallback(() => {
    setInputDisabled(true);
  }, []);

  const showChoices = useCallback((opts: ChoiceOption[], callback: (value: string) => void) => {
    setChoices(opts);
    setChoiceCallback(() => callback);
  }, []);

  const clearChoices = useCallback(() => {
    setChoices([]);
    setChoiceCallback(null);
  }, []);

  // --- Flow logic ---
  const handleScenarioResponse = useCallback(async (userText: string) => {
    const s = stateRef.current;
    addMsg(userText, 'user');
    await botSay(SCENARIO_FEEDBACK[s.dominant!], 800);
    // Start quiz
    s.step = 'quiz_intro';
    updateProgress('quiz_intro');
    s.quizQuestion = 0;
    s.quizScore = 0;
    await botSay("Derni\u00e8re \u00e9tape ! 5 questions pour valider tes acquis. R\u00e9ponds par la lettre correspondante. \u{1F4AA}", 600);
    // Ask first quiz question
    await askQuizQuestionFlow(s);
  }, [addMsg, botSay, updateProgress]);

  const showClosingFlow = useCallback(async () => {
    const s = stateRef.current;
    s.step = 'closing';
    updateProgress('closing');

    let scoreMsg: string;
    if (s.quizScore >= 4) {
      scoreMsg = `\u{1F389} Excellent ! ${s.quizScore}/5 - Tu as parfaitement assimil\u00e9 les fondamentaux du DISC !`;
    } else {
      scoreMsg = `Bon travail ! ${s.quizScore}/5 - N'h\u00e9site pas \u00e0 relire les modules qui t'ont pos\u00e9 probl\u00e8me.`;
    }
    await botSay(scoreMsg, 600);

    const dp = PROFILES[s.dominant!];
    const sp = PROFILES[s.secondary!];

    await botSay(`\u{1F393} Formation DISC Graneet termin\u00e9e !

Ton profil : ${dp.emoji} ${dp.name} + ${sp.emoji} ${sp.name}

Ton conseil cl\u00e9 : ${ADVICE_MAP[s.dominant!]}

Des questions ? Contacte Victoria Bertrel - RH Graneet
\u{1F4E7} victoria.bertrel@graneet.fr

Derni\u00e8re \u00e9tape \u{1F447} Valide ta formation en remplissant le formulaire qui s'affiche !`, 1000);

    disableInput();
    setInputPlaceholder('Formation termin\u00e9e ! Merci \u{1F389}');

    // Pre-fill validation form
    setVfDominant(s.dominant);
    setVfSecondary(s.secondary);
    setVfLevel(s.mode === 'refresh' ? 'deja_forme' : 'premiere_fois');

    setTimeout(() => setShowPanel(true), 1500);
  }, [botSay, updateProgress, disableInput]);

  const handleQuizAnswerFlow = useCallback(async (answer: string, s: GameState) => {
    const q = QUIZ_QUESTIONS[s.quizQuestion];
    const userAnswer = answer.toUpperCase().trim();
    addMsg(userAnswer, 'user');

    const isCorrect = userAnswer === q.answer || userAnswer.charAt(0) === q.answer;

    if (isCorrect) {
      s.quizScore++;
      await botSay(`\u2705 Correct ! ${q.explanation}`, 500);
    } else {
      await botSay(`\u274C Pas tout \u00e0 fait. La bonne r\u00e9ponse \u00e9tait : ${q.answer}\n\n${q.explanation}`, 500);
    }

    s.quizQuestion++;

    if (s.quizQuestion < 5) {
      await askQuizQuestionFlow(s);
    } else {
      await showClosingFlow();
    }
  }, [addMsg, botSay, showClosingFlow]);

  const askQuizQuestionFlow = useCallback(async (s: GameState) => {
    s.step = 'quiz_q';
    updateProgress('quiz_q');
    const qNum = s.quizQuestion + 1;
    const q = QUIZ_QUESTIONS[s.quizQuestion];

    await botSay(`Question ${qNum}/5 :\n\n${q.q}`, 500);

    if (s.quizQuestion === 4) {
      showChoices([
        { label: 'Vrai', value: 'VRAI' },
        { label: 'Faux', value: 'FAUX' }
      ], (val) => {
        clearChoices();
        handleQuizAnswerFlow(val, s);
      });
      enableInput("Vrai ou Faux ?");
    } else {
      showChoices([
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' }
      ], (val) => {
        clearChoices();
        handleQuizAnswerFlow(val, s);
      });
      enableInput("Ou tape A, B, C ou D...");
    }
  }, [updateProgress, botSay, showChoices, clearChoices, enableInput, handleQuizAnswerFlow]);

  const startAdaptation = useCallback(async () => {
    const s = stateRef.current;
    s.step = 'adapt';
    updateProgress('adapt');

    let tipsText = `Maintenant que tu connais ton profil, voyons comment tu peux adapter ta communication avec les autres profils. \u{1F91D}

Voici 3 conseils cl\u00e9s pour chacun des autres profils :`;

    const tips = ADAPT_TIPS[s.dominant!];
    const otherProfiles = ['D', 'I', 'S', 'C'].filter(p => p !== s.dominant);

    otherProfiles.forEach(p => {
      const prof = PROFILES[p];
      tipsText += `\n\n${prof.emoji} Avec un profil ${prof.name} :`;
      tips[p].forEach((tip, i) => {
        tipsText += `\n${i + 1}. ${tip}`;
      });
    });

    await botSay(tipsText, 1000);

    s.step = 'adapt_scenario';
    updateProgress('adapt_scenario');
    await botSay(`Pour finir cette partie, un cas concret chez Graneet. Imagine cette situation :\n\n${SCENARIOS[s.dominant!]}`, 800);

    s.step = 'adapt_scenario_wait';
    enableInput("Partage ta r\u00e9flexion...");
  }, [updateProgress, botSay, enableInput]);

  const calculateResults = useCallback(async () => {
    const s = stateRef.current;
    s.step = 'test_calc';
    updateProgress('test_calc');
    await botSay("Derni\u00e8re r\u00e9ponse re\u00e7ue ! Je calcule ton profil... \u{1F504}", 1200);

    s.scores = { D: 0, I: 0, S: 0, C: 0 };
    const mapping: Record<string, string> = { A: 'D', B: 'I', C: 'S', D: 'C' };
    s.answers.forEach(a => {
      s.scores[mapping[a]]++;
    });

    const sorted = Object.entries(s.scores).sort((a, b) => b[1] - a[1]);
    s.dominant = sorted[0][0];
    s.secondary = sorted[1][0];

    s.step = 'result';
    updateProgress('result');

    const dp = PROFILES[s.dominant];
    const sp = PROFILES[s.secondary];

    let barsHtml = '';
    ['D', 'I', 'S', 'C'].forEach(p => {
      const pct = (s.scores[p] / 20) * 100;
      barsHtml += `<div style="display:flex;align-items:center;gap:8px;margin:6px 0">
        <span style="width:24px;font-weight:700;font-size:14px;color:${PROFILES[p].color}">${PROFILES[p].emoji} ${p}</span>
        <div style="flex:1;height:14px;background:#EEE;border-radius:7px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${PROFILES[p].color};border-radius:7px;transition:width 0.8s ease"></div></div>
        <span style="font-size:13px;font-weight:600;width:40px;text-align:right">${s.scores[p]}/20</span>
      </div>`;
    });

    const resultHtml = `\u{1F389} <strong>Ton profil DISC est r\u00e9v\u00e9l\u00e9 !</strong>\n\n` +
      `<div style="background:white;border-radius:12px;padding:16px;margin-top:10px;border:1px solid ${COLORS.graneetCreamDark}">` +
      `<strong>Profil dominant :</strong> ${dp.emoji} ${dp.name} (${s.scores[s.dominant]}/20)<br/>` +
      `<strong>Profil secondaire :</strong> ${sp.emoji} ${sp.name} (${s.scores[s.secondary]}/20)<br/><br/>` +
      `${barsHtml}</div>`;

    await botSay(resultHtml, 800, true);
    await botSay(RESULT_TEXTS[s.dominant], 1000);
    await startAdaptation();
  }, [updateProgress, botSay, startAdaptation]);

  const handleTestAnswer = useCallback(async (answer: string) => {
    const s = stateRef.current;
    const letter = answer.toUpperCase().trim().charAt(0);
    if (!['A', 'B', 'C', 'D'].includes(letter)) {
      await botSay("Merci de r\u00e9pondre par A, B, C ou D \u{1F60A}", 300);
      return;
    }

    addMsg(letter, 'user');
    s.answers.push(letter);
    s.testQuestion++;

    if (s.testQuestion < 20) {
      await askTestQuestionFlow(s);
    } else {
      await calculateResults();
    }
  }, [addMsg, botSay, calculateResults]);

  const askTestQuestionFlow = useCallback(async (s: GameState) => {
    s.step = 'test_q';
    updateProgress('test_q');
    const qNum = s.testQuestion + 1;
    await botSay(`Question ${qNum}/20 :\n\n${TEST_QUESTIONS[s.testQuestion]}`, 500);

    showChoices([
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'D', value: 'D' }
    ], (val) => {
      clearChoices();
      handleTestAnswer(val);
    });
    enableInput("Ou tape A, B, C ou D...");
  }, [updateProgress, botSay, showChoices, clearChoices, handleTestAnswer, enableInput]);

  const startTest = useCallback(async () => {
    const s = stateRef.current;
    s.step = 'test_intro';
    updateProgress('test_intro');
    s.testQuestion = 0;
    s.answers = [];

    await botSay(`C'est parti pour ton test de profil ! \u{1F9EA}

20 questions, une r\u00e9ponse \u00e0 la fois.
R\u00e9ponds instinctivement, sans trop r\u00e9fl\u00e9chir.
Il n'y a pas de bonne ou mauvaise r\u00e9ponse.

R\u00e9ponds simplement avec la lettre : A, B, C ou D.`, 800);

    await askTestQuestionFlow(s);
  }, [updateProgress, botSay, askTestQuestionFlow]);

  const showProfileFlow = useCallback(async (index: number) => {
    const s = stateRef.current;
    await botSay(DISCOVERY_PROFILES[index], 800);

    if (index < 3) {
      s.profileIndex = index + 1;
      s.step = 'discovery_profiles_next';
      enableInput('Tape "suivant" pour d\u00e9couvrir le profil suivant...');
    } else {
      await botSay(`\u{1F4A1} Rappel important : on a tous les 4 couleurs en nous, dans des proportions diff\u00e9rentes. Tu as un profil dominant et un profil secondaire.

C'est ce qu'on va d\u00e9couvrir maintenant !

Pr\u00eat(e) pour ton test de profil ? \u{1F9EA}`, 800);
      s.step = 'discovery_ready_test';
      updateProgress('discovery_ready_test');
      enableInput('Tape "oui" ou "pr\u00eat" pour lancer le test...');
    }
  }, [botSay, enableInput, updateProgress]);

  const startDiscovery = useCallback(async () => {
    const s = stateRef.current;
    s.step = 'discovery_block1';
    updateProgress('discovery_block1');
    s.discoveryBlock = 1;

    await botSay(`Le DISC est un mod\u00e8le cr\u00e9\u00e9 dans les ann\u00e9es 1920 par le psychologue William Marston.

Son id\u00e9e : nous ne r\u00e9agissons pas tous pareil face aux m\u00eames situations.

Le DISC ne te juge pas. Il ne mesure pas ton intelligence. Il observe tes comportements naturels pour t'aider \u00e0 mieux te comprendre et mieux comprendre les autres.

\u26a0\ufe0f Important : il n'y a pas de bon ou mauvais profil. Chaque profil a ses forces et ses zones de vigilance.

Tu es pr\u00eat(e) pour d\u00e9couvrir les 4 profils ? \u{1F447}`, 1000);

    enableInput('Tape "ok" ou "suivant" pour continuer...');
    s.step = 'discovery_wait_block1';
  }, [updateProgress, botSay, enableInput]);

  const handleRefreshQuiz = useCallback(async () => {
    const s = stateRef.current;
    s.step = 'refresh_correction';
    updateProgress('refresh_correction');
    await botSay(`Voici les bonnes r\u00e9ponses :

1. Le profil qui fuit le conflit \u2192 \u{1F7E2} S - Stable
2. Rapide ET orient\u00e9 relations \u2192 \u{1F7E1} I - Influent
3. V\u00e9rifie chaque d\u00e9tail \u2192 \u{1F535} C - Consciencieux

Bien jou\u00e9 ! On passe maintenant au test de profil.`, 800);

    await startTest();
  }, [updateProgress, botSay, startTest]);

  const startRefresh = useCallback(async () => {
    const s = stateRef.current;
    s.step = 'refresh_intro';
    updateProgress('refresh_intro');
    await botSay(`Super, tu connais d\u00e9j\u00e0 le DISC ! On va aller plus vite sur la th\u00e9orie.

Petit rappel express :

\u{1F534} D - Dominant \u2192 Action, r\u00e9sultats, direct
\u{1F7E1} I - Influent \u2192 Enthousiasme, communication, cr\u00e9ativit\u00e9
\u{1F7E2} S - Stable \u2192 Harmonie, fiabilit\u00e9, \u00e9coute
\u{1F535} C - Consciencieux \u2192 Pr\u00e9cision, rigueur, analyse

3 questions flash pour tester ta m\u00e9moire :

1. Quel profil a tendance \u00e0 fuir le conflit ?
2. Quel profil est \u00e0 la fois rapide ET orient\u00e9 relations ?
3. Quel profil v\u00e9rifie chaque d\u00e9tail avant d'avancer ?

(R\u00e9ponds avec les lettres, par exemple : S, I, C)`, 1000);

    s.step = 'refresh_quiz';
    updateProgress('refresh_quiz');
    enableInput("Tes 3 r\u00e9ponses (ex: S, I, C)...");
  }, [updateProgress, botSay, enableInput]);

  const handleLevelCheck = useCallback(async (answer: string) => {
    const s = stateRef.current;
    clearChoices();
    addMsg(answer === 'A' ? 'A. Oui, je connais d\u00e9j\u00e0 le DISC' : 'B. Non, c\'est la premi\u00e8re fois', 'user');
    if (answer === 'A') {
      s.mode = 'refresh';
      await startRefresh();
    } else {
      s.mode = 'discover';
      await startDiscovery();
    }
  }, [addMsg, clearChoices, startRefresh, startDiscovery]);

  // --- Start welcome on mount ---
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startWelcome = async () => {
      const s = stateRef.current;
      s.step = 'welcome';
      updateProgress('welcome');

      await botSay(`Bienvenue dans la formation DISC de Graneet ! \u{1F3AF}

Je suis ton formateur DISC pour cette session. En 30 mn environ, tu vas :

\u2705 Comprendre les 4 profils DISC
\u2705 D\u00e9couvrir ton propre profil
\u2705 Apprendre \u00e0 mieux communiquer avec ton \u00e9quipe

Avant de d\u00e9marrer, une question : as-tu d\u00e9j\u00e0 entendu parler du mod\u00e8le DISC ou suivi une formation sur ce sujet ?`, 800);

      s.step = 'level_check';
      updateProgress('level_check');
      showChoices([
        { label: 'A. Oui, je connais d\u00e9j\u00e0 le DISC', value: 'A' },
        { label: 'B. Non, c\'est la premi\u00e8re fois', value: 'B' }
      ], handleLevelCheck);
      enableInput();
    };

    startWelcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handle user text input ---
  const handleUserInput = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    const s = stateRef.current;
    const step = s.step;

    if (step === 'discovery_wait_block1') {
      addMsg(text, 'user');
      s.step = 'discovery_profiles';
      updateProgress('discovery_profiles');
      s.profileIndex = 0;
      showProfileFlow(0);
    } else if (step === 'discovery_profiles_next') {
      addMsg(text, 'user');
      showProfileFlow(s.profileIndex);
    } else if (step === 'discovery_ready_test') {
      addMsg(text, 'user');
      startTest();
    } else if (step === 'refresh_quiz') {
      addMsg(text, 'user');
      handleRefreshQuiz();
    } else if (step === 'test_q') {
      const letter = text.toUpperCase().charAt(0);
      if (['A', 'B', 'C', 'D'].includes(letter)) {
        clearChoices();
        handleTestAnswer(letter);
      } else {
        addMsg(text, 'user');
        botSay("Merci de r\u00e9pondre par A, B, C ou D \u{1F60A}", 300);
      }
    } else if (step === 'quiz_q') {
      const upper = text.toUpperCase().trim();
      if (s.quizQuestion === 4) {
        if (upper.startsWith('V') || upper.startsWith('F')) {
          clearChoices();
          handleQuizAnswerFlow(upper.startsWith('V') ? 'VRAI' : 'FAUX', s);
        } else {
          addMsg(text, 'user');
          botSay("R\u00e9ponds par Vrai ou Faux \u{1F60A}", 300);
        }
      } else {
        const letter = upper.charAt(0);
        if (['A', 'B', 'C', 'D'].includes(letter)) {
          clearChoices();
          handleQuizAnswerFlow(letter, s);
        } else {
          addMsg(text, 'user');
          botSay("Merci de r\u00e9pondre par A, B, C ou D \u{1F60A}", 300);
        }
      }
    } else if (step === 'adapt_scenario_wait') {
      handleScenarioResponse(text);
    } else {
      addMsg(text, 'user');
      botSay("Reprenons la formation ! \u{1F60A}", 400);
    }
  }, [inputValue, addMsg, updateProgress, showProfileFlow, startTest, handleRefreshQuiz, clearChoices, handleTestAnswer, handleQuizAnswerFlow, handleScenarioResponse, botSay]);

  // --- Validation form submit ---
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {};
    let valid = true;

    if (vfName.trim().length < 3) { errors.name = true; valid = false; }
    if (!vfDominant) { errors.dominant = true; valid = false; }
    if (!vfSecondary) { errors.secondary = true; valid = false; }
    if (!vfLevel) { errors.level = true; valid = false; }
    if (!vfRating) { errors.rating = true; valid = false; }
    if (vfEngagement.trim().length < 20) { errors.engagement = true; valid = false; }

    setVfErrors(errors);

    if (!valid) return;

    const profileLabels: Record<string, string> = { D: '\u{1F534} Dominant', I: '\u{1F7E1} Influent', S: '\u{1F7E2} Stable', C: '\u{1F535} Consciencieux' };
    setSuccessProfile(`${profileLabels[vfDominant!]} + ${profileLabels[vfSecondary!]}`);
    setFormSubmitted(true);

    localStorage.setItem('graneet_disc_done', 'true');

    console.log('DISC Form submitted:', {
      name: vfName.trim(),
      dominant: vfDominant,
      secondary: vfSecondary,
      level: vfLevel,
      rating: vfRating,
      engagement: vfEngagement.trim(),
      comment: vfComment.trim()
    });
  }, [vfName, vfDominant, vfSecondary, vfLevel, vfRating, vfEngagement, vfComment]);

  const starHints: Record<number, string> = { 1: '\u{1F62C} D\u00e9cevant', 2: '\u{1F610} Peut mieux faire', 3: '\u{1F642} Bien', 4: '\u{1F604} Tr\u00e8s bien !', 5: '\u{1F929} Excellent !' };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: COLORS.graneetCream, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: COLORS.textMain }}>
      <AcademyHeader />

      {/* Sub-header with progress */}
      <div style={{ background: COLORS.graneetDark, color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 16px rgba(30,42,58,0.25)' }}>
        <div style={{ width: 40, height: 40, background: COLORS.graneetYellow, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: COLORS.graneetDark }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 6L12 2L20 6" stroke="#1E2A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12L12 8L20 12" stroke="#1E2A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 18L12 14L20 18" stroke="#1E2A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Formation D.I.S.C</h1>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Graneet</div>
        </div>
        <div style={{ background: 'rgba(232,212,77,0.2)', borderRadius: 8, height: 6, flex: 1, maxWidth: 300, marginLeft: 'auto', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: COLORS.graneetYellow, borderRadius: 8, transition: 'width 0.5s ease', width: `${progressPct}%` }} />
        </div>
        <div style={{ fontSize: 11, opacity: 0.8, marginLeft: 8, whiteSpace: 'nowrap' }}>{progressLabel}</div>
      </div>

      {/* Chat container */}
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, scrollBehavior: 'smooth' }}>
        <style>{`
          @keyframes discFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes discBounce {
            0%, 80%, 100% { transform: scale(0.6); }
            40% { transform: scale(1); }
          }
          @keyframes vpSlideUp {
            from { transform: translateY(60px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes vpFadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes vpPop {
            from { transform: scale(0.4); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .disc-choice-btn:hover {
            background: ${COLORS.graneetDark} !important;
            color: ${COLORS.graneetYellow} !important;
          }
          .disc-vstar-label:hover {
            color: ${COLORS.graneetYellow} !important;
            filter: drop-shadow(0 2px 4px rgba(232,212,77,0.5));
            transform: scale(1.18);
          }
          .disc-vpill-label:hover {
            border-color: ${COLORS.graneetDark} !important;
            background: white !important;
          }
          .disc-vtile:hover {
            border-color: #b0b8c1 !important;
            background: white !important;
          }
        `}</style>

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              maxWidth: '75%',
              padding: '14px 18px',
              borderRadius: 18,
              lineHeight: 1.6,
              fontSize: '14.5px',
              animation: 'discFadeIn 0.3s ease',
              whiteSpace: 'pre-wrap',
              alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
              background: msg.sender === 'bot' ? COLORS.botBubble : COLORS.userBubble,
              color: msg.sender === 'bot' ? COLORS.textMain : 'white',
              borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 18,
              borderBottomRightRadius: msg.sender === 'user' ? 4 : 18,
            }}
            {...(msg.isHtml ? { dangerouslySetInnerHTML: { __html: msg.text } } : { children: msg.text })}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '14px 18px',
            background: COLORS.botBubble,
            borderRadius: 18,
            borderBottomLeftRadius: 4,
            display: 'flex',
            gap: 5,
            animation: 'discFadeIn 0.2s ease',
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 8, height: 8,
                background: '#A5A08A',
                borderRadius: '50%',
                display: 'inline-block',
                animation: `discBounce 1.4s infinite ease-in-out`,
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </div>
        )}

        {/* Choice buttons */}
        {choices.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {choices.map((c, i) => (
              <button
                key={i}
                className="disc-choice-btn"
                onClick={() => {
                  if (choiceCallback) choiceCallback(c.value);
                }}
                style={{
                  background: 'white',
                  border: `2px solid ${COLORS.graneetDark}`,
                  color: COLORS.graneetDark,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{ padding: '16px 20px', background: 'white', borderTop: `1px solid ${COLORS.graneetCreamDark}`, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleUserInput(); }}
          disabled={inputDisabled}
          placeholder={inputPlaceholder}
          autoComplete="off"
          style={{
            flex: 1,
            padding: '12px 16px',
            border: `2px solid ${COLORS.graneetCreamDark}`,
            borderRadius: 12,
            fontSize: '14.5px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s',
            background: COLORS.graneetCream,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = COLORS.graneetDark; }}
          onBlur={e => { e.currentTarget.style.borderColor = COLORS.graneetCreamDark; }}
        />
        <button
          onClick={handleUserInput}
          disabled={inputDisabled}
          style={{
            background: inputDisabled ? '#B2BEC3' : COLORS.graneetDark,
            color: inputDisabled ? 'white' : COLORS.graneetYellow,
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: inputDisabled ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
        >
          Envoyer
        </button>
      </div>

      {/* Validation Panel Overlay */}
      {showPanel && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: COLORS.graneetCream,
          overflowY: 'auto',
          padding: '28px 16px 60px',
          animation: 'vpSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 14,
            boxShadow: '0 4px 24px rgba(30,42,58,0.10)',
            padding: '36px 40px',
            width: '100%',
            maxWidth: 640,
            margin: '0 auto',
          }}>
            {/* Back button */}
            <button
              onClick={() => setShowPanel(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: COLORS.textLight,
                fontSize: 13,
                fontFamily: 'inherit',
                cursor: 'pointer',
                padding: 0,
                marginBottom: 20,
              }}
            >
              \u2190 Revoir mon chat
            </button>

            {/* Intro */}
            <div style={{ textAlign: 'center', marginBottom: 32, borderBottom: `2px solid ${COLORS.graneetCreamDark}`, paddingBottom: 24 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: COLORS.graneetCream,
                borderRadius: 40,
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.graneetDark,
                marginBottom: 14,
              }}>\u{1F393} Fin de formation</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.graneetDark, marginBottom: 8 }}>Valide ta participation</h2>
              <p style={{ color: COLORS.textLight, fontSize: 14, lineHeight: 1.6 }}>Remplis ce formulaire pour confirmer ta formation DISC.<br/>Ca prend moins de 2 minutes !</p>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} noValidate>
                {/* 1. Name */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>\u{1F4DD} Pr\u00e9nom + Nom</div>
                  <input
                    type="text"
                    value={vfName}
                    onChange={e => setVfName(e.target.value)}
                    placeholder="Ex. Marie Dupont"
                    autoComplete="name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${vfErrors.name ? '#E74C3C' : COLORS.graneetCreamDark}`,
                      borderRadius: 10,
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      color: COLORS.textMain,
                      background: COLORS.graneetCream,
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = COLORS.graneetDark; e.currentTarget.style.background = 'white'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = vfErrors.name ? '#E74C3C' : COLORS.graneetCreamDark; e.currentTarget.style.background = COLORS.graneetCream; }}
                  />
                  {vfErrors.name && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>Merci de renseigner ton pr\u00e9nom et nom.</div>}
                </div>

                {/* 2. Dominant profile */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>\u{1F534} Profil DISC dominant</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(['D', 'I', 'S', 'C'] as const).map(p => {
                      const tileColors: Record<string, string> = { D: COLORS.discRed, I: '#c8900a', S: COLORS.discGreen, C: COLORS.discBlue };
                      const labels: Record<string, string> = { D: '\u{1F534} D \u2014 Dominant', I: '\u{1F7E1} I \u2014 Influent', S: '\u{1F7E2} S \u2014 Stable', C: '\u{1F535} C \u2014 Consciencieux' };
                      const selected = vfDominant === p;
                      const tileColor = tileColors[p];
                      return (
                        <label
                          key={`dom-${p}`}
                          className="disc-vtile"
                          onClick={() => setVfDominant(p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '13px 16px',
                            borderRadius: 10,
                            border: `2px solid ${selected ? tileColor : COLORS.graneetCreamDark}`,
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            background: selected ? 'white' : COLORS.graneetCream,
                            fontSize: 14,
                            fontWeight: selected ? 700 : 500,
                            userSelect: 'none',
                            color: tileColor,
                            boxShadow: selected ? `0 0 0 3px ${tileColor}1F` : 'none',
                          }}
                        >
                          <span style={{
                            width: 14, height: 14,
                            borderRadius: '50%',
                            border: `2px solid ${tileColor}`,
                            flexShrink: 0,
                            background: selected ? tileColor : 'transparent',
                            transition: 'background 0.15s',
                          }} />
                          {labels[p]}
                        </label>
                      );
                    })}
                  </div>
                  {vfErrors.dominant && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>Merci de choisir ton profil dominant.</div>}
                </div>

                {/* 3. Secondary profile */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>\u{1F948} Profil secondaire</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(['D', 'I', 'S', 'C'] as const).map(p => {
                      const tileColors: Record<string, string> = { D: COLORS.discRed, I: '#c8900a', S: COLORS.discGreen, C: COLORS.discBlue };
                      const labels: Record<string, string> = { D: '\u{1F534} D \u2014 Dominant', I: '\u{1F7E1} I \u2014 Influent', S: '\u{1F7E2} S \u2014 Stable', C: '\u{1F535} C \u2014 Consciencieux' };
                      const selected = vfSecondary === p;
                      const tileColor = tileColors[p];
                      return (
                        <label
                          key={`sec-${p}`}
                          className="disc-vtile"
                          onClick={() => setVfSecondary(p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '13px 16px',
                            borderRadius: 10,
                            border: `2px solid ${selected ? tileColor : COLORS.graneetCreamDark}`,
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            background: selected ? 'white' : COLORS.graneetCream,
                            fontSize: 14,
                            fontWeight: selected ? 700 : 500,
                            userSelect: 'none',
                            color: tileColor,
                            boxShadow: selected ? `0 0 0 3px ${tileColor}1F` : 'none',
                          }}
                        >
                          <span style={{
                            width: 14, height: 14,
                            borderRadius: '50%',
                            border: `2px solid ${tileColor}`,
                            flexShrink: 0,
                            background: selected ? tileColor : 'transparent',
                            transition: 'background 0.15s',
                          }} />
                          {labels[p]}
                        </label>
                      );
                    })}
                  </div>
                  {vfErrors.secondary && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>Merci de choisir ton profil secondaire.</div>}
                </div>

                {/* 4. Level */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>\u{1F195} Niveau de d\u00e9part</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                      { value: 'premiere_fois', label: '\u{1F64B} Premi\u00e8re fois' },
                      { value: 'deja_forme', label: '\u2705 D\u00e9j\u00e0 form\u00e9(e)' }
                    ].map(opt => {
                      const selected = vfLevel === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className="disc-vpill-label"
                          onClick={() => setVfLevel(opt.value)}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 30,
                            border: `2px solid ${selected ? COLORS.graneetDark : COLORS.graneetCreamDark}`,
                            fontSize: '13.5px',
                            fontWeight: selected ? 600 : 500,
                            cursor: 'pointer',
                            background: selected ? COLORS.graneetDark : COLORS.graneetCream,
                            color: selected ? COLORS.graneetYellow : COLORS.textMain,
                            transition: 'all 0.18s',
                            userSelect: 'none',
                          }}
                        >
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>
                  {vfErrors.level && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>Merci d&apos;indiquer ton niveau de d\u00e9part.</div>}
                </div>

                {/* 5. Rating (stars) */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>\u2b50 Note de la formation</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className="disc-vstar-label"
                        onClick={() => { setVfRating(star); setStarHint(starHints[star]); }}
                        style={{
                          fontSize: 36,
                          cursor: 'pointer',
                          color: vfRating && star <= vfRating ? COLORS.graneetYellow : '#D8D3C8',
                          transition: 'color 0.15s, transform 0.1s',
                          lineHeight: 1,
                          userSelect: 'none',
                          filter: vfRating && star <= vfRating ? 'drop-shadow(0 2px 4px rgba(232,212,77,0.5))' : 'none',
                        }}
                      >
                        \u2605
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>{starHint}</div>
                  {vfErrors.rating && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>Merci de noter la formation.</div>}
                </div>

                <div style={{ height: 1, background: COLORS.graneetCreamDark, margin: '30px 0' }} />

                {/* 6. Engagement */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>\u{1F4AC} Qu&apos;est-ce que tu vas changer ?</div>
                  <textarea
                    value={vfEngagement}
                    onChange={e => setVfEngagement(e.target.value)}
                    rows={5}
                    placeholder="Ex. Je vais faire attention \u00e0 ralentir mon rythme quand je parle \u00e0 mon coll\u00e8gue S, et lui laisser le temps de r\u00e9pondre avant de conclure..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${vfErrors.engagement ? '#E74C3C' : COLORS.graneetCreamDark}`,
                      borderRadius: 10,
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      color: COLORS.textMain,
                      background: COLORS.graneetCream,
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      resize: 'vertical',
                      minHeight: 110,
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = COLORS.graneetDark; e.currentTarget.style.background = 'white'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = vfErrors.engagement ? '#E74C3C' : COLORS.graneetCreamDark; e.currentTarget.style.background = COLORS.graneetCream; }}
                  />
                  {vfErrors.engagement && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>Partage au moins une intention concr\u00e8te.</div>}
                </div>

                {/* 7. Comment (optional) */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>
                    \u{1F4E3} Commentaire libre
                    <span style={{ fontSize: 11, fontWeight: 400, color: COLORS.textLight, background: COLORS.graneetCream, padding: '2px 8px', borderRadius: 20, marginLeft: 4 }}>optionnel</span>
                  </div>
                  <textarea
                    value={vfComment}
                    onChange={e => setVfComment(e.target.value)}
                    rows={3}
                    placeholder="Une remarque, suggestion ou anecdote \u00e0 partager\u2026"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${COLORS.graneetCreamDark}`,
                      borderRadius: 10,
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      color: COLORS.textMain,
                      background: COLORS.graneetCream,
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = COLORS.graneetDark; e.currentTarget.style.background = 'white'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = COLORS.graneetCreamDark; e.currentTarget.style.background = COLORS.graneetCream; }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: 16,
                    background: COLORS.graneetDark,
                    color: COLORS.graneetYellow,
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'background 0.2s, transform 0.1s',
                    letterSpacing: '0.01em',
                    marginTop: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = COLORS.graneetDarkLight; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = COLORS.graneetDark; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Valider ma formation \u2192
                </button>
              </form>
            ) : (
              /* SUCCESS */
              <div style={{ textAlign: 'center', padding: '16px 0 8px', animation: 'vpFadeUp 0.5s ease' }}>
                <span style={{ fontSize: 72, marginBottom: 16, display: 'block', animation: 'vpPop 0.5s 0.2s both cubic-bezier(.36,1.6,.6,1)' }}>\u{1F389}</span>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.graneetDark, marginBottom: 10 }}>Bravo, ta formation DISC est valid\u00e9e !</h2>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: COLORS.graneetCream,
                  borderRadius: 30,
                  padding: '8px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: COLORS.graneetDark,
                  margin: '10px 0 18px',
                }}>{successProfile}</div>
                <div style={{ width: 60, height: 4, background: COLORS.graneetYellow, borderRadius: 2, margin: '20px auto' }} />
                <p style={{ color: COLORS.textLight, fontSize: 14, lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
                  Merci pour ta participation.<br/>
                  Victoria Bertrel a bien re\u00e7u tes r\u00e9ponses.<br/><br/>
                  <strong>\u00c0 tr\u00e8s vite chez Graneet ! \u{1F680}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
