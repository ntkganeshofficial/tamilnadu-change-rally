import { useEffect, useState } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 26,
        hours: 1,
        minutes: 36,
        seconds: 16,
    });

    const handleRegisterClick = () => {
        const attendanceForm = document.getElementById('attendance-form');
        if (attendanceForm) {
            attendanceForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleViewConstituenciesClick = () => {
        const liveRegistration = document.getElementById('live-registration');
        if (liveRegistration) {
            liveRegistration.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Set target date to Feb 21, 2026
        const targetDate = new Date('2026-02-21T10:00:00').getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((distance / 1000 / 60) % 60),
                    seconds: Math.floor((distance / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ value, label, tamilLabel }: { value: number; label: string; tamilLabel: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-red-700/50 border-2 border-red-500 rounded-xl p-4 md:p-6 min-w-24 md:min-w-32">
                <div className="text-4xl md:text-6xl font-bold text-yellow-400 font-tamil">
                    {String(value).padStart(2, '0')}
                </div>
            </div>
            <div className="mt-3 text-center">
                <div className="text-2xl md:text-2xl text-white text-sm md:text-base font-tamil font-semibold">
                    {tamilLabel}
                </div>
                <div className="text-red-300 text-xs md:text-sm font-fredoka">
                    {label}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full py-6 px-4">
            {/* Header */}
            <div className="text-center mb-4">

                <h3 className="text-2xl md:text-2xl text-white text-center text-foreground">
                    நிகழ்வு தொடங்க
                </h3>
            </div>
            {/* Countdown Timer */}
            <div className="flex justify-center gap-2 md:gap-4 mb-6 flex-wrap text-2xl md:text-2xl text-white">
                <TimeUnit value={timeLeft.days} label="Days" tamilLabel="நாட்கள்" />
                <TimeUnit value={timeLeft.hours} label="Hours" tamilLabel="மணி" />
                <TimeUnit value={timeLeft.minutes} label="Minutes" tamilLabel="நிமிடம்" />
                <TimeUnit value={timeLeft.seconds} label="Seconds" tamilLabel="வினாடி" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                <button onClick={handleRegisterClick} className="px-6 md:px-8 py-2 md:py-3 bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-fredoka text-sm md:text-base flex items-center gap-2">
                    👤 பதிவு செய்ய
                    <span className="text-lg">↓</span>
                </button>
                <button onClick={handleViewConstituenciesClick} className="px-6 md:px-8 py-2 md:py-3 border-3 border-red-200 text-red-100 font-bold rounded-full hover:bg-yellow-700/30 transition-all shadow-lg font-fredoka text-sm md:text-base">
                    பார்வையிட
                </button>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {[
                    { number: '234', label: 'Constituencies', tamilLabel: 'தொகுதிகள்' },
                    { number: '10,000+', label: 'Members', tamilLabel: 'உறுப்பினர்கள்' },
                    { number: '100+', label: 'Sessions', tamilLabel: 'அமர்வுகள்' },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="text-center hover:scale-105 transition-transform duration-300"
                    >
                        <div className="text-2xl md:text-2xl text-white md:text-3xl font-bold text-yellow-400 font-tamil">
                            {stat.number}
                        </div>
                        <div className="text-2xl md:text-2xl text-white text-xs md:text-sm font-tamil mt-1">
                            {stat.tamilLabel}
                        </div>
                        <div className="text-2xl md:text-2xl text-white text-xs md:text-xs font-fredoka">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountdownTimer;
