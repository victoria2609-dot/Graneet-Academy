// ============================================================
// DISC COACH - Data & Constants (extracted to .ts to avoid SWC JSX parse issues)
// ============================================================

// --- COLORS ---
export const COLORS = {
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
export const PROFILES: Record<string, { emoji: string; name: string; color: string }> = {
  D: { emoji: '\u{1F534}', name: 'Dominant', color: COLORS.discRed },
  I: { emoji: '\u{1F7E1}', name: 'Influent', color: COLORS.discYellow },
  S: { emoji: '\u{1F7E2}', name: 'Stable', color: COLORS.discGreen },
  C: { emoji: '\u{1F535}', name: 'Consciencieux', color: COLORS.discBlue },
};

// --- TEST QUESTIONS (20) ---
export const TEST_QUESTIONS = [
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
export const QUIZ_QUESTIONS = [
  { q: "Un coll\u00e8gue te parle tr\u00e8s rapidement, va droit au but et n'aime pas les longues r\u00e9unions. Son profil est probablement :\nA. I - Influent\nB. D - Dominant\nC. S - Stable\nD. C - Consciencieux", answer: 'B', explanation: "C'est bien le profil D - Dominant ! Direct, rapide, orient\u00e9 r\u00e9sultats." },
  { q: "Pour convaincre un profil C, la meilleure approche :\nA. Lui raconter une belle histoire\nB. Lui montrer l'impact sur l'\u00e9quipe\nC. Lui apporter des donn\u00e9es et des faits\nD. Lui proposer des options et aller vite", answer: 'C', explanation: "Le profil C est convaincu par les donn\u00e9es, les faits et les arguments logiques." },
  { q: "Comportement d'un profil S sous pression :\nA. Il prend la d\u00e9cision seul\nB. Il \u00e9vite le conflit et met du temps \u00e0 s'adapter\nC. Il analyse les donn\u00e9es en d\u00e9tail\nD. Il mobilise l'\u00e9quipe avec enthousiasme", answer: 'B', explanation: "Le profil S, sous pression, a tendance \u00e0 \u00e9viter le conflit et a besoin de temps pour s'adapter." },
  { q: "Le DISC mesure :\nA. L'intelligence \u00e9motionnelle\nB. Les comportements observables\nC. Le niveau de comp\u00e9tences\nD. Les valeurs personnelles", answer: 'B', explanation: "Le DISC mesure les comportements observables, pas l'intelligence ni les comp\u00e9tences." },
  { q: "Vrai ou Faux : On peut avoir un seul profil DISC \u00e0 100% ?", answer: 'FAUX', explanation: "Faux ! On a toujours les 4 profils en nous, dans des proportions diff\u00e9rentes." }
];

// --- RESULT TEXTS ---
export const RESULT_TEXTS: Record<string, string> = {
  D: "\u{1F534} Tu es D - Dominant\n\nTon superpouvoir chez Graneet : tu sais prendre des d\u00e9cisions rapides et tenir les objectifs. Tu es un moteur dans ton \u00e9quipe.\n\nTes 3 forces naturelles :\n\u2022 Tu assumes les responsabilit\u00e9s sans h\u00e9siter\n\u2022 Tu vas droit au but sans te perdre dans les d\u00e9tails\n\u2022 Tu rel\u00e8ves les d\u00e9fis avec \u00e9nergie\n\nTes 2 points de vigilance :\n\u2022 Tu peux para\u00eetre brusque ou impatient(e) sans le vouloir\n\u2022 Tu as tendance \u00e0 agir avant d'avoir \u00e9cout\u00e9 tout le monde\n\n\u{1F4A1} Ton conseil cette semaine :\nAvant de trancher, pose une question ouverte \u00e0 ton interlocuteur. \u00c7a prend 30 secondes et \u00e7a change tout.",

  I: "\u{1F7E1} Tu es I - Influent\n\nTon superpouvoir chez Graneet : tu sais embarquer les gens et rendre les projets enthousiasmants. Tu es un atout pour la coh\u00e9sion et la relation client.\n\nTes 3 forces naturelles :\n\u2022 Tu communiques facilement et naturellement\n\u2022 Tu donnes de l'\u00e9nergie \u00e0 ceux qui t'entourent\n\u2022 Tu cr\u00e9es facilement des liens avec clients et partenaires\n\nTes 2 points de vigilance :\n\u2022 Tu peux t'\u00e9parpiller et oublier des d\u00e9tails importants\n\u2022 Tu as parfois du mal \u00e0 tenir les d\u00e9lais\n\n\u{1F4A1} Ton conseil cette semaine :\nPour chaque r\u00e9union, note 3 points \u00e0 retenir avant d'en sortir. \u00c7a t'aidera \u00e0 garder le cap.",

  S: "\u{1F7E2} Tu es S - Stable\n\nTon superpouvoir chez Graneet : tu es le ciment de l'\u00e9quipe. Fiable et constant(e), tu cr\u00e9es un environnement o\u00f9 les autres se sentent en s\u00e9curit\u00e9.\n\nTes 3 forces naturelles :\n\u2022 Tu es toujours l\u00e0 quand l'\u00e9quipe en a besoin\n\u2022 Tu \u00e9coutes vraiment, sans juger\n\u2022 Tu d\u00e9samorces les tensions naturellement\n\nTes 2 points de vigilance :\n\u2022 Tu as du mal \u00e0 dire non et exprimer tes d\u00e9saccords\n\u2022 Tu peux accumuler en silence jusqu'\u00e0 saturation\n\n\u{1F4A1} Ton conseil cette semaine :\nOse exprimer ton avis m\u00eame quand il diff\u00e8re du groupe. Ton point de vue a de la valeur.",

  C: "\u{1F535} Tu es C - Consciencieux\n\nTon superpouvoir chez Graneet : tu es le garant de la qualit\u00e9. Tu \u00e9vites les erreurs co\u00fbteuses gr\u00e2ce \u00e0 ta rigueur.\n\nTes 3 forces naturelles :\n\u2022 Tu produis un travail de haute qualit\u00e9\n\u2022 Tu anticipes les probl\u00e8mes avant qu'ils arrivent\n\u2022 Tu ma\u00eetrises ton domaine en profondeur\n\nTes 2 points de vigilance :\n\u2022 Tu peux bloquer sur un d\u00e9tail et ralentir le projet\n\u2022 Tu as du mal \u00e0 d\u00e9l\u00e9guer\n\n\u{1F4A1} Ton conseil cette semaine :\n80% parfait et livr\u00e9 vaut mieux que 100% parfait en retard. Parfois, avancer prime sur la perfection."
};

// --- ADAPT TIPS ---
export const ADAPT_TIPS: Record<string, Record<string, string[]>> = {
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
export const SCENARIOS: Record<string, string> = {
  D: "Tu dois annoncer un changement de process \u00e0 ton \u00e9quipe. Deux coll\u00e8gues ne sont clairement pas d'accord et le disent.\n\nComment tu r\u00e9agirais naturellement ?\nEt comment le DISC te sugg\u00e8re de r\u00e9agir ?\n\n(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)",
  I: "Tu animes une r\u00e9union de brainstorming et tu t'aper\u00e7ois qu'un coll\u00e8gue (profil C) n'a pas dit un mot depuis 20 minutes.\n\nComment tu r\u00e9agirais naturellement ?\nEt comment le DISC te sugg\u00e8re de r\u00e9agir ?\n\n(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)",
  S: "Ton manager (profil D) te demande de prendre en charge un nouveau projet avec une deadline tr\u00e8s serr\u00e9e, alors que tu as d\u00e9j\u00e0 beaucoup sur ton bureau.\n\nComment tu r\u00e9agirais naturellement ?\nEt comment le DISC te sugg\u00e8re de r\u00e9agir ?\n\n(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)",
  C: "Un coll\u00e8gue (profil I) te propose de lancer un nouveau process sans documentation pr\u00e9cise. \"On verra au fur et \u00e0 mesure !\" dit-il.\n\nComment tu r\u00e9agirais naturellement ?\nEt comment le DISC te sugg\u00e8re de r\u00e9agir ?\n\n(R\u00e9fl\u00e9chis un instant, puis partage ta r\u00e9ponse !)"
};

export const SCENARIO_FEEDBACK: Record<string, string> = {
  D: "Super r\u00e9flexion ! \u{1F44F}\n\nCe que le DISC te sugg\u00e8re ici :\nAvant d'imposer le changement, prends 5 minutes pour \u00e9couter les objections de tes coll\u00e8gues. Un profil S a besoin d'\u00eatre rassur\u00e9, un profil C veut comprendre le \"pourquoi\". En montrant que tu as entendu leurs pr\u00e9occupations, tu obtiendras une adh\u00e9sion bien plus forte.",
  I: "Bonne analyse ! \u{1F44F}\n\nCe que le DISC te sugg\u00e8re ici :\nPlut\u00f4t que de remplir le silence avec plus d'\u00e9nergie, pose une question directe mais bienveillante \u00e0 ton coll\u00e8gue C : \"J'aimerais avoir ton analyse sur ce point, qu'en penses-tu ?\" Les profils C ont souvent des id\u00e9es tr\u00e8s pertinentes mais ont besoin qu'on leur ouvre l'espace.",
  S: "Tr\u00e8s bien r\u00e9fl\u00e9chi ! \u{1F44F}\n\nCe que le DISC te sugg\u00e8re ici :\nC'est le moment d'oser dire les choses. Plut\u00f4t que d'accepter en silence, propose un \u00e9change factuel : \"Je veux bien prendre ce projet, mais voici ma charge actuelle. Ensemble, priorisons.\" Un profil D respecte quelqu'un qui s'affirme avec des faits.",
  C: "Excellente r\u00e9flexion ! \u{1F44F}\n\nCe que le DISC te sugg\u00e8re ici :\nPlut\u00f4t que de bloquer le projet en exigeant une documentation parfaite d\u00e8s le d\u00e9part, propose un compromis : \"OK pour avancer, mais mettons un point de contr\u00f4le dans 2 semaines pour documenter ce qui fonctionne.\" Tu gardes ta rigueur tout en t'adaptant au rythme du profil I."
};

export const ADVICE_MAP: Record<string, string> = {
  D: "Avant de trancher, pose une question ouverte \u00e0 ton interlocuteur.",
  I: "Pour chaque r\u00e9union, note 3 points \u00e0 retenir avant d'en sortir.",
  S: "Ose exprimer ton avis m\u00eame quand il diff\u00e8re du groupe.",
  C: "80% parfait et livr\u00e9 vaut mieux que 100% parfait en retard."
};

// --- PROGRESS MAP ---
export const STEPS_PROGRESS: Record<string, [number, string]> = {
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
export const DISCOVERY_PROFILES = [
  "\u{1F534} Profil D - Dominant\n\nMot-cl\u00e9 : Action\nEn deux mots : Direct et d\u00e9termin\u00e9\n\nChez Graneet, c'est souvent la personne qui prend les d\u00e9cisions rapidement, lance les projets, tient les objectifs.\n\nForce principale : leadership, efficacit\u00e9, courage\nPoint de vigilance : peut sembler brusque ou impatient(e)",

  "\u{1F7E1} Profil I - Influent\n\nMot-cl\u00e9 : Enthousiasme\nEn deux mots : Communicant et cr\u00e9atif\n\nChez Graneet, c'est souvent la personne qui anime les r\u00e9unions, propose des id\u00e9es, cr\u00e9e de la coh\u00e9sion.\n\nForce principale : communication, \u00e9nergie, f\u00e9d\u00e9ration\nPoint de vigilance : peut s'\u00e9parpiller, oublier les d\u00e9tails",

  "\u{1F7E2} Profil S - Stable\n\nMot-cl\u00e9 : Harmonie\nEn deux mots : Fiable et \u00e0 l'\u00e9coute\n\nChez Graneet, c'est souvent la personne qui est le pilier discret de l'\u00e9quipe, toujours disponible, d\u00e9samorce les tensions.\n\nForce principale : loyaut\u00e9, \u00e9coute, fiabilit\u00e9\nPoint de vigilance : du mal \u00e0 s'affirmer, r\u00e9siste au changement",

  "\u{1F535} Profil C - Consciencieux\n\nMot-cl\u00e9 : Pr\u00e9cision\nEn deux mots : Rigoureux et analytique\n\nChez Graneet, c'est souvent la personne qui v\u00e9rifie chaque d\u00e9tail, anticipe les probl\u00e8mes, maintient la qualit\u00e9.\n\nForce principale : rigueur, expertise, organisation\nPoint de vigilance : perfectionnisme, lenteur \u00e0 d\u00e9cider"
];

// --- TYPES ---
export interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  isHtml?: boolean;
}

export interface ChoiceOption {
  label: string;
  value: string;
}

export interface GameState {
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

// --- Helper to build result HTML ---
export function buildResultHtml(scores: Record<string, number>, dominant: string, secondary: string): string {
  const dp = PROFILES[dominant];
  const sp = PROFILES[secondary];
  let barsHtml = '';
  ['D', 'I', 'S', 'C'].forEach(p => {
    const pct = (scores[p] / 20) * 100;
    barsHtml += '<div style="display:flex;align-items:center;gap:8px;margin:6px 0">' +
      '<span style="width:24px;font-weight:700;font-size:14px;color:' + PROFILES[p].color + '">' + PROFILES[p].emoji + ' ' + p + '</span>' +
      '<div style="flex:1;height:14px;background:#EEE;border-radius:7px;overflow:hidden">' +
      '<div style="height:100%;width:' + pct + '%;background:' + PROFILES[p].color + ';border-radius:7px;transition:width 0.8s ease"></div></div>' +
      '<span style="font-size:13px;font-weight:600;width:40px;text-align:right">' + scores[p] + '/20</span></div>';
  });
  return '\u{1F389} ' + '<strong>Ton profil DISC est r\u00e9v\u00e9l\u00e9 !</strong>\n\n' +
    '<div style="background:white;border-radius:12px;padding:16px;margin-top:10px;border:1px solid ' + COLORS.graneetCreamDark + '">' +
    '<strong>Profil dominant :</strong> ' + dp.emoji + ' ' + dp.name + ' (' + scores[dominant] + '/20)' + '<br/>' +
    '<strong>Profil secondaire :</strong> ' + sp.emoji + ' ' + sp.name + ' (' + scores[secondary] + '/20)' + '<br/><br/>' +
    barsHtml + '</div>';
}
