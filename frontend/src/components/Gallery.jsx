import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Grid, LayoutTemplate, Loader2, ImageOff, Trash2, Plus } from 'lucide-react';
import { useLandingPage } from '../context/LandingPageContext';
import ImageUploadInput from './ImageUploadInput';
import SectionColorPicker from './SectionColorPicker';

// Dynamic imports for all categories (Lazy loaded)
const localImages = {
    "Wedding": Object.values(import.meta.glob('../assets/wedding/*.{jpg,jpeg,png,webp}', { import: 'default', eager: true })),
    "Engagement": Object.values(import.meta.glob('../assets/engagement/*.{jpg,jpeg,png,webp}', { import: 'default', eager: true })),
    "Pre Wedding": Object.values(import.meta.glob('../assets/pre_wedding/*.{jpg,jpeg,png,webp}', { import: 'default', eager: true })),
    "Haldi": Object.values(import.meta.glob('../assets/haldi/*.{jpg,jpeg,png,webp}', { import: 'default', eager: true })),
    "Reception": Object.values(import.meta.glob('../assets/reception/*.{jpg,jpeg,png,webp}', { import: 'default', eager: true })),
    "Mehendi": Object.values(import.meta.glob('../assets/mehendi/*.{jpg,jpeg,png,webp}', { import: 'default', eager: true }))
};

// Cover images (Lazy loaded -> Eager)
const localCovers = import.meta.glob('../assets/covers/*.{jpg,jpeg,png,webp}', { import: 'default', eager: true });

// Fallback images if folders are empty
const defaultImages = {
    "Wedding": "/assets/services/wedding.jpg",
    "Engagement": "/assets/services/engagement.jpg",
    "Pre Wedding": "/assets/services/pre_wedding.jpg",
    "Haldi": "/assets/services/haldi.jpg",
    "Reception": "/assets/services/wedding.jpg",
    "Mehendi": "/assets/services/haldi.jpg"
};

const DEFAULT_CATEGORIES = [
    { id: "Wedding", label: "Twinkling Knots", tag: "wedding" },
    { id: "Engagement", label: "Engagement", tag: "engagement" },
    { id: "Pre Wedding", label: "Pre Wedding", tag: "pre_wedding" },
    { id: "Haldi", label: "Haldi Ceremony", tag: "haldi" },
    { id: "Reception", label: "Reception", tag: "reception" },
    { id: "Mehendi", label: "Mehendi", tag: "mehendi" }
];

const Gallery = () => {
    const { config, isEditMode, updateSection } = useLandingPage();
    const galleryData = config?.gallery || {};

    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");

    const title = galleryData.title !== undefined ? galleryData.title : "Our Portfolio";
    const subtitle = galleryData.subtitle !== undefined ? galleryData.subtitle : "Capturing moments that last forever. Every detail, every emotion, preserved beautifully.";
    const bgColor = galleryData.bgColor || '#ffffff';
    
    // Dynamic Categories
    const categories = galleryData.categories && galleryData.categories.length > 0 ? galleryData.categories : DEFAULT_CATEGORIES;

    // get images for a category (Local -> Default)
    const getImages = (id) => {
        const local = localImages[id];
        if (local && local.length > 0) return local;
        return defaultImages[id] ? [defaultImages[id]] : [];
    };

    // get cover image (Uploaded Cover -> Local Cover -> Local Album[0] -> Default)
    const getCover = (cat) => {
        if (cat.coverImg) return cat.coverImg;

        const normalizedId = cat.id.toLowerCase().replace(' ', '_');
        const key = Object.keys(localCovers).find(k => {
            const filename = k.split('/').pop().split('.')[0];
            return filename.toLowerCase() === normalizedId;
        });

        if (key) return localCovers[key];

        const images = getImages(cat.id);
        return images.length > 0 ? images[0] : (defaultImages[cat.id] || '');
    };

    const openAlbum = (category) => setSelectedAlbum(category);
    const closeAlbum = () => setSelectedAlbum(null);

    useEffect(() => {
        if (selectedAlbum) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedAlbum]);

    // Filter Logic
    const filteredCategories = activeFilter === "All"
        ? categories
        : categories.filter(cat => cat.id === activeFilter);

    // Edit functions
    const updateCategory = (index, field, value) => {
        const newCats = [...categories];
        newCats[index] = { ...newCats[index], [field]: value };
        // automatically sync id with label if id matches old label
        if (field === 'label' && newCats[index].id === categories[index].label) {
            newCats[index].id = value;
        }
        updateSection('gallery', { categories: newCats });
    };

    const deleteCategory = (index) => {
        const newCats = [...categories];
        newCats.splice(index, 1);
        updateSection('gallery', { categories: newCats });
    };

    const addCategory = () => {
        const newCats = [...categories, { id: "New Category", label: "New Category", tag: "new_tag" }];
        updateSection('gallery', { categories: newCats });
    };

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

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button
                            onClick={() => setActiveFilter("All")}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === "All" ? 'bg-black text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            All Works
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.id)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === cat.id ? 'bg-black text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500">
                        <Loader2 size={48} className="animate-spin mb-4 text-black" />
                        <p className="text-lg font-light tracking-wide animate-pulse">Curating your memories...</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredCategories.map((cat, idx) => {
                                const coverImg = getCover(cat);
                                // The true index in the 'categories' array, necessary for updates since 'filteredCategories' might only have 1 item
                                const realIndex = categories.findIndex(c => c.id === cat.id);
                                
                                return (
                                    <motion.div
                                        layout
                                        key={cat.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                                        className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl bg-gray-50 border border-gray-100 transition-all duration-500 ${isEditMode ? '' : 'cursor-pointer hover:-translate-y-2'}`}
                                        onClick={() => !isEditMode && openAlbum(cat.id)}
                                    >
                                        {isEditMode && (
                                            <div className="absolute top-2 left-2 z-10 bg-white/90 p-2 rounded shadow flex flex-col gap-1 w-[90%]">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-bold text-gray-800">Cover Image:</span>
                                                    <button onClick={() => deleteCategory(realIndex)} className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow border border-red-200" title="Delete Category">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <ImageUploadInput 
                                                    value={cat.coverImg} 
                                                    onChange={(url) => updateCategory(realIndex, 'coverImg', url)}
                                                />
                                            </div>
                                        )}

                                        {coverImg ? (
                                            <div className="w-full h-[400px] overflow-hidden">
                                                <img
                                                    src={coverImg}
                                                    alt={cat.label}
                                                    loading="lazy"
                                                    className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isEditMode ? '' : 'group-hover:scale-110'}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-[400px] flex flex-col items-center justify-center text-gray-400">
                                                <ImageOff size={48} className="mb-4 opacity-50 block mx-auto" />
                                                <span className="text-sm">No Cover Found</span>
                                            </div>
                                        )}

                                        {isEditMode ? (
                                            <div className="absolute bottom-0 w-full bg-black/70 p-4 flex flex-col gap-2 backdrop-blur-sm z-20">
                                                <input 
                                                    type="text"
                                                    value={cat.label}
                                                    onChange={(e) => updateCategory(realIndex, 'label', e.target.value)}
                                                    className="bg-transparent text-white font-serif text-2xl border-b border-white/50 focus:outline-none placeholder-white/50"
                                                    placeholder="Category Label"
                                                />
                                                <input 
                                                    type="text"
                                                    value={cat.tag}
                                                    onChange={(e) => updateCategory(realIndex, 'tag', e.target.value)}
                                                    className="bg-transparent text-white/80 font-mono text-xs uppercase tracking-widest border-b border-white/30 focus:outline-none placeholder-white/50"
                                                    placeholder="Image Tag (e.g. wedding)"
                                                />
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-10">
                                                <h3 className="text-white font-serif text-3xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.label}</h3>
                                                <p className="text-white/80 font-sans text-sm tracking-widest uppercase border-b border-white/40 pb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">View Album</p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Add New Category Button */}
                        {isEditMode && activeFilter === "All" && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[400px]"
                                onClick={addCategory}
                            >
                                <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                    <Plus size={32} />
                                </div>
                                <span className="font-serif text-xl text-gray-600 group-hover:text-black">Add Portfolio Category</span>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Album Modal */}
                <AnimatePresence>
                    {selectedAlbum && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto"
                    >
                        <div className="min-h-screen px-6 py-12">
                            {/* Header */}
                            <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50">
                                <div>
                                    <h3 className="text-white font-serif text-3xl">{categories.find(c => c.id === selectedAlbum)?.label}</h3>
                                    <p className="text-white/60 text-sm tracking-widest font-mono mt-1 uppercase">
                                        #{categories.find(c => c.id === selectedAlbum)?.tag}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6">
                                    {/* View Toggle */}
                                    <div className="hidden sm:flex bg-white/10 rounded-full p-1 backdrop-blur-md border border-white/10">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/70 hover:bg-white/20'}`}
                                            title="Regular Grid Layout"
                                        >
                                            <Grid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('masonry')}
                                            className={`p-2 rounded-full transition-all ${viewMode === 'masonry' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/70 hover:bg-white/20'}`}
                                            title="Masonry Layout"
                                        >
                                            <LayoutTemplate size={18} />
                                        </button>
                                    </div>

                                    <button onClick={closeAlbum} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all hover:rotate-90">
                                        <X size={28} />
                                    </button>
                                </div>
                            </div>

                            {/* Images Grid */}
                            <div className={`mt-28 max-w-7xl mx-auto pb-12 ${viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
                                }`}>
                                {getImages(selectedAlbum).length > 0 ? (
                                    getImages(selectedAlbum).map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (idx % 10) * 0.05, duration: 0.5 }}
                                            className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-lg border border-white/5"
                                        >
                                            <img
                                                src={img}
                                                alt={`${selectedAlbum} Moment ${idx + 1}`}
                                                loading="lazy"
                                                className={`w-full bg-gray-900 ${viewMode === 'grid' ? 'aspect-square object-cover' : 'h-auto'} transition-transform duration-700 group-hover:scale-105`}
                                            />
                                            {/* Hover overlay hint */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-32 text-white/40">
                                        <ImageOff size={64} className="mb-6 opacity-30" />
                                        <p className="text-2xl font-serif">Awaiting Memories</p>
                                        <p className="text-sm tracking-widest uppercase mt-4">Upload images to Cloudinary with tag: {categories.find(c => c.id === selectedAlbum)?.tag}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
