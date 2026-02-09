import { FaCircleInfo } from 'react-icons/fa6';

const HighlightAtom = ({ children, pillar = 'news' }) => {
  const pillarColors = {
    news: 'border-[#c70000] bg-red-50 text-red-900',
    sport: 'border-[#005689] bg-blue-50 text-blue-900',
    opinion: 'border-[#e05e00] bg-orange-50 text-orange-900',
    culture: 'border-[#a1845c] bg-amber-50 text-amber-900',
    lifestyle: 'border-[#7d0068] bg-pink-50 text-pink-900'
  };

  const activeColor = pillarColors[pillar] || pillarColors.news;

  return (
    <div className={`my-10 p-6 md:p-8 border-l-4 rounded-r-2xl shadow-sm ${activeColor}`}>
      <div className="flex items-center gap-3 mb-4 opacity-70">
        <FaCircleInfo className="text-xl" />
        <span className="text-xs font-bold uppercase tracking-widest">Muhimmin Abin Lura / Key Fact</span>
      </div>
      <div className="font-serif text-lg leading-relaxed italic">
        {children}
      </div>
    </div>
  );
};

export default HighlightAtom;
