import { motion } from 'framer-motion';
import { MapPin, Users, BookOpen, Heart, Megaphone, Target } from 'lucide-react';

const FieldWork = () => {
    const activities = [
        {
            icon: Users,
            title: 'மக்கள் தொடர்பு',
            description: 'கிராம கிராமமாக சென்று மக்களின் பிரச்சினைகளை கேட்டறிதல்',
            color: 'bg-red-100 text-red-600'
        },
        {
            icon: BookOpen,
            title: 'விழிப்புணர்வு பிரச்சாரம்',
            description: 'அரசியல் விழிப்புணர்வு மற்றும் கல்வி நிகழ்ச்சிகள்',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            icon: Heart,
            title: 'சமூக சேவை',
            description: 'இலவச மருத்துவ முகாம், இரத்த தான முகாம்',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: Megaphone,
            title: 'குரல் கொடுத்தல்',
            description: 'மக்கள் உரிமைகளுக்காக போராடுதல்',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: Target,
            title: 'இலக்கு நிர்ணயம்',
            description: 'ஒவ்வொரு தொகுதியிலும் வலுவான அமைப்பு',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: MapPin,
            title: 'களப்பயணம்',
            description: 'தொடர்ச்சியான மக்கள் நேர் காணல்',
            color: 'bg-pink-100 text-pink-600'
        },
    ];

    const regions = [
        { name: 'வடக்கு தமிழகம்', count: '1,234' },
        { name: 'தெற்கு தமிழகம்', count: '2,345' },
        { name: 'மேற்கு தமிழகம்', count: '1,567' },
        { name: 'கிழக்கு தமிழகம்', count: '1,890' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            களப்பணி
                        </h1>
                        <p className="text-xl md:text-2xl text-yellow-300">
                            மக்களுக்காக... மக்களுடன்...
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Activities Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
                >
                    நமது செயல்பாடுகள்
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className={`w-16 h-16 rounded-full ${activity.color} flex items-center justify-center mb-4`}>
                                <activity.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {activity.title}
                            </h3>
                            <p className="text-gray-600">
                                {activity.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Regional Stats */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
                    >
                        பிராந்திய அளவில் செயல்பாடுகள்
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {regions.map((region, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg p-6 text-center"
                            >
                                <MapPin className="w-12 h-12 mx-auto text-red-600 mb-3" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {region.name}
                                </h3>
                                <div className="text-3xl font-bold text-red-600">
                                    {region.count}
                                </div>
                                <p className="text-sm text-gray-600 mt-2">நிகழ்ச்சிகள்</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            களப்பணியில் இணையுங்கள்
                        </h2>
                        <p className="text-xl text-yellow-300 mb-8">
                            உங்கள் பகுதியில் நாம் தமிழர் கட்சியின் செயல்பாடுகளில் பங்கு பெறுங்கள்
                        </p>
                        <button className="bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                            இப்போது சேருங்கள்
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FieldWork;
