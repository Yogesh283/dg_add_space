import { Head, useForm } from '@inertiajs/react';

export default function MemberRegister({ referral }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        referral_code: referral || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Member Register" />
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-10">
                <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl">
                    <div className="relative overflow-hidden bg-[#111111] px-6 py-6 text-center">
                        <div
                            className="absolute inset-0 opacity-70"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 30% 20%, rgba(255,92,26,0.2), transparent 45%)',
                            }}
                        />
                        <a href="/" className="relative inline-flex">
                            <img src="/img/logo.png" alt="DG Ad Space" className="h-20 w-auto max-w-[300px] object-contain drop-shadow-[0_0_18px_rgba(77,163,255,0.3)] sm:h-24 sm:max-w-[340px]" />
                        </a>
                        <p className="relative mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff9a66]">
                            Create Profile
                        </p>
                    </div>
                    <div className="p-6 sm:p-8">
                    <h1 className="text-center text-2xl font-bold text-white">Create Member Account</h1>
                    <p className="mt-2 text-center text-sm text-neutral-400">
                        Register your profile to buy games, earn level income, and raise tickets.
                    </p>

                    <form onSubmit={submit} className="mt-6 space-y-3">
                        {[
                            ['name', 'Full Name', 'text'],
                            ['email', 'Email (Gmail)', 'email'],
                            ['phone', 'Phone', 'tel'],
                            ['referral_code', 'Referral Code (optional)', 'text'],
                            ['password', 'Password', 'password'],
                            ['password_confirmation', 'Confirm Password', 'password'],
                        ].map(([key, label, type]) => (
                            <div key={key}>
                                <label className="mb-1 block text-sm font-semibold text-neutral-300">{label}</label>
                                <input
                                    type={type}
                                    value={data[key]}
                                    onChange={(e) => setData(key, e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                />
                                {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]}</p>}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={processing}
                            className="juego-btn mt-2 w-full disabled:opacity-70"
                        >
                            {processing ? 'Creating...' : 'Create Profile'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-neutral-400">
                        Already have account?{' '}
                        <a href="/login" className="font-semibold text-[#ff5c1a]">
                            Login with OTP
                        </a>
                    </p>
                    </div>
                </div>
            </div>
        </>
    );
}
