/**
 * Election Data Store
 *
 * Centralized data for Nigeria 2027 General Election coverage.
 * Designed to be easily swapped with Appwrite collections later.
 *
 * Exports:
 *   - ELECTION_INFO: General election metadata
 *   - PARTIES: Political parties with colors and logos
 *   - CANDIDATES: Presidential and other candidates
 *   - RESULTS: Live/partial results data
 *   - FACT_CHECKS: Fact-checked political claims
 *   - KEY_RACES: Races to watch
 */

export const ELECTION_INFO = {
  name: 'Zaben Gabaɗaya 2027',
  fullName: 'Nigeria General Election 2027',
  date: '2027-02-06',
  type: 'general',
  positions: ['Shugaban Ƙasa', 'Sanata', 'Majalisar Wakilai', 'Gwamna'],
  totalRegisteredVoters: 93469086,
  totalPollingUnits: 176846,
  totalStates: 36,
  totalFCT: 1,
  electoralBody: 'INEC',
  electoralBodyFull: 'Independent National Electoral Commission',
};

export const PARTIES = [
  { id: 'apc', name: 'APC', fullName: 'All Progressives Congress', color: '#008751', symbol: '🏠' },
  { id: 'pdp', name: 'PDP', fullName: "People's Democratic Party", color: '#ED1C24', symbol: '☂️' },
  { id: 'lp', name: 'LP', fullName: 'Labour Party', color: '#003DA5', symbol: '⚒️' },
  { id: 'nnpp', name: 'NNPP', fullName: 'New Nigeria Peoples Party', color: '#FF6600', symbol: '🌾' },
  { id: 'adc', name: 'ADC', fullName: 'African Democratic Congress', color: '#800080', symbol: '🌳' },
  { id: 'apga', name: 'APGA', fullName: 'All Progressives Grand Alliance', color: '#FFD700', symbol: '🦅' },
];

export const CANDIDATES = [
  {
    id: 'c1',
    name: 'Ahmadu Bello Musa',
    party: 'apc',
    position: 'president',
    age: 62,
    state: 'Kaduna',
    education: 'PhD Economics, ABU Zaria',
    platform: [
      'Ƙarfafa tsaro a duk faɗin ƙasa',
      'Haɓaka aikin yi ga matasa miliyan 5',
      'Gina ƙarin hanyoyi da gadaje',
      'Kare noma da masana\'antu',
    ],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    runningMate: 'Fatima Abdullahi',
    previousOffice: 'Gwamnan Kaduna (2015-2023)',
  },
  {
    id: 'c2',
    name: 'Emeka Okonkwo',
    party: 'pdp',
    position: 'president',
    age: 58,
    state: 'Anambra',
    education: 'LLB Law, University of Lagos',
    platform: [
      'Sabuwar kundin tsarin mulki',
      'Raba iko da kuɗi tsakanin jihohi',
      'Kare \'yancin ɗan adam',
      'Haɓaka ilimi kyauta',
    ],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    runningMate: 'Aisha Mohammed',
    previousOffice: 'Sanatan Anambra Central (2011-2023)',
  },
  {
    id: 'c3',
    name: 'Ibrahim Danladi',
    party: 'lp',
    position: 'president',
    age: 55,
    state: 'Kano',
    education: 'MSc Engineering, Imperial College London',
    platform: [
      'Canjin tsarin mulki gaba ɗaya',
      'Ƙarshewar cin hanci da rashawa',
      'Sabis na kiwon lafiya kyauta',
      'Tallafa wa \'yan kasuwa matasa',
    ],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    runningMate: 'Ngozi Eze',
    previousOffice: 'Mai Gudummawa (2019-2023)',
  },
  {
    id: 'c4',
    name: 'Yusuf Abubakar',
    party: 'nnpp',
    position: 'president',
    age: 65,
    state: 'Bauchi',
    education: 'BSc Agriculture, Bayero University',
    platform: [
      'Haɓaka noma da abinci',
      'Ƙarfafa tattalin arzikin karkara',
      'Samun ruwan sha a kowace ƙauye',
      'Gina makarantu a kowace gunduma',
    ],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    runningMate: 'Halima Bello',
    previousOffice: 'Ministan Noma (2010-2015)',
  },
];

export const RESULTS = {
  presidential: {
    totalVotesCast: 24780000,
    turnout: 26.5,
    lastUpdated: '2027-02-08T14:30:00Z',
    status: 'counting',
    statesReported: 28,
    statesTotal: 37,
    candidates: [
      { candidateId: 'c1', votes: 8920000, percentage: 36.0, statesWon: 14 },
      { candidateId: 'c2', votes: 7434000, percentage: 30.0, statesWon: 11 },
      { candidateId: 'c3', votes: 5947200, percentage: 24.0, statesWon: 8 },
      { candidateId: 'c4', votes: 2478000, percentage: 10.0, statesWon: 4 },
    ],
  },
  senate: {
    totalSeats: 109,
    seatsReported: 72,
    parties: [
      { partyId: 'apc', seats: 38, leading: 5 },
      { partyId: 'pdp', seats: 22, leading: 4 },
      { partyId: 'lp', seats: 8, leading: 2 },
      { partyId: 'nnpp', seats: 3, leading: 1 },
      { partyId: 'apga', seats: 1, leading: 0 },
    ],
  },
  governor: {
    totalStates: 36,
    statesReported: 20,
    parties: [
      { partyId: 'apc', states: 10, leading: 3 },
      { partyId: 'pdp', states: 6, leading: 2 },
      { partyId: 'lp', states: 3, leading: 1 },
      { partyId: 'nnpp', states: 1, leading: 0 },
    ],
  },
};

export const STATE_RESULTS = [
  { state: 'Lagos', region: 'South West', presidential: { c1: 42, c2: 35, c3: 18, c4: 5 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 34.2 },
  { state: 'Kano', region: 'North West', presidential: { c1: 38, c2: 28, c3: 25, c4: 9 }, senate: { apc: 1, lp: 1, nnpp: 1 }, governor: 'nnpp', turnout: 22.1 },
  { state: 'Rivers', region: 'South South', presidential: { c2: 48, c1: 30, c3: 15, c4: 7 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 41.5 },
  { state: 'Enugu', region: 'South East', presidential: { c2: 55, c3: 25, c1: 15, c4: 5 }, senate: { pdp: 2, lp: 1 }, governor: 'apga', turnout: 38.7 },
  { state: 'Kaduna', region: 'North West', presidential: { c1: 52, c2: 22, c3: 18, c4: 8 }, senate: { apc: 2, lp: 1 }, governor: 'apc', turnout: 28.3 },
  { state: 'Abuja (FCT)', region: 'FCT', presidential: { c3: 38, c1: 30, c2: 25, c4: 7 }, senate: { apc: 1 }, governor: null, turnout: 45.2 },
  { state: 'Oyo', region: 'South West', presidential: { c1: 40, c2: 38, c3: 16, c4: 6 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 31.8 },
  { state: 'Benue', region: 'North Central', presidential: { c2: 42, c1: 35, c3: 18, c4: 5 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 36.4 },
  { state: 'Borno', region: 'North East', presidential: { c1: 58, c2: 20, c3: 12, c4: 10 }, senate: { apc: 2, nnpp: 1 }, governor: 'apc', turnout: 18.5 },
  { state: 'Delta', region: 'South South', presidential: { c2: 45, c1: 32, c3: 17, c4: 6 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 39.1 },
  { state: 'Katsina', region: 'North West', presidential: { c1: 55, c2: 25, c3: 12, c4: 8 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 24.7 },
  { state: 'Anambra', region: 'South East', presidential: { c2: 50, c3: 28, c1: 16, c4: 6 }, senate: { pdp: 2, apga: 1 }, governor: 'apga', turnout: 42.3 },
  { state: 'Bauchi', region: 'North East', presidential: { c4: 40, c1: 35, c2: 18, c3: 7 }, senate: { nnpp: 2, apc: 1 }, governor: 'nnpp', turnout: 26.8 },
  { state: 'Edo', region: 'South South', presidential: { c2: 44, c1: 34, c3: 16, c4: 6 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 37.5 },
  { state: 'Niger', region: 'North Central', presidential: { c1: 45, c2: 30, c3: 18, c4: 7 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 25.4 },
  { state: 'Plateau', region: 'North Central', presidential: { c2: 40, c1: 38, c3: 16, c4: 6 }, senate: { pdp: 1, apc: 1, lp: 1 }, governor: 'pdp', turnout: 33.2 },
  { state: 'Sokoto', region: 'North West', presidential: { c1: 52, c2: 28, c3: 12, c4: 8 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 21.6 },
  { state: 'Imo', region: 'South East', presidential: { c2: 48, c3: 30, c1: 16, c4: 6 }, senate: { pdp: 2, lp: 1 }, governor: 'apga', turnout: 40.8 },
  { state: 'Ogun', region: 'South West', presidential: { c1: 38, c2: 36, c3: 20, c4: 6 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 35.1 },
  { state: 'Kwara', region: 'North Central', presidential: { c1: 42, c2: 35, c3: 17, c4: 6 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 30.5 },
  { state: 'Cross River', region: 'South South', presidential: { c2: 46, c1: 32, c3: 16, c4: 6 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 38.9 },
  { state: 'Abia', region: 'South East', presidential: { c2: 52, c3: 26, c1: 16, c4: 6 }, senate: { pdp: 2, lp: 1 }, governor: 'apga', turnout: 41.2 },
  { state: 'Zamfara', region: 'North West', presidential: { c1: 58, c2: 22, c3: 10, c4: 10 }, senate: { apc: 2, nnpp: 1 }, governor: 'apc', turnout: 19.8 },
  { state: 'Adamawa', region: 'North East', presidential: { c1: 45, c2: 32, c3: 16, c4: 7 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 27.3 },
  { state: 'Akwa Ibom', region: 'South South', presidential: { c2: 50, c1: 28, c3: 16, c4: 6 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 40.5 },
  { state: 'Jigawa', region: 'North West', presidential: { c1: 55, c2: 25, c3: 10, c4: 10 }, senate: { apc: 2, nnpp: 1 }, governor: 'apc', turnout: 23.1 },
  { state: 'Kebbi', region: 'North West', presidential: { c1: 50, c2: 28, c3: 12, c4: 10 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 22.5 },
  { state: 'Nasarawa', region: 'North Central', presidential: { c1: 42, c2: 35, c3: 17, c4: 6 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 29.8 },
  { state: 'Taraba', region: 'North East', presidential: { c2: 42, c1: 36, c3: 16, c4: 6 }, senate: { pdp: 1, apc: 1, lp: 1 }, governor: 'pdp', turnout: 32.1 },
  { state: 'Yobe', region: 'North East', presidential: { c1: 60, c2: 20, c3: 10, c4: 10 }, senate: { apc: 2, nnpp: 1 }, governor: 'apc', turnout: 17.2 },
  { state: 'Ekiti', region: 'South West', presidential: { c1: 40, c2: 38, c3: 16, c4: 6 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 36.7 },
  { state: 'Osun', region: 'South West', presidential: { c2: 42, c1: 36, c3: 16, c4: 6 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 37.8 },
  { state: 'Ondo', region: 'South West', presidential: { c1: 38, c2: 40, c3: 16, c4: 6 }, senate: { pdp: 2, apc: 1 }, governor: 'pdp', turnout: 34.5 },
  { state: 'Ebonyi', region: 'South East', presidential: { c2: 50, c3: 28, c1: 16, c4: 6 }, senate: { pdp: 2, lp: 1 }, governor: 'apga', turnout: 39.6 },
  { state: 'Kogi', region: 'North Central', presidential: { c1: 44, c2: 34, c3: 16, c4: 6 }, senate: { apc: 2, pdp: 1 }, governor: 'apc', turnout: 31.2 },
  { state: 'Gombe', region: 'North East', presidential: { c1: 48, c2: 28, c3: 16, c4: 8 }, senate: { apc: 2, nnpp: 1 }, governor: 'apc', turnout: 25.9 },
];

export const FACT_CHECKS = [
  {
    id: 'fc1',
    claim: '"Mun gina kilomita 5,000 na hanyoyi a cikin shekaru 4"',
    claimant: 'Ahmadu Bello Musa',
    claimantParty: 'apc',
    verdict: 'misleading',
    verdictLabel: 'Ba Gaskiya Ba',
    analysis: 'Bayanin bincike ya nuna cewa kilomita 2,800 kawai aka kammala, yayin da sauran 2,200 ke ci gaba. Haka nan, wasu daga cikin hanyoyin da aka ambata an gyara su ne kawai, ba sababbiya ba.',
    date: '2027-01-15',
    source: 'Ministry of Works Annual Report 2026',
  },
  {
    id: 'fc2',
    claim: '"Matsakaicin rashin aikin yi ya kai kashi 4.2%"',
    claimant: 'Emeka Okonkwo',
    claimantParty: 'pdp',
    verdict: 'false',
    verdictLabel: 'Ƙarya',
    analysis: 'Bisa ga bayanan NBS na 2026, matsakaicin rashin aikin yi a Najeriya ya kai kashi 33.3%, ba 4.2% ba. Wataƙila mai magana yana magana ne game da matsakaicin rashin aikin yi na duniya.',
    date: '2027-01-20',
    source: 'National Bureau of Statistics Q4 2026 Report',
  },
  {
    id: 'fc3',
    claim: '"Za mu samar da aikin yi ga matasa miliyan 5 a cikin shekara ta farko"',
    claimant: 'Ibrahim Danladi',
    claimantParty: 'lp',
    verdict: 'unverified',
    verdictLabel: 'Ba a Taba Ba',
    analysis: 'Wannan alkawari ba shi da cikakken bayanin yadda za a aiwatar da shi. Masana tattalin arziki sun ce samar da aikin yi miliyan 5 a shekara guda yana buƙatar kasafin kuɗi da bai yiwu ba a yanayin tattalin arzikin yanzu.',
    date: '2027-01-25',
    source: 'Economic Analysts Panel Review',
  },
  {
    id: 'fc4',
    claim: '"Najeriya ta zama ƙasa mafi girma a Afirka wajen fitar da noma"',
    claimant: 'Yusuf Abubakar',
    claimantParty: 'nnpp',
    verdict: 'true',
    verdictLabel: 'Gaskiya',
    analysis: 'Bisa ga bayanan FAO na 2026, Najeriya ita ce ƙasa ta farko a Afirka wajen samar da wake, cassava, da yam. Haka nan, ta kasance cikin manyan ƙasashe 10 na fitar da noma a nahiyar.',
    date: '2027-01-28',
    source: 'FAO Statistical Yearbook 2026',
  },
  {
    id: 'fc5',
    claim: '"Mun rage farashin man fetur da kashi 40%"',
    claimant: 'Ahmadu Bello Musa',
    claimantParty: 'apc',
    verdict: 'false',
    verdictLabel: 'Ƙarya',
    analysis: 'Farashin man fetur a halin yanzu ya kai ₦617/lita, wanda ya fi farashin da ya kasance a 2023 (₦195/lita) da kashi 216%. Babu wani ragi da ya faru tun lokacin da aka cire tallafin man fetur.',
    date: '2027-02-01',
    source: 'NNPC Price Monitor, Feb 2027',
  },
  {
    id: 'fc6',
    claim: '"Za mu kawo karshen cin hanci da rashawa a cikin watanni 100"',
    claimant: 'Emeka Okonkwo',
    claimantParty: 'pdp',
    verdict: 'unverified',
    verdictLabel: 'Ba a Taba Ba',
    analysis: 'Wannan alkawari yana da wuya a tabbatar da shi. Ko da yake akwai tsare-tsare na yaki da cin hanci da rashawa, masana sun ce kawo karshen gaba ɗaya ba zai yiwu ba a cikin wannan lokaci.',
    date: '2027-02-03',
    source: 'Transparency International Nigeria Review',
  },
];

export const KEY_RACES = [
  {
    race: 'Shugaban Ƙasa',
    description: 'Zaben shugaban ƙasa na Najeriya. Wanda ya samu kuri\'u mafi yawa kuma ya wuce kashi 25% a jihohi biyu cikin uku ya ci.',
    threshold: '25% a jihohi 24+',
    totalSeats: 1,
  },
  {
    race: 'Majalisar Dattawa (Senate)',
    description: 'Zaben Sanata 3 daga kowace jiha, da 1 daga FCT. Jimlar kujeru 109.',
    threshold: 'Mafi yawan kujeru',
    totalSeats: 109,
  },
  {
    race: 'Majalisar Wakilai (House)',
    description: 'Zaben wakilai 360 daga mazabu daban-daban.',
    threshold: 'Mafi yawan kujeru',
    totalSeats: 360,
  },
  {
    race: 'Gwamnoni',
    description: 'Zaben gwamna a kowace jiha 36.',
    threshold: '25% + mafi yawan kuri\'u',
    totalSeats: 36,
  },
];

export const VOTER_INFO = {
  registrationDeadline: '2026-12-31',
  pollingDay: '2027-02-06',
  pollingHours: '8:00 AM - 4:00 PM',
  requirements: [
    'Katin zaba na INEC (Permanent Voter Card)',
    'Katin shaida (ID card, passport, ko driving license)',
    'Ku zo da kansa — ba za a iya zaba a madadin ku ba',
  ],
  howToVote: [
    'Je zuwa cibiyar zaba da aka raba maka',
    'Nuna katin zaba ga ma\'aikacin INEC',
    'Ana ba ka takardar zaba',
    'Zaɓi ɗan takarar ka a cikin ɗakin zaba',
    'Saka takardar a cikin akwatin zaba',
    'Danna yatsa da tawada (indelible ink)',
  ],
  emergencyContacts: [
    { name: 'INEC Hotline', phone: '0800-INEC-001' },
    { name: 'Police Emergency', phone: '112' },
    { name: 'Yanci Election Desk', phone: '0800-YANCI-01' },
  ],
};
