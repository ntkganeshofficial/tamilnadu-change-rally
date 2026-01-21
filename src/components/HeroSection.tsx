import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import { useState, useEffect } from "react";


const HeroSection = () => {
    const [showImage, setShowImage] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const tamilNaduMapSection = document.querySelector('.tamil-nadu-map-section');
            if (tamilNaduMapSection) {
                const rect = tamilNaduMapSection.getBoundingClientRect();
                setShowImage(rect.top > window.innerHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <section className="relative w-full h-80 flex flex-col items-center justify-center overflow-visible" style={{ backgroundColor: '#ed1c24', backgroundImage: 'url(/maanaadu-2026-logo-final.png)', backgroundSize: '26%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                {/* Right Side Image - Half in Hero, Half in Timer */}
                {showImage && (
                    <img
                        src="/annan-may-18-kovai-full-standing-hand-raising.png"
                        alt="Annan"
                        className="fixed right-10 top-0 h-screen object-cover pointer-events-none z-10"
                        style={{ height: '38rem' }}
                    />
                )}

                {/* Decorative Background Elements */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400/10 rounded-full filter blur-3xl opacity-20" />
                <div className="absolute right-20 w-96 h-96 bg-yellow-400/10 rounded-full filter blur-3xl opacity-20" />
            </section>
            <div className="relative overflow-visible" style={{ backgroundColor: '#ed1c24' }}>
                <CountdownTimer />
            </div>
        </>
    );
};

export default HeroSection;
