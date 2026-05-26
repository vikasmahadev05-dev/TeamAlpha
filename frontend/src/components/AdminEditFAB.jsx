import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLandingPage } from '../context/LandingPageContext';
import { Edit3, Save, X } from 'lucide-react';

const AdminEditFAB = () => {
    const { user } = useAuth();
    const { isEditMode, setIsEditMode, saveConfig, config } = useLandingPage();

    if (user?.role !== 'admin') return null;

    const handleSave = () => {
        saveConfig(config);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
            <AnimatePresence>
                {isEditMode && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        onClick={() => setIsEditMode(false)}
                        className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        title="Cancel Edit"
                    >
                        <X size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isEditMode ? handleSave : () => setIsEditMode(true)}
                className={`p-4 rounded-full shadow-2xl text-white transition-all flex items-center justify-center backdrop-blur-md border border-white/10 ${
                    isEditMode ? 'bg-black hover:bg-gray-900' : 'bg-black hover:bg-gray-900'
                }`}
                title={isEditMode ? "Save Changes" : "Edit Landing Page"}
            >
                {isEditMode ? <Save size={26} /> : <Edit3 size={26} />}
            </motion.button>
        </div>
    );
};

export default AdminEditFAB;
