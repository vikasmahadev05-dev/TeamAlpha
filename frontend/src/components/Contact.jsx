import { motion } from 'framer-motion';
import { Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import { useLandingPage } from '../context/LandingPageContext';
import SectionColorPicker from './SectionColorPicker';

const Contact = () => {
    const { config, isEditMode, updateSection } = useLandingPage();
    const contactData = config?.contact || {};

    const title = contactData.title !== undefined ? contactData.title : "Get In Touch";
    const subtitle = contactData.subtitle !== undefined ? contactData.subtitle : "Reach Out To Us";
    
    const phone = contactData.phone !== undefined ? contactData.phone : "+91 91106 03953";
    const phoneLink = contactData.phoneLink !== undefined ? contactData.phoneLink : "tel:+919110603953";
    
    const email = contactData.email !== undefined ? contactData.email : "Teamalphacrews@gmail.com";
    const emailLink = contactData.emailLink !== undefined ? contactData.emailLink : "mailto:Teamalphacrews@gmail.com";
    
    const whatsapp = contactData.whatsapp !== undefined ? contactData.whatsapp : "Message Us";
    const whatsappLink = contactData.whatsappLink !== undefined ? contactData.whatsappLink : "https://wa.me/919110603953";
    
    const instagram = contactData.instagram !== undefined ? contactData.instagram : "@teamalpha_crew";
    const instagramLink = contactData.instagramLink !== undefined ? contactData.instagramLink : "https://instagram.com/teamalpha_crew";

    const bgColor = contactData.bgColor || '#ffffff';

    return (
        <section className="py-16 border-t border-gray-100 relative" style={{ backgroundColor: bgColor }}>
            {isEditMode && (
                <SectionColorPicker 
                    value={bgColor} 
                    onChange={(color) => updateSection('contact', { bgColor: color })} 
                />
            )}
            <div className="max-w-7xl mx-auto px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 flex flex-col gap-2 items-center"
                >
                    {isEditMode ? (
                        <>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => updateSection('contact', { title: e.target.value })}
                                className="text-3xl md:text-4xl font-serif mb-2 text-[#1C1C1C] text-center border-b-2 border-dashed border-gray-400 focus:outline-none w-full max-w-sm"
                            />
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => updateSection('contact', { subtitle: e.target.value })}
                                className="text-gray-600 font-light tracking-widest uppercase text-xs text-center border-b-2 border-dashed border-gray-400 focus:outline-none w-full max-w-sm"
                            />
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl md:text-4xl font-serif mb-4">{title}</h2>
                            <p className="text-gray-600 font-light tracking-widest uppercase text-xs">{subtitle}</p>
                        </>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Phone */}
                    <div className="group flex flex-col items-center bg-[#F2EFEA] p-6 rounded-2xl transition-all duration-500 relative">
                        <Phone className="w-8 h-8 mb-6 text-gray-700" strokeWidth={1.5} />
                        <h3 className="font-serif text-xl mb-2 text-black">Phone</h3>
                        {isEditMode ? (
                            <>
                                <input type="text" value={phone} onChange={(e) => updateSection('contact', { phone: e.target.value })} className="text-sm text-center border-b border-gray-400 w-full mb-2 bg-transparent" />
                                <input type="text" value={phoneLink} onChange={(e) => updateSection('contact', { phoneLink: e.target.value })} className="text-[10px] text-center border-b border-gray-400 w-full bg-transparent text-gray-500" placeholder="Link (tel:...)" />
                            </>
                        ) : (
                            <a href={phoneLink} className="text-sm tracking-wider font-light text-gray-500 hover:text-black">{phone}</a>
                        )}
                    </div>

                    {/* Email */}
                    <div className="group flex flex-col items-center bg-[#F2EFEA] p-6 rounded-2xl transition-all duration-500 relative">
                        <Mail className="w-8 h-8 mb-6 text-gray-700" strokeWidth={1.5} />
                        <h3 className="font-serif text-xl mb-2 text-black">Email</h3>
                        {isEditMode ? (
                            <>
                                <input type="text" value={email} onChange={(e) => updateSection('contact', { email: e.target.value })} className="text-sm text-center border-b border-gray-400 w-full mb-2 bg-transparent" />
                                <input type="text" value={emailLink} onChange={(e) => updateSection('contact', { emailLink: e.target.value })} className="text-[10px] text-center border-b border-gray-400 w-full bg-transparent text-gray-500" placeholder="Link (mailto:...)" />
                            </>
                        ) : (
                            <a href={emailLink} className="text-xs tracking-wider font-light text-gray-500 hover:text-black">Drop us a line</a>
                        )}
                    </div>

                    {/* WhatsApp */}
                    <div className="group flex flex-col items-center bg-[#F2EFEA] p-6 rounded-2xl transition-all duration-500 relative">
                        <MessageCircle className="w-8 h-8 mb-6 text-gray-700" strokeWidth={1.5} />
                        <h3 className="font-serif text-xl mb-2 text-black">WhatsApp</h3>
                        {isEditMode ? (
                            <>
                                <input type="text" value={whatsapp} onChange={(e) => updateSection('contact', { whatsapp: e.target.value })} className="text-sm text-center border-b border-gray-400 w-full mb-2 bg-transparent" />
                                <input type="text" value={whatsappLink} onChange={(e) => updateSection('contact', { whatsappLink: e.target.value })} className="text-[10px] text-center border-b border-gray-400 w-full bg-transparent text-gray-500" placeholder="Link" />
                            </>
                        ) : (
                            <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-sm tracking-wider font-light text-gray-500 hover:text-black">{whatsapp}</a>
                        )}
                    </div>

                    {/* Instagram */}
                    <div className="group flex flex-col items-center bg-[#F2EFEA] p-6 rounded-2xl transition-all duration-500 relative">
                        <Instagram className="w-8 h-8 mb-6 text-gray-700" strokeWidth={1.5} />
                        <h3 className="font-serif text-xl mb-2 text-black">Instagram</h3>
                        {isEditMode ? (
                            <>
                                <input type="text" value={instagram} onChange={(e) => updateSection('contact', { instagram: e.target.value })} className="text-sm text-center border-b border-gray-400 w-full mb-2 bg-transparent" />
                                <input type="text" value={instagramLink} onChange={(e) => updateSection('contact', { instagramLink: e.target.value })} className="text-[10px] text-center border-b border-gray-400 w-full bg-transparent text-gray-500" placeholder="Link" />
                            </>
                        ) : (
                            <a href={instagramLink} target="_blank" rel="noreferrer" className="text-sm tracking-wider font-light text-gray-500 hover:text-black">{instagram}</a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
