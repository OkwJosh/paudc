import React, { useEffect } from 'react';

const LogoutCallback: React.FC = () => {
    useEffect(() => {
        // The OIDC provider has logged out the user and redirected here
        // Redirect to home page or a show logout success message
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <svg
                    className="mx-auto h-12 w-12 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Signed Out Successfully</h2>
                <p className="mt-2 text-gray-600">Redirecting to home page...</p>
            </div>
        </div>
    );
};

export default LogoutCallback;