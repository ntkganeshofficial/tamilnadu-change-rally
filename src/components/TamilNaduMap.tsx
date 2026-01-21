import { motion } from 'framer-motion';
import { useState } from 'react';

const TamilNaduMap = () => {
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

    const districts = [
        { name: 'Chennai', tamil: 'சென்னை', registrations: 5393 },
        { name: 'Chengalpattu', tamil: 'செங்கல்பட்டு', registrations: 1237 },
        { name: 'Kancheepuram', tamil: 'காஞ்சிபுரம்', registrations: 845 },
        { name: 'Ranipet', tamil: 'ராணிப்பேட்டை', registrations: 623 },
        { name: 'Vellore', tamil: 'வேலூர்', registrations: 912 },
        { name: 'Tiruppattur', tamil: 'திருப்பத்தூர்', registrations: 456 },
        { name: 'Krishnagiri', tamil: 'கிருஷ்ணாகிரி', registrations: 1158 },
        { name: 'Dharmapuri', tamil: 'தர்மபுரி', registrations: 534 },
        { name: 'Salem', tamil: 'சேலம்', registrations: 2070 },
        { name: 'Namakkal', tamil: 'நாமக்கல்', registrations: 723 },
        { name: 'Erode', tamil: 'ஈரோடு', registrations: 1413 },
        { name: 'Karur', tamil: 'கரூர்', registrations: 612 },
        { name: 'Tiruppur', tamil: 'திருப்பூர்', registrations: 1470 },
        { name: 'Coimbatore', tamil: 'கோயம்பத்தூர்', registrations: 2102 },
        { name: 'The Nilgiris', tamil: 'நீலகிரி', registrations: 389 },
        { name: 'Tiruchirappalli', tamil: 'திருச்சிராப்பள்ளி', registrations: 1602 },
        { name: 'Ariyalur', tamil: 'அரியலூர்', registrations: 445 },
        { name: 'Perambalur', tamil: 'பெரம்பலூர்', registrations: 378 },
        { name: 'Cuddalore', tamil: 'கடலூர்', registrations: 567 },
        { name: 'Villupuram', tamil: 'விழுப்புரம்', registrations: 689 },
        { name: 'Tiruvannamalai', tamil: 'திருவண்ணாமலை', registrations: 1258 },
        { name: 'Tiruvarur', tamil: 'திருவாரூர்', registrations: 598 },
        { name: 'Thanjavur', tamil: 'தஞ்சாவூர்', registrations: 1316 },
        { name: 'Nagapattinam', tamil: 'நாகப்பட்டிணம்', registrations: 478 },
        { name: 'Mayiladuthurai', tamil: 'மயிலாடுதுறை', registrations: 412 },
        { name: 'Puducherry', tamil: 'புதுச்சேரி', registrations: 734 },
        { name: 'Madurai', tamil: 'மதுரை', registrations: 2002 },
        { name: 'Theni', tamil: 'தேனி', registrations: 756 },
        { name: 'Dindigul', tamil: 'திண்டுக்கல்', registrations: 1171 },
        { name: 'Sivagangai', tamil: 'சிவகங்கை', registrations: 623 },
        { name: 'Ramanathapuram', tamil: 'ராமநாதபுரம்', registrations: 534 },
        { name: 'Thoothukudi', tamil: 'தூத்துக்குடி', registrations: 845 },
        { name: 'Tirunelveli', tamil: 'தென்காசி', registrations: 912 },
        { name: 'Kanyakumari', tamil: 'கன்னியாகுமரி', registrations: 1770 },
        { name: 'Pudukkottai', tamil: 'புதுக்கோட்டை', registrations: 689 },
    ];

    const totalRegistrations = districts.reduce((sum, d) => sum + d.registrations, 0);
    const totalDistricts = districts.length;
    const avgRegistrations = Math.round(totalRegistrations / totalDistricts);

    return (
        <section className="py-4 md:py-6 tamil-nadu-map-section" style={{ backgroundColor: '#ed1c24' }}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                >
                    {/* Map Column */}
                    <div className="lg:col-span-1 bg-background rounded-lg shadow-lg p-4">
                        <h2 className="text-2xl md:text-2xl text-red text-center text-foreground">
                            மாவட்ட வரைபடம்
                        </h2>
                        <div className="flex items-start justify-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Tamil_Nadu_districts_map.svg"
                                alt="Tamil Nadu Districts Map"
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                    </div>

                    {/* Rankings Column */}
                    <div className="bg-background rounded-lg shadow-lg p-4">

                        <h2 className="text-2xl md:text-2xl text-red text-center text-foreground">
                            மாவட்ட தரவரிசை
                        </h2>
                        <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                            {districts.sort((a, b) => b.registrations - a.registrations).map((district, index) => (
                                <motion.button
                                    key={district.name}
                                    whileHover={{ x: 2 }}
                                    onClick={() => setSelectedDistrict(selectedDistrict === district.name ? null : district.name)}
                                    className={`w-full text-left p-2 rounded text-xs transition-all font-fredoka whitespace-nowrap ${selectedDistrict === district.name
                                            ? 'bg-red-600 text-white shadow-lg'
                                            : 'bg-gray-100 hover:bg-red-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold">#{index + 1} {district.tamil}</div>
                                        <div className={`font-semibold ${selectedDistrict === district.name ? 'text-white' : 'text-red-600'}`}>
                                            {district.registrations.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className={`text-xs ${selectedDistrict === district.name ? 'text-white/80' : 'text-gray-600'}`}>
                                        {district.name}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Statistics Cards Column */}
                    <div className="bg-background rounded-lg shadow-lg p-4">

                        <h2 className="text-2xl md:text-2xl text-red text-center text-foreground">
                            பதிவு நிலை
                        </h2>
                        <div className="space-y-2">
                            {[
                                { label: 'மொத்த பதிவுகள்', value: totalRegistrations.toLocaleString(), color: 'bg-primary' },
                                { label: 'மாவட்டங்கள்', value: totalDistricts, color: 'bg-emerald-500' },
                                { label: 'சராசரி', value: avgRegistrations, color: 'bg-green-500' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ translateY: -2 }}
                                    className={`${stat.color} rounded-lg p-4 text-white shadow-md text-center`}
                                >
                                    <div className="text-xs font-fredoka opacity-90 mb-2">{stat.label}</div>
                                    <div className="text-2xl font-bold font-tamil">{stat.value}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Selected District Info 
        {selectedDistrict && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-fredoka opacity-80 mb-2">தேர்ந்தெடுக்கப்பட்ட மாவட்டம்</div>
                  <div className="text-3xl font-bold font-tamil">
                    {districts.find((d) => d.name === selectedDistrict)?.tamil}
                  </div>
                  <div className="text-sm opacity-75 mt-1">{selectedDistrict}</div>
                </div>
                <div>
                  <div className="text-sm font-fredoka opacity-80 mb-2">மொத்த பதிவுகள்</div>
                  <div className="text-3xl font-bold">
                    {districts.find((d) => d.name === selectedDistrict)?.registrations.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-fredoka opacity-80 mb-2">நிலை</div>
                  <div className="text-3xl font-bold font-tamil">
                    {(() => {
                      const regs = districts.find((d) => d.name === selectedDistrict)?.registrations || 0;
                      return regs > 2000 ? 'முதல்' : regs > 1000 ? 'இரண்டாம்' : 'மூன்றாம்';
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
        )}*/}

                {/* Selected District Details */}
                {selectedDistrict && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-gradient-to-r from-primary to-emerald-600 rounded-xl shadow-tamil-lg p-8 text-white"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="text-sm font-fredoka opacity-80 mb-2">தேர்ந்தெடுக்கப்பட்ட மாவட்டம்</div>
                                <div className="text-3xl font-bold font-tamil">
                                    {districts.find((d) => d.name === selectedDistrict)?.tamil}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-fredoka opacity-80 mb-2">மொத்த பதிவுகள்</div>
                                <div className="text-3xl font-bold">
                                    {districts.find((d) => d.name === selectedDistrict)?.registrations.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-fredoka opacity-80 mb-2">மாவட்ட தரவரிசை</div>
                                <div className="text-3xl font-bold">
                                    {(() => {
                                        const index = districts.sort((a, b) => b.registrations - a.registrations).findIndex((d) => d.name === selectedDistrict) + 1;
                                        return `#${index}`;
                                    })()}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default TamilNaduMap;
