import { useState, useRef } from 'react';
import { UploadCloud, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ImageUploadInput = ({ value, onChange, className = "" }) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${BASE_URL}/api/landing-page/upload`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({ msg: 'Upload failed with an unexpected response.' }));
                throw new Error(data.msg || data.error || 'Upload failed');
            }

            const data = await response.json();
            
            // Call the parent onChange with the new URL
            // Since we are using Cloudinary, data.url is a full absolute URL.
            onChange(data.url);
            setSuccess(true);
            
            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message);
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1 px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : success ? (
                        <Check size={14} className="text-green-600" />
                    ) : (
                        <UploadCloud size={14} />
                    )}
                    <span>{uploading ? 'Uploading...' : success ? 'Uploaded' : 'Upload Image'}</span>
                </button>
                <input 
                    type="text" 
                    value={value || ''} 
                    onChange={(e) => onChange(e.target.value)}
                    className="text-xs p-1 border rounded w-full text-black bg-white"
                    placeholder="Or enter image URL"
                />
            </div>
            {error && <span className="text-[10px] text-red-500">{error}</span>}
        </div>
    );
};

export default ImageUploadInput;
