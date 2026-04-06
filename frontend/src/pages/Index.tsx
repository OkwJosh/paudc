import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Award, BookOpen, Mic, Globe, Trophy, Plane } from 'lucide-react';

export default function Index() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const eventDate = new Date('2026-12-05T00:00:00').getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });

            if (distance < 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section - Full width with Minimal Centered Content */}
            <section className="relative w-full h-screen flex items-center justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="https://mgx-backend-cdn.smedan.gov.ng/generate/images/906150/2024-01-20/a5835d4b-6517-4622-9247-331240a98dca.jpg"
                        alt="Abuja Cityscape"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Centered Content */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        The Republic of Reason
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-light">
                        Africa's most prestigious arena for youth dialogue and intellectual exchange
                    </p>

                    {/* Event Details */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 text-lg font-medium">
                        <div className="flex items-center gap-2">
                            <Mic className="w-5 h-5 text-[#C84B46]" />
                            <span>December 5-13, 2026</span>
                        </div>
                        <div className="hidden md:block w-1 h-6 bg-white/30"></div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-[#C84B46]" />
                            <span>Veritas University, Abuja, Nigeria</span>
                        </div>
                    </div>

                    {/* Countdown - Subtle inline */}
                    <div className="flex items-center justify-center gap-6 md:gap-8 mb-12 text-white/80">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold tracking-wider">{String(timeLeft.days).padStart(2, '0')}</div>
                            <div className="text-sm uppercase tracking-widest mt-1">Days</div>
                        </div>
                        <div className="text-3xl font-light">:</div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold tracking-wider">{String(timeLeft.hours).padStart(2, '0')}</div>
                            <div className="text-sm uppercase tracking-widest mt-1">Hours</div>
                        </div>
                        <div className="text-3xl font-light">:</div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold tracking-wider">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <div className="text-sm uppercase tracking-widest mt-1">Mins</div>
                        </div>
                        <div className="text-3xl font-light">:</div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold tracking-wider">{String(timeLeft.seconds).padStart(2, '0')}</div>
                            <div className="text-sm uppercase tracking-widest mt-1">Secs</div>
                        </div>
                    </div>

                    {/* Call to Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-[#C84B46] hover:bg-[#A83D39] text-white px-8 py-6 text-lg rounded-full" asChild>
                            <Link to="/register">Register Your Team</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full" asChild>
                            <Link to="/about">Explore the Vision</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* PRIZE MONEY & WUDC Sponsorship Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-[#C84B46]/20 rounded-full mb-4">
                            <Trophy className="h-8 w-8 text-[#C84B46]" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Compete for Glory & Global Recognition</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            PAUDC 2026 offers not just prestige, but life-changing opportunities for Africa's brightest minds.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Prize Pool Card */}
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-[#C84B46] transition-colors">
                            <CardContent className="p-8 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Total Prize Pool</h3>
                                <div className="text-5xl font-black text-[#C84B46] mb-4">$20,000 USD</div>
                                <p className="text-gray-400">
                                    Distributed among champions, finalists, and top speakers across multiple categories.
                                </p>
                            </CardContent>
                        </Card>

                        {/* WUDC Sponsorship Card */}
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-[#185E3B] transition-colors">
                            <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                                <Plane className="h-12 w-12 text-[#185E3B] mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">Full WUDC Sponsorship</h3>
                                <p className="text-gray-400">
                                    The winning team and top speaker receive full sponsorship to represent Africa at the World Universities Debating Championship.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#C84B46] to-transparent blur-3xl"></div>
                    <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#185E3B] to-transparent blur-3xl"></div>
                </div>
            </section>

            {/* Key Pillars */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Kakaki: Our Symbol</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The Kakaki - a long royal trumpet of Northern Nigeria - traditionally announces the arrival of royalty or the gathering of communities. It is both sound and statement; it commands attention and conveys dignity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gray-50">
                            <CardContent className="p-8">
                                <Users className="h-12 w-12 text-[#185E3B] mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Pan-African Unity</h3>
                                <p className="text-gray-600">
                                    Fostering a sense of shared destiny and collaboration among young leaders from diverse African nations.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gray-50">
                            <CardContent className="p-8">
                                <Award className="h-12 w-12 text-[#C84B46] mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Intellectual Excellence</h3>
                                <p className="text-gray-600">
                                    Cultivating critical thinking, rigorous analysis, and the pursuit of truth through structured debate.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gray-50">
                            <CardContent className="p-8">
                                <BookOpen className="h-12 w-12 text-[#185E3B] mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Civic Leadership</h3>
                                <p className="text-gray-600">
                                    Empowering youth to engage meaningfully with pressing continental issues and drive positive change.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}