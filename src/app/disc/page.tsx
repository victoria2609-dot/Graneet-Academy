'use client';

import React, { useState, useEffect, useRef } from 'react';
import AcademyHeader from '../../components/AcademyHeader';
import {
  COLORS, PROFILES, TEST_QUESTIONS, QUIZ_QUESTIONS, RESULT_TEXTS,
  ADAPT_TIPS, SCENARIOS, SCENARIO_FEEDBACK, ADVICE_MAP, STEPS_PROGRESS,
  DISCOVERY_PROFILES, buildResultHtml,
} from './disc-data';
import type { ChatMessage, ChoiceOption, GameState } from './disc-data';

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
  function addMsg(text: string, sender: 'bot' | 'user', isHtml = false) {
    const id = ++msgIdRef.current;
    setMessages(prev => [...prev, { id, sender, text, isHtml }]);
    return id;
  }

  function updateProgress(step: string) {
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
  }

  function botSay(text: string, delay = 600, isHtml = false): Promise<void> {
    return new Promise(resolve => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMsg(text, 'bot', isHtml);
        resolve();
      }, delay);
    });
  }

  function enableInput(placeholder = 'Tape ta r\u00e9ponse ici...') {
    setInputDisabled(false);
    setInputPlaceholder(placeholder);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function disableInput() {
    setInputDisabled(true);
  }

  function showChoicesFn(opts: ChoiceOption[], callback: (value: string) => void) {
    setChoices(opts);
    setChoiceCallback(() => callback);
  }

  function clearChoices() {
    setChoices([]);
    setChoiceCallback(null);
  }

  // --- Flow logic ---
  async function handleScenarioResponse(userText: string) {
    const s = stateRef.current;
    addMsg(userText, 'user');
    await botSay(SCENARIO_FEEDBACK[s.dominant!], 800);
    s.step = 'quiz_intro';
    updateProgress('quiz_intro');
    s.quizQuestion = 0;
    s.quizScore = 0;
    await botSay("Derni\u00e8re \u00e9tape ! 5 questions pour valider tes acquis. R\u00e9ponds par la lettre correspondante. \u{1F4AA}", 600);
    await askQuizQuestionFlow(s);
  }

  async function showClosingFlow() {
    const s = stateRef.current;
    s.step = 'closing';
    updateProgress('closing');
    const scoreMsg = s.quizScore >= 4
      ? '\u{1F389} Excellent ! ' + s.quizScore + '/5 - Tu as parfaitement assimil\u00e9 les fondamentaux du DISC !'
      : 'Bon travail ! ' + s.quizScore + '/5 - N\'h\u00e9site pas \u00e0 relire les modules qui t\'ont pos\u00e9 probl\u00e8me.';
    await botSay(scoreMsg, 600);
    const dp = PROFILES[s.dominant!];
    const sp = PROFILES[s.secondary!];
    await botSay('\u{1F393} Formation DISC Graneet termin\u00e9e !\n\nTon profil : ' + dp.emoji + ' ' + dp.name + ' + ' + sp.emoji + ' ' + sp.name + '\n\nTon conseil cl\u00e9 : ' + ADVICE_MAP[s.dominant!] + '\n\nDes questions ? Contacte Victoria Bertrel - RH Graneet\n\u{1F4E7} victoria.bertrel@graneet.fr\n\nDerni\u00e8re \u00e9tape \u{1F447} Valide ta formation en remplissant le formulaire qui s\'affiche !', 1000);
    disableInput();
    setInputPlaceholder('Formation termin\u00e9e ! Merci \u{1F389}');
    setVfDominant(s.dominant);
    setVfSecondary(s.secondary);
    setVfLevel(s.mode === 'refresh' ? 'deja_forme' : 'premiere_fois');
    setTimeout(() => setShowPanel(true), 1500);
  }

  async function handleQuizAnswerFlow(answer: string, s: GameState) {
    const q = QUIZ_QUESTIONS[s.quizQuestion];
    const userAnswer = answer.toUpperCase().trim();
    addMsg(userAnswer, 'user');
    const isCorrect = userAnswer === q.answer || userAnswer.charAt(0) === q.answer;
    if (isCorrect) {
      s.quizScore++;
      await botSay('\u2705 Correct ! ' + q.explanation, 500);
    } else {
      await botSay('\u274C Pas tout \u00e0 fait. La bonne r\u00e9ponse \u00e9tait : ' + q.answer + '\n\n' + q.explanation, 500);
    }
    s.quizQuestion++;
    if (s.quizQuestion < 5) {
      await askQuizQuestionFlow(s);
    } else {
      await showClosingFlow();
    }
  }

  async function askQuizQuestionFlow(s: GameState) {
    s.step = 'quiz_q';
    updateProgress('quiz_q');
    const qNum = s.quizQuestion + 1;
    const q = QUIZ_QUESTIONS[s.quizQuestion];
    await botSay('Question ' + qNum + '/5 :\n\n' + q.q, 500);
    if (s.quizQuestion === 4) {
      showChoicesFn([
        { label: 'Vrai', value: 'VRAI' },
        { label: 'Faux', value: 'FAUX' }
      ], (val) => { clearChoices(); handleQuizAnswerFlow(val, s); });
      enableInput("Vrai ou Faux ?");
    } else {
      showChoicesFn([
        { label: 'A', value: 'A' }, { label: 'B', value: 'B' },
        { label: 'C', value: 'C' }, { label: 'D', value: 'D' }
      ], (val) => { clearChoices(); handleQuizAnswerFlow(val, s); });
      enableInput("Ou tape A, B, C ou D...");
    }
  }

  async function startAdaptation() {
    const s = stateRef.current;
    s.step = 'adapt';
    updateProgress('adapt');
    let tipsText = 'Maintenant que tu connais ton profil, voyons comment tu peux adapter ta communication avec les autres profils. \u{1F91D}\n\nVoici 3 conseils cl\u00e9s pour chacun des autres profils :';
    const tips = ADAPT_TIPS[s.dominant!];
    ['D', 'I', 'S', 'C'].filter(p => p !== s.dominant).forEach(p => {
      const prof = PROFILES[p];
      tipsText += '\n\n' + prof.emoji + ' Avec un profil ' + prof.name + ' :';
      tips[p].forEach((tip, i) => { tipsText += '\n' + (i + 1) + '. ' + tip; });
    });
    await botSay(tipsText, 1000);
    s.step = 'adapt_scenario';
    updateProgress('adapt_scenario');
    await botSay('Pour finir cette partie, un cas concret chez Graneet. Imagine cette situation :\n\n' + SCENARIOS[s.dominant!], 800);
    s.step = 'adapt_scenario_wait';
    enableInput("Partage ta r\u00e9flexion...");
  }

  async function calculateResults() {
    const s = stateRef.current;
    s.step = 'test_calc';
    updateProgress('test_calc');
    await botSay("Derni\u00e8re r\u00e9ponse re\u00e7ue ! Je calcule ton profil... \u{1F504}", 1200);
    s.scores = { D: 0, I: 0, S: 0, C: 0 };
    const mapping: Record<string, string> = { A: 'D', B: 'I', C: 'S', D: 'C' };
    s.answers.forEach(a => { s.scores[mapping[a]]++; });
    const sorted = Object.entries(s.scores).sort((a, b) => b[1] - a[1]);
    s.dominant = sorted[0][0];
    s.secondary = sorted[1][0];
    s.step = 'result';
    updateProgress('result');
    const resultHtml = buildResultHtml(s.scores, s.dominant, s.secondary);
    await botSay(resultHtml, 800, true);
    await botSay(RESULT_TEXTS[s.dominant], 1000);
    await startAdaptation();
  }

  async function handleTestAnswer(answer: string) {
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
  }

  async function askTestQuestionFlow(s: GameState) {
    s.step = 'test_q';
    updateProgress('test_q');
    const qNum = s.testQuestion + 1;
    await botSay('Question ' + qNum + '/20 :\n\n' + TEST_QUESTIONS[s.testQuestion], 500);
    showChoicesFn([
      { label: 'A', value: 'A' }, { label: 'B', value: 'B' },
      { label: 'C', value: 'C' }, { label: 'D', value: 'D' }
    ], (val) => { clearChoices(); handleTestAnswer(val); });
    enableInput("Ou tape A, B, C ou D...");
  }

  async function startTest() {
    const s = stateRef.current;
    s.step = 'test_intro';
    updateProgress('test_intro');
    s.testQuestion = 0;
    s.answers = [];
    await botSay("C'est parti pour ton test de profil ! \u{1F9EA}\n\n20 questions, une r\u00e9ponse \u00e0 la fois.\nR\u00e9ponds instinctivement, sans trop r\u00e9fl\u00e9chir.\nIl n'y a pas de bonne ou mauvaise r\u00e9ponse.\n\nR\u00e9ponds simplement avec la lettre : A, B, C ou D.", 800);
    await askTestQuestionFlow(s);
  }

  async function showProfileFlow(index: number) {
    const s = stateRef.current;
    await botSay(DISCOVERY_PROFILES[index], 800);
    if (index < 3) {
      s.profileIndex = index + 1;
      s.step = 'discovery_profiles_next';
      enableInput('Tape "suivant" pour d\u00e9couvrir le profil suivant...');
    } else {
      await botSay("\u{1F4A1} Rappel important : on a tous les 4 couleurs en nous, dans des proportions diff\u00e9rentes. Tu as un profil dominant et un profil secondaire.\n\nC'est ce qu'on va d\u00e9couvrir maintenant !\n\nPr\u00eat(e) pour ton test de profil ? \u{1F9EA}", 800);
      s.step = 'discovery_ready_test';
      updateProgress('discovery_ready_test');
      enableInput('Tape "oui" ou "pr\u00eat" pour lancer le test...');
    }
  }

  async function startDiscovery() {
    const s = stateRef.current;
    s.step = 'discovery_block1';
    updateProgress('discovery_block1');
    s.discoveryBlock = 1;
    await botSay("Le DISC est un mod\u00e8le cr\u00e9\u00e9 dans les ann\u00e9es 1920 par le psychologue William Marston.\n\nSon id\u00e9e : nous ne r\u00e9agissons pas tous pareil face aux m\u00eames situations.\n\nLe DISC ne te juge pas. Il ne mesure pas ton intelligence. Il observe tes comportements naturels pour t'aider \u00e0 mieux te comprendre et mieux comprendre les autres.\n\n\u26A0\uFE0F Important : il n'y a pas de bon ou mauvais profil. Chaque profil a ses forces et ses zones de vigilance.\n\nTu es pr\u00eat(e) pour d\u00e9couvrir les 4 profils ? \u{1F447}", 1000);
    enableInput('Tape "ok" ou "suivant" pour continuer...');
    s.step = 'discovery_wait_block1';
  }

  async function handleRefreshQuiz() {
    const s = stateRef.current;
    s.step = 'refresh_correction';
    updateProgress('refresh_correction');
    await botSay("Voici les bonnes r\u00e9ponses :\n\n1. Le profil qui fuit le conflit \u2192 \u{1F7E2} S - Stable\n2. Rapide ET orient\u00e9 relations \u2192 \u{1F7E1} I - Influent\n3. V\u00e9rifie chaque d\u00e9tail \u2192 \u{1F535} C - Consciencieux\n\nBien jou\u00e9 ! On passe maintenant au test de profil.", 800);
    await startTest();
  }

  async function startRefresh() {
    const s = stateRef.current;
    s.step = 'refresh_intro';
    updateProgress('refresh_intro');
    await botSay("Super, tu connais d\u00e9j\u00e0 le DISC ! On va aller plus vite sur la th\u00e9orie.\n\nPetit rappel express :\n\n\u{1F534} D - Dominant \u2192 Action, r\u00e9sultats, direct\n\u{1F7E1} I - Influent \u2192 Enthousiasme, communication, cr\u00e9ativit\u00e9\n\u{1F7E2} S - Stable \u2192 Harmonie, fiabilit\u00e9, \u00e9coute\n\u{1F535} C - Consciencieux \u2192 Pr\u00e9cision, rigueur, analyse\n\n3 questions flash pour tester ta m\u00e9moire :\n\n1. Quel profil a tendance \u00e0 fuir le conflit ?\n2. Quel profil est \u00e0 la fois rapide ET orient\u00e9 relations ?\n3. Quel profil v\u00e9rifie chaque d\u00e9tail avant d'avancer ?\n\n(R\u00e9ponds avec les lettres, par exemple : S, I, C)", 1000);
    s.step = 'refresh_quiz';
    updateProgress('refresh_quiz');
    enableInput("Tes 3 r\u00e9ponses (ex: S, I, C)...");
  }

  async function handleLevelCheck(answer: string) {
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
  }

  // --- Start welcome on mount ---
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const startWelcome = async () => {
      const s = stateRef.current;
      s.step = 'welcome';
      updateProgress('welcome');
      await botSay("Bienvenue dans la formation DISC de Graneet ! \u{1F3AF}\n\nJe suis ton formateur DISC pour cette session. En 30 mn environ, tu vas :\n\n\u2705 Comprendre les 4 profils DISC\n\u2705 D\u00e9couvrir ton propre profil\n\u2705 Apprendre \u00e0 mieux communiquer avec ton \u00e9quipe\n\nAvant de d\u00e9marrer, une question : as-tu d\u00e9j\u00e0 entendu parler du mod\u00e8le DISC ou suivi une formation sur ce sujet ?", 800);
      s.step = 'level_check';
      updateProgress('level_check');
      showChoicesFn([
        { label: 'A. Oui, je connais d\u00e9j\u00e0 le DISC', value: 'A' },
        { label: 'B. Non, c\'est la premi\u00e8re fois', value: 'B' }
      ], handleLevelCheck);
      enableInput();
    };
    startWelcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handle user text input ---
  function handleUserInput() {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    const s = stateRef.current;
    const step = s.step;
    if (step === 'discovery_wait_block1') {
      addMsg(text, 'user'); s.step = 'discovery_profiles'; updateProgress('discovery_profiles'); s.profileIndex = 0; showProfileFlow(0);
    } else if (step === 'discovery_profiles_next') {
      addMsg(text, 'user'); showProfileFlow(s.profileIndex);
    } else if (step === 'discovery_ready_test') {
      addMsg(text, 'user'); startTest();
    } else if (step === 'refresh_quiz') {
      addMsg(text, 'user'); handleRefreshQuiz();
    } else if (step === 'test_q') {
      const letter = text.toUpperCase().charAt(0);
      if (['A', 'B', 'C', 'D'].includes(letter)) { clearChoices(); handleTestAnswer(letter); }
      else { addMsg(text, 'user'); botSay("Merci de r\u00e9pondre par A, B, C ou D \u{1F60A}", 300); }
    } else if (step === 'quiz_q') {
      const upper = text.toUpperCase().trim();
      if (s.quizQuestion === 4) {
        if (upper.startsWith('V') || upper.startsWith('F')) { clearChoices(); handleQuizAnswerFlow(upper.startsWith('V') ? 'VRAI' : 'FAUX', s); }
        else { addMsg(text, 'user'); botSay("R\u00e9ponds par Vrai ou Faux \u{1F60A}", 300); }
      } else {
        const letter = upper.charAt(0);
        if (['A', 'B', 'C', 'D'].includes(letter)) { clearChoices(); handleQuizAnswerFlow(letter, s); }
        else { addMsg(text, 'user'); botSay("Merci de r\u00e9pondre par A, B, C ou D \u{1F60A}", 300); }
      }
    } else if (step === 'adapt_scenario_wait') {
      handleScenarioResponse(text);
    } else {
      addMsg(text, 'user'); botSay("Reprenons la formation ! \u{1F60A}", 400);
    }
  }

  // --- Validation form submit ---
  function handleFormSubmit(e: React.FormEvent) {
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
    setSuccessProfile(profileLabels[vfDominant!] + ' + ' + profileLabels[vfSecondary!]);
    setFormSubmitted(true);
    localStorage.setItem('graneet_disc_done', 'true');
    console.log('DISC Form submitted:', { name: vfName.trim(), dominant: vfDominant, secondary: vfSecondary, level: vfLevel, rating: vfRating, engagement: vfEngagement.trim(), comment: vfComment.trim() });
  }

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
        <style dangerouslySetInnerHTML={{ __html: [
          '@keyframes discFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }',
          '@keyframes discBounce { 0%, 80%, 100% { transform: scale(0.6); } 40% { transform: scale(1); } }',
          '@keyframes vpSlideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
          '@keyframes vpFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
          '@keyframes vpPop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }',
          '.disc-choice-btn:hover { background: ' + COLORS.graneetDark + ' !important; color: ' + COLORS.graneetYellow + ' !important; }',
          '.disc-vstar-label:hover { color: ' + COLORS.graneetYellow + ' !important; filter: drop-shadow(0 2px 4px rgba(232,212,77,0.5)); transform: scale(1.18); }',
          '.disc-vpill-label:hover { border-color: ' + COLORS.graneetDark + ' !important; background: white !important; }',
          '.disc-vtile:hover { border-color: #b0b8c1 !important; background: white !important; }',
        ].join('\n') }} />

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
                animation: 'discBounce 1.4s infinite ease-in-out',
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
                  border: '2px solid ' + COLORS.graneetDark,
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
      <div style={{ padding: '16px 20px', background: 'white', borderTop: '1px solid ' + COLORS.graneetCreamDark, display: 'flex', gap: 10, alignItems: 'center' }}>
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
            border: '2px solid ' + COLORS.graneetCreamDark,
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
              {'\u2190 Revoir mon chat'}
            </button>

            {/* Intro */}
            <div style={{ textAlign: 'center', marginBottom: 32, borderBottom: '2px solid ' + COLORS.graneetCreamDark, paddingBottom: 24 }}>
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
              }}>{'\u{1F393} Fin de formation'}</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.graneetDark, marginBottom: 8 }}>Valide ta participation</h2>
              <p style={{ color: COLORS.textLight, fontSize: 14, lineHeight: 1.6 }}>{'Remplis ce formulaire pour confirmer ta formation DISC.'}<br/>{'Ca prend moins de 2 minutes !'}</p>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} noValidate>
                {/* 1. Name */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>{'\u{1F4DD} Pr\u00e9nom + Nom'}</div>
                  <input
                    type="text"
                    value={vfName}
                    onChange={e => setVfName(e.target.value)}
                    placeholder="Ex. Marie Dupont"
                    autoComplete="name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid ' + (vfErrors.name ? '#E74C3C' : COLORS.graneetCreamDark),
                      borderRadius: 10,
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      color: COLORS.textMain,
                      background: COLORS.graneetCream,
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box' as const,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = COLORS.graneetDark; e.currentTarget.style.background = 'white'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = vfErrors.name ? '#E74C3C' : COLORS.graneetCreamDark; e.currentTarget.style.background = COLORS.graneetCream; }}
                  />
                  {vfErrors.name && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>{'Merci de renseigner ton pr\u00e9nom et nom.'}</div>}
                </div>

                {/* 2. Dominant profile */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>{'\u{1F534} Profil DISC dominant'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(['D', 'I', 'S', 'C'] as const).map(p => {
                      const tileColors: Record<string, string> = { D: COLORS.discRed, I: '#c8900a', S: COLORS.discGreen, C: COLORS.discBlue };
                      const labels: Record<string, string> = { D: '\u{1F534} D \u2014 Dominant', I: '\u{1F7E1} I \u2014 Influent', S: '\u{1F7E2} S \u2014 Stable', C: '\u{1F535} C \u2014 Consciencieux' };
                      const selected = vfDominant === p;
                      const tileColor = tileColors[p];
                      return (
                        <label
                          key={'dom-' + p}
                          className="disc-vtile"
                          onClick={() => setVfDominant(p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '13px 16px',
                            borderRadius: 10,
                            border: '2px solid ' + (selected ? tileColor : COLORS.graneetCreamDark),
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            background: selected ? 'white' : COLORS.graneetCream,
                            fontSize: 14,
                            fontWeight: selected ? 700 : 500,
                            userSelect: 'none' as const,
                            color: tileColor,
                            boxShadow: selected ? '0 0 0 3px ' + tileColor + '1F' : 'none',
                          }}
                        >
                          <span style={{
                            width: 14, height: 14,
                            borderRadius: '50%',
                            border: '2px solid ' + tileColor,
                            flexShrink: 0,
                            background: selected ? tileColor : 'transparent',
                            transition: 'background 0.15s',
                          }} />
                          {labels[p]}
                        </label>
                      );
                    })}
                  </div>
                  {vfErrors.dominant && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>{'Merci de choisir ton profil dominant.'}</div>}
                </div>

                {/* 3. Secondary profile */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>{'\u{1F948} Profil secondaire'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(['D', 'I', 'S', 'C'] as const).map(p => {
                      const tileColors: Record<string, string> = { D: COLORS.discRed, I: '#c8900a', S: COLORS.discGreen, C: COLORS.discBlue };
                      const labels: Record<string, string> = { D: '\u{1F534} D \u2014 Dominant', I: '\u{1F7E1} I \u2014 Influent', S: '\u{1F7E2} S \u2014 Stable', C: '\u{1F535} C \u2014 Consciencieux' };
                      const selected = vfSecondary === p;
                      const tileColor = tileColors[p];
                      return (
                        <label
                          key={'sec-' + p}
                          className="disc-vtile"
                          onClick={() => setVfSecondary(p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '13px 16px',
                            borderRadius: 10,
                            border: '2px solid ' + (selected ? tileColor : COLORS.graneetCreamDark),
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            background: selected ? 'white' : COLORS.graneetCream,
                            fontSize: 14,
                            fontWeight: selected ? 700 : 500,
                            userSelect: 'none' as const,
                            color: tileColor,
                            boxShadow: selected ? '0 0 0 3px ' + tileColor + '1F' : 'none',
                          }}
                        >
                          <span style={{
                            width: 14, height: 14,
                            borderRadius: '50%',
                            border: '2px solid ' + tileColor,
                            flexShrink: 0,
                            background: selected ? tileColor : 'transparent',
                            transition: 'background 0.15s',
                          }} />
                          {labels[p]}
                        </label>
                      );
                    })}
                  </div>
                  {vfErrors.secondary && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>{'Merci de choisir ton profil secondaire.'}</div>}
                </div>

                {/* 4. Level */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>{'\u{1F195} Niveau de d\u00e9part'}</div>
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
                            border: '2px solid ' + (selected ? COLORS.graneetDark : COLORS.graneetCreamDark),
                            fontSize: '13.5px',
                            fontWeight: selected ? 600 : 500,
                            cursor: 'pointer',
                            background: selected ? COLORS.graneetDark : COLORS.graneetCream,
                            color: selected ? COLORS.graneetYellow : COLORS.textMain,
                            transition: 'all 0.18s',
                            userSelect: 'none' as const,
                          }}
                        >
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>
                  {vfErrors.level && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>{"Merci d'indiquer ton niveau de d\u00e9part."}</div>}
                </div>

                {/* 5. Rating (stars) */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>{'\u2B50 Note de la formation'}</div>
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
                          userSelect: 'none' as const,
                          filter: vfRating && star <= vfRating ? 'drop-shadow(0 2px 4px rgba(232,212,77,0.5))' : 'none',
                        }}
                      >
                        {'\u2605'}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>{starHint}</div>
                  {vfErrors.rating && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>{'Merci de noter la formation.'}</div>}
                </div>

                <div style={{ height: 1, background: COLORS.graneetCreamDark, margin: '30px 0' }} />

                {/* 6. Engagement */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>{"\u{1F4AC} Qu'est-ce que tu vas changer ?"}</div>
                  <textarea
                    value={vfEngagement}
                    onChange={e => setVfEngagement(e.target.value)}
                    rows={5}
                    placeholder="Ex. Je vais faire attention \u00e0 ralentir mon rythme quand je parle \u00e0 mon coll\u00e8gue S, et lui laisser le temps de r\u00e9pondre avant de conclure..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid ' + (vfErrors.engagement ? '#E74C3C' : COLORS.graneetCreamDark),
                      borderRadius: 10,
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      color: COLORS.textMain,
                      background: COLORS.graneetCream,
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      resize: 'vertical' as const,
                      minHeight: 110,
                      boxSizing: 'border-box' as const,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = COLORS.graneetDark; e.currentTarget.style.background = 'white'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = vfErrors.engagement ? '#E74C3C' : COLORS.graneetCreamDark; e.currentTarget.style.background = COLORS.graneetCream; }}
                  />
                  {vfErrors.engagement && <div style={{ color: '#E74C3C', fontSize: '12.5px', marginTop: 6 }}>{'Partage au moins une intention concr\u00e8te.'}</div>}
                </div>

                {/* 7. Comment (optional) */}
                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.textMain, marginBottom: 10 }}>
                    {'\u{1F4E3} Commentaire libre'}
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
                      border: '2px solid ' + COLORS.graneetCreamDark,
                      borderRadius: 10,
                      fontSize: '14.5px',
                      fontFamily: 'inherit',
                      color: COLORS.textMain,
                      background: COLORS.graneetCream,
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      resize: 'vertical' as const,
                      boxSizing: 'border-box' as const,
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
                  {'Valider ma formation \u2192'}
                </button>
              </form>
            ) : (
              /* SUCCESS */
              <div style={{ textAlign: 'center', padding: '16px 0 8px', animation: 'vpFadeUp 0.5s ease' }}>
                <span style={{ fontSize: 72, marginBottom: 16, display: 'block', animation: 'vpPop 0.5s 0.2s both cubic-bezier(.36,1.6,.6,1)' }}>{'\u{1F389}'}</span>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.graneetDark, marginBottom: 10 }}>{'Bravo, ta formation DISC est valid\u00e9e !'}</h2>
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
                  {'Merci pour ta participation.'}<br/>
                  {'Victoria Bertrel a bien re\u00e7u tes r\u00e9ponses.'}<br/><br/>
                  <strong>{'\u00c0 tr\u00e8s vite chez Graneet ! \u{1F680}'}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
