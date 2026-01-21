import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
    name: string;
    email: string;
    phone: string;
    district: string;
    photoUrl: string;
    memberId: string;
}

const AttendanceForm = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        memberId: '',
        email: '',
        phone: '',
        district: '',
        photoUrl: '',
    });

    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setFormData((prev) => ({
                    ...prev,
                    photoUrl: result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.phone && formData.district) {
            setShowPreview(true);
        }
    };

    const downloadAttendanceCard = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 550;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Load background image
            const bgImg = new Image();
            bgImg.onload = () => {
                // Draw background image
                ctx.drawImage(bgImg, 0, 0, 480, 550);

                // Draw photo if exists
                if (formData.photoUrl) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(60, 345, 140, 145);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(img, 60, 345, 140, 145);
                        ctx.restore();

                        // Draw border around photo
                        ctx.strokeStyle = '#fbbf24';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(60, 345, 140, 145);

                        // Draw name
                        ctx.font = 'bold 18px Arial';
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'center';
                        ctx.fillText(`${formData.name}`, 130, 515);

                        // Draw district
                        ctx.font = '14px Arial';
                        ctx.fillStyle = '#000000ff';
                        ctx.fillText(formData.district, 120, 540);

                        const link = document.createElement('a');
                        link.href = canvas.toDataURL('image/png');
                        link.download = `${formData.district}-${formData.name}.png`;
                        link.click();
                    };
                    img.src = formData.photoUrl;
                } else {
                    // If no photo, still download the card
                    ctx.font = 'bold 18px Arial';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.fillText(formData.name, 200, 400);

                    ctx.font = '14px Arial';
                    ctx.fillStyle = '#fbbf24';
                    ctx.fillText(formData.district, 200, 430);
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `Rally-Card-${formData.name}.png`;
                    link.click();
                }
            };
            bgImg.src = '/idcard_bg1.jpeg';
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-0 pt-0">
            <motion.form
                onSubmit={handleSubmit}
                viewport={{ once: true }}
                className="rounded-lg p-3"
                style={{ backgroundColor: 'rgba(219, 0, 0)' }}>

                <h2 className="text-2xl md:text-2xl text-white text-center text-foreground">
                    உங்கள் வருகையை பதிவு செய்க
                </h2>
                <div className="space-y-3">
                    {formData.photoUrl && (
                        <div className="mt-3 flex justify-center">
                            <img src={formData.photoUrl} alt="Preview" className="w-20 h-24 object-cover rounded-lg border-2 border-yellow-400" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Upload Photo
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-4 py-2 bg-secondary border border-red-500 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            முழு பெயர்
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            உறுப்பினர் எண்
                        </label>
                        <input
                            type="text"
                            name="memberId"
                            value={formData.memberId}
                            onChange={handleChange}

                            className="w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            உறுப்பினர் மின்னஞ்சல்
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            அலைபேசி எண்
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            மாவட்டம்
                        </label>
                        <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="மாவட்டம்">மாவட்டம்</option>
                            <option value="அரியலூர்">அரியலூர்</option>
                            <option value="செங்கல்பட்டு">செங்கல்பட்டு</option>
                            <option value="கோயம்பத்தூர்">கோயம்பத்தூர்</option>
                            <option value="கடலூர்">கடலூர்</option>
                            <option value="தர்மபுரி">தர்மபுரி</option>
                            <option value="திண்டுக்கல்">திண்டுக்கல்</option>
                            <option value="ஈரோடு">ஈரோடு</option>
                            <option value="கள்ள்க்குறிச்சி">கள்ள்க்குறிச்சி</option>
                            <option value="காஞ்சிபுரம்">காஞ்சிபுரம்</option>
                            <option value="கன்னியாகுமரி">கன்னியாகுமரி</option>
                            <option value="கரூர்">கரூர்</option>
                            <option value="கிருஷ்ணாகிரி">கிருஷ்ணாகிரி</option>
                            <option value="மதுரை">மதுரை</option>
                            <option value="மயிலாடுதுறை">மயிலாடுதுறை</option>
                            <option value="நாகப்பட்டிணம்">நாகப்பட்டிணம்</option>
                            <option value="நாமக்கல்">நாமக்கல்</option>
                            <option value="நீலகிரி">நீலகிரி</option>
                            <option value="பெரம்பலூர்">பெரம்பலூர்</option>
                            <option value="புதுச்சேரி">புதுச்சேரி</option>
                            <option value="ராமநாதபுரம்">ராமநாதபுரம்</option>
                            <option value="ராணிப்பேட்டை">ராணிப்பேட்டை</option>
                            <option value="சேலம்">சேலம்</option>
                            <option value="சிவகங்கை">சிவகங்கை</option>
                            <option value="தென்காசி">தென்காசி</option>
                            <option value="தஞ்சாவூர்">தஞ்சாவூர்</option>
                            <option value="தேனி">தேனி</option>
                            <option value="தூத்துக்குடி">தூத்துக்குடி</option>
                            <option value="திருப்பத்தூர்">திருப்பத்தூர்</option>
                            <option value="திருப்பூர்">திருப்பூர்</option>
                            <option value="திருவண்ணாமலை">திருவண்ணாமலை</option>
                            <option value="திருவாரூர்">திருவாரூர்</option>
                            <option value="வேலூர்">வேலூர்</option>
                            <option value="விழுப்புரம்">விழுப்புரம்</option>
                            <option value="விருத்துநாகர்">விருத்துநாகர்</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bolds font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        பதிவு செய்க
                    </button>
                </div>
            </motion.form>

            {/* Modal Popup */}
            {showPreview && formData.name && formData.email && formData.phone && formData.district && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowPreview(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Attendance Card Preview */}
                        <div
                            id="attendance-card"
                            className="text-center flex flex-col justify-between border-red-600 relative bg-cover bg-center"
                            style={{
                                width: '352px',
                                height: '440px',
                                backgroundImage: 'url(/idcard_bg1.jpeg)',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                            }}
                        >
                            {/* Background Overlay */}
                            <div className="absolute inset-0 rounded-xl" />

                            {/* Content Wrapper */}
                            <div className="relative z-10 h-full flex flex-col justify-between">




                                {/* Content */}
                                <div className="space-y-3 flex-1 flex flex-col justify-center">
                                    <div className="text-left">


                                    </div>


                                </div>

                                {/* Footer */}
                                <div className="space-y-0 space-x-12 text-left">
                                    {/* Photo */}
                                    {formData.photoUrl && (
                                        <div className="flex text-left mb-2">
                                            <img src={formData.photoUrl} alt="Member Photo" className="w-24 h-25 object-cover" style={{ position: 'relative', left: '2.96rem', top: '-0.1rem' }} />
                                        </div>
                                    )}


                                </div>
                                <div className="text-white text-sm font-bold text-left" style={{ position: 'relative', left: '2.5rem', top: '-0.5rem' }} >
                                    {formData.name}
                                </div>
                                <div className="text-black text-sm font-bold text-left" style={{ position: 'relative', left: '1.5rem', top: '-0.1rem' }}>
                                    {formData.district}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 mt-4 px-4 pb-4">
                            <button
                                onClick={downloadAttendanceCard}
                                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-2 px-3 text-sm rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                பதிவிறக்கு
                            </button>
                            <button
                                onClick={() => {
                                    const shareText = `நான் மாற்றத்திற்க்கான மக்களின் மாநாட்டிற்க்கு பதிவு செய்துவிட்டேன்! 🎉`;
                                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                                    window.open(whatsappUrl, '_blank');
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 text-sm rounded-lg transition-all duration-300"
                            >
                                WhatsApp
                            </button>
                            <button
                                onClick={() => {
                                    const shareText = `நான் மாற்றத்திற்க்கான மக்களின் மாநாட்டிற்க்கு பதிவு செய்துவிட்டேன்! 🎉 ${formData.name}`;
                                    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
                                    window.open(facebookUrl, '_blank');
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded-lg transition-all duration-300"
                            >
                                Facebook
                            </button>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default AttendanceForm;
