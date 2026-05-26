import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLandingPage } from '../context/LandingPageContext';
import SectionColorPicker from './SectionColorPicker';

const Testimonials = () => {
    const { config, isEditMode, updateSection } = useLandingPage();
    const testData = config?.testimonials || {};

    const defaultReviews = [
        {
            id: 1,
            author: "Abhishek Khr",
            rating: 5,
            text: "We hired Team alpha photography (Yogesh) for our wedding, and it was one of the best decisions we made! From pre-wedding shoots to the final album, everything was handled with perfection.",
            reply: "Thank you so much Abhishek! It was a pleasure capturing your special moments.",
            date: "Recent"
        },
        {
            id: 2,
            author: "SOWMYASHREE K N",
            rating: 5,
            text: "Best work ever, standard is amazing, really worth for the money. If anyone looking for photography team then just go with Team Alpha without doubt.",
            reply: "We're thrilled to hear that! Quality is our top priority.",
            date: "Recent"
        },
        {
            id: 3,
            author: "keshava k",
            rating: 5,
            text: "Excellent service from Team ALPHA, highly happy with the cinematic video and also the photo quality.",
            reply: "Happy to serve! Cinematic storytelling is what we love.",
            date: "Recent"
        }
    ];

    const title = testData.title !== undefined ? testData.title : "Client Stories";
    const subtitle = testData.subtitle !== undefined ? testData.subtitle : "Testimonials from Google Reviews";
    const reviews = testData.list && testData.list.length > 0 ? testData.list : defaultReviews;
    const bgColor = testData.bgColor || '#F2EFEA';

    const handleReviewUpdate = (index, field, value) => {
        const newList = [...reviews];
        newList[index] = { ...newList[index], [field]: value };
        updateSection('testimonials', { list: newList });
    };

    // Duplicate reviews for infinite scroll
    const duplicatedReviews = [...reviews, ...reviews];

    return (
        <section className="py-24 overflow-hidden relative" style={{ backgroundColor: bgColor }}>
            {isEditMode && (
                <SectionColorPicker 
                    value={bgColor} 
                    onChange={(color) => updateSection('testimonials', { bgColor: color })} 
                />
            )}
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 flex flex-col gap-2 items-center"
                >
                    {isEditMode ? (
                        <>
                            <textarea
                                value={title}
                                onChange={(e) => updateSection('testimonials', { title: e.target.value })}
                                className="text-4xl md:text-5xl font-serif mb-2 text-[#1C1C1C] text-center border-b-2 border-dashed border-gray-400 focus:outline-none w-full max-w-2xl bg-transparent resize-none"
                                rows={2}
                            />
                            <textarea
                                value={subtitle}
                                onChange={(e) => updateSection('testimonials', { subtitle: e.target.value })}
                                className="text-gray-600 font-light tracking-widest uppercase text-xs text-center border-b-2 border-dashed border-gray-400 focus:outline-none w-full max-w-sm bg-transparent resize-none"
                                rows={2}
                            />
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl md:text-5xl font-serif mb-4">{title}</h2>
                            <p className="text-gray-600 font-light tracking-widest uppercase text-xs">{subtitle}</p>
                        </>
                    )}
                </motion.div>

                <div className="relative">
                    <div className="flex overflow-hidden relative">
                        <motion.div
                            className="flex gap-8"
                            animate={{
                                x: [0, -1 * (reviews.length * 482)], // 450px width + 32px gap
                            }}
                            transition={{
                                duration: isEditMode ? 0 : 40,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                            whileHover={{ animationPlayState: 'paused' }}
                            style={{ width: "fit-content" }}
                        >
                            {duplicatedReviews.map((review, idx) => (
                                <div
                                    key={`${review.id || idx}-${idx}`}
                                    className="min-w-[350px] md:min-w-[450px] bg-white/60 backdrop-blur-sm p-10 rounded-2xl border border-white/40 shadow-xl relative group"
                                >
                                    <Quote className="absolute top-6 right-6 text-black/5 w-16 h-16 group-hover:text-black/10 transition-colors" />

                                    <div className="flex gap-1 mb-6">
                                        {[...Array(Number(review.rating) || 5)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-black text-black" />
                                        ))}
                                    </div>

                                    {isEditMode && idx < reviews.length ? (
                                        <div className="flex flex-col gap-3">
                                            <textarea
                                                value={review.text}
                                                onChange={(e) => handleReviewUpdate(idx, 'text', e.target.value)}
                                                className="text-gray-700 leading-relaxed italic mb-2 font-light text-sm border p-1 rounded"
                                                rows={4}
                                            />
                                            <input
                                                type="text"
                                                value={review.author}
                                                onChange={(e) => handleReviewUpdate(idx, 'author', e.target.value)}
                                                className="font-serif font-bold text-sm border p-1 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={review.reply}
                                                onChange={(e) => handleReviewUpdate(idx, 'reply', e.target.value)}
                                                className="text-xs text-gray-500 font-light italic border p-1 rounded"
                                                placeholder="Reply..."
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-gray-700 leading-relaxed italic mb-8 font-light text-lg">
                                                "{review.text}"
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-serif font-bold text-lg">{review.author}</h4>
                                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{review.date}</span>
                                                </div>
                                                <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter">Verified Review</div>
                                            </div>

                                            {review.reply && (
                                                <div className="mt-8 pt-8 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500 font-light italic">
                                                        <span className="font-semibold text-black not-italic block mb-1">Response from Team Alpha:</span>
                                                        {review.reply}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
