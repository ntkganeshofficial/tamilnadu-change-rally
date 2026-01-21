import HeroSection from "@/components/HeroSection";
import AttendanceForm from "@/components/AttendanceForm";
import LocationSection from "@/components/LocationSection";
import UpdatesSection from "@/components/UpdatesSection";
import TamilNaduMap from "@/components/TamilNaduMap";
import { motion } from "framer-motion";
import { useState } from "react";

interface District {
    name: string;
    tamil: string;
    registrations: number;
}

const Index = () => {
    const initialDistricts: District[] = [
        { name: 'Chennai', tamil: 'சென்னை', registrations: 5393 },
        { name: 'Chengalpattu', tamil: 'செங்கல்பட்டு', registrations: 1237 },
        { name: 'Kancheepuram', tamil: 'காஞ்சிபுரம்', registrations: 845 },
        { name: 'Ranipet', tamil: 'ராணிப்பேட்டை', registrations: 623 },
        { name: 'Vellore', tamil: 'வேலூர்', registrations: 912 },
        { name: 'Tiruppattur', tamil: 'திருப்பத்தூர்', registrations: 456 },
        { name: 'Krishnagiri', tamil: 'கிருஷ்ணகிரி', registrations: 1158 },
        { name: 'Dharmapuri', tamil: 'தர்மபுரி', registrations: 534 },
        { name: 'Salem', tamil: 'சேலம்', registrations: 2070 },
        { name: 'Namakkal', tamil: 'நாமக்கல்', registrations: 723 },
        { name: 'Erode', tamil: 'ஈரோடு', registrations: 1413 },
        { name: 'Karur', tamil: 'கரூர்', registrations: 612 },
        { name: 'Tiruppur', tamil: 'திருப்பூர்', registrations: 1470 },
        { name: 'Coimbatore', tamil: 'கோயம்பத்தூர்', registrations: 2102 },
        { name: 'The Nilgiris', tamil: 'நீலகிரி', registrations: 389 },
        { name: 'Tiruchirappalli', tamil: 'திருச்சிராப்பள்ளி', registrations: 1602 },
        { name: 'Ariyalur', tamil: 'அரியலூர்', registrations: 445 },
        { name: 'Perambalur', tamil: 'பெரம்பலூர்', registrations: 378 },
        { name: 'Cuddalore', tamil: 'கடலூர்', registrations: 567 },
        { name: 'Villupuram', tamil: 'விழுப்புரம்', registrations: 689 },
        { name: 'Kallakurichi', tamil: 'கள்ளக்குறிச்சி', registrations: 700 },
        { name: 'Tiruvannamalai', tamil: 'திருவண்ணாமலை', registrations: 1258 },
        { name: 'Tiruvarur', tamil: 'திருவாரூர்', registrations: 598 },
        { name: 'Thanjavur', tamil: 'தஞ்சாவூர்', registrations: 1316 },
        { name: 'Nagapattinam', tamil: 'நாகப்பட்டிணம்', registrations: 478 },
        { name: 'Mayiladuthurai', tamil: 'மயிலாடுதுறை', registrations: 412 },
        { name: 'Puducherry', tamil: 'புதுச்சேரி', registrations: 734 },
        { name: 'Madurai', tamil: 'மதுரை', registrations: 2002 },
        { name: 'Theni', tamil: 'தேனி', registrations: 756 },
        { name: 'Dindigul', tamil: 'திண்டுக்கல்', registrations: 1171 },
        { name: 'Sivagangai', tamil: 'சிவகங்கை', registrations: 623 },
        { name: 'Ramanathapuram', tamil: 'ராமநாதபுரம்', registrations: 534 },
        { name: 'Thoothukudi', tamil: 'தூத்துக்குடி', registrations: 845 },
        { name: 'Tirunelveli', tamil: 'தென்காசி', registrations: 912 },
        { name: 'Kanyakumari', tamil: 'கன்னியாகுமரி', registrations: 1770 },
        { name: 'Pudukkottai', tamil: 'புதுக்கோட்டை', registrations: 689 },
    ];

    const [districts, setDistricts] = useState<District[]>(initialDistricts);
    const handleRegistration = (districtName: string) => {
        setDistricts(prevDistricts =>
            prevDistricts.map(district =>
                district.name === districtName
                    ? { ...district, registrations: district.registrations + 1 }
                    : district
            )
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <HeroSection />

            {/* Registration Section */}
            <section id="attendance-form" className="py-6 md:py-1" style={{ backgroundColor: '#ed1c24' }}>
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                    </motion.div>
                    <AttendanceForm onRegistration={handleRegistration} />
                </div>
            </section>
            
            {/* Tamil Nadu Constituency Map */}
            <section id="live-registration">
                <TamilNaduMap districts={districts} />
            </section>

            {/* Updates Section */}
            <section className="py-6 md:py-1" style={{ backgroundColor: '#ed1c24' }}>
                <UpdatesSection />
            </section>

            {/* Location Section */}
            <section id="location" className="py-6 md:py-1" style={{ backgroundColor: '#ed1c24' }}>
                <LocationSection />
            </section>
            {/* Footer */}
        </div>
    );
};

export default Index;
