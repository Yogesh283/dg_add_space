import { Head, useForm } from '@inertiajs/react';

export default function MemberRegister({ referral }) {
    const hasReferral = Boolean(referral);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        referral_code: referral ? String(referral).toUpperCase() : '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Member Register">
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
                            Create Profile
                        </p>
                    </div>
                    <div className="p-6 sm:p-8">
                        <h1 className="text-center text-2xl font-bold text-neutral-900">Create Member Account</h1>
                        <p className="mt-2 text-center text-sm text-neutral-600">
                            Register to buy games, open Referral & Earn, and get level income.
                        </p>

                        {hasReferral && (
                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
                                Joining with referral code: <strong>{String(referral).toUpperCase()}</strong>
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6 space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-neutral-700">Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#ff5c1a]"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-neutral-700">Email (Gmail)</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#ff5c1a]"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-neutral-700">Phone</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#ff5c1a]"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                                    Referral Code {hasReferral ? '' : '(optional)'}
                                </label>
                                <input
                                    type="text"
                                    value={data.referral_code}
                                    onChange={(e) => setData('referral_code', e.target.value.toUpperCase())}
                                    readOnly={hasReferral}
                                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#ff5c1a] ${
                                        hasReferral
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                            : 'border-neutral-200 bg-white text-neutral-900'
                                    }`}
                                    placeholder="Enter sponsor referral code"
                                />
                                {errors.referral_code && (
                                    <p className="mt-1 text-xs text-red-600">{errors.referral_code}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-neutral-700">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#ff5c1a]"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-neutral-700">Confirm Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#ff5c1a]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="juego-btn mt-2 w-full disabled:opacity-70"
                            >
                                {processing ? 'Creating...' : 'Create Profile'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-neutral-600">
                            Already have account?{' '}
                            <a href="/login" className="font-semibold text-[#ff5c1a]">
                                Login with OTP
                            </a>
                        </p>
                        <p className="mt-2 text-center text-sm">
                            <a href="/game-store" className="font-semibold text-neutral-500 hover:text-[#ff5c1a]">
                                ← Back to Game Store
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
