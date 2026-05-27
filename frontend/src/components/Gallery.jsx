import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Grid, LayoutTemplate, Loader2, ImageOff } from 'lucide-react';
import { useLandingPage } from '../context/LandingPageContext';
import SectionColorPicker from './SectionColorPicker';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const Gallery = () => {
    const { config, isEditMode, updateSection } = useLandingPage();
    const galleryData = config?.gallery || {};

    const [portfolioGalleries, setPortfolioGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [galleryEvents, setGalleryEvents] = useState([]);
    const [activeEventId, setActiveEventId] = useState(null);
    const [eventFiles, setEventFiles] = useState([]);
    
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);

    const title = galleryData.title !== undefined ? galleryData.title : "Our Portfolio";
    const subtitle = galleryData.subtitle !== undefined ? galleryData.subtitle : "Capturing moments that last forever. Every detail, every emotion, preserved beautifully.";
    const bgColor = galleryData.bgColor || '#ffffff';

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/drive-gallery/portfolio/public`);
            setPortfolioGalleries(res.data);
        } catch (error) {
            console.error("Failed to fetch portfolio galleries", error);
        } finally {
            setLoading(false);
        }
    };

    const openGallery = async (gallery) => {
        setSelectedGallery(gallery);
        setModalLoading(true);
        setGalleryEvents([]);
        setEventFiles([]);
        setActiveEventId('all');
        
        try {
            const res = await axios.get(`${API_BASE_URL}/api/drive-gallery/portfolio/public/${gallery._id}/events`);
            setGalleryEvents(res.data);
            
            // Fetch ALL photos recursively from the root folder
            const filesRes = await axios.get(`${API_BASE_URL}/api/drive-gallery/portfolio/public/gallery-files/${gallery._id}`);
            setEventFiles(filesRes.data);
            
            setModalLoading(false);
        } catch (error) {
            console.error("Failed to fetch events", error);
            setModalLoading(false);
        }
    };

    const fetchEventFiles = async (eventId) => {
        try {
            setModalLoading(true);
            let res;
            if (eventId === 'all') {
                res = await axios.get(`${API_BASE_URL}/api/drive-gallery/portfolio/public/gallery-files/${selectedGallery._id}`);
            } else {
                res = await axios.get(`${API_BASE_URL}/api/drive-gallery/portfolio/public/files/${eventId}`);
            }
            setEventFiles(res.data);
        } catch (error) {
            console.error("Failed to fetch files", error);
        } finally {
            setModalLoading(false);
        }
    };

    const handleEventTabClick = (eventId) => {
        if (eventId !== activeEventId) {
            setActiveEventId(eventId);
            fetchEventFiles(eventId);
        }
    };

    const closeGallery = () => {
        setSelectedGallery(null);
        setGalleryEvents([]);
        setEventFiles([]);
    };

    useEffect(() => {
        if (selectedGallery) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedGallery]);

    return (
        <section id="gallery" className="py-24 px-6 relative min-h-screen" style={{ backgroundColor: bgColor }}>
            {isEditMode && (
                <SectionColorPicker 
                    value={bgColor} 
                    onChange={(color) => updateSection('gallery', { bgColor: color })} 
                />
            )}
            <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-16 flex flex-col gap-2 items-center">
                    {isEditMode ? (
                        <>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => updateSection('gallery', { title: e.target.value })}
                                className="text-4xl md:text-5xl font-serif mb-4 text-gray-900 text-center border-b-2 border-dashed border-gray-400 focus:outline-none w-full max-w-2xl bg-transparent"
                            />
                            <textarea
                                value={subtitle}
                                onChange={(e) => updateSection('gallery', { subtitle: e.target.value })}
                                className="text-gray-600 font-light mb-10 max-w-2xl mx-auto text-center border-2 border-dashed border-gray-400 focus:outline-none w-full bg-transparent p-2"
                                rows={2}
                            />
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">{title}</h2>
                            <p className="text-gray-600 font-light mb-10 max-w-2xl mx-auto">{subtitle}</p>
                        </>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500">
                        <Loader2 size={48} className="animate-spin mb-4 text-black" />
                        <p className="text-lg font-light tracking-wide animate-pulse">Curating your memories...</p>
                    </div>
                ) : portfolioGalleries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500">
                        <ImageOff size={48} className="mb-4 text-gray-300" />
                        <p className="text-lg font-light tracking-wide">No portfolio collections available yet.</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {portfolioGalleries.map((gallery, idx) => (
                                <motion.div
                                    layout
                                    key={gallery._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl bg-gray-50 border border-gray-100 transition-all duration-500 cursor-pointer ${isEditMode ? 'opacity-90' : 'hover:-translate-y-2'}`}
                                    onClick={() => openGallery(gallery)}
                                >
                                    {gallery.thumbnail ? (
                                        <div className="w-full h-[400px] overflow-hidden">
                                            <img
                                                src={gallery.thumbnail}
                                                alt={gallery.name}
                                                loading="lazy"
                                                className={`w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110`}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-[400px] flex flex-col items-center justify-center text-gray-400">
                                            <ImageOff size={48} className="mb-4 opacity-50 block mx-auto" />
                                            <span className="text-sm">No Cover Found</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-10">
                                        <h3 className="text-white font-serif text-3xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{gallery.name}</h3>
                                        <p className="text-white/80 font-sans text-sm tracking-widest uppercase border-b border-white/40 pb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">View Collection</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Album Modal */}
                <AnimatePresence>
                    {selectedGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl overflow-y-auto"
                    >
                        <div className="min-h-screen px-4 sm:px-6 py-12">
                            {/* Header */}
                            <div className="fixed top-0 left-0 right-0 p-4 sm:p-6 flex flex-wrap justify-between items-center bg-gradient-to-b from-white/95 via-white/80 to-transparent z-50">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-gray-900 font-serif text-2xl sm:text-3xl">{selectedGallery.name}</h3>
                                    <p className="text-gray-500 text-xs sm:text-sm tracking-widest font-mono mt-1 uppercase">
                                        Portfolio Collection
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-end">
                                    <div className="hidden sm:flex bg-gray-100 rounded-full p-1 border border-gray-200">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white text-black shadow-sm scale-105' : 'text-gray-500 hover:bg-gray-200'}`}
                                            title="Regular Grid Layout"
                                        >
                                            <Grid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('masonry')}
                                            className={`p-2 rounded-full transition-all ${viewMode === 'masonry' ? 'bg-white text-black shadow-sm scale-105' : 'text-gray-500 hover:bg-gray-200'}`}
                                            title="Masonry Layout"
                                        >
                                            <LayoutTemplate size={18} />
                                        </button>
                                    </div>

                                    <button onClick={closeGallery} className="text-gray-500 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-full transition-all hover:rotate-90">
                                        <X size={28} />
                                    </button>
                                </div>
                            </div>

                            {/* Events Tabs */}
                            {galleryEvents.length > 0 && (
                                <div className="mt-28 sm:mt-32 mb-10 sm:mb-12 flex justify-center">
                                    <div className="inline-flex flex-wrap justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-100/50 backdrop-blur-2xl border border-gray-200 rounded-[30px] shadow-sm mx-4">
                                        <button
                                            onClick={() => handleEventTabClick('all')}
                                            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[13px] tracking-wider uppercase font-semibold transition-all duration-500 relative ${
                                                activeEventId === 'all' 
                                                ? 'text-white bg-black shadow-md scale-100' 
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 scale-95 hover:scale-100'
                                            }`}
                                        >
                                            All Photos
                                        </button>
                                        {galleryEvents.map(event => (
                                            <button
                                                key={event._id}
                                                onClick={() => handleEventTabClick(event._id)}
                                                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[13px] tracking-wider uppercase font-semibold transition-all duration-500 relative ${
                                                    activeEventId === event._id 
                                                    ? 'text-white bg-black shadow-md scale-100' 
                                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 scale-95 hover:scale-100'
                                                }`}
                                            >
                                                {event.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images Grid */}
                            {modalLoading ? (
                                <div className="flex justify-center items-center py-32">
                                    <Loader2 size={48} className="animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <div className={`max-w-7xl mx-auto pb-12 ${viewMode === 'grid'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                    : 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
                                    }`}>
                                    {eventFiles.length > 0 ? (
                                        eventFiles.map((file, idx) => {
                                            const fileType = file.mimeType.split('/')[0];
                                            if (fileType !== 'image') return null;
                                            
                                            const proxyUrl = `${API_BASE_URL}/api/drive-gallery/proxy/${file.id}?thumbnail=true`;
                                            
                                            return (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: (idx % 10) * 0.05, duration: 0.5 }}
                                                    className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                                                >
                                                    <img
                                                        src={proxyUrl}
                                                        alt={file.name}
                                                        loading="lazy"
                                                        className={`w-full bg-gray-100 ${viewMode === 'grid' ? 'aspect-square object-cover' : 'h-auto'} transition-transform duration-700 group-hover:scale-105`}
                                                    />
                                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
                                                </motion.div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-400">
                                            <ImageOff size={64} className="mb-6 opacity-30" />
                                            <p className="text-2xl font-serif text-gray-500">Awaiting Memories</p>
                                            <p className="text-sm tracking-widest uppercase mt-4 text-gray-400">This event has no media yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
