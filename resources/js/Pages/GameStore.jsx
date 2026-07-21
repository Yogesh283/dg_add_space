import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    BadgeCheck,
    CheckCircle2,
    CircleDollarSign,
    Download,
    Filter,
    ListFilter,
    Menu,
    MessageCircle,
    Search,
    Star,
    Store,
    Users,
    X,
} from 'lucide-react';

const defaultCategories = [
    'Racing Games',
    'Puzzle Games',
    'Arcade Games',
    'Quiz Games',
    'Multiplayer Games',
    'Sports Games',
    'Casual Games',
    'Card Games',
    'Board Games',
    'Action Games',
    'Adventure Games',
    'Simulation Games',
    'Hyper Casual Games',
];

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
    'Customize Options',
    'Review Order',
    'Secure Payment',
    'Order Confirmation',
    'Project Processing',
    'Delivery',
];

const paymentMethods = [
    'Razorpay',
    'PhonePe',
    'Google Pay',
    'UPI',
    'Debit Card',
    'Credit Card',
    'Net Banking',
    'International Cards',
    'UPI QR',
];

const faqs = [
    ['Can I publish on Play Store?', 'Yes. We assist with Play Store publishing based on your selected package.'],
    ['Will I get source code?', 'Yes. Complete source code is included with every ready-made game purchase.'],
    ['Can I customize design?', 'Yes. Logo, colors, splash, package name, and branding can be customized.'],
    ['Will AdMob be integrated?', 'Yes. AdMob monetization setup assistance is available with our packages.'],
    ['How many days for delivery?', 'Delivery usually takes 4–20 days depending on the game and customization scope.'],
    ['Do you provide updates?', 'Yes. Support and update assistance is available as per the selected support package.'],
];

export default function GameStore({ games = [], categories = [] }) {
    const whatsappNumber = '918817788185';
    const whatsappBaseLink = `https://wa.me/${whatsappNumber}`;
    const { auth, flash } = usePage().props;
    const categoryList = categories.length ? categories : defaultCategories;
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Popularity');
    const [selectedGame, setSelectedGame] = useState(games[0] || null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [buying, setBuying] = useState(false);

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
                amount: game.price,
                payment_method: 'UPI',
            },
            {
                onFinish: () => setBuying(false),
            }
        );
    };

    const filteredGames = useMemo(() => {
        let items = games.filter((g) => {
            const q = query.toLowerCase();
            const matchesQuery =
                g.name.toLowerCase().includes(q) ||
                (g.category || '').toLowerCase().includes(q) ||
                (g.tech || '').toLowerCase().includes(q);
            const matchesCategory = activeCategory === 'All' || g.category === activeCategory;
            return matchesQuery && matchesCategory;
        });

        if (sortBy === 'Price') {
            items = [...items].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'Latest' || sortBy === 'Newest') {
            items = [...items].reverse();
        } else if (sortBy === 'Best Selling') {
            items = [...items].sort((a, b) => parseInt(b.downloads || '0', 10) - parseInt(a.downloads || '0', 10));
        }

        return items;
    }, [games, query, activeCategory, sortBy]);

    return (
        <>
            <Head title="Ready-Made Android Games | DG Ad Space" />

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

                    <div id="games" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
                        <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
                            <aside className="pro-card h-fit p-4">
                                <h3 className="inline-flex items-center gap-2 font-bold text-white">
                                    <Filter className="size-4 text-[#ff5c1a]" />
                                    Search & Filter
                                </h3>
                                <div className="mt-4">
                                    <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                        Category
                                    </label>
                                    <div className="mt-2 grid max-h-[420px] gap-1.5 overflow-auto pr-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveCategory('All')}
                                            className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${
                                                activeCategory === 'All'
                                                    ? 'bg-[#ff5c1a]/10 text-[#ff5c1a]'
                                                    : 'text-neutral-400 hover:bg-white/5'
                                            }`}
                                        >
                                            All Games
                                        </button>
                                        {categoryList.map((c) => (
                                            <button
                                                type="button"
                                                key={c}
                                                onClick={() => setActiveCategory(c)}
                                                className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${
                                                    activeCategory === c
                                                        ? 'bg-[#ff5c1a]/10 text-[#ff5c1a]'
                                                        : 'text-neutral-400 hover:bg-white/5'
                                                }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            <div>
                                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-neutral-500" />
                                        <input
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Search games..."
                                            className="w-full rounded-xl border border-white/10 bg-[#141414] py-3 pl-9 pr-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                        />
                                    </div>
                                    <div className="relative">
                                        <ListFilter className="pointer-events-none absolute left-3 top-3.5 size-4 text-neutral-500" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-[#141414] py-3 pl-9 pr-8 text-sm text-white outline-none focus:border-[#ff5c1a] sm:w-auto"
                                        >
                                            <option>Popularity</option>
                                            <option>Price</option>
                                            <option>Latest</option>
                                            <option>Best Selling</option>
                                            <option>Newest</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {filteredGames.map((game) => (
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
                                                    onClick={() => {
                                                        setSelectedGame(game);
                                                        document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
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
                                                    disabled={buying}
                                                    onClick={() => buyGame(game)}
                                                    className="rounded-lg bg-[#ff5c1a] px-3 py-2 text-center text-xs font-semibold text-white hover:bg-[#ff7338] disabled:opacity-70"
                                                >
                                                    {buying ? 'Processing...' : 'Buy Now'}
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

                                {filteredGames.length === 0 && (
                                    <div className="pro-card p-8 text-center text-neutral-500">
                                        No games found for your search.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Details */}
                        {selectedGame && (
                        <section id="details" className="pro-card mt-10 p-5 md:p-6">
                            <h2 className="text-2xl font-bold text-white">
                                {selectedGame.name} — Product Details
                            </h2>
                            <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                                <div className="space-y-4">
                                    <img
                                        src={selectedGame.image}
                                        alt={`${selectedGame.name} banner`}
                                        className="h-72 w-full rounded-xl object-cover"
                                    />
                                    <div className="overflow-hidden rounded-xl border border-white/10">
                                        <div className="relative w-full pt-[56.25%]">
                                            <iframe
                                                title="Gameplay Video"
                                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                                className="absolute inset-0 h-full w-full"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <img src={selectedGame.image} alt="Screenshot 1" className="h-24 w-full rounded-lg object-cover" />
                                        <img src={games[1]?.image || selectedGame.image} alt="Screenshot 2" className="h-24 w-full rounded-lg object-cover" />
                                        <img src={games[2]?.image || selectedGame.image} alt="Screenshot 3" className="h-24 w-full rounded-lg object-cover" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-[#ff5c1a]/30 bg-[#ff5c1a]/5 p-4">
                                        <h3 className="font-bold text-white">Pricing</h3>
                                        <ul className="mt-2 space-y-1.5 text-sm text-neutral-300">
                                            <li>Game Price: ₹{Number(selectedGame.price).toLocaleString('en-IN')}</li>
                                            <li>Customization Cost: ₹9,999+</li>
                                            <li>Play Store Publishing Assistance: ₹4,999</li>
                                            <li>AdMob Integration Assistance: ₹3,999</li>
                                            <li>Support Package: ₹4,999</li>
                                            <li className="font-bold text-[#ff5c1a]">
                                                Total Price: ₹{(Number(selectedGame.price) + 18997).toLocaleString('en-IN')}
                                            </li>
                                        </ul>
                                        <button
                                            type="button"
                                            disabled={buying}
                                            onClick={() => buyGame(selectedGame)}
                                            className="juego-btn mt-4 w-full disabled:opacity-70"
                                        >
                                            <CircleDollarSign className="size-4" />
                                            {buying ? 'Processing...' : 'Buy Now'}
                                        </button>
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
                                <h4 className="mt-5 font-bold text-white">After Successful Payment</h4>
                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                    {[
                                        'Order ID',
                                        'Invoice',
                                        'Customer Dashboard',
                                        'Download Invoice',
                                        'Email Confirmation',
                                        'SMS Notification',
                                        'Admin Notification',
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
