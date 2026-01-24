import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-100 py-8" style={{ backgroundColor: '#ed1c24' }}>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 text-center"
            >
                <p className="text-sm text-white mb-2">
                    &copy; 2026 நாம் தமிழர் கட்சி - தகவல் தொழில்நுட்பப் பாசறை
                </p>
                <p className="text-xs text-yellow-500">
                    மாற்றத்தை விரும்பும் மக்களின் மாநாடு - 2026
                </p>
            </motion.div>
        </footer>
    );
};

export default Footer;
