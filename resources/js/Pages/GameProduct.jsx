import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    CheckCircle2,
    CircleDollarSign,
    Menu,
    MessageCircle,
    Minus,
    Package,
    Plus,
    ShieldCheck,
    Star,
    Trash2,
    Users,
    X,
} from 'lucide-react';

const baseIncluded = [
    { title: 'Complete Source Code', desc: 'Full project files with ownership after purchase' },
    { title: 'APK + AAB Build', desc: 'Ready Android package files for testing & publishing' },
    { title: 'Game Assets', desc: 'Graphics, UI, and media assets included' },
    { title: 'Documentation', desc: 'Setup and installation guide for your team' },
    { title: 'Database Setup Guide', desc: 'Backend / Firebase structure documentation' },
    { title: 'One-Time Setup Support', desc: 'Initial installation and handover support' },
];

export default function GameProduct({ game, addons = [], related = [] }) {
    const whatsappNumber = '918817788185';
    const whatsappBaseLink = `https://wa.me/${whatsappNumber}`;
    const { auth } = usePage().props;
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

    const totalPrice = Number(game.price || 0) + addonTotal;

    const addAddon = (addonId) => {
        setSelectedAddonIds((prev) => (prev.includes(addonId) ? prev : [...prev, addonId]));
    };

    const removeAddon = (addonId) => {
        setSelectedAddonIds((prev) => prev.filter((id) => id !== addonId));
    };

    const buyNow = () => {
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
                amount: totalPrice,
                addon_ids: selectedAddonIds,
                payment_method: 'Razorpay',
            },
            { onFinish: () => setBuying(false) }
        );
    };

    return (
        <>
            <Head title={game.name}>
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
                            <a href="/services" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Services</a>
                            <a href="/game-store" className="text-sm font-semibold text-[#ff5c1a]">Game Store</a>
                            <a href="/#contact" className="text-sm font-semibold text-neutral-600 hover:text-[#ff5c1a]">Contact</a>
                        </nav>
                        <div className="hidden items-center gap-3 md:flex">
                            {auth?.user ? (
                                <a href="/member" className="juego-btn px-4 py-2 text-sm">
                                    <Users className="size-4" /> Referral & Earn
                                </a>
                            ) : (
                                <>
                                    <a href="/login" className="text-sm font-semibold text-neutral-700 hover:text-[#ff5c1a]">Login</a>
                                    <a href="/register" className="juego-btn px-4 py-2">Register</a>
                                </>
                            )}
                        </div>
                        <button type="button" className="rounded-lg border border-neutral-200 p-2 text-neutral-700 lg:hidden" onClick={() => setMenuOpen((v) => !v)}>
                            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>
                    {menuOpen && (
                        <div className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
                            <div className="flex flex-col gap-2">
                                <a href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700">Home</a>
                                <a href="/services" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700">Services</a>
                                <a href="/game-store" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#ff5c1a]">Game Store</a>
                                {auth?.user ? (
                                    <a href="/member" className="rounded-lg bg-[#ff5c1a] px-3 py-2.5 text-center text-sm font-semibold text-white">
                                        Referral & Earn
                                    </a>
                                ) : (
                                    <>
                                        <a href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700">Login</a>
                                        <a href="/register" className="rounded-lg bg-[#ff5c1a] px-3 py-2.5 text-center text-sm font-semibold text-white">
                                            Register
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                    <p className="mb-4 text-sm text-neutral-500">
                        <a href="/game-store" className="hover:text-[#ff5c1a]">Game Store</a>
                        <span className="mx-2">/</span>
                        <span className="font-semibold text-neutral-800">{game.name}</span>
                    </p>

                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
                                <img src={game.image} alt={game.name} className="h-[320px] w-full rounded-2xl object-cover sm:h-[420px]" />
                            </div>

                            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <Package className="size-5 text-[#ff5c1a]" />
                                    <h2 className="text-xl font-bold text-neutral-900">What&apos;s Included (Base Package)</h2>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {baseIncluded.map((item) => (
                                        <div key={item.title} className="rounded-xl border border-neutral-200 bg-[#f8fafc] p-3">
                                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">
                                                <CheckCircle2 className="size-4 text-emerald-500" />
                                                {item.title}
                                            </p>
                                            <p className="mt-1 pl-6 text-xs text-neutral-600">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
                                <h2 className="text-xl font-bold text-neutral-900">Add / Remove Services</h2>
                                <p className="mt-1 text-sm text-neutral-600">
                                    Like Amazon — add only what you need. Price updates instantly.
                                </p>
                                <div className="mt-4 space-y-3">
                                    {addons.map((addon) => {
                                        const selected = selectedAddonIds.includes(addon.id);
                                        return (
                                            <div
                                                key={addon.id}
                                                className={`rounded-2xl border px-4 py-4 ${
                                                    selected
                                                        ? 'border-[#ff5c1a]/50 bg-[#ff5c1a]/5'
                                                        : 'border-neutral-200 bg-[#f8fafc]'
                                                }`}
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-neutral-900">{addon.name}</p>
                                                        {addon.description && (
                                                            <p className="mt-1 text-sm text-neutral-600">{addon.description}</p>
                                                        )}
                                                        <p className="mt-2 text-sm font-extrabold text-[#ff5c1a]">
                                                            +₹{Number(addon.price).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                    {selected ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAddon(addon.id)}
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Remove
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => addAddon(addon.id)}
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5c1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff7338]"
                                                        >
                                                            <Plus className="size-4" />
                                                            Add
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {addons.length === 0 && (
                                        <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-500">
                                            No add-on services available right now.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
                            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff5c1a]">Product</p>
                                <h1 className="mt-2 text-2xl font-extrabold text-neutral-900">{game.name}</h1>
                                <p className="mt-2 text-sm text-neutral-600">
                                    {game.category} • {game.mode || 'Single Player'} • {game.tech || 'Unity'}
                                </p>
                                <div className="mt-2 flex text-amber-400">
                                    {Array.from({ length: game.rating || 5 }).map((_, i) => (
                                        <Star key={i} className="size-4 fill-amber-400" />
                                    ))}
                                </div>

                                <div className="mt-5 rounded-2xl border border-neutral-200 bg-[#f8fafc] p-4">
                                    <ul className="space-y-2 text-sm text-neutral-700">
                                        <li className="flex justify-between gap-3">
                                            <span>{game.name} (Base)</span>
                                            <span className="font-semibold">₹{Number(game.price).toLocaleString('en-IN')}</span>
                                        </li>
                                        {selectedAddons.map((addon) => (
                                            <li key={addon.id} className="flex items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-2">
                                                    <button type="button" onClick={() => removeAddon(addon.id)} className="rounded border border-neutral-300 p-0.5 text-neutral-500 hover:text-red-600">
                                                        <Minus className="size-3" />
                                                    </button>
                                                    {addon.name}
                                                </span>
                                                <span>₹{Number(addon.price).toLocaleString('en-IN')}</span>
                                            </li>
                                        ))}
                                        <li className="flex justify-between gap-3 border-t border-neutral-200 pt-2 text-base font-extrabold text-[#ff5c1a]">
                                            <span>Total</span>
                                            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                                    <p className="inline-flex items-center gap-2 font-semibold">
                                        <ShieldCheck className="size-3.5" />
                                        Secure Razorpay checkout
                                    </p>
                                    <p className="mt-1">Payment success pe order auto paid ho jata hai — no admin wait.</p>
                                </div>

                                <button
                                    type="button"
                                    disabled={buying}
                                    onClick={buyNow}
                                    className="juego-btn mt-4 w-full disabled:opacity-70"
                                >
                                    <CircleDollarSign className="size-4" />
                                    {buying ? 'Processing...' : `Buy Now · ₹${totalPrice.toLocaleString('en-IN')}`}
                                </button>

                                <a
                                    href={`${whatsappBaseLink}?text=${encodeURIComponent(
                                        `Hi, I want ${game.name}. Selected: ${selectedAddons.map((a) => a.name).join(', ') || 'Base only'}. Total ₹${totalPrice.toLocaleString('en-IN')}.`
                                    )}`}
                                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                                >
                                    <MessageCircle className="size-4 text-[#25D366]" />
                                    Talk to Sales
                                </a>

                                <Link href="/services" className="mt-3 block text-center text-sm font-semibold text-[#ff5c1a] hover:underline">
                                    View all Services explained →
                                </Link>
                            </div>
                        </aside>
                    </div>

                    {related.length > 0 && (
                        <section className="mt-10">
                            <h3 className="text-xl font-bold text-neutral-900">Related Games</h3>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {related.map((item) => (
                                    <a key={item.id} href={`/game-store/${item.slug}`} className="pro-card overflow-hidden p-3 transition hover:-translate-y-0.5">
                                        <img src={item.image} alt={item.name} className="h-28 w-full rounded-xl object-cover" />
                                        <p className="mt-2 font-bold text-neutral-900">{item.name}</p>
                                        <p className="text-sm font-semibold text-[#ff5c1a]">₹{Number(item.price).toLocaleString('en-IN')}</p>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <footer className="mt-10 border-t border-neutral-200 bg-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-8">
                        <p>© {new Date().getFullYear()} DG AD SPACE</p>
                        <div className="flex gap-4">
                            <a href="/services" className="hover:text-[#ff5c1a]">Services</a>
                            <a href="/game-store" className="hover:text-[#ff5c1a]">Game Store</a>
                            <a href="/#contact" className="hover:text-[#ff5c1a]">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
