import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function MemberLogin() {
    const { flash } = usePage().props;
    const [otpSent, setOtpSent] = useState(!!flash?.otp_sent);
    const [email, setEmail] = useState(flash?.otp_email || '');

    const otpForm = useForm({ email: flash?.otp_email || '' });
    const verifyForm = useForm({ email: flash?.otp_email || '', otp: '' });

    useEffect(() => {
        if (flash?.otp_sent) {
            setOtpSent(true);
            setEmail(flash.otp_email || otpForm.data.email);
            verifyForm.setData('email', flash.otp_email || otpForm.data.email);
        }
    }, [flash?.otp_sent, flash?.otp_email]);

    const sendOtp = (e) => {
        e.preventDefault();
        otpForm.post(route('login.otp.send'), {
            onSuccess: () => {
                setOtpSent(true);
                setEmail(otpForm.data.email);
                verifyForm.setData('email', otpForm.data.email);
            },
        });
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        verifyForm.setData('email', email);
        verifyForm.post(route('login.otp.verify'));
    };

    return (
        <>
            <Head title="Member Login">
                <link rel="icon" type="image/png" href="/img/app.icon.png" />
            </Head>
            <div className="theme-light flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-10 text-neutral-800">
                <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
                    <div className="relative overflow-hidden border-b border-neutral-200 bg-[#f8fafc] px-6 py-6 text-center">
                        <div
                            className="absolute inset-0 opacity-80"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 30% 20%, rgba(255,92,26,0.12), transparent 45%)',
                            }}
                        />
                        <a href="/" className="relative inline-flex">
                            <img
                                src="/img/logo.png"
                                alt="DG Ad Space"
                                className="h-20 w-auto max-w-[300px] object-contain sm:h-24 sm:max-w-[340px]"
                            />
                        </a>
                        <p className="relative mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5c1a]">
                            Member Access
                        </p>
                    </div>
                    <div className="p-6 sm:p-8">
                        <h1 className="text-center text-2xl font-bold text-neutral-900">Member Login</h1>
                        <p className="mt-2 text-center text-sm text-neutral-600">
                            Enter your email ID. OTP will be sent to your Gmail.
                        </p>

                        {flash?.success && (
                            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                                {flash.success}
                            </div>
                        )}

                        {!otpSent ? (
                            <form onSubmit={sendOtp} className="mt-6 space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-neutral-700">Email ID</label>
                                    <input
                                        type="email"
                                        value={otpForm.data.email}
                                        onChange={(e) => otpForm.setData('email', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#ff5c1a]"
                                        placeholder="your@gmail.com"
                                        required
                                    />
                                    {otpForm.errors.email && (
                                        <p className="mt-1 text-xs text-red-600">{otpForm.errors.email}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={otpForm.processing}
                                    className="juego-btn w-full disabled:opacity-70"
                                >
                                    {otpForm.processing ? 'Sending OTP...' : 'Send OTP to Email'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={verifyOtp} className="mt-6 space-y-4">
                                <p className="rounded-xl border border-[#ff5c1a]/20 bg-[#ff5c1a]/10 px-3 py-2 text-sm text-[#ff5c1a]">
                                    OTP sent to <strong>{email}</strong>
                                </p>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-neutral-700">Enter OTP</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={verifyForm.data.otp}
                                        onChange={(e) => verifyForm.setData('otp', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-lg tracking-[0.3em] text-neutral-900 outline-none focus:border-[#ff5c1a]"
                                        placeholder="••••••"
                                        required
                                    />
                                    {verifyForm.errors.otp && (
                                        <p className="mt-1 text-xs text-red-600">{verifyForm.errors.otp}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={verifyForm.processing}
                                    className="juego-btn w-full disabled:opacity-70"
                                >
                                    {verifyForm.processing ? 'Verifying...' : 'Verify & Login'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="w-full text-sm font-semibold text-neutral-500 hover:text-[#ff5c1a]"
                                >
                                    Change email
                                </button>
                            </form>
                        )}

                        <p className="mt-6 text-center text-sm text-neutral-600">
                            New user?{' '}
                            <a href="/register" className="font-semibold text-[#ff5c1a]">
                                Create account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
