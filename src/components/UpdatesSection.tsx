import { motion } from 'framer-motion';

const UpdatesSection = () => {
    const updates = [
        {
            date: 'Jan 25, 2026',
            title: 'Kickoff Event',
            description: 'Join us for the official launch of the Tamil Nadu Change Rally',
            district: 'Chennai',
        },
        {
            date: 'Feb 10, 2026',
            title: 'Regional Meet',
            description: 'District-wise regional meetings to discuss local concerns',
            district: 'Coimbatore',
        },
        {
            date: 'Mar 5, 2026',
            title: 'Grand Rally',
            description: 'Join thousands of participants from across Tamil Nadu',
            district: 'Madurai',
        },
    ];

    return (
        <section className="py-6 md:py-20 bg-background" style={{ backgroundColor: '#ed1c24' }}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >

                    <h2 className="text-2xl md:text-2xl text-white text-center text-foreground">
                        அடுத்த நிகழ்வு
                    </h2>
                    
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {updates.map((update, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-background rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="text-sm font-semibold text-primary mb-2">
                                {update.date}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                {update.title}
                            </h3>
                            <p className="text-foreground/70 mb-4">
                                {update.description}
                            </p>
                            <div className="inline-block px-3 py-1 bg-yellow-400 text-red-600 rounded-full text-sm font-medium">
                                {update.district}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UpdatesSection;
