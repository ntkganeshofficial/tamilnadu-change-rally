import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, UserPlus, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        district: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const districts = [
        'அரியலூர்', 'சென்னை', 'கோயம்புத்தூர்', 'கடலூர்', 'தர்மபுரி', 'திண்டுக்கல்',
        'ஈரோடு', 'காஞ்சிபுரம்', 'கன்னியாகுமரி', 'கரூர்', 'கிருஷ்ணகிரி', 'மதுரை',
        'நாகப்பட்டினம்', 'நாமக்கல்', 'நீலகிரி', 'பெரம்பலூர்', 'புதுக்கோட்டை', 'இராமநாதபுரம்',
        'சேலம்', 'சிவகங்கை', 'தஞ்சாவூர்', 'தேனி', 'திருச்சி', 'திருநெல்வேலி',
        'திருப்பூர்', 'திருவள்ளூர்', 'திருவண்ணாமலை', 'திருவாரூர்', 'தூத்துக்குடி', 'வேலூர்',
        'விழுப்புரம்', 'விருதுநகர்'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('கடவுச்சொற்கள் பொருந்தவில்லை.');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('கடவுச்சொல் குறைந்தது 6 எழுத்துக்களாக இருக்க வேண்டும்.');
            setLoading(false);
            return;
        }

        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Update user profile
            await updateProfile(userCredential.user, {
                displayName: formData.name,
            });

            // Save additional user data to Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                district: formData.district,
                createdAt: new Date().toISOString(),
                role: 'member',
            });

            navigate('/');
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('இந்த மின்னஞ்சல் ஏற்கனவே பயன்பாட்டில் உள்ளது.');
            } else if (err.code === 'auth/invalid-email') {
                setError('தவறான மின்னஞ்சல் முகவரி.');
            } else if (err.code === 'auth/weak-password') {
                setError('பலவீனமான கடவுச்சொல். வலுவான கடவுச்சொல்லை பயன்படுத்தவும்.');
            } else {
                setError('பதிவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full"
            >
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
                        <UserPlus className="text-white" size={40} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        புதிய கணக்கு உருவாக்கு
                    </h1>
                    <p className="text-gray-600">
                        நாம் தமிழர் கட்சியில் இணையுங்கள்
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    பெயர்
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="உங்கள் பெயர்"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    மின்னஞ்சல்
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    தொலைபேசி எண்
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>
                            </div>

                            {/* District Field */}
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                                    மாவட்டம்
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="text-gray-400" size={20} />
                                    </div>
                                    <select
                                        id="district"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        required
                                    >
                                        <option value="">மாவட்டத்தை தேர்வு செய்யவும்</option>
                                        {districts.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    கடவுச்சொல்
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    கடவுச்சொல்லை உறுதிப்படுத்து
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-700 to-red-600 text-white py-3 rounded-lg font-bold hover:from-red-800 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>பதிவு செய்கிறது...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    <span>பதிவு செய்க</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 mb-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">ஏற்கனவே கணக்கு உள்ளதா?</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Login Link */}
                    <Link
                        to="/login"
                        className="w-full block text-center bg-yellow-400 hover:bg-yellow-500 text-red-700 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} />
                        <span>உள்நுழைக</span>
                    </Link>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                        முகப்பு பக்கத்திற்கு திரும்பு
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
