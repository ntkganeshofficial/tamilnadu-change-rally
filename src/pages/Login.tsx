import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/');
        } catch (err: any) {
            if (err.code === 'auth/user-not-found') {
                setError('பயனர் கணக்கு இல்லை. பதிவு செய்யவும்.');
            } else if (err.code === 'auth/wrong-password') {
                setError('தவறான கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.');
            } else if (err.code === 'auth/invalid-email') {
                setError('தவறான மின்னஞ்சல் முகவரி.');
            } else {
                setError('உள்நுழைவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்.');
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
                className="max-w-md w-full"
            >
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
                        <LogIn className="text-white" size={40} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        உள்நுழைவு
                    </h1>
                    <p className="text-gray-600">
                        நாம் தமிழர் கட்சி
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <span>உள்நுழைகிறது...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>உள்நுழைக</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 mb-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">அல்லது</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Register Link */}
                    <Link
                        to="/register"
                        className="w-full block text-center bg-yellow-400 hover:bg-yellow-500 text-red-700 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <UserPlus size={20} />
                        <span>புதிய கணக்கு உருவாக்கு</span>
                    </Link>

                    {/* Forgot Password */}
                    <div className="mt-4 text-center">
                        <a href="#forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium">
                            கடவுச்சொல் மறந்துவிட்டதா?
                        </a>
                    </div>
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

export default Login;
