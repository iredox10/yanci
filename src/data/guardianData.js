export const GUARDIAN_DATA = {
  ticker: [
    'Farashin danyen mai ya fadi da kashi uku saboda karin samarwa a Afirka',
    'Jami’ar Kano ta kaddamar da tsarin karatun AI na farko a Arewa',
    'Masu sana’ar noma sun samu tallafin ruwan sama na zamani daga gwamnati',
    'Matasa 5,000 sun kammala horon fasahar sadarwa a cibiyar Yanci Lab',
  ],
  headlines: [
    {
      id: 1,
      kicker: 'Kai Tsaye',
      headline: 'Majalisa ta amince da dokar tsare bayanan dijital domin kare ’yan kasa',
      trail: 'Sabuwar dokar za ta tilasta kamfanonin fasaha bin sharudan adana bayanai a cikin kasar tare da samar da ayyuka 25,000 a shekarar farko.',
      body: '<p>Majalisar dokokin Najeriya ta amince da wani muhimmin kudiri da ke nufin kare bayanan ‘yan kasa a yanar gizo. Wannan doka, wacce aka dade ana tafka muhawara a kanta, za ta tilasta wa manyan kamfanonin fasaha kamar Facebook, Google, da Twitter su adana bayanan masu amfani da su na Najeriya a cikin kasar.</p><p>Shugaban kwamitin sadarwa na majalisar, ya bayyana cewa wannan mataki zai taimaka wajen bunkasa tattalin arzikin dijital na kasar tare da samar da ayyukan yi ga matasa.</p><h3>Me dokar ta kunsa?</h3><ul><li>Dole ne kamfanoni su yi rajista da hukumar NITDA.</li><li>Dole ne a adana bayanan gwamnati a cikin Najeriya.</li><li>Za a ci tarar duk kamfanin da ya saba wa dokar.</li></ul>',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=2000&auto=format&fit=crop',
      type: 'hero',
      pillar: 'news',
    },
    {
      id: 2,
      kicker: 'Bincike',
      headline: 'Dalilin da ya sa kudin Naira ke kara kwanciyar hankali a kasuwar duniya',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop',
      type: 'standard',
      pillar: 'news',
    },
    {
      id: 3,
      kicker: 'Sufuri',
      headline: 'Sabon tsarin jirgin kasa mai sauri ya fara gwaji tsakanin Abuja da Kaduna',
      type: 'compact',
      pillar: 'news',
      isLive: true,
    },
    {
      id: 4,
      kicker: 'Makaman Haske',
      headline: 'Gidaje 12,000 a Arewa maso Gabas sun koma amfani da hasken rana',
      type: 'compact',
      pillar: 'news',
    },
  ],
  sport: [
    {
      id: 5,
      kicker: 'AFCON 2025',
      headline: 'An sanar da sabbin sunaye cikin jerin Super Eagles kafin wasan sada zumunci',
      image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&auto=format&fit=crop',
      type: 'standard',
      pillar: 'sport',
    },
    {
      id: 6,
      kicker: 'Gasara',
      headline: 'Ndidi ya kafa sabon rikodi na kwace kwallon 18 a wasa guda',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&auto=format&fit=crop',
      type: 'compact',
      pillar: 'sport',
    },
  ],
  opinion: [
    {
      id: 7,
      author: 'Rahama Ibrahim',
      headline: 'Yadda siyasar kula da bayanai ke tsare martabar dimokuradiyya',
      quote: 'Idan ba mu mallaki labarin kanmu ba, to za a rubuta shi ta hanyar da ba ta wakiltar mu ba.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop',
      pillar: 'opinion',
    },
    {
      id: 8,
      author: 'Dr. Garba Kurfi',
      headline: 'Matakin tattabarun kudade ga kananan kamfanoni',
      pillar: 'opinion',
    },
  ],
  culture: [
    {
      id: 9,
      kicker: 'Kiɗa',
      headline: 'Sabon sautin Arewa fusion ya mamaye jerin Spotify Afrika',
      image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1200&auto=format&fit=crop',
      pillar: 'culture',
    },
    {
      id: 10,
      kicker: 'Fina-finai',
      headline: 'Nollywood ta samu gurbin nuna fina-finai biyu a Cannes 2025',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop',
      pillar: 'culture',
    },
  ],
  lifestyle: [
    {
      id: 11,
      kicker: 'Lafiya',
      headline: 'Likita ya bayyana tsarin motsa jiki na minti 15 da ke rage hawan jini',
      pillar: 'lifestyle',
    },
    {
      id: 12,
      kicker: 'Kasuwanci',
      headline: 'Matashiya daga Bauchi ta kafa dakin gwaje-gwajen kayan kwalliya na farko',
      pillar: 'lifestyle',
    },
    {
      id: 13,
      kicker: 'Ilimi',
      headline: 'Yadda makarantu masu zaman kansu ke amfani da AI wajen koyar da lissafi',
      pillar: 'lifestyle',
    },
  ],
};

export const PILLARS = {
  news: { main: '#8a2c2c', pastel: '#eecaca', dark: '#631a1a' }, // Clay Red
  sport: { main: '#2c7a7b', pastel: '#b2f5ea', dark: '#1a4e4f' }, // Teal Green
  opinion: { main: '#c59d5f', pastel: '#fdf3d8', dark: '#8a6a35', bg: '#fbf8f3' }, // Gold
  culture: { main: '#553c9a', pastel: '#e9d8fd', dark: '#322659' }, // Indigo
  lifestyle: { main: '#d69e2e', pastel: '#fefcbf', dark: '#975a16' }, // Ochre
};
