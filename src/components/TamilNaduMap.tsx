import { motion } from 'framer-motion';
import { useState } from 'react';
import InteractiveTNMap from './InteractiveTNMap';
// import ExportRegistrations from './ExportRegistrations';

interface District {
    name: string;
    tamil: string;
    registrations: number;
}

interface TamilNaduMapProps {
    districts: District[];
}

const TamilNaduMap = ({ districts }: TamilNaduMapProps) => {
    // Get the top district (highest registrations) as default
    const topDistrict = districts.length > 0 
        ? [...districts].sort((a, b) => b.registrations - a.registrations)[0].name 
        : null;
    
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(topDistrict);

    const totalRegistrations = districts.reduce((sum, d) => sum + d.registrations, 0);
    const totalDistricts = districts.length;
    const avgRegistrations = Math.round(totalRegistrations / totalDistricts);

    return (
        <section className="py-1 md:py-2 tamil-nadu-map-section" style={{ backgroundColor: '#ed1c24' }}>
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
                    <div className="lg:col-span-2 lg:h-[45rem] bg-background rounded-lg shadow-lg p-4">
                        <h2 className="text-2xl md:text-2xl text-red text-center text-foreground">
                            மாவட்ட வரைபடம்
                        </h2>
                        <div className="flex items-start justify-center p-2">
                            <InteractiveTNMap 
                                selectedDistrict={selectedDistrict}
                                onDistrictClick={setSelectedDistrict}
                                districts={districts}
                            />
                        </div>
                    </div>

                    

                    {/* Selected District Details */}
                    {selectedDistrict && (
                        <div className="bg-background rounded-lg shadow-lg p-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="text-center">
                                    {/* <div className="text-sm font-fredoka opacity-80 mb-2">தேர்ந்தெடுக்கப்பட்ட மாவட்டம்</div> */}
                                    <h2 className="text-2xl md:text-2xl text-red text-center text-foreground">
                             மாவட்டம்
                        </h2>
                                    <div className="text-1xl font-bold font-tamil text-red-600">
                                        {districts.find((d) => d.name === selectedDistrict)?.tamil}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-fredoka opacity-80 mb-2">மொத்த பதிவுகள்</div>
                                    <div className="text-2xl font-bold">
                                        {districts.find((d) => d.name === selectedDistrict)?.registrations.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-fredoka opacity-80 mb-2">மாவட்ட தரவரிசை</div>
                                    <div className="text-2xl font-bold">
                                        {(() => {
                                            const index = districts.sort((a, b) => b.registrations - a.registrations).findIndex((d) => d.name === selectedDistrict) + 1;
                                            return `#${index}`;
                                        })()}
                                    </div>
                                </div>
                                
                                {/* Statistics Cards */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-tamil text-center mb-3">மொத்த புள்ளிவிவரங்கள்</h3>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'மொத்த பதிவுகள்', value: totalRegistrations.toLocaleString(), color: 'bg-green-600' },
                                            { label: 'மாவட்டங்கள்', value: totalDistricts, color: 'bg-blue-600' },
                                            { label: 'சராசரி', value: avgRegistrations, color: 'bg-yellow-600' },
                                        ].map((stat, index) => (
                                            <div
                                                key={index}
                                                className={`${stat.color} rounded-lg p-3 text-white shadow-md text-center`}
                                            >
                                                <div className="text-xs font-fredoka opacity-90 mb-1">{stat.label}</div>
                                                <div className="text-xl font-bold font-tamil">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* <div>
                                    <ExportRegistrations />
                                </div> */}
                            </div>
                        </div>
                    )}
                </motion.div>

            </div>
        </section>
    );
};

export default TamilNaduMap;
