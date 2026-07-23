import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Menu,
    MessageCircle,
    Star,
    Store,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';

const faqs = [
    ['Can I publish on Play Store?', 'Yes. Add Play Store Publishing service on the game product page.'],
    ['Will I get source code?', 'Yes. Complete source code is included with every ready-made game purchase.'],
    ['Can I customize design?', 'Yes. Add Development / Customization on the product page and remove anytime before checkout.'],
    ['Will AdMob be integrated?', 'Yes. Add Monetize / AdMob service while buying the game.'],
    ['How does add-on pricing work?', 'Open any game page, Add or Remove services like Amazon. Total updates instantly.'],
];

export default function GameStore({ games = [] }) {
    const whatsappNumber = '918817788185';
    const whatsappBaseLink = `https://wa.me/${whatsappNumber}`;
    const { auth, flash, errors } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    const productUrl = (game) => `/game-store/${game.slug || game.id}`;

    return (
        <>
            <Head title="Game Store">
                <link rel="icon" type="image/png" href="/img/app.icon.png" />
            </Head>

            <div className="theme-light min-h-screen bg-[#f5f7fb] text-neutral-800">
                {auth?.user && (
                    <div className="bg-gradient-to-r from-[#ff5c1a] via-[#ff7338] to-[#1aa3ff] px-4 py-2.5 text-center shadow-md">
                        <a
                            href="/member"
                            className="inline-flex items-center justify-center gap-2 text-sm font-extrabold tracking-wide text-white"
                        >
                            <TrendingUp className="size-4" />
                            Referral & Earn — Share link, track wallet & level income
                            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase">
                                Open Panel
                            </span>
                        </a>
                    </div>
                )}

                <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
                        <a href="/" className="inline-flex items-center">
                            <img src="/img/logo.png" alt="DG Ad Space" className="h-[72px] w-auto max-w-[300px] object-contain object-left sm:h-20 sm:max-w-[340px] md:h-24 md:max-w-[400px]" />
                        </a>
                        <nav className="hidden items-center gap-7 lg:flex">
                            <a href="/" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Home</a>
                            <a href="/services" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Services</a>
                            <a href="/game-store" className="text-sm font-semibold text-[#ff5c1a]">Game Store</a>
                            {auth?.user && (
                                <a href="/member" className="text-sm font-extrabold text-[#ff5c1a] underline decoration-2 underline-offset-4">
                                    Referral & Earn
                                </a>
                            )}
                            <a href="/#pricing" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Pricing</a>
                            <a href="/#contact" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Contact</a>
                        </nav>
                        <div className="hidden items-center gap-3 md:flex">
                            {auth?.user ? (
                                <>
                                    <a
                                        href="/member"
                                        className="relative inline-flex items-center gap-2 rounded-xl bg-[#ff5c1a] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(255,92,26,0.45)] ring-2 ring-[#ff5c1a]/30 ring-offset-2 transition hover:bg-[#ff7338] hover:shadow-[0_10px_28px_rgba(255,92,26,0.55)]"
                                    >
                                        <span className="absolute -right-1 -top-1 flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                                            <span className="relative inline-flex size-3 rounded-full bg-amber-400" />
                                        </span>
                                        <TrendingUp className="size-4" />
                                        Referral & Earn
                                    </a>
                                    <span className="text-sm font-semibold text-neutral-600">
                                        Hi, {auth.user.name?.split(' ')[0] || 'Member'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="text-sm font-semibold text-neutral-700 hover:text-[#ff5c1a]">Login</a>
                                    <a href="/register" className="juego-btn px-4 py-2">Register</a>
                                </>
                            )}
                            <a href={whatsappBaseLink} className="pro-btn bg-emerald-600 text-white hover:bg-emerald-700">
                                <MessageCircle className="size-4" /> WhatsApp
                            </a>
                        </div>
                        <div className="flex items-center gap-2 lg:hidden">
                            {auth?.user && (
                                <a
                                    href="/member"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#ff5c1a] px-3 py-2 text-xs font-extrabold text-white shadow-lg shadow-[#ff5c1a]/30"
                                >
                                    <TrendingUp className="size-3.5" />
                                    Earn
                                </a>
                            )}
                            <button type="button" className="rounded-lg border border-neutral-200 p-2 text-neutral-700" onClick={() => setMenuOpen((v) => !v)}>
                                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                            </button>
                        </div>
                    </div>
                    {menuOpen && (
                        <div className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
                            <div className="flex flex-col gap-2">
                                <a href="/" className="rounded-lg px-3 py-2 text-sm font-semibold">Home</a>
                                <a href="/services" className="rounded-lg px-3 py-2 text-sm font-semibold">Services</a>
                                <a href="/game-store" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#ff5c1a]">Game Store</a>
                                <a href="/#contact" className="rounded-lg px-3 py-2 text-sm font-semibold">Contact</a>
                                {auth?.user ? (
                                    <a
                                        href="/member"
                                        className="rounded-xl bg-[#ff5c1a] px-3 py-3 text-center text-sm font-extrabold text-white shadow-lg shadow-[#ff5c1a]/35"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <TrendingUp className="size-4" />
                                            Referral & Earn — Open Now
                                        </span>
                                    </a>
                                ) : (
                                    <>
                                        <a href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold">Login</a>
                                        <a href="/register" className="rounded-lg bg-[#ff5c1a] px-3 py-2.5 text-center text-sm font-semibold text-white">
                                            Register
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    <section className="relative overflow-hidden bg-[#f5f7fb]">
                        <div
                            className="absolute inset-0 opacity-90"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 15% 20%, rgba(255,92,26,0.12), transparent 40%), radial-gradient(circle at 85% 0%, rgba(26,163,255,0.10), transparent 35%)',
                            }}
                        />
                        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff5c1a]">Marketplace</p>
                            <h1 className="max-w-3xl text-3xl font-extrabold text-neutral-900 sm:text-4xl md:text-5xl">
                                Ready-Made <span className="text-[#ff5c1a]">Android Games</span>
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                                Choose a game → open product page → add/remove services (Development, Play Store, AdMob, Marketing) → checkout.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {auth?.user ? (
                                    <a
                                        href="/member"
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#ff5c1a] px-6 py-3.5 text-base font-extrabold text-white shadow-[0_10px_30px_rgba(255,92,26,0.4)] ring-4 ring-[#ff5c1a]/20 transition hover:bg-[#ff7338]"
                                    >
                                        <TrendingUp className="size-5" />
                                        Referral & Earn
                                    </a>
                                ) : null}
                                <a href="#games" className="juego-btn-outline"><Store className="size-4" /> Browse Games</a>
                                {!auth?.user && (
                                    <>
                                        <a href="/register" className="juego-btn">Register with Referral</a>
                                        <a href="/login" className="juego-btn-outline">Login</a>
                                    </>
                                )}
                                <a href="/services" className="juego-btn-outline">View Services</a>
                            </div>

                            {auth?.user && (
                                <div className="mt-8 max-w-3xl overflow-hidden rounded-2xl border-2 border-[#ff5c1a]/40 bg-gradient-to-r from-[#ff5c1a]/10 via-white to-[#1aa3ff]/10 p-5 shadow-lg md:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff5c1a]">
                                                <Users className="size-3.5" />
                                                Your earning panel
                                            </p>
                                            <h2 className="mt-1 text-xl font-extrabold text-neutral-900 md:text-2xl">
                                                Referral & Earn is ready
                                            </h2>
                                            <p className="mt-1 text-sm text-neutral-600">
                                                Copy/share referral link, check wallet, purchases, level income & tickets — same as member main panel.
                                            </p>
                                        </div>
                                        <a
                                            href="/member"
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ff5c1a] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#ff5c1a]/35 hover:bg-[#ff7338]"
                                        >
                                            <TrendingUp className="size-4" />
                                            Open Referral & Earn
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {flash?.success && (
                        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">{flash.success}</div>
                        </div>
                    )}
                    {errors?.payment && (
                        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">{errors.payment}</div>
                        </div>
                    )}

                    <div id="games" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {games.map((game) => (
                                <article key={game.id || game.name} className="pro-card p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                                    <a href={productUrl(game)}>
                                        <img src={game.image} alt={game.name} className="h-40 w-full rounded-xl object-cover" />
                                    </a>
                                    <h3 className="mt-3 text-lg font-bold text-neutral-900">{game.name}</h3>
                                    <p className="text-xs text-neutral-500">{game.category} • {game.mode}</p>
                                    <p className="mt-1 text-xs text-neutral-500">Android v8+ • {game.tech}</p>
                                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-600">AdMob Ready</span>
                                        <span className="rounded-full bg-[#ff5c1a]/10 px-2.5 py-1 font-semibold text-[#ff5c1a]">Play Store Ready</span>
                                    </div>
                                    <div className="mt-3 space-y-0.5">
                                        {Number(game.market_price) > 0 && (
                                            <p className="text-xs text-neutral-500">
                                                Market Price{' '}
                                                <span className="line-through">
                                                    ₹{Number(game.market_price).toLocaleString('en-IN')}
                                                </span>
                                            </p>
                                        )}
                                        <p className="text-xl font-extrabold text-[#ff5c1a]">
                                            <span className="mr-1 text-xs font-semibold text-neutral-500">DG Adspace</span>
                                            ₹{Number(game.price).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <p className="text-xs text-neutral-500">Delivery: {game.delivery} • Demo: {game.downloads}</p>
                                    <div className="mt-1 flex text-amber-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className="size-3.5 fill-amber-400" />
                                        ))}
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <a href={productUrl(game)} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
                                            View Details
                                        </a>
                                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer" className="rounded-lg border border-neutral-200 px-3 py-2 text-center text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
                                            Watch Demo
                                        </a>
                                        <a href={productUrl(game)} className="rounded-lg bg-[#ff5c1a] px-3 py-2 text-center text-xs font-semibold text-white hover:bg-[#ff7338]">
                                            Buy Now
                                        </a>
                                        <a href={`${whatsappBaseLink}?text=${encodeURIComponent(`Hi, I want customization for ${game.name}.`)}`} className="rounded-lg border border-neutral-200 px-3 py-2 text-center text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
                                            Customize
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                        {games.length === 0 && (
                            <div className="pro-card p-8 text-center text-neutral-500">No games available right now.</div>
                        )}

                        <section className="pro-card mt-10 p-5 md:p-6">
                            <h3 className="text-xl font-bold text-neutral-900">Frequently Asked Questions</h3>
                            <div className="mt-4 space-y-2">
                                {faqs.map(([q, a]) => (
                                    <details key={q} className="rounded-xl border border-neutral-200 bg-[#f8fafc] p-4">
                                        <summary className="cursor-pointer text-sm font-semibold text-neutral-900">{q}</summary>
                                        <p className="mt-2 text-sm text-neutral-600">{a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>

                        <section className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm md:px-10">
                            <h3 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Ready to Launch Your Own Game?</h3>
                            <p className="mx-auto mt-3 max-w-2xl text-neutral-600">
                                Open any game page, add/remove services, and checkout with Razorpay.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                {auth?.user ? (
                                    <a href="/member" className="juego-btn">
                                        <Users className="size-4" /> Open Referral & Earn
                                    </a>
                                ) : (
                                    <a href="/register" className="juego-btn">Register / Join with Referral</a>
                                )}
                                <a href="/services" className="juego-btn-outline">Explore Services</a>
                                <a href={whatsappBaseLink} className="pro-btn bg-emerald-600 text-white hover:bg-emerald-700">
                                    <MessageCircle className="size-4" /> Chat on WhatsApp
                                </a>
                            </div>
                        </section>
                    </div>
                </main>

                <footer className="border-t border-neutral-200 bg-white text-neutral-800">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
                        <div>
                            <img src="/img/logo.png" alt="DG Ad Space" className="h-16 w-auto max-w-[280px] object-contain object-left sm:h-20 sm:max-w-[340px]" />
                            <p className="mt-3 text-sm text-neutral-600">Ready-Made Android Games Marketplace</p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                            <a href="/" className="hover:text-[#ff5c1a]">Home</a>
                            <a href="/services" className="hover:text-[#ff5c1a]">Services</a>
                            <a href="/game-store" className="hover:text-[#ff5c1a]">Game Store</a>
                            {auth?.user ? (
                                <a href="/member" className="hover:text-[#ff5c1a]">Referral & Earn</a>
                            ) : (
                                <a href="/register" className="hover:text-[#ff5c1a]">Register</a>
                            )}
                            <a href="/#contact" className="hover:text-[#ff5c1a]">Contact</a>
                        </div>
                    </div>
                    <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
                        © {new Date().getFullYear()} DG Ad Space. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
