import { FaMapLocationDot } from 'react-icons/fa6';

const MapAtom = ({ url }) => {
  if (!url) return null;

  return (
    <div className="my-10 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <FaMapLocationDot className="text-blue-500" />
        Taswira / Map
      </div>
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
        <iframe
          src={url}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Article Map"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        ></iframe>
      </div>
      <p className="text-center text-[10px] text-gray-400 italic">
        Kuna iya sarrafa taswirar domin gani dalla-dalla.
      </p>
    </div>
  );
};

export default MapAtom;
