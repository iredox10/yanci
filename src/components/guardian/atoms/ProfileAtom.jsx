import { FaUser } from 'react-icons/fa6';

const ProfileAtom = ({ name, role, image, description }) => {
    return (
        <div className="my-10 flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-sm shadow-sm group hover:shadow-md transition-shadow">
            <div className="shrink-0">
                {image ? (
                    <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full border-4 border-[#fbf8f3] shadow-inner">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#fbf8f3] flex items-center justify-center text-gray-300 border-4 border-white shadow-inner">
                        <FaUser className="w-10 h-10" />
                    </div>
                )}
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex flex-col">
                    <h3 className="font-serif font-bold text-xl text-[#0f3036] leading-tight group-hover:text-[#c59d5f] transition-colors">
                        {name || "Suna"}
                    </h3>
                    {role && (
                        <span className="text-xs font-bold text-[#c59d5f] uppercase tracking-widest">
                            {role}
                        </span>
                    )}
                </div>

                {description && (
                    <p className="text-gray-600 font-serif leading-relaxed text-sm border-t border-gray-100 pt-3 mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileAtom;
