import { motion } from 'framer-motion';
import { User, MapPin, Phone, Mail, Calendar, Award, Heart, Video, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CandidateProfile = () => {
    const location = useLocation();
    const candidateData = location.state as { 
        name: string; 
        constituency: string; 
        district: string;
        age?: string;
        education?: string;
        joinedYear?: string;
        phone?: string;
        email?: string;
        bio?: string;
    } | null;

    // Sample candidate data - can be replaced with props or fetched from API
    const candidate = {
        name: candidateData?.name || 'செந்தமிழன் சீமான்',
        constituency: candidateData?.constituency || 'சென்னை மத்திய',
        district: candidateData?.district || 'சென்னை',
        age: candidateData?.age || '45',
        education: candidateData?.education || 'எம்.ஏ',
        photo: '/placeholder-candidate.jpg',
        party: 'நாம் தமிழர் கட்சி',
        phone: candidateData?.phone || '+91 98765 43210',
        email: candidateData?.email || 'candidate@naamtamilar.org',
        joinedDate: candidateData?.joinedYear || '2010',
        bio: candidateData?.bio || 'தமிழ் மக்களின் உரிமைகளுக்காக குரல் கொடுத்து வரும் தீவிர சமூக ஆர்வலர். கடந்த 10 ஆண்டுகளாக தமிழக மக்களின் நலனுக்காக உழைத்து வருபவர்.',
    };

    const achievements = [
        { title: 'மக்களுக்கான குடிநீர் திட்டம்', description: '50+ கிராமங்களில் குடிநீர் வசதி ஏற்படுத்தியது', year: '2018' },
        { title: 'கல்வி உதவித் திட்டம்', description: '500+ மாணவர்களுக்கு கல்வி உதவித்தொகை வழங்கியது', year: '2019' },
        { title: 'விவசாயிகள் நல திட்டம்', description: 'விவசாயிகளுக்கு நவீன விவசாய பயிற்சி வழங்கியது', year: '2020' },
        { title: 'சுகாதார முகாம்கள்', description: '100+ இலவச மருத்துவ முகாம்கள் நடத்தியது', year: '2021' },
    ];

    const groundWork = [
        {
            title: 'கிராம வளர்ச்சி திட்டம்',
            location: 'திருவள்ளூர் மாவட்டம்',
            date: 'ஜனவரி 2023',
            description: '30 கிராமங்களில் மின்சார வசதி மற்றும் சாலை வசதிகளை மேம்படுத்தியது',
            impact: '10,000+ மக்கள் பயனடைந்தனர்',
        },
        {
            title: 'இளைஞர்கள் திறன் மேம்பாட்டு பயிற்சி',
            location: 'சென்னை',
            date: 'மார்ச் 2023',
            description: 'வேலை வாய்ப்புக்கான திறன் மேம்பாட்டு பயிற்சி வகுப்புகள்',
            impact: '500+ இளைஞர்கள் பயிற்சி பெற்றனர்',
        },
        {
            title: 'விவசாயிகள் கடன் தள்ளுபடி போராட்டம்',
            location: 'தஞ்சாவூர் மாவட்டம்',
            date: 'ஜூன் 2023',
            description: 'விவசாயிகள் கடன் தள்ளுபடிக்காக அமைதி போராட்டம்',
            impact: '5,000+ விவசாயிகள் பங்கேற்றனர்',
        },
    ];

    const videos = [
        {
            title: 'கிராம வளர்ச்சி திட்ட துவக்க விழா',
            thumbnail: '/video-thumb-1.jpg',
            duration: '5:30',
            views: '50K',
            date: 'ஜனவரி 2023',
        },
        {
            title: 'விவசாயிகளுடன் நேரடி உரையாடல்',
            thumbnail: '/video-thumb-2.jpg',
            duration: '12:45',
            views: '75K',
            date: 'மார்ச் 2023',
        },
        {
            title: 'இளைஞர்களுக்கான வேலைவாய்ப்பு பயிற்சி',
            thumbnail: '/video-thumb-3.jpg',
            duration: '8:20',
            views: '40K',
            date: 'மே 2023',
        },
        {
            title: 'தேர்தல் பிரச்சார பேச்சு - 2016',
            thumbnail: '/video-thumb-4.jpg',
            duration: '15:00',
            views: '100K',
            date: 'ஏப்ரல் 2016',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link 
                        to="/election-2016" 
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                    >
                        <ChevronLeft size={20} />
                        <span>வேட்பாளர்கள் பட்டியலுக்கு திரும்பு</span>
                    </Link>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row items-center md:items-start gap-8"
                    >
                        {/* Profile Photo */}
                        <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <User size={80} className="text-red-600" />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                {candidate.name}
                            </h1>
                            <div className="space-y-2 text-lg md:text-xl">
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <MapPin size={20} />
                                    <span>{candidate.constituency} தொகுதி</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center md:justify-start text-yellow-300">
                                    <Award size={20} />
                                    <span>{candidate.party}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <Calendar size={20} />
                                    <span>கட்சியில் சேர்ந்த ஆண்டு: {candidate.joinedDate}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                >
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Phone className="text-red-600" size={24} />
                            <div>
                                <div className="text-sm text-gray-600">தொலைபேசி</div>
                                <div className="font-semibold">{candidate.phone}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Mail className="text-red-600" size={24} />
                            <div>
                                <div className="text-sm text-gray-600">மின்னஞ்சல்</div>
                                <div className="font-semibold">{candidate.email}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bio Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-lg shadow-lg p-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        சுய விவரம்
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        {candidate.bio}
                    </p>
                </motion.div>
            </div>

            {/* Achievements Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8"
                >
                    சாதனைகள்
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Award className="text-red-600" size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {achievement.title}
                                        </h3>
                                        <span className="text-sm text-red-600 font-semibold">
                                            {achievement.year}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">
                                        {achievement.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Ground Work Section */}
            <div className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8"
                    >
                        களப்பணிகள்
                    </motion.h2>

                    <div className="space-y-6">
                        {groundWork.map((work, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg p-6 md:p-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {work.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={16} />
                                                <span>{work.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={16} />
                                                <span>{work.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                                        <Heart size={16} />
                                        <span>{work.impact}</span>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-lg">
                                    {work.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Videos Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8"
                >
                    காணொளிகள்
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                        >
                            <div className="aspect-video bg-gray-300 relative flex items-center justify-center">
                                <Video size={48} className="text-gray-500" />
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                    {video.duration}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                    {video.title}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>{video.views} பார்வைகள்</span>
                                    <span>{video.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
