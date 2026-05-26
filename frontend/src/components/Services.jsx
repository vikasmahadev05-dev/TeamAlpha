

import { motion } from 'framer-motion';
import { useLandingPage } from '../context/LandingPageContext';
import ImageUploadInput from './ImageUploadInput';
import SectionColorPicker from './SectionColorPicker';

const Services = () => {
    const { config, isEditMode, updateSection } = useLandingPage();
    const servicesData = config?.services || {};

    const defaultServices = [
        {
            title: "Wedding",
            desc: "Weddings are all about traditions, colors, laughter, happy tears, families and friends coming together to celebrate the union.",
            img: "/assets/services/wedding.jpg"
        },
        {
            title: "Pre Wedding",
            desc: "Step into a world of timeless elegance. We create dreamy, cinematic frames that blend natural light and genuine emotions.",
            img: "/assets/services/pre_wedding.jpg"
        },
        {
            title: "Haldi Ceremony",
            desc: "Golden hues, pure joy, and heartfelt moments. From the playful splashes of turmeric to the candid laughter of loved ones.",
            img: "/assets/services/haldi.jpg"
        },
        {
            title: "Engagement",
            desc: "An engagement is more than a celebration - it's a promise. Highlighting every emotion, every detail, and every memory.",
            img: "/assets/services/engagement.jpg"
        }
    ];

    const title = servicesData.title !== undefined ? servicesData.title : "Our Services";
    const subtitle = servicesData.subtitle !== undefined ? servicesData.subtitle : "Thoughtfully crafted visual storytelling for weddings, celebrations, and legacy moments.";
    const servicesList = servicesData.list && servicesData.list.length > 0 ? servicesData.list : defaultServices;
    const bgColor = servicesData.bgColor || '#ffffff';

    const vivahasyaTitle = servicesData.vivahasyaTitle !== undefined ? servicesData.vivahasyaTitle : "In-House Services: Vivahasya";
    const vivahasyaSubtitle = servicesData.vivahasyaSubtitle !== undefined ? servicesData.vivahasyaSubtitle : "Wedding Planner & Decor";
    const vivahasyaText = servicesData.vivahasyaText !== undefined ? servicesData.vivahasyaText : "Transforming your dream wedding into reality. From concept to execution, we curate every detail with precision and creativity.";

    const handleServiceUpdate = (index, field, value) => {
        const newList = [...servicesList];
        newList[index] = { ...newList[index], [field]: value };
        updateSection('services', { list: newList });
    };

    return (
        <section id="services" className="py-24 relative" style={{ backgroundColor: bgColor }}>
            {isEditMode && (
                <SectionColorPicker 
                    value={bgColor} 
                    onChange={(color) => updateSection('services', { bgColor: color })} 
                />
            )}
            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-20 flex flex-col gap-2 items-center">
                    {isEditMode ? (
                        <>
                            <textarea
                                value={title}
                                onChange={(e) => updateSection('services', { title: e.target.value })}
                                className="text-4xl md:text-5xl font-serif mb-2 text-[#1C1C1C] text-center border-b-2 border-dashed border-gray-400 focus:outline-none w-full max-w-2xl resize-none"
                                rows={2}
                            />
                            <textarea
                                value={subtitle}
                                onChange={(e) => updateSection('services', { subtitle: e.target.value })}
                                className="text-gray-600 w-full max-w-2xl mx-auto font-light text-center border-2 border-dashed border-gray-400 p-2 focus:outline-none"
                            />
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-[#1C1C1C]">{title}</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto font-light">{subtitle}</p>
                        </>
                    )}
                </div>

                <div className="space-y-32">
                    {servicesList.map((service, index) => (
                        <div key={index} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="w-full md:w-1/2 relative"
                            >
                                {isEditMode && (
                                    <div className="absolute top-2 left-2 z-10 bg-white/90 p-2 rounded shadow flex flex-col gap-1 w-[90%]">
                                        <span className="text-[10px] font-bold text-gray-800 text-left">Service Image:</span>
                                        <ImageUploadInput 
                                            value={service.img} 
                                            onChange={(url) => handleServiceUpdate(index, 'img', url)}
                                        />
                                    </div>
                                )}
                                <img src={service.img} alt={service.title} className="w-full h-[500px] object-cover shadow-xl" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="w-full md:w-1/2 text-center md:text-left flex flex-col gap-4"
                            >
                                {isEditMode ? (
                                    <>
                                        <textarea
                                            value={service.title}
                                            onChange={(e) => handleServiceUpdate(index, 'title', e.target.value)}
                                            className="text-3xl font-serif border-b border-dashed border-gray-400 focus:outline-none w-full resize-none"
                                            rows={2}
                                        />
                                        <textarea
                                            value={service.desc}
                                            onChange={(e) => handleServiceUpdate(index, 'desc', e.target.value)}
                                            className="text-gray-700 leading-relaxed font-light border-2 border-dashed border-gray-400 p-2 focus:outline-none w-full"
                                            rows={3}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-3xl font-serif mb-6">{service.title}</h3>
                                        <p className="text-gray-700 leading-relaxed font-light">{service.desc}</p>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Vivahasya */}
                <div className="mt-32 text-center max-w-3xl mx-auto bg-[#F7F5F2] p-12 rounded-sm shadow-sm flex flex-col items-center gap-3">
                    {isEditMode ? (
                        <>
                            <textarea
                                value={vivahasyaTitle}
                                onChange={(e) => updateSection('services', { vivahasyaTitle: e.target.value })}
                                className="text-3xl font-serif text-center bg-transparent border-b border-dashed border-gray-400 focus:outline-none w-full resize-none"
                                rows={2}
                            />
                            <textarea
                                value={vivahasyaSubtitle}
                                onChange={(e) => updateSection('services', { vivahasyaSubtitle: e.target.value })}
                                className="text-sm font-sans uppercase tracking-widest text-gray-500 text-center bg-transparent border-b border-dashed border-gray-400 focus:outline-none w-full resize-none"
                                rows={2}
                            />
                            <textarea
                                value={vivahasyaText}
                                onChange={(e) => updateSection('services', { vivahasyaText: e.target.value })}
                                className="text-gray-700 leading-relaxed font-light text-center bg-transparent border-2 border-dashed border-gray-400 p-2 focus:outline-none w-full"
                                rows={3}
                            />
                        </>
                    ) : (
                        <>
                            <h3 className="text-3xl font-serif mb-4">{vivahasyaTitle}</h3>
                            <p className="text-sm font-sans uppercase tracking-widest text-gray-500 mb-6">{vivahasyaSubtitle}</p>
                            <p className="text-gray-700 leading-relaxed font-light mb-8">
                                {vivahasyaText}
                            </p>
                        </>
                    )}
                    <div className="flex gap-4">
                        <a href="https://www.vivahasya.in" target="_blank" rel="noopener noreferrer" className="border-b border-black pb-1 hover:opacity-60 transition">
                            Visit Vivahasya
                        </a>
                        <a href="https://www.instagram.com/vivahasya.celebrations?igsh=MTZyeWY4bndrYW5nNQ==q" target="_blank" rel="noopener noreferrer" className="border-b border-black pb-1 hover:opacity-60 transition">
                            Visit Instagram
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Services;
