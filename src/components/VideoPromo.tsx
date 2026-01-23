import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const VideoPromo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isPlaying) {
                        setIsPlaying(true);
                    }
                });
            },
            { threshold: 0.3 } // Trigger when 30% of section is visible
        );

        const currentSection = sectionRef.current;
        if (currentSection) {
            observer.observe(currentSection);
        }

        return () => {
            if (currentSection) {
                observer.unobserve(currentSection);
            }
        };
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying && videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log('Video play failed:', error);
            });
        }
    }, [isPlaying]);

    return (
        <section ref={sectionRef} className="relative w-full md:w-[93%] mx-auto bg-black/90 video-promo-section">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[30vh] md:h-screen flex items-center justify-center"
            >
                {/* Video Container */}
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                    {!isPlaying ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="relative w-full h-full flex items-center justify-center cursor-pointer group"
                            onClick={() => setIsPlaying(true)}
                        >
                            {/* Thumbnail/Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
                            <img
                                src="/maanaadu-2026-logo-final.png"
                                alt="Video Promo"
                                className="w-full h-full object-contain"
                            />

                            {/* Play Button */}
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                className="absolute z-20 flex items-center justify-center"
                            >
                                <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 transition-all shadow-2xl">
                                    <svg
                                        className="w-12 h-12 fill-current"
                                        viewBox="0 0 24 24"
                                    >
                                        <polygon points="5 3 19 12 5 21" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* "Click to Play" Text */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute bottom-10 z-20 text-white text-center"
                            >
                                <p className="text-lg font-semibold">Click to Play</p>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full h-full"
                        >
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                src="/maanaadu-promo-video-logo.mp4"
                                title="Maanadu Promo Video"
                                controls
                                controlsList="nodownload"
                                muted
                                playsInline
                                loop
                            />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default VideoPromo;
