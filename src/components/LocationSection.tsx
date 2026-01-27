import { motion } from 'framer-motion';

const LocationSection = () => {
    return (
        <section className="py-3 md:py-8" style={{ backgroundColor: '#ed1c24' }}>
            <div className="container mx-auto w-[93%] md:w-auto px-0 md:px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-2xl text-white text-center text-foreground">
                        நிகழ்விடம்
                    </h2>
                </motion.div>

                <div className="grid">
                    {/* <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-background rounded-lg shadow-lg p-8"
                    >
                        <h3 className="text-xl font-bold text-foreground mb-4">
                            Main Venue
                        </h3>
                        <p className="text-foreground/70 mb-4">
                            Chennai Convention Centre
                        </p>
                        <p className="text-foreground/70 mb-4">
                            No. 100, Pantheon Road, Egmore, Chennai - 600008
                        </p>
                        <p className="text-foreground/70">
                            Contact: +91 99416 94861
                        </p>
                    </motion.div> */}

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-background rounded-none md:rounded-lg shadow-lg p-0 md:p-8"
                    >
                        <div className="aspect-video bg-muted rounded-none md:rounded-lg overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src="https://maps.google.com/maps?q=MGXG+4F,+Chithanatham,+Tamil+Nadu&z=15&output=embed"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LocationSection;
