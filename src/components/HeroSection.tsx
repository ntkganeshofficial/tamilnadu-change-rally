import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import { useState, useEffect } from "react";

interface HeroSectionProps {
    totalRegistrations: number;
}

const HeroSection = ({ totalRegistrations }: HeroSectionProps) => {
    const [showImage, setShowImage] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleScroll = () => {
            const tamilNaduMapSection = document.querySelector('.tamil-nadu-map-section');
            const videoPromoSection = document.querySelector('.video-promo-section');
            
            if (tamilNaduMapSection) {
                const rect = tamilNaduMapSection.getBoundingClientRect();
                if (rect.top <= window.innerHeight) {
                    setShowImage(false);
                    return;
                }
            }
            
            if (videoPromoSection) {
                const rect = videoPromoSection.getBoundingClientRect();
                if (rect.top <= window.innerHeight) {
                    setShowImage(false);
                    return;
                }
            }
            
            setShowImage(true);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <section className="relative w-full h-80 flex flex-col items-center justify-center overflow-visible" style={{ backgroundColor: '#ed1c24', backgroundImage: `url(/${isMobile ? 'maanaadu-2026-logo-final-1024.png' : 'maanaadu-2026-logo-final.png'})`, backgroundSize: isMobile ? '95%' : '26%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                {/* Right Side Image - Half in Hero, Half in Timer */}
                {showImage && (
                    <img
                        src="/annan-may-18-kovai-full-standing-hand-raising.png"
                        alt="Annan"
                        className="fixed right-10 top-0 h-screen object-cover pointer-events-none z-10 hidden md:block"
                        style={{ height: '35rem' }}
                    />
                )}

                {/* Decorative Background Elements */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400/10 rounded-full filter blur-3xl opacity-20" />
                <div className="absolute right-20 w-96 h-96 bg-yellow-400/10 rounded-full filter blur-3xl opacity-20" />
            </section>
            <div className="relative overflow-visible" style={{ backgroundColor: '#ed1c24' }}>
                <CountdownTimer totalRegistrations={totalRegistrations} />
            </div>
        </>
    );
};

export default HeroSection;
