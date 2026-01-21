import HeroSection from "@/components/HeroSection";
import AttendanceForm from "@/components/AttendanceForm";
import LocationSection from "@/components/LocationSection";
import UpdatesSection from "@/components/UpdatesSection";
import TamilNaduMap from "@/components/TamilNaduMap";
import { motion } from "framer-motion";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <HeroSection />

            {/* Registration Section */}
            <section id="attendance-form" className="md:py-1" style={{ backgroundColor: '#ed1c24' }}>
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >

                    </motion.div>

                    <AttendanceForm />
                </div>
            </section>
            
            {/* Tamil Nadu Constituency Map */}
            <section id="live-registration">
                <TamilNaduMap />
            </section>

            {/* Updates Section */}
            <UpdatesSection />

            {/* Location Section */}
            <section id="location">
                <LocationSection />
            </section>
            {/* Footer */}
        </div>
    );
};

export default Index;
