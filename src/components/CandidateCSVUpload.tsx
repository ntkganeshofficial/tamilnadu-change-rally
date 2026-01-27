import { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Candidate {
    id: number;
    name: string;
    constituency: string;
    district: string;
    age?: string;
    education?: string;
    joinedYear?: string;
    phone?: string;
    email?: string;
    bio?: string;
}

interface CandidateCSVUploadProps {
    onCandidatesImport: (candidates: Candidate[]) => void;
}

const CandidateCSVUpload = ({ onCandidatesImport }: CandidateCSVUploadProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const parseCSV = (text: string): Candidate[] => {
        const lines = text.split('\n').filter(line => line.trim());
        const candidates: Candidate[] = [];
        
        // Skip header row (index 0)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Split by comma, but handle quoted fields
            const fields: string[] = [];
            let currentField = '';
            let insideQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    fields.push(currentField.trim());
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            fields.push(currentField.trim()); // Add last field

            // Expected columns: மாவட்டம், தொகுதி, பெயர், வயது, கல்வித்தகுதி, கட்சியில் இணைந்த ஆண்டு, தொலைபேசி, இமெயில்
            if (fields.length >= 3) {
                candidates.push({
                    id: i,
                    district: fields[0] || '',
                    constituency: fields[1] || '',
                    name: fields[2] || '',
                    age: fields[3] || '',
                    education: fields[4] || '',
                    joinedYear: fields[5] || '2010',
                    phone: fields[6] || '+91 98765 43210',
                    email: fields[7] || 'candidate@naamtamilar.org',
                    bio: fields[8] || 'தமிழ் மக்களின் உரிமைகளுக்காக குரல் கொடுத்து வரும் தீவிர சமூக ஆர்வலர்.'
                });
            }
        }

        return candidates;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);

        try {
            const text = await file.text();
            const candidates = parseCSV(text);

            if (candidates.length === 0) {
                throw new Error('CSV கோப்பில் செல்லுபடியாகும் தரவு இல்லை');
            }

            onCandidatesImport(candidates);
            setUploadStatus({
                type: 'success',
                message: `${candidates.length} வேட்பாளர் விவரங்கள் வெற்றிகரமாக பதிவேற்றப்பட்டது`
            });

            setTimeout(() => {
                setIsOpen(false);
                setUploadStatus(null);
            }, 2000);
        } catch (error) {
            setUploadStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'கோப்பை பதிவேற்றுவதில் பிழை'
            });
        } finally {
            setUploading(false);
            event.target.value = ''; // Reset input
        }
    };

    return (
        <>
            {/* Upload Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                <Upload size={20} />
                <span>CSV பதிவேற்றம்</span>
            </button>

            {/* Upload Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    வேட்பாளர் CSV பதிவேற்றம்
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Instructions */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2">CSV வடிவம்:</h3>
                                <p className="text-sm text-blue-800 mb-2">
                                    CSV கோப்பில் பின்வரும் தலைப்புகள் இருக்க வேண்டும்:
                                </p>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• மாவட்டம், தொகுதி, பெயர், வயது</li>
                                    <li>• கல்வித்தகுதி, கட்சியில் இணைந்த ஆண்டு</li>
                                    <li>• தொலைபேசி, இமெயில்</li>
                                </ul>
                            </div>

                            {/* Upload Area */}
                            <div className="mb-6">
                                <label
                                    htmlFor="csv-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-600 font-medium">
                                            கோப்பைத் தேர்வு செய்ய கிளிக் செய்யவும்
                                        </p>
                                        <p className="text-xs text-gray-500">CSV கோப்புகள் மட்டும்</p>
                                    </div>
                                    <input
                                        id="csv-upload"
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Status Messages */}
                            {uploading && (
                                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <span className="text-blue-900">பதிவேற்றுகிறது...</span>
                                </div>
                            )}

                            {uploadStatus && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-3 p-4 rounded-lg ${
                                        uploadStatus.type === 'success'
                                            ? 'bg-green-50 text-green-900'
                                            : 'bg-red-50 text-red-900'
                                    }`}
                                >
                                    {uploadStatus.type === 'success' ? (
                                        <CheckCircle className="text-green-600" size={24} />
                                    ) : (
                                        <AlertCircle className="text-red-600" size={24} />
                                    )}
                                    <span>{uploadStatus.message}</span>
                                </motion.div>
                            )}

                            {/* Sample CSV Download */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <a
                                    href="data:text/csv;charset=utf-8,மாவட்டம்,தொகுதி,பெயர்,வயது,கல்வித்தகுதி,கட்சியில் இணைந்த ஆண்டு,தொலைபேசி,இமெயில்\nசென்னை,சென்னை - அண்ணாநகர்,செந்தமிழன் சீமான்,45,எம்.ஏ,2010,+91 98765 43210,seeman@naamtamilar.org"
                                    download="sample-candidates.csv"
                                    className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <Upload size={16} />
                                    <span>மாதிரி CSV பதிவிறக்கம்</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CandidateCSVUpload;
