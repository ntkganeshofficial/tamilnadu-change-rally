import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, Home, Calendar, Upload, Map } from 'lucide-react';

interface HeaderProps {
    userName?: string;
    onLogout?: () => void;
}

const Header = ({ userName = "பயனர்", onLogout }: HeaderProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const menuItems = [
        { name: 'முகப்பு', icon: Home, href: '/' },
        { name: 'மாநாடு', icon: Calendar, href: '/#rally' },
        { name: 'தேர்தல்-2026', icon: Upload, href: '/election-2016' },
        { name: 'களப்பணி', icon: Map, href: '/field-work' },
        { name: 'செயற்பாட்டு வரைவு', icon: Map, href: '/action-plan' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsProfileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    return (
        <header className="bg-gradient-to-r from-red-700 to-red-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img 
                                src="/logo-2024-new.png" 
                                alt="நாம் தமிழர்" 
                                className="h-12 md:h-16 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8">
                        {menuItems.map((item) => (
                            item.href.startsWith('/#') ? (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors duration-200 font-medium"
                                >
                                    <item.icon size={18} />
                                    <span>{item.name}</span>
                                </a>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors duration-200 font-medium"
                                >
                                    <item.icon size={18} />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        ))}
                    </nav>

                    {/* Desktop Profile Menu */}
                    <div className="hidden md:block relative">
                        {onLogout ? (
                            <>
                                <button
                                    onClick={toggleProfileMenu}
                                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-red-700 px-4 py-2 rounded-full transition-all duration-200 font-bold"
                                >
                                    <User size={18} />
                                    <span>{userName}</span>
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden"
                                        >
                                            <a
                                                href="#profile"
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 transition-colors"
                                            >
                                                <User size={18} />
                                                <span>சுயவிவரம்</span>
                                            </a>
                                            <a
                                                href="#settings"
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 transition-colors"
                                            >
                                                <Settings size={18} />
                                                <span>அமைப்புகள்</span>
                                            </a>
                                            <button
                                                onClick={onLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                <span>வெளியேறு</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-red-700 px-4 py-2 rounded-full transition-all duration-200 font-bold"
                            >
                                <User size={18} />
                                <span>உள்நுழைக</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white hover:text-yellow-400 transition-colors p-2"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-red-600 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {menuItems.map((item) => (
                                item.href.startsWith('/#') ? (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 text-white hover:bg-red-700 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <item.icon size={18} />
                                        <span>{item.name}</span>
                                    </a>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className="flex items-center gap-3 text-white hover:bg-red-700 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <item.icon size={18} />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Mobile Profile Section */}
                        <div className="border-t border-red-700 pt-4 pb-3 px-2">
                            {onLogout ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 mb-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-red-700" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-bold">{userName}</div>
                                            <div className="text-yellow-300 text-sm">உறுப்பினர்</div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <a
                                            href="#profile"
                                            className="flex items-center gap-3 text-white hover:bg-red-700 px-3 py-2 rounded-md transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User size={18} />
                                            <span>சுயவிவரம்</span>
                                        </a>
                                        <a
                                            href="#settings"
                                            className="flex items-center gap-3 text-white hover:bg-red-700 px-3 py-2 rounded-md transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Settings size={18} />
                                            <span>அமைப்புகள்</span>
                                        </a>
                                        <button
                                            onClick={() => {
                                                onLogout?.();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 text-yellow-300 hover:bg-red-700 px-3 py-2 rounded-md transition-colors"
                                        >
                                            <LogOut size={18} />
                                            <span>வெளியேறு</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-red-700 px-4 py-2 rounded-full transition-all duration-200 font-bold mx-3"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User size={18} />
                                    <span>உள்நுழைக</span>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
