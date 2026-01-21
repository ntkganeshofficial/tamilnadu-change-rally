import { motion } from 'framer-motion';

const LocationSection = () => {
    return (
        <section className="py-1 md:py-20" style={{ backgroundColor: '#ed1c24' }}>
            <div className="container mx-auto px-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-background rounded-lg shadow-lg p-8"
                    >
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.5697192645596!2d80.24697!3d13.0064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526d6b6b6b6b6b%3A0x1234567890abcdef!2sChennai%20Convention%20Centre!5e0!3m2!1sen!2sin!4v1705740000000"
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
