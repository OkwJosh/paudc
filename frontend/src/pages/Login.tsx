import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
// Make sure this path matches where you store the logo!
import LOGO_URL from '../assets/paudc.png';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const checkAuth = async () => {
            try {
                const response = await api.auth.me();
                if (response && response.data) {
                    window.location.href = '/dashboard';
                    return;
                }
            } catch (err) {
                console.log("Not logged in.");
            } finally {
                clearTimeout(timeout);
                setChecking(false);
            }
        };

        checkAuth();

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, []);

    const handleAuth = async () => {
        setLoading(true);
        try {
            // This endpoint triggers the OIDC flow. 
            // The provider handles both logging in and creating new accounts.
            await api.auth.login();
        } catch (err) {
            console.error('Auth redirect error:', err);
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6F0E1]">
                <Loader2 className="h-10 w-10 animate-spin text-[#1B5E3B]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F0E1] px-4 relative overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] -right-20 w-[400px] h-[400px] rounded-full bg-[#C8A046] opacity-20 blur-[100px]" />
                <div className="absolute bottom-[-10%] -left-20 w-[500px] h-[500px] rounded-full bg-[#1B5E3B] opacity-10 blur-[120px]" />
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md relative z-10 border-[#1B5E3B]/10 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-6 pt-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src={LOGO_URL}
                            alt="PAUDC 2026 Logo"
                            className="h-24 w-auto object-contain drop-shadow-sm"
                        />
                    </div>
                    <CardTitle className="text-3xl font-black text-[#022512] tracking-tight">
                        LMS Portal
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-[#022512]/60 mt-2">
                        Welcome to the Pan-African University Debating Championship
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8 space-y-6">
                    <div className="space-y-4">
                        <Button
                            className="w-full bg-[#1B5E3B] hover:bg-[#0d301e] text-[#F6F0E1] h-14 text-lg font-bold rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
                            onClick={handleAuth}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    Redirecting...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-bold">
                                <span className="bg-white px-3 text-gray-400">Or</span>
                            </div>
                        </div>

                    </div>

                    <p className="text-center text-sm font-medium text-[#022512]/50 leading-relaxed mt-6">
                        Secure access for registered debaters, adjudicators, organizers, and speakers.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}