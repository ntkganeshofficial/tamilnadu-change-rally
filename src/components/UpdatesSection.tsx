import { motion } from 'framer-motion';

const UpdatesSection = () => {
    const updates = [
        {
            date: 'பிப் 20, 2026',
            title: 'மாநாட்டு திடல் பார்வையிடல்',
            description: 'மாற்றத்தை விரும்பும் மக்களின் மாநாட்டு திடல் பார்வையிடல் நிகழ்வு.',
            district: 'திருச்சி',
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

                <div className="grid gap-6">
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
