import { Link, usePage } from '@inertiajs/react';
import {
    CreditCard,
    Gamepad2,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    Ticket,
    TrendingUp,
    ShoppingBag,
    X,
} from 'lucide-react';
import { useState } from 'react';

const links = [
    { href: '/member', label: 'Referral & Earn', icon: TrendingUp },
    { href: '/member/purchases', label: 'Purchases', icon: ShoppingBag },
    { href: '/member/payments', label: 'Payments', icon: CreditCard },
    { href: '/member/incomes', label: 'Level Income', icon: LayoutDashboard },
    { href: '/member/tickets', label: 'Tickets', icon: Ticket },
];

function isActive(url, href) {
    if (href === '/member') {
        return url === '/member' || url === '/dashboard';
    }
    return url.startsWith(href);
}

export default function MemberLayout({ children, title, subtitle }) {
    const page = usePage();
    const { auth } = page.props;
    const currentUrl = page.url;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
            {/* Top brand bar */}
            <div className="bg-[#111111] py-1.5 text-center text-[11px] font-semibold tracking-wide text-[#ff9a66]">
                DG Ad Space Member Panel — Your Game. Our Work. Your Income.
            </div>

            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 shadow-sm backdrop-blur-lg">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:px-8">
                    <Link href="/" className="inline-flex items-center">
                        <img
                            src="/img/logo.png"
                            alt="DG Ad Space"
                            className="h-[72px] w-auto max-w-[300px] object-contain object-left drop-shadow-[0_0_20px_rgba(77,163,255,0.25)] sm:h-20 sm:max-w-[340px] md:h-24 md:max-w-[400px]"
                        />
                    </Link>

                    <div className="hidden items-center gap-3 md:flex">
                        <span className="rounded-full bg-[#ff5c1a]/10 px-3 py-1.5 text-sm font-semibold text-[#ff5c1a]">
                            {auth.user?.name}
                        </span>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5"
                        >
                            <Home className="size-4" />
                            Home
                        </Link>
                        <Link
                            href="/game-store"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5"
                        >
                            <Gamepad2 className="size-4" />
                            Game Store
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#ff5c1a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#ff7338]"
                        >
                            <LogOut className="size-4" />
                            Logout
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="rounded-xl border border-white/10 p-2 text-neutral-200 md:hidden"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="border-t border-white/10 bg-[#0a0a0a] px-4 py-4 md:hidden">
                        <p className="mb-3 text-sm font-semibold text-[#ff5c1a]">{auth.user?.name}</p>
                        <div className="mb-3 space-y-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                                        isActive(currentUrl, link.href)
                                            ? 'bg-[#ff5c1a] text-white'
                                            : 'text-neutral-300 hover:bg-[#ff5c1a]/10 hover:text-[#ff5c1a]'
                                    }`}
                                >
                                    <link.icon className="size-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
                            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-300">Home</Link>
                            <Link href="/game-store" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-300">Game Store</Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded-xl bg-[#ff5c1a] px-3 py-2.5 text-left text-sm font-semibold text-white"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-8 md:py-8">
                <aside className="pro-card hidden h-fit overflow-hidden md:block">
                    <div className="border-b border-white/10 bg-[#111111] px-4 py-4">
                        <img
                            src="/img/logo.png"
                            alt="DG Ad Space"
                            className="mx-auto h-16 w-auto object-contain drop-shadow md:h-20"
                        />
                        <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff9a66]">
                            Member Panel
                        </p>
                    </div>
                    <nav className="space-y-1 p-3">
                        {links.map((link) => {
                            const active = isActive(currentUrl, link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                        active
                                            ? 'bg-[#ff5c1a] text-white shadow-sm'
                                            : 'text-neutral-300 hover:bg-[#ff5c1a]/10 hover:text-[#ff5c1a]'
                                    }`}
                                >
                                    <link.icon className="size-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main>
                    {(title || subtitle) && (
                        <div className="mb-6">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ff5c1a]">
                                DG Ad Space
                            </p>
                            {title && (
                                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="mt-2 text-sm text-neutral-400 sm:text-base">{subtitle}</p>
                            )}
                        </div>
                    )}
                    {children}
                </main>
            </div>

            <footer className="mt-4 border-t border-white/10 bg-[#050505] text-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 md:flex-row md:justify-between md:px-8">
                    <div className="text-center md:text-left">
                        <img
                            src="/img/logo.png"
                            alt="DG Ad Space"
                            className="mx-auto h-16 w-auto object-contain drop-shadow md:mx-0 md:h-20"
                        />
                        <p className="mt-2 text-sm text-neutral-400">Member dashboard powered by DG Ad Space</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-400">
                        <Link href="/" className="hover:text-[#ff5c1a]">Home</Link>
                        <Link href="/game-store" className="hover:text-[#ff5c1a]">Game Store</Link>
                        <Link href="/member" className="hover:text-[#ff5c1a]">Dashboard</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
