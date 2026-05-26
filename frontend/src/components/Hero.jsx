import { motion } from 'framer-motion';
import { useLandingPage } from '../context/LandingPageContext';
import ImageUploadInput from './ImageUploadInput';

const Hero = () => {
    const { config, isEditMode, updateSection } = useLandingPage();
    const heroData = config?.hero || {};

    const defaultTitle = "Timeless Moments, Captured Beautifully";
    const defaultSubtitle = "We weave stories out of fleeting moments, ensuring your memories last a lifetime.";
    const defaultImage = "/assets/banner.jpg";

    const title = heroData.title !== undefined ? heroData.title : defaultTitle;
    const subtitle = heroData.subtitle !== undefined ? heroData.subtitle : defaultSubtitle;
    const bannerImage = heroData.bannerImage !== undefined ? heroData.bannerImage : defaultImage;

    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={bannerImage}
                    alt="Wedding Couple"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                {isEditMode && (
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 bg-white/90 p-4 rounded shadow flex flex-col gap-2 w-[90%] max-w-lg">
                        <span className="text-xs font-bold text-gray-800">Hero Banner Background:</span>
                        <ImageUploadInput 
                            value={bannerImage} 
                            onChange={(url) => updateSection('hero', { bannerImage: url })} 
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20 flex flex-col gap-4 items-center">
                {isEditMode ? (
                    <>
                        <textarea
                            value={title}
                            onChange={(e) => updateSection('hero', { title: e.target.value })}
                            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-2 bg-black/30 border border-dashed border-gray-400 p-2 focus:outline-none w-full text-center resize-none"
                            rows={2}
                        />
                        <textarea
                            value={subtitle}
                            onChange={(e) => updateSection('hero', { subtitle: e.target.value })}
                            className="text-lg md:text-xl text-gray-200 mb-4 bg-black/30 border border-dashed border-gray-400 p-2 focus:outline-none w-full max-w-2xl text-center"
                            rows={3}
                        />
                    </>
                ) : (
                    <>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 drop-shadow-lg"
                        >
                            {title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md font-light"
                        >
                            {subtitle}
                        </motion.p>
                    </>
                )}

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3 bg-white text-black font-medium tracking-wide uppercase text-sm hover:bg-gray-100 transition-colors rounded-full shadow-lg"
                >
                    Book Your Session
                </motion.button>
            </div>
        </section>
    );
};

export default Hero;
