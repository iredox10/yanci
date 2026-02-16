import { FaStar } from 'react-icons/fa6';

const ReviewAtom = ({ title, rating, maxRating = 5 }) => {
    const stars = [];
    const validRating = Math.min(Math.max(0, Number(rating) || 0), maxRating);

    for (let i = 1; i <= maxRating; i++) {
        stars.push(
            <FaStar
                key={i}
                className={`w-5 h-5 ${i <= validRating ? 'text-[#c59d5f]' : 'text-gray-200'}`}
            />
        );
    }

    return (
        <div className="my-10 p-6 bg-[#fbf8f3] border-t-4 border-[#c59d5f] shadow-sm rounded-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-serif font-black text-2xl text-[#0f3036] leading-tight">
                    {title || "Review"}
                </h3>
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100 w-fit">
                    {stars}
                    <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                        {validRating}/{maxRating}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReviewAtom;
