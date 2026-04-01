/**
 * Election Data Store — Real INEC-style structure
 *
 * Based on how INEC actually reports results:
 * - Registered Voters, Accredited Voters, Valid Votes, Rejected Votes
 * - Actual vote counts per candidate (not just percentages)
 * - 25% threshold tracking per state
 * - States won per candidate
 *
 * All data is structured to match INEC Form EC8A (Polling Unit) and
 * Form EC8B (Ward Collation) reporting standards.
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
  winningThreshold: 'Majority of valid votes + 25% in at least 24 of 37 states/FCT',
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

/**
 * STATE_RESULTS — Full INEC-style data per state/FCT.
 *
 * Each state includes:
 *  - registeredVoters: Total PVC holders in the state
 *  - accreditedVoters: Voters who passed BVAS/Smart Card Reader
 *  - validVotes: Legitimate ballots counted
 *  - rejectedVotes: Spoiled/invalid ballots
 *  - totalVotesCast: validVotes + rejectedVotes (= accreditedVoters in theory)
 *  - candidateVotes: { candidateId: actualVoteCount } — raw numbers
 *  - candidatePercentages: { candidateId: percentageOfValidVotes }
 *  - winner: candidateId who got most valid votes
 *  - met25Threshold: [candidateIds] who got >= 25% of valid votes
 *  - governor: partyId that won governorship (if applicable)
 *  - senate: { partyId: seatsWon }
 */
export const STATE_RESULTS = [
  { state: 'Abia', region: 'South East', registeredVoters: 2315884, accreditedVoters: 952340, validVotes: 920150, rejectedVotes: 32190, totalVotesCast: 952340, candidateVotes: { c1: 147224, c2: 478478, c3: 239239, c4: 55209 }, met25Threshold: ['c2', 'c3'], winner: 'c2', governor: 'apga', senate: { pdp: 2, lp: 1 } },
  { state: 'Adamawa', region: 'North East', registeredVoters: 2270156, accreditedVoters: 619763, validVotes: 598420, rejectedVotes: 21343, totalVotesCast: 619763, candidateVotes: { c1: 269289, c2: 191494, c3: 95747, c4: 41890 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Akwa Ibom', region: 'South South', registeredVoters: 2456789, accreditedVoters: 992543, validVotes: 960210, rejectedVotes: 32333, totalVotesCast: 992543, candidateVotes: { c1: 268859, c2: 480105, c3: 153634, c4: 57612 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Anambra', region: 'South East', registeredVoters: 2678432, accreditedVoters: 1132977, validVotes: 1095650, rejectedVotes: 37327, totalVotesCast: 1132977, candidateVotes: { c1: 175304, c2: 547825, c3: 306782, c4: 65739 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'apga', senate: { pdp: 2, apga: 1 } },
  { state: 'Bauchi', region: 'North East', registeredVoters: 2834567, accreditedVoters: 759830, validVotes: 732100, rejectedVotes: 27730, totalVotesCast: 759830, candidateVotes: { c1: 256235, c2: 131778, c3: 51247, c4: 292840 }, met25Threshold: ['c1', 'c4'], winner: 'c4', governor: 'nnpp', senate: { nnpp: 2, apc: 1 } },
  { state: 'Bayelsa', region: 'South South', registeredVoters: 1023456, accreditedVoters: 387890, validVotes: 375120, rejectedVotes: 12770, totalVotesCast: 387890, candidateVotes: { c1: 105034, c2: 187560, c3: 60019, c4: 22507 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Benue', region: 'North Central', registeredVoters: 2567890, accreditedVoters: 934712, validVotes: 902340, rejectedVotes: 32372, totalVotesCast: 934712, candidateVotes: { c1: 315819, c2: 378983, c3: 162421, c4: 45117 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Borno', region: 'North East', registeredVoters: 2345678, accreditedVoters: 433950, validVotes: 418200, rejectedVotes: 15750, totalVotesCast: 433950, candidateVotes: { c1: 242556, c2: 83640, c3: 50184, c4: 41820 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, nnpp: 1 } },
  { state: 'Cross River', region: 'South South', registeredVoters: 1789012, accreditedVoters: 695926, validVotes: 672340, rejectedVotes: 23586, totalVotesCast: 695926, candidateVotes: { c1: 215149, c2: 309276, c3: 107574, c4: 40341 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Delta', region: 'South South', registeredVoters: 2890123, accreditedVoters: 1130038, validVotes: 1091200, rejectedVotes: 38838, totalVotesCast: 1130038, candidateVotes: { c1: 349184, c2: 491040, c3: 185504, c4: 65472 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Ebonyi', region: 'South East', registeredVoters: 1567890, accreditedVoters: 620896, validVotes: 599420, rejectedVotes: 21476, totalVotesCast: 620896, candidateVotes: { c1: 95907, c2: 299710, c3: 167837, c4: 35966 }, met25Threshold: ['c2', 'c3'], winner: 'c2', governor: 'apga', senate: { pdp: 2, lp: 1 } },
  { state: 'Edo', region: 'South South', registeredVoters: 2123456, accreditedVoters: 796296, validVotes: 768900, rejectedVotes: 27396, totalVotesCast: 796296, candidateVotes: { c1: 261426, c2: 338316, c3: 123024, c4: 46134 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Ekiti', region: 'South West', registeredVoters: 1456789, accreditedVoters: 534641, validVotes: 516180, rejectedVotes: 18461, totalVotesCast: 534641, candidateVotes: { c1: 206472, c2: 196149, c3: 82589, c4: 30970 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Enugu', region: 'South East', registeredVoters: 2234567, accreditedVoters: 864787, validVotes: 835120, rejectedVotes: 29667, totalVotesCast: 864787, candidateVotes: { c1: 125268, c2: 459316, c3: 208780, c4: 41756 }, met25Threshold: ['c2', 'c3'], winner: 'c2', governor: 'apga', senate: { pdp: 2, lp: 1 } },
  { state: 'FCT', region: 'North Central', registeredVoters: 2345678, accreditedVoters: 1060246, validVotes: 1024560, rejectedVotes: 35686, totalVotesCast: 1060246, candidateVotes: { c1: 307368, c2: 256140, c3: 389333, c4: 71719 }, met25Threshold: ['c1', 'c2', 'c3', 'c4'], winner: 'c3', governor: null, senate: { apc: 1 } },
  { state: 'Gombe', region: 'North East', registeredVoters: 1567890, accreditedVoters: 406084, validVotes: 391200, rejectedVotes: 14884, totalVotesCast: 406084, candidateVotes: { c1: 187776, c2: 109536, c3: 62592, c4: 31296 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, nnpp: 1 } },
  { state: 'Imo', region: 'South East', registeredVoters: 2456789, accreditedVoters: 1002370, validVotes: 968120, rejectedVotes: 34250, totalVotesCast: 1002370, candidateVotes: { c1: 154899, c2: 464698, c3: 290436, c4: 58087 }, met25Threshold: ['c2', 'c3'], winner: 'c2', governor: 'apga', senate: { pdp: 2, lp: 1 } },
  { state: 'Jigawa', region: 'North West', registeredVoters: 2890123, accreditedVoters: 667618, validVotes: 644500, rejectedVotes: 23118, totalVotesCast: 667618, candidateVotes: { c1: 354475, c2: 161125, c3: 64450, c4: 64450 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, nnpp: 1 } },
  { state: 'Kaduna', region: 'North West', registeredVoters: 3456789, accreditedVoters: 978271, validVotes: 944200, rejectedVotes: 34071, totalVotesCast: 978271, candidateVotes: { c1: 490984, c2: 207724, c3: 169956, c4: 75536 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, lp: 1 } },
  { state: 'Kano', region: 'North West', registeredVoters: 5678901, accreditedVoters: 1255037, validVotes: 1210500, rejectedVotes: 44537, totalVotesCast: 1255037, candidateVotes: { c1: 459990, c2: 338940, c3: 302625, c4: 108945 }, met25Threshold: ['c1', 'c2', 'c3', 'c4'], winner: 'c1', governor: 'nnpp', senate: { apc: 1, lp: 1, nnpp: 1 } },
  { state: 'Katsina', region: 'North West', registeredVoters: 3789012, accreditedVoters: 935886, validVotes: 903200, rejectedVotes: 32686, totalVotesCast: 935886, candidateVotes: { c1: 496760, c2: 225800, c3: 108384, c4: 72256 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Kebbi', region: 'North West', registeredVoters: 2123456, accreditedVoters: 477778, validVotes: 460800, rejectedVotes: 16978, totalVotesCast: 477778, candidateVotes: { c1: 230400, c2: 129024, c3: 55296, c4: 46080 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Kogi', region: 'North Central', registeredVoters: 2012345, accreditedVoters: 627852, validVotes: 606120, rejectedVotes: 21732, totalVotesCast: 627852, candidateVotes: { c1: 266693, c2: 206081, c3: 96979, c4: 36367 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Kwara', region: 'North Central', registeredVoters: 1678901, accreditedVoters: 512065, validVotes: 494200, rejectedVotes: 17865, totalVotesCast: 512065, candidateVotes: { c1: 207564, c2: 172970, c3: 84014, c4: 29652 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Lagos', region: 'South West', registeredVoters: 6567890, accreditedVoters: 2246218, validVotes: 2168400, rejectedVotes: 77818, totalVotesCast: 2246218, candidateVotes: { c1: 910728, c2: 758940, c3: 390312, c4: 108420 }, met25Threshold: ['c1', 'c2', 'c3', 'c4'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Nasarawa', region: 'North Central', registeredVoters: 1567890, accreditedVoters: 467231, validVotes: 450900, rejectedVotes: 16331, totalVotesCast: 467231, candidateVotes: { c1: 189378, c2: 157815, c3: 76653, c4: 27054 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Niger', region: 'North Central', registeredVoters: 2567890, accreditedVoters: 652244, validVotes: 629400, rejectedVotes: 22844, totalVotesCast: 652244, candidateVotes: { c1: 283230, c2: 188820, c3: 113292, c4: 44058 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Ogun', region: 'South West', registeredVoters: 2890123, accreditedVoters: 1014433, validVotes: 980100, rejectedVotes: 34333, totalVotesCast: 1014433, candidateVotes: { c1: 372438, c2: 352836, c3: 196020, c4: 58806 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Ondo', region: 'South West', registeredVoters: 2012345, accreditedVoters: 694259, validVotes: 670320, rejectedVotes: 23939, totalVotesCast: 694259, candidateVotes: { c1: 254722, c2: 268128, c3: 107251, c4: 40219 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Osun', region: 'South West', registeredVoters: 2123456, accreditedVoters: 802666, validVotes: 775200, rejectedVotes: 27466, totalVotesCast: 802666, candidateVotes: { c1: 279072, c2: 325584, c3: 124032, c4: 46512 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Oyo', region: 'South West', registeredVoters: 3456789, accreditedVoters: 1099259, validVotes: 1061400, rejectedVotes: 37859, totalVotesCast: 1099259, candidateVotes: { c1: 424560, c2: 403332, c3: 169824, c4: 63684 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Plateau', region: 'North Central', registeredVoters: 2012345, accreditedVoters: 668100, validVotes: 644700, rejectedVotes: 23400, totalVotesCast: 668100, candidateVotes: { c1: 244986, c2: 257880, c3: 103152, c4: 38682 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 1, apc: 1, lp: 1 } },
  { state: 'Rivers', region: 'South South', registeredVoters: 2890123, accreditedVoters: 1199501, validVotes: 1158000, rejectedVotes: 41501, totalVotesCast: 1199501, candidateVotes: { c1: 347400, c2: 555840, c3: 173700, c4: 81060 }, met25Threshold: ['c1', 'c2', 'c3', 'c4'], winner: 'c2', governor: 'pdp', senate: { pdp: 2, apc: 1 } },
  { state: 'Sokoto', region: 'North West', registeredVoters: 2345678, accreditedVoters: 506666, validVotes: 489200, rejectedVotes: 17466, totalVotesCast: 506666, candidateVotes: { c1: 254384, c2: 136976, c3: 58704, c4: 39136 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, pdp: 1 } },
  { state: 'Taraba', region: 'North East', registeredVoters: 1567890, accreditedVoters: 503293, validVotes: 485700, rejectedVotes: 17593, totalVotesCast: 503293, candidateVotes: { c1: 174852, c2: 203994, c3: 77712, c4: 29142 }, met25Threshold: ['c1', 'c2', 'c3'], winner: 'c2', governor: 'pdp', senate: { pdp: 1, apc: 1, lp: 1 } },
  { state: 'Yobe', region: 'North East', registeredVoters: 1456789, accreditedVoters: 250568, validVotes: 241800, rejectedVotes: 8768, totalVotesCast: 250568, candidateVotes: { c1: 145080, c2: 48360, c3: 24180, c4: 24180 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, nnpp: 1 } },
  { state: 'Zamfara', region: 'North West', registeredVoters: 2234567, accreditedVoters: 442444, validVotes: 426800, rejectedVotes: 15644, totalVotesCast: 442444, candidateVotes: { c1: 247544, c2: 93896, c3: 42680, c4: 42680 }, met25Threshold: ['c1', 'c2'], winner: 'c1', governor: 'apc', senate: { apc: 2, nnpp: 1 } },
];

/**
 * Compute national totals from state results.
 */
export function computeNationalTotals(candidateIds) {
  const totals = {
    registeredVoters: 0,
    accreditedVoters: 0,
    validVotes: 0,
    rejectedVotes: 0,
    totalVotesCast: 0,
    candidateVotes: {},
    candidatePercentages: {},
    statesWon: {},
    statesMet25: {},
    turnout: 0,
  };

  candidateIds.forEach(id => {
    totals.candidateVotes[id] = 0;
    totals.statesWon[id] = 0;
    totals.statesMet25[id] = 0;
  });

  STATE_RESULTS.forEach(sr => {
    totals.registeredVoters += sr.registeredVoters;
    totals.accreditedVoters += sr.accreditedVoters;
    totals.validVotes += sr.validVotes;
    totals.rejectedVotes += sr.rejectedVotes;
    totals.totalVotesCast += sr.totalVotesCast;

    candidateIds.forEach(id => {
      totals.candidateVotes[id] += sr.candidateVotes[id] || 0;
      if (sr.winner === id) totals.statesWon[id]++;
      if (sr.met25Threshold.includes(id)) totals.statesMet25[id]++;
    });
  });

  candidateIds.forEach(id => {
    totals.candidatePercentages[id] = totals.validVotes > 0
      ? ((totals.candidateVotes[id] / totals.validVotes) * 100)
      : 0;
  });

  totals.turnout = totals.registeredVoters > 0
    ? ((totals.accreditedVoters / totals.registeredVoters) * 100)
    : 0;

  return totals;
}

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
