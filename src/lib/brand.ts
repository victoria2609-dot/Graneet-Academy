export const BRAND = {
  vert: '#122428',
  vertMid: '#1e3a40',
  beige: '#F5F5F0',
  or: '#EBE68C',
  blanc: '#FFFFFF',
  noir: '#141414',
} as const;

export const MODULE_LIST = [
  {
    id: 'onboarding',
    number: '01',
    title: 'Ton onboarding',
    description: 'Ton parcours d\'intégration semaine par semaine. Découvre l\'entreprise, ton équipe et tes outils — à ton rythme.',
    href: '/onboarding',
    progressKey: 'graneet_progress',
    icon: 'calendar',
  },
  {
    id: 'value-propositions',
    number: '02',
    title: 'Les value propositions de Graneet',
    description: 'Parcours interactif de 2 mois pour maîtriser les 8 propositions de valeur de Graneet.',
    href: '/value-propositions',
    progressKey: 'graneet_vp_done',
    icon: 'hexagon',
  },
  {
    id: 'disc',
    number: '03',
    title: 'DISC : découvre les clés de la communication',
    description: 'Identifie ton profil comportemental DISC et apprends à mieux communiquer avec les 4 profils.',
    href: '/disc',
    progressKey: 'graneet_disc_done',
    icon: 'people',
  },
] as const;
