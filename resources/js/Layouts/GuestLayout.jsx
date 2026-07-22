import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="theme-light flex min-h-screen flex-col items-center bg-[#f5f7fb] px-4 pt-6 text-neutral-800 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="inline-flex">
                    <img
                        src="/img/logo.png"
                        alt="DG Ad Space"
                        className="h-16 w-auto max-w-[260px] object-contain sm:h-20 sm:max-w-[300px]"
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white px-6 py-6 shadow-lg sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
