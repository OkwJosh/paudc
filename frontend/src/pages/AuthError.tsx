import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function AuthErrorPage() {
    const [searchParams] = useSearchParams();
    const [countdown, setCountdown] = useState(3);
    const errorMsg =
        searchParams.get('msg') ||
        'Sorry, your authentication information is invalid or has expired.';

    useEffect(() => {
        // Countdown logic
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect to home page
                    window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleReturnHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-16 px-4">
                <div className="max-w-md mx-auto">
                    <Card className="border-red-200">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>

                            {/* Error Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Authentication Error
                            </h1>

                            {/* Error Description */}
                            <p className="text-base text-muted-foreground">{errorMsg}</p>

                            {/* Countdown */}
                            <div className="pt-2">
                                <p className="text-sm text-gray-500">
                                    {countdown > 0 ? (
                                        <>
                                            Will automatically return to the home page in{' '}
                                            <span className="text-blue-600 font-semibold text-base">
                                                {countdown}
                                            </span>{' '}
                                            seconds...
                                        </>
                                    ) : (
                                        'Redirecting...'
                                    )}
                                </p>
                            </div>

                            {/* Return to home button */}
                            <div className="flex justify-center pt-2">
                                <Button onClick={handleReturnHome} className="px-6">
                                    Return to Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}