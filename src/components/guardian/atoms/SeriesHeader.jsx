import { FaLayerGroup } from 'react-icons/fa6';

const SeriesHeader = ({ title }) => {
  if (!title) return null;

  return (
    <div className="mb-6 inline-flex items-center gap-2 group cursor-pointer">
      <span className="w-8 h-8 rounded-lg bg-[#0f3036] flex items-center justify-center text-[#c59d5f] group-hover:bg-[#c59d5f] group-hover:text-[#0f3036] transition-all">
        <FaLayerGroup className="text-xs" />
      </span>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none mb-1">Daga Shirin / From the Series</span>
        <span className="text-sm font-bold text-[#0f3036] underline decoration-[#c59d5f]/30 underline-offset-4 group-hover:decoration-[#c59d5f] transition-all italic">
          {title}
        </span>
      </div>
    </div>
  );
};

export default SeriesHeader;
