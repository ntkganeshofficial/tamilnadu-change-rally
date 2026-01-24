import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Cropper, { Area } from 'react-easy-crop';

interface FormData {
    name: string;
    email: string;
    phone: string;
    district: string;
    photoUrl: string;
    memberId: string;
}

interface AttendanceFormProps {
    onRegistration: (districtName: string) => void;
}

const AttendanceForm = ({ onRegistration }: AttendanceFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        memberId: '',
        email: '',
        phone: '',
        district: '',
        photoUrl: '',
    });

    const [showPreview, setShowPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Crop states
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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
                setTempImageUrl(result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        if (!tempImageUrl || !croppedAreaPixels) return;

        const image = new Image();
        image.src = tempImageUrl;
        
        await new Promise((resolve) => {
            image.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        return new Promise<string>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(blob);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleCropSave = async () => {
        const croppedImage = await createCroppedImage();
        if (croppedImage) {
            setFormData((prev) => ({
                ...prev,
                photoUrl: croppedImage,
            }));
        }
        setShowCropModal(false);
        setTempImageUrl('');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.phone && formData.district) {
            setShowPreview(true);
            // Map Tamil district names to English district names for registration tracking
            const districtMapping: { [key: string]: string } = {
                'அரியலூர்': 'Ariyalur',
                'செங்கல்பட்டு': 'Chengalpattu',
                'சென்னை': 'Chennai',
                'கோயம்பத்தூர்': 'Coimbatore',
                'கடலூர்': 'Cuddalore',
                'தர்மபுரி': 'Dharmapuri',
                'திண்டுக்கல்': 'Dindigul',
                'ஈரோடு': 'Erode',
                'காஞ்சிபுரம்': 'Kanchipuram',
                'கண்ணியாகுமரி': 'Kannyakumari',
                'கள்ளக்குறிச்சி': 'Kallakurichi',
                'கரூர்': 'Karur',
                'கிருஷ்ணகிரி': 'Krishnagiri',
                'மதுரை': 'Madurai',
                'மயிலாடுதுறை': 'Mayiladuthurai',
                'நாகப்பட்டிணம்': 'Nagapattinam',
                'நாமக்கல்': 'Namakkal',
                'நீலகிரி': 'Nilgiris',
                'பெரம்பலூர்': 'Perambalur',
                'புதுச்சேரி': 'Puducherry',
                'ராமநாதபுரம்': 'Ramanathapuram',
                'ராணிப்பேட்டை': 'Ranipet',
                'சேலம்': 'Salem',
                'சிவகங்கை': 'Sivagangai',
                'தென்காசி': 'Tenkasi',
                'தஞ்சாவூர்': 'Thanjavur',
                'தேனி': 'Theni',
                'தூத்துக்குடி': 'Thoothukudi',
                'திருப்பத்தூர்': 'Tirupattur',
                'திருப்பூர்': 'Tiruppur',
                'திருவண்ணாமலை': 'Tiruvannamalai',
                'திருவாரூர்': 'Tiruvarur',
                'திருச்சிராப்பள்ளி': 'Tiruchirappalli',
                'வேலூர்': 'Vellore',
                'விழுப்புரம்': 'Viluppuram',
                'விருதுநகர்': 'Virudhunagar',
                'திருவள்ளூர்': 'Tiruvallur',
                'திருநெல்வேலி': 'Tirunelveli'
            };
            const englishDistrictName = districtMapping[formData.district] || formData.district;
            onRegistration(englishDistrictName);

            // Save to Firestore
            saveToFirestore(englishDistrictName);
        }
    };

    const saveToFirestore = async (englishDistrictName: string) => {
        setIsLoading(true);
        try {
            const registrationData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                district: formData.district,
                districtEnglish: englishDistrictName,
                memberId: formData.memberId,
                // photoUrl: formData.photoUrl, // Stores as base64
                // registeredAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'registrations'), registrationData);
            console.log('Registration saved with ID:', docRef.id);
            setSuccessMessage('✓ Your registration has been saved successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving registration:', error);
            alert('Error saving registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateCardImage = (): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = 480;
            canvas.height = 550;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

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
                        ctx.rect(60, 320, 120, 125);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(img, 60, 320, 120, 125);
                        ctx.restore();

                        // Draw border around photo
                        ctx.strokeStyle = '#fbbf24';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(60, 320, 120, 125);

                        // Draw name
                        ctx.font = 'bold 18px Arial';
                        ctx.fillStyle = '#fffc43ff';
                        ctx.textAlign = 'center';
                        ctx.fillText(`${formData.name}`, 130, 470);

                        // Draw district
                        ctx.font = '14px Arial';
                        ctx.fillStyle = '#ffffffff';
                        ctx.fillText(formData.district, 120, 490);

                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to generate image blob'));
                            }
                        }, 'image/png');
                    };
                    img.onerror = () => reject(new Error('Failed to load photo'));
                    img.src = formData.photoUrl;
                } else {
                    // If no photo, still generate the card
                    ctx.font = 'bold 18px Arial';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.fillText(formData.name, 200, 400);

                    ctx.font = '14px Arial';
                    ctx.fillStyle = '#fbbf24';
                    ctx.fillText(formData.district, 200, 430);
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to generate image blob'));
                        }
                    }, 'image/png');
                }
            };
            bgImg.onerror = () => reject(new Error('Failed to load background image'));
            bgImg.src = '/idcard_bg1.jpeg';
        });
    };

    const downloadAttendanceCard = async () => {
        try {
            const blob = await generateCardImage();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${formData.district}-${formData.name}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading card:', error);
            alert('பதிவிறக்கத்தில் பிழை ஏற்பட்டது');
        }
    };

    const shareToSocialMedia = async (platform: 'whatsapp' | 'facebook' | 'twitter' | 'instagram') => {
        try {
            const blob = await generateCardImage();
            const file = new File([blob], `மாநாடு-2026-${formData.phone}.png`, { type: 'image/png' });
            const shareText = `தீய ஆட்சிமுறை ஒழிய... தூய ஆட்சிமுறை மலர... நான் பிப்ரவரி 21 திருச்சியில் நாம் தமிழர் கட்சியின் தலைமை ஒருங்கிணைப்பாளர் செந்தமிழன் சீமான் அவர்களின் தலைமையில் பேரெழுச்சியாக நடைபெறவிருக்கும் *மாற்றத்தை விரும்பும் மக்களின் மாநாட்டிற்குச் செல்கிறேன்* என பதிவு செய்துவிட்டேன்! 🎉\n\nபெயர்: ${formData.name}\nமாவட்டம்: ${formData.district} இது நம் இனத்தின் திருவிழா! எல்லோரும் கூடுவோம்! தங்கள் வருகையைப் பதிவு செய்து இதேபோன்று உங்கள் புகைப்படத்துடன் கூடிய பதாகையைப் பெற வேண்டுமா? https://makkalinmaanadu.naamtamilar.org #மக்களின்_மாநாடு2026`;


            // Try Web Share API first (mainly for mobile)
            const canUseWebShare = typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
            let canShareFiles = false;
            
            if (canUseWebShare) {
                try {
                    canShareFiles = navigator.canShare({ files: [file] });
                } catch (e) {
                    canShareFiles = false;
                }
            }

            if (canUseWebShare && canShareFiles) {
                try {
                    await navigator.share({
                        title: 'மாற்றத்தை விரும்பும் மக்களின் மாநாடு - 2026',
                        text: shareText,
                        files: [file]
                    });
                    return;
                } catch (shareError) {
                    // If sharing was cancelled or failed, continue to fallback
                    if ((shareError as Error).name === 'AbortError') {
                        return; // User cancelled, don't show fallback
                    }
                }
            }

            // Fallback for desktop and browsers without Web Share API
            const imageUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `மாநாடு-2026-${formData.phone}.png`;
            link.click();
            
            setTimeout(() => {
                if (platform === 'whatsapp') {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                    window.open(whatsappUrl, '_blank');
                } else if (platform === 'facebook') {
                    window.open('https://www.facebook.com/', '_blank');
                } else if (platform === 'twitter') {
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                    window.open(twitterUrl, '_blank');
                } else if (platform === 'instagram') {
                    alert('படம் பதிவிறக்கப்பட்டது! Instagram-இல் பதிவேற்றவும்');
                }
                URL.revokeObjectURL(imageUrl);
            }, 300);
        } catch (error) {
            console.error('Error sharing:', error);
            alert('பகிர்தலில் பிழை ஏற்பட்டது');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-0 pt-0 mb-12">
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center font-semibold"
                >
                    {successMessage}
                </motion.div>
            )}
            <motion.form
                onSubmit={handleSubmit}
                viewport={{ once: true }}
                className="rounded-lg p-3"
                style={{ backgroundColor: 'rgba(219, 0, 0)' }}>

                <h2 className="text-2xl md:text-2xl text-white text-center text-foreground pb-4">
                    உங்கள் வருகையை பதிவு செய்க
                </h2>
                <div className="space-y-3">
                    <div>

                        <div
                            className="flex justify-center cursor-pointer"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                            {formData.photoUrl ? (
                                <img
                                    src={formData.photoUrl}
                                    alt="Preview"
                                    className="w-25 h-25 object-cover rounded-lg border-4 border-yellow-400 hover:border-yellow-300 transition-all"
                                />
                            ) : (
                                <div className="w-25 h-25 bg-gray-200 rounded-lg border-4 border-dashed border-yellow-400 hover:border-yellow-300 flex items-center justify-center transition-all">
                                    <div className="text-center">
                                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <p className="text-xs text-gray-500 mt-2">புகைப்படம் (கட்டாயம்)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            பெயர்
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
                            உறுப்பினர் எண் (கட்டாயமில்லை)
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
                            மின்னஞ்சல்
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
                            தொடர்பு எண்
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
                            <option value="">மாவட்டம்</option>
                            <option value="அரியலூர்">அரியலூர்</option>
                            <option value="செங்கல்பட்டு">செங்கல்பட்டு</option>
                            <option value="கோயம்பத்தூர்">கோயம்பத்தூர்</option>
                            <option value="கடலூர்">கடலூர்</option>
                            <option value="தர்மபுரி">தர்மபுரி</option>
                            <option value="திண்டுக்கல்">திண்டுக்கல்</option>
                            <option value="ஈரோடு">ஈரோடு</option>
                            <option value="கள்ளக்குறிச்சி">கள்ளக்குறிச்சி</option>
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
                            <option value="சென்னை">சென்னை</option>
                            <option value="சேலம்">சேலம்</option>
                            <option value="சிவகங்கை">சிவகங்கை</option>
                            <option value="தென்காசி">தென்காசி</option>
                            <option value="தஞ்சாவூர்">தஞ்சாவூர்</option>
                            <option value="தேனி">தேனி</option>
                            <option value="தூத்துக்குடி">தூத்துக்குடி</option>
                            <option value="திருப்பத்தூர்">திருப்பத்தூர்</option>
                            <option value="திருப்பூர்">திருப்பூர்</option>
                            <option value="திருவண்ணாமலை">திருவண்ணாமலை</option>
			    <option value="திருவள்ளூர்">திருவள்ளூர்</option>
                            <option value="திருவாரூர்">திருவாரூர்</option>
                            <option value="வேலூர்">வேலூர்</option>
                            <option value="விழுப்புரம்">விழுப்புரம்</option>
                            <option value="விருதுநகர்">விருதுநகர்</option>
                        </select>
                    </div>

                    <p className="text-xs text-white text-center mt-4">
                        * உங்கள் தகவல்கள் தொடர்புக்கு பயன்படுத்தப்படும்
                    </p>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-red-700 font-bolds font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        {isLoading ? 'Saving...' : 'பதிவு செய்க'}
                    </button>
                </div>
            </motion.form>

            {/* Crop Modal */}
            {showCropModal && tempImageUrl && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                    onClick={() => {
                        setShowCropModal(false);
                        setTempImageUrl('');
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-center mb-4">புகைப்படத்தை செதுக்கவும்</h3>
                        
                        <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                            <Cropper
                                image={tempImageUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">பெரிதாக்கு</label>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCropModal(false);
                                    setTempImageUrl('');
                                }}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all"
                            >
                                ரத்து செய்
                            </button>
                            <button
                                onClick={handleCropSave}
                                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-red-700 font-bold py-2 px-4 rounded-lg transition-all"
                            >
                                சேமி
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

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
                            <div className="absolute inset-0" />

                            {/* Content Wrapper */}
                            <div className="relative z-10 h-full flex flex-col justify-between">




                                {/* Content */}
                                <div className="space-y-3 flex-1 flex flex-col justify-center">
                                    <div className="text-left">


                                    </div>


                                </div>

                                {/* Footer */}
                                
                                 <div className="grid grid-cols-2 gap-2 px-4">
                                    <div>
                                        <img 
                                            src={formData.photoUrl} 
                                            alt="Member Photo" 
                                            className="object-cover"
                                            style={{width: '100px', height: '100px', position: 'relative', left: '1.8rem', top: '-3rem', border: '2px solid #fbbf24' }} 
                                        />
                                    </div>
                                    
                                    
                                </div>
                                <div style={{position: 'relative', top: '-2.7rem'}}>
                                    <div className="grid grid-cols-2 gap-2 px-4">
                                    <div className="text-yellow-400 text-sm font-bold text-center">
                                        {formData.name}
                                    </div>
                                    
                                </div>
                                <div className="grid grid-cols-2 gap-2 px-4">
                                    
                                    <div className="text-white text-sm font-bold text-center">
                                        {formData.district}
                                    </div>
                                </div>
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
                                onClick={() => shareToSocialMedia('whatsapp')}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 text-sm rounded-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => shareToSocialMedia('facebook')}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => shareToSocialMedia('twitter')}
                                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-3 text-sm rounded-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => shareToSocialMedia('instagram')}
                                className="flex-1 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold py-2 px-3 text-sm rounded-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default AttendanceForm;
