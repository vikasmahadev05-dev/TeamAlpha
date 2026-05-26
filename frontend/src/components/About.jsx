

import { motion } from 'framer-motion';
import yogeshImg from '../assets/yogesh.jpg';
import sachithaImg from '../assets/sachitha.jpg';
import { useLandingPage } from '../context/LandingPageContext';
import ImageUploadInput from './ImageUploadInput';
import SectionColorPicker from './SectionColorPicker';

const About = () => {
    const { config, isEditMode, updateSection } = useLandingPage();
    const aboutData = config?.about || {};

    const defaultTitle = "Welcome To Team Alpha";
    const defaultText = "We are a passionate team of professional wedding photographers and cinematographers, dedicated to creating timeless memories that allow you to relive your special day for decades to come. Our philosophy is simple - to capture the true essence of every wedding, preserving genuine emotions and weaving them into beautiful, meaningful visual stories.";
    const defaultTeam = [
        { name: "Yogesh Acharya", role: "Founder and DOP", img: yogeshImg },
        { name: "Sachitha Kharvi", role: "CEO", img: sachithaImg }
    ];

    const title = aboutData.title !== undefined ? aboutData.title : defaultTitle;
    const text = aboutData.text !== undefined ? aboutData.text : defaultText;
    const team = aboutData.team && aboutData.team.length === 2 ? aboutData.team : defaultTeam;
    const bgColor = aboutData.bgColor || '#ffffff';

    const handleTeamUpdate = (index, field, value) => {
        const newTeam = [...team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        updateSection('about', { team: newTeam });
    };

    return (
        <section id="about" className="py-24 px-6 relative" style={{ backgroundColor: bgColor }}>
            {isEditMode && (
                <SectionColorPicker 
                    value={bgColor} 
                    onChange={(color) => updateSection('about', { bgColor: color })} 
                />
            )}
            <div className="max-w-7xl mx-auto relative">
                {/* Intro */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-4 items-center"
                >
                    {isEditMode ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => updateSection('about', { title: e.target.value })}
                            className="text-4xl md:text-5xl font-serif mb-4 text-[#1C1C1C] text-center border-b-2 border-dashed border-gray-400 focus:outline-none w-full"
                        />
                    ) : (
                        <h2 className="text-4xl md:text-5xl font-serif mb-8 text-[#1C1C1C]">{title}</h2>
                    )}

                    {isEditMode ? (
                        <textarea
                            value={text}
                            onChange={(e) => updateSection('about', { text: e.target.value })}
                            className="text-lg text-gray-700 leading-relaxed font-light text-center border-2 border-dashed border-gray-400 p-2 focus:outline-none w-full"
                            rows={4}
                        />
                    ) : (
                        <p className="text-lg text-gray-700 leading-relaxed font-light">
                            {text}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Team */}
            <div className="grid md:grid-cols-2 gap-16 justify-center">
                {team.map((member, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.2 }}
                        className="text-center group relative"
                    >
                        <div className="overflow-hidden mb-6 relative">
                            {isEditMode && (
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 p-2 rounded shadow flex flex-col gap-1 w-[90%]">
                                    <span className="text-[10px] font-bold text-gray-800 text-left">Team Member Image:</span>
                                    <ImageUploadInput 
                                        value={member.img} 
                                        onChange={(url) => handleTeamUpdate(idx, 'img', url)}
                                    />
                                </div>
                            )}
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-[500px] object-cover transition duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                            />
                        </div>
                        {isEditMode ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => handleTeamUpdate(idx, 'name', e.target.value)}
                                    className="text-2xl font-serif text-center border-b border-dashed border-gray-400 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    value={member.role}
                                    onChange={(e) => handleTeamUpdate(idx, 'role', e.target.value)}
                                    className="text-sm text-gray-500 uppercase tracking-widest text-center border-b border-dashed border-gray-400 focus:outline-none"
                                />
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-serif mb-1">{member.name}</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest">{member.role}</p>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
            </div>
        </section>
    );
};

export default About;
