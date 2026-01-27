import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, TrendingUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import CandidateCSVUpload from '../components/CandidateCSVUpload';

interface CandidateData {
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

const Election2016 = () => {
    const [selectedConstituency, setSelectedConstituency] = useState('all');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedCandidates, setUploadedCandidates] = useState<CandidateData[]>(() => {
        // Load from localStorage on initial mount
        const stored = localStorage.getItem('uploadedCandidates');
        return stored ? JSON.parse(stored) : [];
    });

    // All districts of Tamil Nadu
    const districts = [
        'அரியலூர்', 'சென்னை', 'கோயம்புத்தூர்', 'கடலூர்', 'தர்மபுரி', 'திண்டுக்கல்',
        'ஈரோடு', 'காஞ்சிபுரம்', 'கன்னியாகுமரி', 'கரூர்', 'கிருஷ்ணகிரி', 'மதுரை',
        'நாகப்பட்டினம்', 'நாமக்கல்', 'நீலகிரி', 'பெரம்பலூர்', 'புதுக்கோட்டை', 'இராமநாதபுரம்',
        'சேலம்', 'சிவகங்கை', 'தஞ்சாவூர்', 'தேனி', 'திருச்சி', 'திருநெல்வேலி',
        'திருப்பூர்', 'திருவள்ளூர்', 'திருவண்ணாமலை', 'திருவாரூர்', 'தூத்துக்குடி', 'வேலூர்',
        'விழுப்புரம்', 'விருதுநகர்'
    ];

    // District to Constituencies mapping
    const districtConstituencies: Record<string, string[]> = {
        'அரியலூர்': ['அரியலூர்', 'ஜெயங்கொண்டம்', 'திருமானூர்'],
        'சென்னை': ['சென்னை - அண்ணாநகர்', 'சென்னை - ஆயிரம் விளக்கு', 'சென்னை - ஆழ்வார் திருநகர்', 'சென்னை - டாக்டர் இராதாகிருஷ்ணன் நகர்', 
                    'சென்னை - தியாகராய நகர்', 'சென்னை - மயிலாப்பூர்', 'சென்னை - வடபழனி', 'சென்னை - வில்லிவாக்கம்', 'சென்னை - வீராணம்',
                    'டாம்ஸ் டவுன்', 'கிண்டி', 'ஆலந்தூர்', 'திருவோட்டியூர்', 'திருவல்லிக்கேணி'],
        'கோயம்புத்தூர்': ['கோயம்புத்தூர் (தெற்கு)', 'கோயம்புத்தூர் (வடக்கு)', 'சுலூர்', 'கவுன்டம்பாளையம்', 'தொண்டாமுத்தூர்', 
                          'கிணத்துக்கடவு', 'பொள்ளாச்சி', 'வல்பாரை', 'ஆனைமலை'],
        'கடலூர்': ['கடலூர்', 'குறிஞ்சிபாடி', 'பண்ருட்டி', 'கட்டுமன்னார்கோவில்', 'விருதாச்சலம்'],
        'தர்மபுரி': ['தருமபுரி', 'பாப்பிரெட்டிபட்டி', 'பாலக்கோடு', 'ஹரூர்', 'பென்னாகரம்'],
        'திண்டுக்கல்': ['திண்டுக்கல்', 'நத்தம்', 'நீலக்கோட்டை', 'பழனி', 'வெடசந்தூர்'],
        'ஈரோடு': ['எரோடு (கிழக்கு)', 'எரோடு (மேற்கு)', 'பவானி', 'பெருந்துறை', 'பரங்கிப்பேட்டை', 'கோபி', 'மொடக்குறிச்சி'],
        'காஞ்சிபுரம்': ['காஞ்சிபுரம்', 'அரக்கோணம்', 'சோழிங்கர்', 'செஞ்சி', 'திருப்பூர்', 'உத்திரமேரூர்'],
        'கன்னியாகுமரி': ['கணியாகுமரி', 'நாகர்கோவில்', 'கொல்லங்கோடு', 'வெள்ளிமலை'],
        'கரூர்': ['கரூர்', 'கிருஷ்ணராயபுரம்', 'குளித்தலை', 'அரவக்குறிச்சி'],
        'கிருஷ்ணகிரி': ['கிருஷ்ணகிரி', 'வேபனபல்லி', 'ஹொசூர்', 'உத்தங்கரை', 'பர்கூர்'],
        'மதுரை': ['மதுரை - கிழக்கு', 'மதுரை - தெற்கு', 'மதுரை - மத்திய', 'மதுரை - மேற்கு', 'மதுரை - வடக்கு', 'மதுரை (ஆவடிகாடு)', 'திருப்பரங்குன்றம்', 'மேலூர்'],
        'நாகப்பட்டினம்': ['நாகப்பட்டினம்', 'கிள்வேளூர்', 'வேதாரண்யம்', 'மயிலாடுதுறை'],
        'நாமக்கல்': ['நாமக்கல்', 'ராசிபுரம்', 'சென்னிமலை', 'பரமதி'],
        'நீலகிரி': ['நீலகிரி', 'உதகமண்டலம்', 'கூடலூர்', 'குன்னூர்'],
        'பெரம்பலூர்': ['பெரம்பலூர்', 'குண்டம்', 'வேப்பந்தாவடி'],
        'புதுக்கோட்டை': ['புதுக்கோட்டை', 'அலங்குடி', 'திருவரங்குளம்', 'கந்தர்வகோட்டை'],
        'இராமநாதபுரம்': ['இராமநாதபுரம்', 'முதுகுளத்தூர்', 'பரமக்குடி', 'திருவாடாணை'],
        'சேலம்': ['சேலம் (தெற்கு)', 'சேலம் (மேற்கு)', 'சேலம் (வடக்கு)', 'வீரகுப்பம்', 'ஆத்தூர்', 'ஒமலூர்', 'மேட்டூர்', 'எடப்பாடி'],
        'சிவகங்கை': ['சிவகங்கை', 'கராத்துறை', 'மானாமதுரை', 'திருப்புவனம்'],
        'தஞ்சாவூர்': ['தஞ்சாவூர்', 'திருவையாறு', 'குடந்தை', 'பாபநாசம்', 'பட்டுக்கோட்டை', 'பேராவூரணி', 'ஒராத்தநாடு'],
        'தேனி': ['தேனி', 'போடிநாயக்கனூர்', 'பெரியகுளம்', 'ஆண்டிபட்டி'],
        'திருச்சி': ['திருச்சி (கிழக்கு)', 'திருச்சி (மத்திய)', 'திருச்சி (மேற்கு)', 'சீரங்கம்', 'முசிறி', 'மணப்பாறை', 'மணச்சநல்லூர்', 'திருவெரம்பூர்'],
        'திருநெல்வேலி': ['திருநெல்வேலி', 'அம்பாசமுத்திரம்', 'பாளையங்கோட்டை', 'ராதாபுரம்', 'நாங்குநேரி'],
        'திருப்பூர்': ['திருப்பூர் (வடக்கு)', 'திருப்பூர் (தெற்கு)', 'காங்கயம்', 'அவினாசி', 'பாலாச்சேரி', 'உடுமலை'],
        'திருவள்ளூர்': ['திருவள்ளூர்', 'பூந்தமல்லி', 'ஆவடி', 'மதுரவாயல்', 'பொன்னேரி', 'கும்மிடிப்பூண்டி'],
        'திருவண்ணாமலை': ['திருவண்ணாமலை', 'கீழ்பெண்ணாத்தூர்', 'ஆரணி', 'செய்யாறு', 'வந்தவாசி', 'போளூர்', 'கலசப்பாக்கம்', 'செங்கம்',],
        'திருவாரூர்': ['திருவாரூர்', 'நன்னிலம்', 'திருத்துறைப்பூண்டி', 'மன்னார்குடி', 'திருவிடைமருதூர்'],
        'தூத்துக்குடி': ['தூத்துக்குடி', 'திருச்செந்தூர்', 'சாத்தன்குளம்', 'கோவில்பட்டி', 'விளாத்திகுளம்'],
        'வேலூர்': ['வேலூர்', 'காத்பாடி', 'ஆனைக்கட்டி', 'அம்பூர்', 'வாணியம்பாடி', 'ஆர்க்காடு'],
        'விழுப்புரம்': ['விழுப்புரம்', 'விக்கிரவாண்டி', 'திருக்கோயிலூர்', 'உலுந்துர்பேட்டை', 'சானரூர்', 'மைலம்', 'கபிஸ்தலம்'],
        'விருதுநகர்': ['விருதுநகர்', 'சாதுர்', 'இராஜபாளையம்', 'சிவகாசி', 'திருச்சுழி', 'அருப்புக்கோட்டை']
    };

    // All 234 constituencies of Tamil Nadu (2016 election)
    const constituencies = [
        'அரக்கோணம்', 'அரந்தாங்கி', 'அரியலூர்', 'அரூர்', 'அலங்குளம்', 'அலங்காநல்லூர்', 'அழகர்குவில்', 'அழிஞ்சிவாக்கம்',
        'அன்னூர்', 'அம்பாசமுத்திரம்', 'அம்பாத்துறை', 'அம்பூர்', 'ஆத்தூர்', 'ஆண்டிப்பட்டி', 'ஆதிராமபட்டினம்', 'ஆந்தூர்',
        'ஆனைக்கட்டி', 'ஆனைமலை', 'ஆர்க்காடு', 'ஆர்காம்', 'ஆலந்தூர்', 'ஆலங்குளம்', 'ஆவடி', 'ஆவணி', 'இடப்பாடி',
        'இராசிபுரம்', 'இராணிப்பேட்டை', 'இராஜபாளையம்', 'இளையான்குடி', 'உடுமலைப்பேட்டை', 'உத்தமபாளையம்', 'உத்தங்கரை',
        'உத்திரமேரூர்', 'உத்தரமெரூர்', 'உசிலம்பட்டி', 'ஊத்துக்குளி', 'ஊத்துமலை', 'ஊரன்', 'எஃகூர்', 'எட்டையபுரம்',
        'எண்ணோர்', 'எரோடு (கிழக்கு)', 'எரோடு (மேற்கு)', 'ஏலகிரி', 'ஐந்தக்கரை', 'ஒசூர்', 'ஒட்டன்சத்திரம்', 'ஓமலூர்',
        'ஓத்தக்கடை', 'கங்கவல்லி', 'கங்கைகொண்டான்', 'கடவூர்', 'கடம்பத்தூர்', 'கடலூர்', 'கடையநல்லூர்', 'கடையம்',
        'கணியாகுமரி', 'கணேஷமங்கலம்', 'கரூர்', 'கல்லக்குறிச்சி', 'களக்காடு', 'களப்பட்டு', 'கவின்திப்பாடி', 'காட்டுமன்னார்குடி',
        'காஞ்சிபுரம்', 'காரைக்குடி', 'கிண்டி', 'கிள்ளியூர்', 'குடந்தை', 'குடவாசல்', 'குடியாத்தம்', 'குண்டம்', 'குன்னம்',
        'குன்னூர்', 'குன்றக்குடி', 'கும்பகோணம்', 'கூடலூர்', 'கூடானூர்', 'கூடுவாஞ்சேரி', 'கொடைக்கானல்', 'கொடுமுடி',
        'கொடுங்கையூர்', 'கொல்லிமலை', 'கோவில்பட்டி', 'கோட்டூர்', 'கோபாலபுரம்', 'கோபி', 'கோயம்புத்தூர் (தெற்கு)',
        'கோயம்புத்தூர் (வடக்கு)', 'சங்கரன்கோவில்', 'சங்ககிரி', 'சாத்தூர்', 'சாயல்குடி', 'சிதம்பரம்', 'சிறுகுளம்',
        'சிறுமலை', 'சீர்காழி', 'சீனி (வடக்கு)', 'செட்டிபுன்னியம்', 'செங்கத்து', 'செங்கம்', 'செஞ்சி', 'செம்மனார் கோவில்',
        'சேரன்மாதேவி', 'சேலம் (தெற்கு)', 'சேலம் (மேற்கு)', 'சேலம் (வடக்கு)', 'சென்னை - அண்ணாநகர்', 'சென்னை - ஆயிரம் விளக்கு',
        'சென்னை - ஆழ்வார் திருநகர்', 'சென்னை - டாக்டர் இராதாகிருஷ்ணன் நகர்', 'சென்னை - தியாகராய நகர்', 'சென்னை - மயிலாப்பூர்',
        'சென்னை - வடபழனி', 'சென்னை - வில்லிவாக்கம்', 'சென்னை - வீராணம்', 'சொரப்பட்டு', 'சோழவந்தான்', 'சோழிங்கர்',
        'டாம்ஸ் டவுன்', 'தஞ்சாவூர்', 'தருமபுரி', 'தலைவாசல்', 'திண்டல்', 'திண்டுக்கல்', 'திருக்கோயிலூர்', 'திருச்சி (கிழக்கு)',
        'திருச்சி (மத்திய)', 'திருச்சி (மேற்கு)', 'திருச்செந்தூர்', 'திருத்தணி', 'திருத்துறைப்பூண்டி', 'திருநெல்வேலி',
        'திருப்பத்தூர்', 'திருப்பரங்குன்றம்', 'திருப்போர்', 'திருமங்கலம்', 'திருமயம்', 'திருமுல்லைவாயல்', 'திருவண்ணாமலை',
        'திருவாடாணை', 'திருவாரூர்', 'திருவிடைமருதூர்', 'திருவில்லிபுத்தூர்', 'திருவெறும்பூர்', 'திருவோட்டியூர்', 'தீர்த்தம்',
        'தேங்காசி', 'தேவகோட்டை', 'தொண்டாமுத்தூர்', 'நகர்கோவில்', 'நம்மக்கல்', 'நல்லூர்', 'நாகப்பட்டினம்', 'நாகர்கோவில்',
        'நாஞ்சிக்கொட்டை', 'நாமக்கல்', 'நீடாமங்கலம்', 'நீலகிரி', 'பட்டினாம்', 'பட்டுக்கோட்டை', 'பண்ணைமாடு', 'பண்ருட்டி',
        'பரமக்குடி', 'பரமத்தி', 'பழனி', 'பழனிசாமி', 'பழாயங்கோட்டை', 'பழையதம்', 'பழையமாநேரி', 'பாபநாசம்', 'பாண்டி',
        'பாளச்சோழன்பட்டு', 'பாளையம்கோட்டை', 'பூந்தமல்லி', 'பூதனூர்', 'பூவணம்மலை', 'பெண்ணாகரம்', 'பெரம்பலூர்', 'பெரியகுளம்',
        'பெரியகுன்னம்', 'பெருந்துறை', 'பெருமணல்மேடு', 'பேரகம்', 'பேராவூரணி', 'பொள்ளாச்சி', 'பொன்னேரி', 'மதுரை - கிழக்கு',
        'மதுரை - தெற்கு', 'மதுரை - மத்திய', 'மதுரை - மேற்கு', 'மதுரை - வடக்கு', 'மதுரை (ஆவடிகாடு)', 'மணப்பாறை', 'மணலி',
        'மணலூர்', 'மதுரன்த்தகம்', 'மயிலாடுதுறை', 'மாதவரம்', 'மாந்தனாம்', 'மாயவரம்', 'முதுகுளத்தூர்', 'முசிறி',
        'முஸ்ஸியம்பாடி', 'மேட்டூர்', 'மேலூர்', 'வசதாலை', 'வடமதுரை', 'வடிப்பட்டி', 'வட்டலகுண்டு', 'வண்டலூர்', 'வண்டவாசி',
        'வத்திராயிருப்பு', 'வந்தவாசி', 'வல்பாரை', 'வல்லம்', 'வாலாஜாபேட்டை', 'வாலாஜா', 'வாழப்பாடி', 'விருதாச்சலம்',
        'விருத்தாசலம்', 'விருதுநகர்', 'வில்லுபுரம்', 'வீரபாண்டி கட்டபோம்மன்', 'வேம்பார்', 'வேப்பனபல்லி', 'வேளூர்', 'வேளூர் (வடக்கு)'
    ];

    // Get filtered constituencies based on selected district
    const getFilteredConstituencies = () => {
        if (selectedDistrict === 'all') {
            return constituencies;
        }
        return districtConstituencies[selectedDistrict] || [];
    };

    const filteredConstituencies = getFilteredConstituencies();

    // Handle district change - reset constituency selection
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(e.target.value);
        setSelectedConstituency('all');
    };

    const stats = [
        { icon: Users, label: 'மொத்த வாக்குகள்', value: '1,23,45,678' },
        { icon: MapPin, label: 'தொகுதிகள்', value: '234' },
        { icon: TrendingUp, label: 'வாக்கு சதவீதம்', value: '4.2%' },
        { icon: Calendar, label: 'ஆண்டு', value: '2016' },
    ];

    const highlights = [
        { title: 'தமிழக சட்டமன்ற தேர்தல்', description: 'நாம் தமிழர் கட்சியின் முதல் தேர்தல் பிரச்சாரம்' },
        { title: 'செந்தமிழன் சீமான்', description: 'தலைமை ஒருங்கிணைப்பாளராக களத்தில் இறங்கினார்' },
        { title: '234 தொகுதிகள்', description: 'அனைத்து தொகுதிகளிலும் போட்டியிட்டோம்' },
        { title: 'மக்கள் ஆதரவு', description: 'புதிய அரசியல் சக்தியாக அடையாளம் பெற்றோம்' },
    ];

    // Generate all candidates dynamically from district-constituency mapping
    const generateAllCandidates = () => {
        const candidates: CandidateData[] = [];
        let id = 1;

        Object.entries(districtConstituencies).forEach(([district, constituenciesList]) => {
            constituenciesList.forEach((constituency) => {
                candidates.push({
                    id: id++,
                    name: constituency === 'சென்னை - அண்ணாநகர்' ? 'செந்தமிழன் சீமான்' : `வேட்பாளர் - ${constituency}`,
                    constituency: constituency,
                    district: district,
                    age: '45',
                    education: 'எம்.ஏ',
                    joinedYear: '2010',
                    phone: '+91 98765 43210',
                    email: 'candidate@naamtamilar.org',
                    bio: 'தமிழ் மக்களின் உரிமைகளுக்காக குரல் கொடுத்து வரும் தீவிர சமூக ஆர்வலர்.'
                });
            });
        });

        return candidates;
    };

    const defaultCandidates = generateAllCandidates();
    const allCandidates = uploadedCandidates.length > 0 ? uploadedCandidates : defaultCandidates;

    const handleCandidatesImport = (candidates: CandidateData[]) => {
        setUploadedCandidates(candidates);
        // Save to localStorage for persistence
        localStorage.setItem('uploadedCandidates', JSON.stringify(candidates));
    };

    // Filter candidates based on selected district and constituency
    const getFilteredCandidates = () => {
        let filtered = allCandidates;
        
        if (selectedDistrict !== 'all') {
            filtered = filtered.filter(candidate => candidate.district === selectedDistrict);
        }
        
        if (selectedConstituency !== 'all') {
            filtered = filtered.filter(candidate => candidate.constituency === selectedConstituency);
        }
        
        return filtered;
    };

    const displayedCandidates = getFilteredCandidates();

    // Handle loading state
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedDistrict, selectedConstituency]);

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
                            தேர்தல் - 2026
                        </h1>
                        <p className="text-xl md:text-2xl text-yellow-300">
                            தமிழக சட்டமன்ற தேர்தல்
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-lg p-6 text-center"
                        >
                            <stat.icon className="w-8 h-8 md:w-12 md:h-12 mx-auto text-red-600 mb-3" />
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base text-gray-600">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Highlights Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
                >
                    முக்கிய சிறப்புகள்
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {highlights.map((highlight, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {highlight.title}
                            </h3>
                            <p className="text-gray-600">
                                {highlight.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Image Gallery Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900"
                        >
                            வேட்பாளர்கள் பட்டியல்
                        </motion.h2>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
                            {/* CSV Upload Button */}
                            <CandidateCSVUpload onCandidatesImport={handleCandidatesImport} />

                            {/* Dropdowns Container */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* District Dropdown */}
                                <select
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    className="w-full sm:w-64 px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white text-gray-900 font-medium"
                                >
                                    <option value="all">அனைத்து மாவட்டங்களும்</option>
                                    {districts.map((district, index) => (
                                        <option key={index} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>

                                {/* Constituency Dropdown */}
                                <select
                                    value={selectedConstituency}
                                    onChange={(e) => setSelectedConstituency(e.target.value)}
                                    className="w-full sm:w-64 px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white text-gray-900 font-medium"
                                >
                                    <option value="all">அனைத்து தொகுதிகளும்</option>
                                    {filteredConstituencies.map((constituency, index) => (
                                        <option key={index} value={constituency}>
                                            {constituency}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
                                <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {displayedCandidates.length > 0 ? (
                                displayedCandidates.map((candidate) => (
                                    <motion.div
                                        key={candidate.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: candidate.id * 0.01 }}
                                    >
                                        <Link 
                                            to="/candidate-profile"
                                            state={{ 
                                                name: candidate.name, 
                                                constituency: candidate.constituency,
                                                district: candidate.district,
                                                age: candidate.age,
                                                education: candidate.education,
                                                joinedYear: candidate.joinedYear,
                                                phone: candidate.phone,
                                                email: candidate.email,
                                                bio: candidate.bio
                                            }}
                                            className="block bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                                        >
                                            <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <User size={40} className="text-white" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-1">{candidate.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{candidate.constituency}</p>
                                            <div className="text-xs text-red-600 font-semibold">நாம் தமிழர் கட்சி</div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 md:col-span-3 text-center py-12">
                                    <p className="text-gray-600 text-lg">தேர்ந்தெடுக்கப்பட்ட தொகுதிக்கு வேட்பாளர்கள் இல்லை</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Election2016;
