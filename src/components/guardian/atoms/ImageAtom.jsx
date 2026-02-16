import { FaCamera } from 'react-icons/fa6';

const ImageAtom = ({ src, caption, credit }) => {
    if (!src) return null;

    return (
        <figure className="my-10 group">
            <div className="w-full overflow-hidden rounded-sm bg-gray-100 shadow-sm border border-gray-100">
                <img
                    src={src}
                    alt={caption || "Article Image"}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                />
            </div>
            {(caption || credit) && (
                <figcaption className="mt-3 flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-gray-500 border-l-2 border-[#c59d5f] pl-3 py-1">
                    {caption && (
                        <span className="font-medium leading-relaxed max-w-2xl">
                            {caption}
                        </span>
                    )}
                    {credit && (
                        <span className="shrink-0 flex items-center gap-1.5 uppercase tracking-wider font-bold text-[10px] text-gray-400">
                            <FaCamera className="w-3 h-3" />
                            {credit}
                        </span>
                    )}
                </figcaption>
            )}
        </figure>
    );
};

export default ImageAtom;
