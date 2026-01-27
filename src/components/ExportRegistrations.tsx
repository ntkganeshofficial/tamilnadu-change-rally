import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Download, Loader2 } from 'lucide-react';

interface Registration {
    name: string;
    email: string;
    phone: string;
    district: string;
    districtEnglish: string;
    memberId: string;
    registeredAt?: any;
}

const ExportRegistrations = () => {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchRegistrationsFromFirestore = async (): Promise<Registration[]> => {
        try {
            const registrationsRef = collection(db, 'registrations');
            const querySnapshot = await getDocs(registrationsRef);

            const registrations: Registration[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                registrations.push({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    district: data.district || '',
                    districtEnglish: data.districtEnglish || '',
                    memberId: data.memberId || '',
                    registeredAt: data.registeredAt || null,
                });
            });

            console.log(`Fetched ${registrations.length} registrations from Firestore`);
            setTotalRecords(registrations.length);

            return registrations;
        } catch (error) {
            console.error('Error fetching registrations:', error);
            throw error;
        }
    };

    const exportToCSV = async () => {
        try {
            setLoading(true);

            // Fetch data from Firestore
            const registrations = await fetchRegistrationsFromFirestore();

            if (registrations.length === 0) {
                alert('பதிவுகள் இல்லை / No registrations found');
                setLoading(false);
                return;
            }

            // Create CSV content
            const headers = ['Name', 'Email', 'Phone', 'District (Tamil)', 'District (English)', 'Member ID', 'Registered At'];
            const csvRows = [headers.join(',')];

            registrations.forEach((reg) => {
                const row = [
                    `"${reg.name.replace(/"/g, '""')}"`,
                    `"${reg.email.replace(/"/g, '""')}"`,
                    `"${reg.phone.replace(/"/g, '""')}"`,
                    `"${reg.district.replace(/"/g, '""')}"`,
                    `"${reg.districtEnglish.replace(/"/g, '""')}"`,
                    `"${reg.memberId.replace(/"/g, '""')}"`,
                    reg.registeredAt ? new Date(reg.registeredAt.seconds * 1000).toLocaleString() : 'N/A',
                ];
                csvRows.push(row.join(','));
            });

            const csvContent = csvRows.join('\n');

            // Create and download CSV file
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `மாநாடு-பதிவுகள்-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);

            alert(`${registrations.length} பதிவுகள் வெற்றிகரமாக பதிவிறக்கப்பட்டன!`);
        } catch (error) {
            console.error('Export error:', error);
            alert('ஏற்றுமதியில் பிழை ஏற்பட்டது / Export failed');
        } finally {
            setLoading(false);
        }
    };

    const exportToJSON = async () => {
        try {
            setLoading(true);

            // Fetch data from Firestore
            const registrations = await fetchRegistrationsFromFirestore();

            if (registrations.length === 0) {
                alert('பதிவுகள் இல்லை / No registrations found');
                setLoading(false);
                return;
            }

            // Create JSON content
            const jsonContent = JSON.stringify(registrations, null, 2);

            // Create and download JSON file
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `மாநாடு-பதிவுகள்-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            alert(`${registrations.length} பதிவுகள் வெற்றிகரமாக பதிவிறக்கப்பட்டன!`);
        } catch (error) {
            console.error('Export error:', error);
            alert('ஏற்றுமதியில் பிழை ஏற்பட்டது / Export failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 mb-12 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
                தரவுகளை பதிவிறக்க
            </h2>

            {totalRecords > 0 && (
                <div className="text-center mb-4 text-gray-600">
                    மொத்த பதிவுகள்: <span className="font-bold">{totalRecords}</span>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <button
                    onClick={exportToCSV}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            தரவுகள் பதிவிறக்கம் செய்யப்படுகிறது...
                        </>
                    ) : (
                        <>
                            <Download size={20} />
                            CSV ஆக தரவுகளை பதிவிறக்க
                        </>
                    )}
                </button>

                {/* <button
                    onClick={exportToJSON}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            ஏற்றுமதி செய்யப்படுகிறது...
                        </>
                    ) : (
                        <>
                            <Download size={20} />
                            JSON ஆக ஏற்றுமதி செய்க
                        </>
                    )}
                </button> */}
            </div>


        </div>
    );
};

export default ExportRegistrations;
