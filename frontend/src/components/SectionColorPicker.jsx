import { Palette } from 'lucide-react';

const SectionColorPicker = ({ value, onChange }) => {
    return (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/90 p-2 rounded-full shadow-lg border border-gray-200">
            <Palette size={16} className="text-gray-600 ml-1" />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Bg Color</span>
            <input
                type="color"
                value={value || '#ffffff'}
                onChange={(e) => onChange(e.target.value)}
                className="w-6 h-6 p-0 border-0 rounded cursor-pointer overflow-hidden"
            />
        </div>
    );
};

export default SectionColorPicker;
