import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    BadgeCheck,
    CheckCircle2,
    CircleDollarSign,
    Download,
    Menu,
    MessageCircle,
    Package,
    ShieldCheck,
    Star,
    Store,
    Users,
    X,
} from 'lucide-react';

const features = [
    'Source Code Included',
    'Android Studio / Flutter / Unity Project',
    'Admin Panel',
    'Firebase Integration',
    'Login System',
    'Leaderboards',
    'Achievements',
    'Coins System',
    'Reward Ads',
    'Banner Ads',
    'Interstitial Ads',
    'Daily Rewards',
    'Spin Wheel',
    'In-App Purchases (Optional)',
    'Multiplayer Support (if available)',
    'Cloud Save',
    'Push Notifications',
    'Analytics',
    'Crash Reporting',
    'Privacy Policy Ready',
    'Play Store Ready',
];

const purchaseFlow = [
    'Select Game',
    'Choose Extra Services',
    'Pay with Razorpay',
    'Auto Payment Confirm',
    'Order Paid',
    'Project Processing',
    'Delivery',
];

const paymentMethods = [
    'Razorpay Auto',
    'UPI',
    'Cards',
    'Net Banking',
    'Wallets',
];

const baseIncluded = [
    { title: 'Complete Source Code', desc: 'Full project files with ownership after purchase' },
    { title: 'APK + AAB Build', desc: 'Ready Android package files for testing & publishing' },
    { title: 'Game Assets', desc: 'Graphics, UI, and media assets included' },
    { title: 'Documentation', desc: 'Setup and installation guide for your team' },
    { title: 'Database Setup Guide', desc: 'Backend / Firebase structure documentation' },
    { title: 'One-Time Setup Support', desc: 'Initial installation and handover support' },
];

const deliverySteps = [
    'Order confirmation',
    'Requirement check',
    'Customization (if selected)',
    'QA & delivery',
    'Handover support',
];

const faqs = [
    ['Can I publish on Play Store?', 'Yes. We assist with Play Store publishing based on your selected package.'],
    ['Will I get source code?', 'Yes. Complete source code is included with every ready-made game purchase.'],
    ['Can I customize design?', 'Yes. Logo, colors, splash, package name, and branding can be customized.'],
    ['Will AdMob be integrated?', 'Yes. AdMob monetization setup assistance is available with our packages.'],
    ['How many days for delivery?', 'Delivery usually takes 4–20 days depending on the game and customization scope.'],
    ['Do you provide updates?', 'Yes. Support and update assistance is available as per the selected support package.'],
];

export default function GameStore({ games = [], addons = [] }) {
    const whatsappNumber = '918817788185';
    const whatsappBaseLink = `https://wa.me/${whatsappNumber}`;
    const { auth, flash, errors } = usePage().props;
    const [selectedGame, setSelectedGame] = useState(games[0] || null);
    const [selectedAddonIds, setSelectedAddonIds] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [buying, setBuying] = useState(false);

    const selectedAddons = useMemo(
        () => addons.filter((addon) => selectedAddonIds.includes(addon.id)),
        [addons, selectedAddonIds]
    );

    const addonTotal = useMemo(
        () => selectedAddons.reduce((sum, addon) => sum + Number(addon.price || 0), 0),
        [selectedAddons]
    );

    const totalPrice = useMemo(
        () => Number(selectedGame?.price || 0) + addonTotal,
        [selectedGame, addonTotal]
    );

    const toggleAddon = (addonId) => {
        setSelectedAddonIds((prev) =>
            prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
        );
    };

    const selectAllAddons = () => {
        setSelectedAddonIds(addons.map((addon) => addon.id));
    };

    const clearAddons = () => {
        setSelectedAddonIds([]);
    };

    const openGameDetails = (game) => {
        setSelectedGame(game);
        setSelectedAddonIds([]);
        document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
    };

    const buyGame = (game) => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }
        setBuying(true);
        router.post(
            route('member.buy-game'),
            {
                game_id: game.id,
                game_name: game.name,
                game_category: game.category,
                amount: Number(game.price) + addonTotal,
                addon_ids: selectedAddonIds,
                payment_method: 'UPI',
            },
            {
                onFinish: () => setBuying(false),
            }
        );
    };

    return (
        <>
            <Head title="Game Store">
                <link rel="icon" type="image/png" href="/img/app.icon.png" />
            </Head>

            <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
                <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
                        <a href="/" className="inline-flex items-center">
                            <img
                                src="/img/logo.png"
                                alt="DG Ad Space"
                                className="h-[72px] w-auto max-w-[300px] object-contain object-left drop-shadow-[0_0_20px_rgba(77,163,255,0.25)] sm:h-20 sm:max-w-[340px] md:h-24 md:max-w-[400px]"
                            />
                        </a>

                        <nav className="hidden items-center gap-7 lg:flex">
                            <a href="/" className="text-sm font-semibold text-neutral-400 hover:text-[#ff5c1a]">
                                Home
                            </a>
                            <a href="/game-store" className="text-sm font-semibold text-[#ff5c1a]">
                                Game Store
                            </a>
                            <a href="/#pricing" className="text-sm font-semibold text-neutral-400 hover:text-[#ff5c1a]">
                                Pricing
                            </a>
                            <a href="/#contact" className="text-sm font-semibold text-neutral-400 hover:text-[#ff5c1a]">
                                Contact
                            </a>
                        </nav>

                        <div className="hidden items-center gap-3 md:flex">
                            {auth?.user ? (
                                <a href="/member" className="juego-btn-outline px-4 py-2 text-sm">
                                    <Users className="size-4" />
                                    Referral & Earn
                                </a>
                            ) : (
                                <>
                                    <a href="/login" className="text-sm font-semibold text-neutral-200 hover:text-[#ff5c1a]">
                                        Login
                                    </a>
                                    <a href="/register" className="text-sm font-semibold text-neutral-200 hover:text-[#ff5c1a]">
                                        Register
                                    </a>
                                </>
                            )}
                            <a
                                href={whatsappBaseLink}
                                className="pro-btn bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <MessageCircle className="size-4" />
                                WhatsApp
                            </a>
                        </div>

                        <button
                            type="button"
                            className="rounded-lg border border-white/10 p-2 text-neutral-200 lg:hidden"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className="border-t border-white/10 bg-[#0a0a0a] px-4 py-4 lg:hidden">
                            <div className="flex flex-col gap-3">
                                <a href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5">
                                    Home
                                </a>
                                <a href="/game-store" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#ff5c1a] hover:bg-white/5">
                                    Game Store
                                </a>
                                {auth?.user ? (
                                    <a href="/member" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5">
                                        Referral & Earn
                                    </a>
                                ) : (
                                    <>
                                        <a href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5">
                                            Login
                                        </a>
                                        <a href="/register" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5">
                                            Register
                                        </a>
                                    </>
                                )}
                                <a href="/#contact" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5">
                                    Contact
                                </a>
                                <a href={whatsappBaseLink} className="pro-btn bg-emerald-600 text-white">
                                    <MessageCircle className="size-4" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    {/* Hero */}
                    <section className="relative overflow-hidden bg-[#0a0a0a]">
                        <div
                            className="absolute inset-0 opacity-70"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 15% 20%, rgba(255,92,26,0.18), transparent 40%), radial-gradient(circle at 85% 0%, rgba(255,92,26,0.12), transparent 35%)',
                            }}
                        />
                        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a66]">
                                Marketplace
                            </p>
                            <h1 className="max-w-3xl text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                                Ready-Made{' '}
                                <span className="text-[#ff5c1a]">Android Games</span>
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                                Choose your favorite game, customize it with your brand, and launch your own gaming business on Google Play Store.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <a href="#games" className="juego-btn">
                                    Browse Games
                                </a>
                                {auth?.user ? (
                                    <a href="/member" className="juego-btn-outline">
                                        <Users className="size-4" />
                                        Referral & Earn
                                    </a>
                                ) : (
                                    <a
                                        href={`${whatsappBaseLink}?text=${encodeURIComponent('Hi, I need help choosing a ready-made game.')}`}
                                        className="juego-btn-outline"
                                    >
                                        Talk to Sales
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>

                    {flash?.success && (
                        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                {flash.success}
                            </div>
                        </div>
                    )}

                    {errors?.payment && (
                        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {errors.payment}
                            </div>
                        </div>
                    )}

                    <div id="games" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
                        <section>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {games.map((game) => (
                                    <article key={game.name} className="pro-card p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                                        <img
                                            src={game.image}
                                            alt={game.name}
                                            className="h-40 w-full rounded-xl object-cover"
                                        />
                                        <h3 className="mt-3 text-lg font-bold text-white">{game.name}</h3>
                                        <p className="text-xs text-neutral-500">
                                            {game.category} • {game.mode}
                                        </p>
                                        <p className="mt-1 text-xs text-neutral-500">
                                            Android v8+ • {game.tech}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-400">
                                                AdMob Ready
                                            </span>
                                            <span className="rounded-full bg-[#ff5c1a]/10 px-2.5 py-1 font-semibold text-[#ff5c1a]">
                                                Play Store Ready
                                            </span>
                                        </div>
                                        <p className="mt-3 text-xl font-extrabold text-[#ff5c1a]">
                                            ₹{game.price.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            Delivery: {game.delivery} • Demo: {game.downloads}
                                        </p>
                                        <div className="mt-1 flex text-amber-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className="size-3.5 fill-amber-400" />
                                            ))}
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openGameDetails(game)}
                                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-white/10"
                                            >
                                                View Details
                                            </button>
                                            <a
                                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/5"
                                            >
                                                Watch Demo
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => openGameDetails(game)}
                                                className="rounded-lg bg-[#ff5c1a] px-3 py-2 text-center text-xs font-semibold text-white hover:bg-[#ff7338]"
                                            >
                                                Buy Now
                                            </button>
                                            <a
                                                href={`${whatsappBaseLink}?text=${encodeURIComponent(`Hi, I want customization for ${game.name}.`)}`}
                                                className="rounded-lg border border-white/10 px-3 py-2 text-center text-xs font-semibold text-neutral-300 hover:bg-white/5"
                                            >
                                                Customize
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {games.length === 0 && (
                                <div className="pro-card p-8 text-center text-neutral-500">
                                    No games available right now.
                                </div>
                            )}
                        </section>

                        {/* Advanced Product Configurator */}
                        {selectedGame && (
                        <section id="details" className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
                            <div className="border-b border-white/10 bg-gradient-to-r from-[#ff5c1a]/15 via-transparent to-[#1aa3ff]/10 px-5 py-6 md:px-8">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a66]">
                                    Enterprise Product Package
                                </p>
                                <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                                            {selectedGame.name}
                                        </h2>
                                        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
                                            {selectedGame.description ||
                                                'Professional ready-made Android game package. See what is included, add optional services, and get a clear final quote — like buying from a VIP IT company.'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
                                        <p className="text-[11px] uppercase tracking-wide text-neutral-500">Starting from</p>
                                        <p className="text-2xl font-extrabold text-[#ff5c1a]">
                                            ₹{Number(selectedGame.price).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-300">
                                        {selectedGame.category}
                                    </span>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-300">
                                        {selectedGame.tech || 'Unity'}
                                    </span>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-300">
                                        {selectedGame.mode || 'Single Player'}
                                    </span>
                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                                        Delivery: {selectedGame.delivery || '7-10 days'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                                <div className="space-y-6 border-b border-white/10 p-5 md:p-8 lg:border-b-0 lg:border-r">
                                    <img
                                        src={selectedGame.image}
                                        alt={`${selectedGame.name} banner`}
                                        className="h-64 w-full rounded-2xl object-cover md:h-72"
                                    />

                                    <div>
                                        <div className="mb-3 flex items-center gap-2">
                                            <Package className="size-5 text-[#ff5c1a]" />
                                            <h3 className="text-lg font-bold text-white">What You Get in Base Package</h3>
                                        </div>
                                        <p className="mb-4 text-sm text-neutral-400">
                                            These deliverables are included with every game purchase.
                                        </p>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {baseIncluded.map((item) => (
                                                <div
                                                    key={item.title}
                                                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                                                >
                                                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                                                        <CheckCircle2 className="size-4 text-emerald-400" />
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 pl-6 text-xs text-neutral-400">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Add More Services</h3>
                                                <p className="mt-1 text-sm text-neutral-400">
                                                    Optional upgrades — select only what you need. Price adds to total.
                                                </p>
                                            </div>
                                            {addons.length > 0 && (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={selectAllAddons}
                                                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-white/5"
                                                    >
                                                        Select All
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={clearAddons}
                                                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-white/5"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {addons.length > 0 ? (
                                            <div className="space-y-3">
                                                {addons.map((addon, index) => {
                                                    const checked = selectedAddonIds.includes(addon.id);
                                                    return (
                                                        <label
                                                            key={addon.id}
                                                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition ${
                                                                checked
                                                                    ? 'border-[#ff5c1a]/60 bg-[#ff5c1a]/10 shadow-[0_0_0_1px_rgba(255,92,26,0.25)]'
                                                                    : 'border-white/10 bg-[#0a0a0a]/70 hover:border-white/25'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => toggleAddon(addon.id)}
                                                                className="mt-1 size-4 accent-[#ff5c1a]"
                                                            />
                                                            <span className="flex-1">
                                                                <span className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-sm font-bold text-white">
                                                                        {addon.name}
                                                                    </span>
                                                                    {index === 0 && (
                                                                        <span className="rounded-full bg-[#1aa3ff]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1aa3ff]">
                                                                            Recommended
                                                                        </span>
                                                                    )}
                                                                    {checked && (
                                                                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                                                                            Selected
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                {addon.description && (
                                                                    <span className="mt-1 block text-xs leading-relaxed text-neutral-400">
                                                                        {addon.description}
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className="shrink-0 text-right">
                                                                <span className="block text-sm font-extrabold text-[#ff5c1a]">
                                                                    +₹{Number(addon.price).toLocaleString('en-IN')}
                                                                </span>
                                                                <span className="text-[10px] uppercase tracking-wide text-neutral-500">
                                                                    Add-on
                                                                </span>
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-neutral-500">
                                                Extra services will appear here once admin adds them in Game Options.
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="mb-3 text-lg font-bold text-white">Delivery Process</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {deliverySteps.map((step, i) => (
                                                <div
                                                    key={step}
                                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-300"
                                                >
                                                    <span className="flex size-5 items-center justify-center rounded-full bg-[#ff5c1a]/20 text-[10px] font-bold text-[#ff5c1a]">
                                                        {i + 1}
                                                    </span>
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0d0d0d] p-5 md:p-8">
                                    <div className="sticky top-24 space-y-4">
                                        <div className="rounded-2xl border border-[#ff5c1a]/35 bg-[#ff5c1a]/5 p-5">
                                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a66]">
                                                Order Summary
                                            </p>
                                            <h3 className="mt-2 text-xl font-bold text-white">Your Package</h3>

                                            <ul className="mt-4 space-y-2.5 text-sm text-neutral-300">
                                                <li className="flex justify-between gap-3">
                                                    <span>{selectedGame.name} (Base)</span>
                                                    <span className="font-semibold text-white">
                                                        ₹{Number(selectedGame.price).toLocaleString('en-IN')}
                                                    </span>
                                                </li>
                                                {selectedAddons.length === 0 && (
                                                    <li className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-neutral-500">
                                                        No extra services selected yet.
                                                    </li>
                                                )}
                                                {selectedAddons.map((addon) => (
                                                    <li key={addon.id} className="flex justify-between gap-3">
                                                        <span className="text-neutral-400">+ {addon.name}</span>
                                                        <span>₹{Number(addon.price).toLocaleString('en-IN')}</span>
                                                    </li>
                                                ))}
                                                <li className="flex justify-between gap-3 border-t border-white/10 pt-3 text-base font-extrabold text-[#ff5c1a]">
                                                    <span>Total Payable</span>
                                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                                </li>
                                            </ul>

                                            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-neutral-400">
                                                <p className="inline-flex items-center gap-2 font-semibold text-neutral-200">
                                                    <ShieldCheck className="size-3.5 text-emerald-400" />
                                                    Secure purchase
                                                </p>
                                                <p className="mt-1">
                                                    Source code ownership after payment. Selected services are added to your order notes.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={buying}
                                                onClick={() => buyGame(selectedGame)}
                                                className="juego-btn mt-4 w-full disabled:opacity-70"
                                            >
                                                <CircleDollarSign className="size-4" />
                                                {buying ? 'Processing...' : `Buy Package · ₹${totalPrice.toLocaleString('en-IN')}`}
                                            </button>

                                            <a
                                                href={`${whatsappBaseLink}?text=${encodeURIComponent(
                                                    `Hi, I want a custom quote for ${selectedGame.name}. Selected: ${
                                                        selectedAddons.map((a) => a.name).join(', ') || 'Base package only'
                                                    }. Total approx ₹${totalPrice.toLocaleString('en-IN')}.`
                                                )}`}
                                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-neutral-200 hover:bg-white/5"
                                            >
                                                <MessageCircle className="size-4 text-[#25D366]" />
                                                Talk to Sales
                                            </a>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                            <h4 className="font-bold text-white">Why this package?</h4>
                                            <ul className="mt-3 space-y-2 text-xs text-neutral-400">
                                                <li className="inline-flex items-start gap-2">
                                                    <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-[#ff5c1a]" />
                                                    Transparent pricing — no hidden charges
                                                </li>
                                                <li className="inline-flex items-start gap-2">
                                                    <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-[#ff5c1a]" />
                                                    Add only Development, Play Store, AdMob or Marketing
                                                </li>
                                                <li className="inline-flex items-start gap-2">
                                                    <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-[#ff5c1a]" />
                                                    Admin-controlled prices (always up to date)
                                                </li>
                                                <li className="inline-flex items-start gap-2">
                                                    <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-[#ff5c1a]" />
                                                    Professional delivery & handover support
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        )}

                        <section className="mt-10 grid gap-5 lg:grid-cols-2">
                            <article className="pro-card p-5">
                                <h3 className="text-xl font-bold text-white">Game Features</h3>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {features.map((f) => (
                                        <div
                                            key={f}
                                            className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-neutral-300"
                                        >
                                            <CheckCircle2 className="size-4 shrink-0 text-[#ff5c1a]" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </article>
                            <article className="pro-card p-5">
                                <h3 className="text-xl font-bold text-white">What's Included</h3>
                                <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                                    {[
                                        'Complete Source Code',
                                        'Game Assets',
                                        'Documentation',
                                        'APK',
                                        'AAB',
                                        'Admin Panel (if available)',
                                        'Database Setup Guide',
                                        'Installation Guide',
                                        'One-Time Setup Support',
                                    ].map((item) => (
                                        <li key={item} className="inline-flex items-center gap-2">
                                            <BadgeCheck className="size-4 text-[#ff5c1a]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="mt-6 text-xl font-bold text-white">Customization Options</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {[
                                        'App Name',
                                        'Package Name',
                                        'Logo',
                                        'Splash Screen',
                                        'App Icon',
                                        'Theme Color',
                                        'AdMob IDs',
                                        'Firebase Setup',
                                        'Language',
                                        'Additional Features',
                                    ].map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        </section>

                        <section className="mt-10 grid gap-5 lg:grid-cols-2">
                            <article className="pro-card p-5">
                                <h3 className="text-xl font-bold text-white">Purchase Flow</h3>
                                <div className="mt-3 space-y-2">
                                    {purchaseFlow.map((step, idx) => (
                                        <p key={step} className="inline-flex items-center gap-2 text-sm text-neutral-300">
                                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#ff5c1a]/10 text-xs font-bold text-[#ff5c1a]">
                                                {idx + 1}
                                            </span>
                                            {step}
                                        </p>
                                    ))}
                                </div>
                            </article>
                            <article className="pro-card p-5">
                                <h3 className="text-xl font-bold text-white">Payment Gateway</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {paymentMethods.map((m) => (
                                        <span
                                            key={m}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300"
                                        >
                                            {m}
                                        </span>
                                    ))}
                                </div>
                                <h4 className="mt-5 font-bold text-white">After Razorpay Payment</h4>
                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                    {[
                                        'Auto Payment Verify',
                                        'Order Marked Paid',
                                        'Customer Dashboard',
                                        'Level Income Credit',
                                        'Project Processing',
                                        'Delivery Handover',
                                    ].map((item) => (
                                        <p
                                            key={item}
                                            className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-neutral-300"
                                        >
                                            <Download className="size-4 text-[#ff5c1a]" />
                                            {item}
                                        </p>
                                    ))}
                                </div>
                            </article>
                        </section>

                        <section className="mt-10 grid gap-5 lg:grid-cols-2">
                            <article className="pro-card p-5">
                                <h3 className="text-xl font-bold text-white">Customer Dashboard</h3>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {[
                                        'Track Project',
                                        'View Order Status',
                                        'Upload Logo',
                                        'Upload Assets',
                                        'Send Requirements',
                                        'Chat with Team',
                                        'Download Invoice',
                                        'Raise Support Ticket',
                                    ].map((item) => (
                                        <p
                                            key={item}
                                            className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-neutral-300"
                                        >
                                            <Store className="size-4 text-[#ff5c1a]" />
                                            {item}
                                        </p>
                                    ))}
                                </div>
                            </article>
                            <article className="pro-card p-5">
                                <h3 className="text-xl font-bold text-white">Recommended Games</h3>
                                <p className="mt-2 text-sm text-neutral-500">Customers may also like</p>
                                <div className="mt-3 grid gap-2">
                                    {games.slice(0, 4).map((g) => (
                                        <button
                                            key={g.name}
                                            type="button"
                                            onClick={() => {
                                                setSelectedGame(g);
                                                document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-neutral-300 hover:border-[#ff5c1a]/40 hover:bg-[#ff5c1a]/5"
                                        >
                                            {g.name} — ₹{g.price.toLocaleString('en-IN')}
                                        </button>
                                    ))}
                                </div>
                            </article>
                        </section>

                        <section className="pro-card mt-10 p-5 md:p-6">
                            <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
                            <div className="mt-4 space-y-2">
                                {faqs.map(([q, a]) => (
                                    <details key={q} className="rounded-xl border border-white/10 bg-white/5 p-4">
                                        <summary className="cursor-pointer text-sm font-semibold text-white">
                                            {q}
                                        </summary>
                                        <p className="mt-2 text-sm text-neutral-400">{a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>

                        <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#141414] px-6 py-10 text-center text-white md:px-10">
                            <h3 className="text-2xl font-bold sm:text-3xl">Ready to Launch Your Own Game?</h3>
                            <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
                                Choose your favorite game today and start your mobile gaming business with DG Ad Space.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <a
                                    href={`${whatsappBaseLink}?text=${encodeURIComponent('Hi, I want to buy a ready-made Android game.')}`}
                                    className="juego-btn"
                                >
                                    Buy Now
                                </a>
                                <a
                                    href={`${whatsappBaseLink}?text=${encodeURIComponent('Hi, I need help choosing a game package.')}`}
                                    className="juego-btn-outline"
                                >
                                    Contact Sales
                                </a>
                                <a
                                    href={whatsappBaseLink}
                                    className="pro-btn bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    <MessageCircle className="size-4" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </section>
                    </div>
                </main>

                <footer className="border-t border-white/10 bg-[#050505] text-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
                        <div>
                            <img src="/img/logo.png" alt="DG Ad Space" className="h-16 w-auto max-w-[280px] object-contain object-left drop-shadow sm:h-20 sm:max-w-[340px]" />
                            <p className="mt-3 text-sm text-neutral-400">Ready-Made Android Games Marketplace</p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                            <a href="/" className="hover:text-[#ff5c1a]">Home</a>
                            <a href="/game-store" className="hover:text-[#ff5c1a]">Game Store</a>
                            <a href="/#contact" className="hover:text-[#ff5c1a]">Contact</a>
                        </div>
                    </div>
                    <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">
                        © {new Date().getFullYear()} DG Ad Space. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
