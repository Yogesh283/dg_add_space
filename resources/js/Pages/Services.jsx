import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    Coins,
    Gamepad2,
    Megaphone,
    Menu,
    MessageCircle,
    Rocket,
    ShieldCheck,
    Store,
    Users,
    X,
} from 'lucide-react';

const coreServices = [
    {
        title: 'Game Development',
        icon: Gamepad2,
        banner: '/img/step-banner-dev.png',
        summary: 'Complete Android game build from idea to playable product.',
        points: [
            'Custom Android game development',
            'Modern UI/UX design',
            'Source code ownership after purchase',
            'Performance testing & optimization',
        ],
    },
    {
        title: 'Play Store Publishing',
        icon: Store,
        banner: '/img/step-banner-publish.png',
        summary: 'Publish your branded game on Google Play with full listing support.',
        points: [
            'Store listing & assets guidance',
            'Policy & compliance checks',
            'APK / AAB publishing assistance',
            'Launch support on Google Play',
        ],
    },
    {
        title: 'Monetize / AdMob',
        icon: Coins,
        banner: '/img/banner-admob.png',
        summary: 'Enable advertising revenue with Google AdMob integration.',
        points: [
            'Banner, interstitial & rewarded ads',
            'AdMob account setup assistance',
            'Monetization flow configuration',
            'Revenue-ready game delivery',
        ],
    },
    {
        title: 'Digital Marketing & Growth',
        icon: Megaphone,
        banner: '/img/step-banner-marketing.png',
        summary: 'Grow installs, users and long-term engagement for your game.',
        points: [
            'Meta Ads / social promotion guidance',
            'Download growth campaigns',
            'Creative & launch strategy',
            'User retention focus',
        ],
    },
];

const whyUs = [
    'End-to-end gaming business support',
    'Transparent package pricing',
    'Add only the services you need',
    'Razorpay auto payment checkout',
    'Professional delivery & handover',
];

export default function Services({ addons = [] }) {
    const whatsappNumber = '918817788185';
    const whatsappBaseLink = `https://wa.me/${whatsappNumber}`;
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <Head title="Services">
                <link rel="icon" type="image/png" href="/img/app.icon.png" />
            </Head>

            <div className="theme-light min-h-screen bg-[#f5f7fb] text-neutral-800">
                <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
                        <a href="/" className="inline-flex items-center">
                            <img src="/img/logo.png" alt="DG Ad Space" className="h-[64px] w-auto max-w-[260px] object-contain object-left sm:h-20" />
                        </a>
                        <nav className="hidden items-center gap-7 lg:flex">
                            <a href="/" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Home</a>
                            <a href="/services" className="text-sm font-semibold text-[#ff5c1a]">Services</a>
                            <a href="/game-store" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Game Store</a>
                            <a href="/#pricing" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Pricing</a>
                            <a href="/#contact" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Contact</a>
                        </nav>
                        <div className="hidden items-center gap-3 md:flex">
                            {auth?.user ? (
                                <a href="/member" className="juego-btn-outline px-4 py-2 text-sm"><Users className="size-4" /> Referral & Earn</a>
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
                        <button type="button" className="rounded-lg border border-neutral-200 p-2 lg:hidden" onClick={() => setMenuOpen((v) => !v)}>
                            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>
                    {menuOpen && (
                        <div className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
                            <div className="flex flex-col gap-2">
                                <a href="/" className="rounded-lg px-3 py-2 text-sm font-semibold">Home</a>
                                <a href="/services" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#ff5c1a]">Services</a>
                                <a href="/game-store" className="rounded-lg px-3 py-2 text-sm font-semibold">Game Store</a>
                                <a href="/#contact" className="rounded-lg px-3 py-2 text-sm font-semibold">Contact</a>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#f5f7fb]" />
                        <div
                            className="absolute inset-0 opacity-90"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 20% 20%, rgba(255,92,26,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(26,163,255,0.10), transparent 35%)',
                            }}
                        />
                        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff5c1a]">DG AD SPACE Services</p>
                            <h1 className="max-w-3xl text-3xl font-extrabold text-neutral-900 sm:text-5xl">
                                All Services Connected — From Game to Income
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                                Development, Play Store publishing, AdMob monetization and marketing — sab ek system mein connected hai.
                                Game buy karte time aap in services ko Amazon jaisi product page pe add/remove kar sakte ho.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a href="/game-store" className="juego-btn">
                                    <Store className="size-4" /> Browse Games
                                </a>
                                <a href="/#contact" className="juego-btn-outline">
                                    Get Custom Quote
                                </a>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                            Core Services <span className="text-[#ff5c1a]">Explained</span>
                        </h2>
                        <p className="mt-2 max-w-2xl text-neutral-600">
                            Har service ka clear role hai. Aap base game le sakte ho, ya required services add karke complete business package bana sakte ho.
                        </p>
                        <div className="mt-8 grid gap-5 md:grid-cols-2">
                            {coreServices.map((service) => (
                                <article key={service.title} className="pro-card overflow-hidden">
                                    <img src={service.banner} alt={service.title} className="h-40 w-full object-cover" />
                                    <div className="p-5 md:p-6">
                                        <div className="mb-3 inline-flex rounded-xl bg-[#ff5c1a]/10 p-2.5 text-[#ff5c1a]">
                                            <service.icon className="size-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900">{service.title}</h3>
                                        <p className="mt-2 text-sm text-neutral-600">{service.summary}</p>
                                        <ul className="mt-4 space-y-2">
                                            {service.points.map((point) => (
                                                <li key={point} className="flex items-start gap-2 text-sm text-neutral-700">
                                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#ff5c1a]" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white py-12">
                        <div className="mx-auto max-w-7xl px-4 md:px-8">
                            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                                Optional Add-ons <span className="text-[#ff5c1a]">(Live Prices)</span>
                            </h2>
                            <p className="mt-2 max-w-2xl text-neutral-600">
                                Ye prices admin set karta hai. Game product page pe aap inko add/remove kar sakte ho — total turant update hota hai.
                            </p>
                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                {addons.map((addon) => (
                                    <div key={addon.id} className="rounded-2xl border border-neutral-200 bg-[#f8fafc] p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-neutral-900">{addon.name}</h3>
                                                <p className="mt-1 text-sm text-neutral-600">{addon.description}</p>
                                            </div>
                                            <p className="shrink-0 text-lg font-extrabold text-[#ff5c1a]">
                                                ₹{Number(addon.price).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {addons.length === 0 && (
                                    <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-500 md:col-span-2">
                                        Add-on services admin panel se active hone ke baad yahan dikhengi.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-neutral-900">How Buying Works</h3>
                                <ol className="mt-4 space-y-3 text-sm text-neutral-700">
                                    {[
                                        'Open Game Store and choose a game',
                                        'New product page opens (Amazon style)',
                                        'Add or remove Development / Play Store / AdMob / Marketing',
                                        'See live total price',
                                        'Pay with Razorpay — order confirms automatically',
                                    ].map((step, i) => (
                                        <li key={step} className="flex items-start gap-3">
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ff5c1a]/10 text-xs font-bold text-[#ff5c1a]">
                                                {i + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                                <a href="/game-store" className="juego-btn mt-6">
                                    Start Buying <ArrowRight className="size-4" />
                                </a>
                            </div>
                            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-neutral-900">Why DG AD SPACE</h3>
                                <ul className="mt-4 space-y-2.5">
                                    {whyUs.map((item) => (
                                        <li key={item} className="inline-flex w-full items-center gap-2 text-sm text-neutral-700">
                                            <BadgeCheck className="size-4 shrink-0 text-[#ff5c1a]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                                    <p className="inline-flex items-center gap-2 font-semibold">
                                        <ShieldCheck className="size-4" /> Transparent & connected system
                                    </p>
                                    <p className="mt-1">Services + Game Store + Payment ek flow mein connected hain.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
                        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm md:px-10">
                            <Rocket className="mx-auto size-8 text-[#ff5c1a]" />
                            <h3 className="mt-3 text-2xl font-bold text-neutral-900">Ready to launch your game business?</h3>
                            <p className="mx-auto mt-2 max-w-xl text-neutral-600">
                                Pick a game, customize services, and checkout — simple professional flow.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <a href="/game-store" className="juego-btn">Open Game Store</a>
                                <a href={whatsappBaseLink} className="pro-btn bg-emerald-600 text-white hover:bg-emerald-700">
                                    <MessageCircle className="size-4" /> WhatsApp
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-neutral-200 bg-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-8">
                        <p>© {new Date().getFullYear()} DG AD SPACE</p>
                        <div className="flex gap-4">
                            <a href="/" className="hover:text-[#ff5c1a]">Home</a>
                            <a href="/services" className="hover:text-[#ff5c1a]">Services</a>
                            <a href="/game-store" className="hover:text-[#ff5c1a]">Game Store</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
