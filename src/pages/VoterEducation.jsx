import { Link } from 'react-router-dom';
import {
  FaCheckToSlot, FaIdCard, FaClock, FaLocationDot,
  FaPhone, FaTriangleExclamation, FaCircleCheck, FaListCheck,
  FaShieldHalved, FaBook, FaCircleInfo,
} from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import SEO from '../components/SEO';
import { VOTER_INFO, ELECTION_INFO } from '../data/electionData';

export default function VoterEducation() {
  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title="Ilimin ɗan Zaba — Zabe 2027 | Yanci"
        description="Koyi yadda ake zaba — rajista, abubuwan da ake buƙata, lokaci, da wuraren zaba."
        url="/zabe/ilimi"
      />
      <GuardianNav />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f3460] to-[#1a1a2e] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-3">
            <FaCheckToSlot className="text-[#c59d5f] w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Ilimin ɗan Zaba</span>
          </div>
          <h1 className="font-serif font-black text-3xl md:text-5xl tracking-tighter mb-3">
            Koyi Yadda Ake Zaba
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Cikakken jagora ga ɗan ƙasa mai son yin zabe — daga rajista har zuwa jefa ƙuri'a.
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 space-y-12">

        {/* Key Dates */}
        <section>
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <FaClock className="text-[#0f3460]" /> Muhimman Lokuta
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ranar Rajista</div>
              <div className="text-xl font-black text-red-600">
                {new Date(VOTER_INFO.registrationDeadline).toLocaleDateString('ha-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <p className="text-xs text-gray-500 mt-2">Ranar ƙarshe don yin rajista ko canza cibiyar zaba</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ranar Zabe</div>
              <div className="text-xl font-black text-[#0f3460]">
                {new Date(VOTER_INFO.pollingDay).toLocaleDateString('ha-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <p className="text-xs text-gray-500 mt-2">Lokacin zaba: {VOTER_INFO.pollingHours}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Jimlar Masu Rajista</div>
              <div className="text-xl font-black">{(ELECTION_INFO.totalRegisteredVoters / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-gray-500 mt-2">Cibiyoyin zaba: {ELECTION_INFO.totalPollingUnits.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* How to Register */}
        <section className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <FaIdCard className="text-[#0f3460]" /> Yadda Ake Yin Rajista
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Je Ofishin INEC', desc: 'Je ofishin INEC na ƙaramar hukumar ka tare da takardar shaida.' },
              { step: '2', title: 'Cika Fom', desc: 'Cika fom din rajistar ɗan zaba da duk bayanin da ake buƙata.' },
              { step: '3', title: 'Hotuna da Fingerprint', desc: 'Ana ɗaukar hoton ka da fingerprints na hannun ka biyu.' },
              { step: '4', title: 'Karɓi Katin Zaba', desc: 'Za a ba ka Permanent Voter Card (PVC) bayan kwanaki 30-90.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#0f3460] text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to Bring */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <FaListCheck className="text-green-700" /> Abubuwan Da Ake Bukata A Ranar Zabe
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VOTER_INFO.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <FaCircleCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{req}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How to Vote */}
        <section className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <FaCheckToSlot className="text-[#0f3460]" /> Matakan Jefa Ƙuri'a
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VOTER_INFO.howToVote.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0f3460] text-white flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Warnings */}
        <section className="bg-amber-50 rounded-xl p-8 border border-amber-200">
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <FaExclamationTriangle className="text-amber-600" /> Gargadi — Abubuwan Da Kada A Yi
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Kada ka sayi ko ka sayar da ƙuri\'ar ka — laifi ne',
              'KADA ka ɗauki hoton ƙuri\'ar ka a cikin ɗakin zaba',
              'KADA ka karɓi kuɗi ko kayayyaki don zaba',
              'KADA ka bar katin zabar ka ga wani',
              'KADA ka yi zaba fiye da sau ɗaya',
              'KADA ka ɗauki makami ko wani abu mai haɗari zuwa cibiyar zaba',
            ].map((warning, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <FaTriangleExclamation className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{warning}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Know Your Rights */}
        <section className="bg-[#0f3460] text-white rounded-xl p-8">
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <FaShieldHalved className="text-[#c59d5f]" /> 'Yancin Ka A Matsayin ɗan Zaba
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "'Yancin Sirri", desc: "Zaben ka sirri ne — babu wanda zai iya tilasta maka zaban wani." },
              { title: "'Yancin Samun Bayanai", desc: "Kana da 'yancin sanin manufofin 'yan takara da tsarin zabe." },
              { title: "'Yancin Korar Suka", desc: "Idan aka hana ka zaba, kana da 'yancin korar hukuma ga INEC." },
              { title: "'Yancin Tsaro", desc: "Kana da 'yancin zaba cikin tsaro ba tare da tsoro ba." },
            ].map((right, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-5 backdrop-blur">
                <h3 className="font-bold text-[#c59d5f] mb-2">{right.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{right.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <FaPhone className="text-[#0f3460]" /> Lambobin Gaggawa
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {VOTER_INFO.emergencyContacts.map((contact) => (
              <div key={contact.name} className="bg-gray-50 rounded-lg p-5 text-center">
                <div className="text-2xl font-black text-[#0f3460] mb-1">{contact.phone}</div>
                <div className="text-sm font-bold text-gray-600">{contact.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Hub */}
        <div className="text-center pt-4">
          <Link
            to="/zabe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f3460] text-white font-bold rounded-lg hover:bg-[#1a454c] transition-colors"
          >
            Komawa Babban Shafin Zabe
          </Link>
        </div>

      </main>

      <GuardianFooter />
    </div>
  );
}
