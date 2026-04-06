import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="space-y-6 max-w-md text-center">
                <h1 className="text-8xl font-bold text-gray-300">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
                <p className="text-muted-foreground">
                    The page you're looking for doesn't exist or may have been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link to="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}