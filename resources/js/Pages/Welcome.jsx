import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ArrowRight,
    BadgeCheck,
    Briefcase,
    ChartLine,
    CheckCircle2,
    CircleDollarSign,
    Coins,
    Gamepad2,
    Megaphone,
    MessageCircle,
    Menu,
    Rocket,
    ShieldCheck,
    Smartphone,
    Star,
    Store,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';
import { heroBannerImage, landingBanners } from '../data/appImages';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#income', label: 'Income' },
    { href: '#services', label: 'Services' },
    { href: '#how-it-works', label: 'Process' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
];

const processCards = [
    {
        step: '01',
        title: 'Game Development',
        icon: Gamepad2,
        banner: '/img/step-banner-dev.png',
        points: [
            'Custom Android game development',
            'Modern UI/UX design',
            'Performance optimization',
            'Testing and deployment support',
        ],
    },
    {
        step: '02',
        title: 'Play Store & AdMob Setup',
        icon: Store,
        banner: '/img/step-banner-publish.png',
        points: [
            'Publish the game on Google Play Store',
            'Configure and activate Google AdMob',
            'Banner, interstitial & rewarded ads',
            'Enable advertising revenue monetization',
        ],
    },
    {
        step: '03',
        title: 'Digital Marketing & Growth',
        icon: Megaphone,
        banner: '/img/step-banner-marketing.png',
        points: [
            'Social media marketing campaigns',
            'App promotion strategies',
            'Download growth campaigns',
            'User engagement & retention strategies',
        ],
    },
];

const featureCards = [
    {
        title: 'End-to-End',
        subtitle: 'Development to Revenue',
        desc: 'From concept to code and beyond – we handle everything for your gaming success.',
        icon: Gamepad2,
        accent: '#3b82f6',
        soft: 'rgba(59,130,246,0.12)',
        border: 'rgba(59,130,246,0.35)',
    },
    {
        title: 'Publish',
        subtitle: 'Google Play Store',
        desc: 'We publish your game on Play Store with full setup and policy compliance.',
        playStore: true,
        accent: '#a855f7',
        soft: 'rgba(168,85,247,0.12)',
        border: 'rgba(168,85,247,0.35)',
    },
    {
        title: 'Monetize',
        subtitle: 'Google AdMob Ads',
        desc: 'AdMob integration to help you earn more with smart ad placements.',
        icon: CircleDollarSign,
        accent: '#22c55e',
        soft: 'rgba(34,197,94,0.12)',
        border: 'rgba(34,197,94,0.35)',
    },
    {
        title: 'Grow',
        subtitle: 'Marketing & Users',
        desc: 'Our marketing strategies bring real users and long-term growth for your game.',
        icon: ChartLine,
        accent: '#ff5c1a',
        soft: 'rgba(255,92,26,0.12)',
        border: 'rgba(255,92,26,0.35)',
    },
];

function GooglePlayIcon({ className = 'size-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path fill="#00C3FF" d="M3.609 1.814 13.792 12 3.61 22.186a1 1 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92Z" />
            <path fill="#FFD500" d="M16.709 14.492 3.61 22.186l10.183-10.185 2.916 2.491Z" />
            <path fill="#FF3954" d="M20.868 11.134a1.004 1.004 0 0 1 0 1.732l-4.159 2.626-2.917-2.491L16.71 9.51l4.158 1.624Z" />
            <path fill="#00F076" d="M16.709 9.51 3.61 1.814l10.183 10.185L16.71 9.51Z" />
        </svg>
    );
}

const systemFlow = [
    'Idea',
    'Game Development',
    'Play Store Publishing',
    'Google AdMob Activation',
    'Digital Marketing',
    'User Growth',
    'Revenue Generation',
];

const incomeTiers = [
    {
        users: '1,000–3,000',
        income: '₹2,000–₹5,000',
        label: 'Active users / month',
        width: '40%',
        banner: '/img/income-banner-starter.png',
    },
    {
        users: '3,000–6,000',
        income: '₹5,000–₹10,000',
        label: 'Active users / month',
        featured: true,
        width: '70%',
        banner: '/img/income-banner-growth.png',
    },
    {
        users: '6,000+',
        income: 'Higher potential',
        label: 'Active users / month',
        width: '95%',
        banner: '/img/income-banner-premium.png',
    },
];

const whyChoose = [
    { title: 'Complete end-to-end solution', desc: 'From idea to revenue, one dedicated partner.', icon: Rocket },
    { title: 'Professional development team', desc: 'Experienced Android game builders and designers.', icon: Gamepad2 },
    { title: 'Play Store & AdMob expertise', desc: 'Publishing and monetization handled correctly.', icon: Store },
    { title: 'Transparent workflow', desc: 'Clear milestones, updates, and delivery process.', icon: ShieldCheck },
    { title: 'Digital marketing support', desc: 'Campaigns designed to grow installs and users.', icon: Megaphone },
    { title: 'Long-term growth strategy', desc: 'Business-focused plans for sustainable income.', icon: TrendingUp },
];

const pricing = [
    {
        name: 'Starter Plan',
        marketPrice: '₹79,999',
        price: '₹49,999',
        tag: 'Launch',
        banner: '/img/pricing-banner-starter.png',
        features: [
            'Custom game development',
            'Play Store publishing',
            'Google AdMob integration',
            'Basic marketing support',
            '30 days technical support',
        ],
    },
    {
        name: 'Growth Plan',
        marketPrice: '₹1,49,999',
        price: '₹99,999',
        tag: 'Recommended',
        featured: true,
        banner: '/img/pricing-banner-growth.png',
        features: [
            'Premium game development',
            'Play Store publishing',
            'Full AdMob monetization setup',
            'Growth marketing campaigns',
            '90 days technical support',
        ],
    },
    {
        name: 'Premium Plan',
        marketPrice: '₹2,49,999',
        price: '₹1,49,999',
        tag: 'Scale',
        banner: '/img/pricing-banner-premium.png',
        features: [
            'Advanced custom game build',
            'Play Store publishing',
            'Advanced AdMob + analytics',
            'Long-term marketing support',
            'Dedicated technical support',
        ],
    },
];

const testimonials = [
    {
        name: 'Rahul Mehta',
        role: 'Game Entrepreneur',
        text: 'DG Ad Space handled development, publishing, and AdMob setup. My game launched smoothly and started getting installs within weeks.',
    },
    {
        name: 'Ananya Sharma',
        role: 'Startup Founder',
        text: 'Clear process, strong communication, and professional delivery. The marketing guidance helped improve downloads consistently.',
    },
    {
        name: 'Vikram Patel',
        role: 'Creator',
        text: 'From idea to Play Store, everything was managed end-to-end. Best partner for anyone starting a gaming business.',
    },
];

const faqs = [
    [
        'How long does game development take?',
        'Timeline depends on game complexity. Most ready-to-launch projects take a few weeks, while custom advanced games may take longer.',
    ],
    [
        'Who owns the game?',
        'You own the final game, branding, and source code as per the project agreement after successful delivery and payment.',
    ],
    [
        'How does AdMob revenue work?',
        'AdMob earns from ad impressions and user engagement. Revenue varies by traffic quality, geography, ad formats, and retention.',
    ],
    [
        'Do you publish on Google Play Store?',
        'Yes. We assist with store listing, assets, policy checks, and publishing support on Google Play Store.',
    ],
    [
        'Can you help grow downloads?',
        'Yes. We provide digital marketing and promotion strategies to help grow installs, engagement, and long-term user growth.',
    ],
    [
        'Do you guarantee monthly income?',
        'No. Income depends on users, engagement, ad impressions, audience location, app category, and overall performance.',
    ],
];

function SectionEyebrow({ children }) {
    return (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff5c1a]">
            {children}
        </p>
    );
}

function SectionHeading({ title, highlight, subtitle }) {
    return (
        <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {title}{' '}
                <span className="text-[#ff5c1a]">{highlight}</span>
            </h2>
            {subtitle && <p className="mt-3 text-base text-neutral-400">{subtitle}</p>}
        </div>
    );
}

export default function Welcome({ featuredGame = null }) {
    const whatsappNumber = '918817788185';
    const whatsappBaseLink = `https://wa.me/${whatsappNumber}`;
    const { flash } = usePage().props;
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const heroImage = featuredGame?.image || heroBannerImage;
    const { data, setData, post, processing, errors, reset } = useForm({
        inquiry_name: '',
        phone: '',
        email: '',
        project_budget: '',
        project_type: '',
        message: '',
        attachment: null,
    });

    const submitInquiry = (e) => {
        e.preventDefault();
        post(route('inquiries.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setShowSuccessPopup(true);
            },
        });
    };

    useEffect(() => {
        if (flash?.success) setShowSuccessPopup(true);
    }, [flash?.success]);

    useEffect(() => {
        if (!showSuccessPopup) return;
        const timer = setTimeout(() => setShowSuccessPopup(false), 3500);
        return () => clearTimeout(timer);
    }, [showSuccessPopup]);

    return (
        <>
            <Head title="DG Ad Space | Build. Launch. Earn.">
                <meta
                    name="description"
                    content="DG Ad Space develops your game, publishes it on Google Play Store, integrates Google AdMob, and grows your audience through digital marketing."
                />
            </Head>

            <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
                {showSuccessPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
                        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-6 text-center shadow-2xl">
                            <p className="text-lg font-bold text-emerald-500">Success!</p>
                            <p className="mt-2 text-sm text-neutral-400">
                                Your query was sent to support@dgadspace.com. Our team will contact you soon.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowSuccessPopup(false)}
                                className="juego-btn mt-4"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
                        <a href="#home" className="inline-flex items-center">
                            <img
                                src="/img/logo.png"
                                alt="DG Ad Space"
                                className="h-[72px] w-auto max-w-[280px] object-contain object-left drop-shadow-[0_0_18px_rgba(255,92,26,0.25)] sm:h-20 sm:max-w-[320px] md:h-24 md:max-w-[380px]"
                            />
                        </a>

                        <nav className="hidden items-center gap-7 lg:flex">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-semibold text-neutral-400 transition hover:text-[#ff5c1a]"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 md:flex">
                            <a
                                href="/game-store"
                                className="text-sm font-semibold text-neutral-200 hover:text-[#ff5c1a]"
                            >
                                Game Store
                            </a>
                            <a href="/login" className="text-sm font-semibold text-neutral-200 hover:text-[#ff5c1a]">
                                Login
                            </a>
                            <a href="/register" className="juego-btn px-4 py-2">
                                Register
                            </a>
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
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href="/game-store"
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5"
                                >
                                    Game Store
                                </a>
                                <a href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5">
                                    Login
                                </a>
                                <a href="/register" className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-white/5">
                                    Register
                                </a>
                                <a
                                    href={whatsappBaseLink}
                                    className="pro-btn bg-emerald-600 text-white"
                                >
                                    <MessageCircle className="size-4" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    {/* Only highlight strip — nav ke bilkul neeche (compact height) */}
                    <section id="highlights" className="border-b border-white/10 bg-[#111111] py-3 md:py-3.5">
                        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-2 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
                            {featureCards.map((card) => (
                                <article
                                    key={card.title}
                                    className="group flex items-center gap-2.5 overflow-hidden rounded-xl border bg-[#141414] px-3 py-2.5 transition hover:-translate-y-0.5"
                                    style={{
                                        borderColor: card.border,
                                        boxShadow: `0 0 12px ${card.soft}`,
                                    }}
                                >
                                    <div
                                        className="flex size-8 shrink-0 items-center justify-center rounded-full border"
                                        style={{
                                            borderColor: card.accent,
                                            background: card.playStore ? '#ffffff' : card.soft,
                                            color: card.accent,
                                        }}
                                    >
                                        {card.playStore ? (
                                            <GooglePlayIcon className="size-4" />
                                        ) : (
                                            <card.icon className="size-3.5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="truncate text-sm font-bold text-white">{card.title}</h3>
                                            <span
                                                className="text-xs font-bold transition group-hover:translate-x-0.5"
                                                style={{ color: card.accent }}
                                                aria-hidden
                                            >
                                                →
                                            </span>
                                        </div>
                                        <p className="truncate text-[11px] font-semibold leading-tight" style={{ color: card.accent }}>
                                            {card.subtitle}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Hero — main content same */}
                    <section id="home" className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div
                            className="absolute inset-0 opacity-70"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 15% 20%, rgba(255,92,26,0.18), transparent 40%), radial-gradient(circle at 85% 0%, rgba(255,92,26,0.12), transparent 35%), radial-gradient(circle at 50% 100%, rgba(255,92,26,0.08), transparent 45%)',
                            }}
                        />

                        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-2">
                            <div>
                                <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff9a66]">
                                    Gaming Business Solutions
                                </p>
                                <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-[3.4rem]">
                                    Your Game. Our Work. Your Income.
                                </h1>
                                <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                                    We develop your game, publish it on the Google Play Store, integrate Google AdMob, and help grow your audience through digital marketing.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                    <a href="#contact" className="juego-btn">
                                        <Rocket className="size-4" />
                                        Start Your Project
                                    </a>
                                    <a
                                        href="/game-store"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1aa3ff] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1aa3ff]/25 transition hover:bg-[#0d8ee6] hover:shadow-[#1aa3ff]/40"
                                    >
                                        <Store className="size-4" />
                                        Game Store
                                    </a>
                                    <a href="#services" className="juego-btn-outline">
                                        View Services
                                    </a>
                                    <a href="#contact" className="juego-btn-outline">
                                        Contact Us
                                    </a>
                                </div>
                                <div className="mt-10 grid grid-cols-3 gap-3">
                                    {[
                                        ['120+', 'Projects'],
                                        ['45+', 'Launches'],
                                        ['98%', 'Satisfaction'],
                                    ].map(([value, label]) => (
                                        <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur">
                                            <p className="text-xl font-bold text-white">{value}</p>
                                            <p className="mt-1 text-[11px] text-neutral-400">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
                                    <img
                                        src={heroImage}
                                        alt={featuredGame?.name || 'DG Ad Space gaming showcase'}
                                        className="h-[300px] w-full rounded-2xl object-contain sm:h-[360px]"
                                    />
                                </div>
                                <div className="mt-4 rounded-2xl border border-white/10 bg-[#141414] p-4 shadow-xl">
                                    {featuredGame ? (
                                        <>
                                            <p className="text-xs font-bold uppercase tracking-wide text-[#ff5c1a]">
                                                Featured Game
                                            </p>
                                            <h3 className="mt-1 text-lg font-bold text-white">{featuredGame.name}</h3>
                                            <p className="mt-1 text-sm text-neutral-400">
                                                {featuredGame.category} • {featuredGame.mode || 'Multiplayer'} • {featuredGame.tech || 'Unity'}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <p className="text-xl font-extrabold text-[#ff5c1a]">
                                                    ₹{Number(featuredGame.price).toLocaleString('en-IN')}
                                                </p>
                                                <a href="/game-store" className="juego-btn !px-4 !py-2 text-xs">
                                                    View in Store
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xs font-bold uppercase tracking-wide text-[#ff5c1a]">
                                                Business Highlight
                                            </p>
                                            <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                                                Launch your branded Android game with source code, AdMob monetization, and Play Store publishing support.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trust strip */}
                    <section className="border-b border-white/10 bg-[#0a0a0a]">
                        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-5 text-sm font-semibold text-neutral-400 md:justify-between md:px-8">
                            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#ff5c1a]" /> Trusted delivery</span>
                            <span className="inline-flex items-center gap-2"><Store className="size-4 text-[#ff5c1a]" /> Play Store ready</span>
                            <span className="inline-flex items-center gap-2"><Coins className="size-4 text-[#ff5c1a]" /> AdMob monetization</span>
                            <span className="inline-flex items-center gap-2"><Megaphone className="size-4 text-[#ff5c1a]" /> Growth marketing</span>
                        </div>
                    </section>

                    {/* Pricing — nav 2nd section */}
                    <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                        <SectionHeading
                            title="Pricing"
                            highlight="Plans"
                            subtitle="Choose the package that matches your business goals."
                        />
                        <div className="grid gap-5 lg:grid-cols-3">
                            {pricing.map((plan) => (
                                <article
                                    key={plan.name}
                                    className={`overflow-hidden rounded-2xl border ${
                                        plan.featured
                                            ? 'border-[#ff5c1a] bg-[#141414] shadow-xl ring-1 ring-[#ff5c1a]/30'
                                            : 'border-white/10 bg-[#141414]'
                                    }`}
                                >
                                    <img
                                        src={plan.banner}
                                        alt={`${plan.name} banner`}
                                        className="h-36 w-full object-cover sm:h-40"
                                    />
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                                    plan.featured
                                                        ? 'bg-[#ff5c1a] text-white'
                                                        : 'bg-white/10 text-neutral-300'
                                                }`}
                                            >
                                                {plan.tag}
                                            </span>
                                        </div>
                                        <div className="mt-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
                                            <div className="flex items-end justify-between gap-3">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                                                        Market Rate
                                                    </p>
                                                    <p className="relative mt-1 inline-block text-lg font-semibold text-neutral-500">
                                                        <span className="line-through decoration-[#ff5c1a] decoration-2">
                                                            {plan.marketPrice}
                                                        </span>
                                                        <span
                                                            aria-hidden
                                                            className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-[-8deg] bg-[#ff5c1a]"
                                                        />
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff5c1a]">
                                                        Our Price
                                                    </p>
                                                    <p className="mt-1 text-3xl font-extrabold text-white">
                                                        {plan.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="mt-5 space-y-2.5">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2 text-sm text-neutral-400">
                                                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#ff5c1a]" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href={`${whatsappBaseLink}?text=${encodeURIComponent(`Hi DG Ad Space, I want the ${plan.name}.`)}`}
                                            className={`mt-6 w-full ${
                                                plan.featured
                                                    ? 'juego-btn'
                                                    : 'juego-btn-outline'
                                            }`}
                                        >
                                            <Briefcase className="size-4" />
                                            Choose Plan
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Income — nav 3rd section */}
                    <section id="income" className="bg-[#111111] py-16">
                        <div className="mx-auto max-w-7xl px-4 md:px-8">
                            <SectionHeading
                                title="Potential"
                                highlight="Monthly Income"
                                subtitle="Illustrative earning ranges based on active users."
                            />
                            <div className="grid gap-5 md:grid-cols-3">
                                {incomeTiers.map((tier) => (
                                    <article
                                        key={tier.users}
                                        className={`overflow-hidden rounded-2xl border ${
                                            tier.featured
                                                ? 'border-[#ff5c1a] bg-[#ff5c1a]/5 shadow-md'
                                                : 'border-white/10 bg-[#141414]'
                                        }`}
                                    >
                                        <img
                                            src={tier.banner}
                                            alt={`${tier.users} income potential`}
                                            className="h-36 w-full object-cover sm:h-40"
                                        />
                                        <div className="p-6">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                                {tier.label}
                                            </p>
                                            <p className="mt-2 text-2xl font-bold text-white">{tier.users}</p>
                                            <p className="mt-3 text-lg font-bold text-[#ff5c1a]">{tier.income}</p>
                                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-[#ff5c1a]"
                                                    style={{ width: tier.width }}
                                                />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                                Important note: Actual revenue depends on user engagement, ad impressions, audience location, app category, and overall app performance.
                            </p>
                        </div>
                    </section>

                    {/* Extra banners */}
                    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
                        <div className="mb-8 text-center">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff5c1a]">
                                Solutions
                            </p>
                            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                Grow Faster With Our{' '}
                                <span className="text-[#ff5c1a]">Core Services</span>
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-base text-neutral-400">
                                From Play Store publishing to AdMob income and marketing growth — everything you need to scale your gaming business.
                            </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {landingBanners.map((banner) => (
                                <article key={banner.title} className="pro-card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                                    <img
                                        src={banner.src}
                                        alt={banner.title}
                                        className="h-44 w-full object-cover sm:h-52"
                                    />
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-neutral-400">{banner.desc}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* About */}
                    <section id="about" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                        <SectionEyebrow>About DG Ad Space</SectionEyebrow>
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                A complete gaming business solution
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
                                DG Ad Space helps entrepreneurs and creators transform their gaming ideas into scalable digital businesses. We provide end-to-end solutions, from game development and Play Store publishing to user acquisition and long-term growth strategies.
                            </p>
                        </div>
                    </section>

                    {/* Process */}
                    <section id="services" className="bg-[#111111] py-16">
                        <div className="mx-auto max-w-7xl px-4 md:px-8">
                            <SectionHeading
                                title="Our Three-Step"
                                highlight="Process"
                                subtitle="A clear path from idea to income."
                            />
                            <div className="grid gap-5 md:grid-cols-3">
                                {processCards.map((card) => (
                                    <article key={card.title} className="pro-card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                                        <img
                                            src={card.banner}
                                            alt={`${card.title} banner`}
                                            className="h-40 w-full object-cover sm:h-44"
                                        />
                                        <div className="p-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff5c1a]">
                                                    Step {card.step}
                                                </span>
                                                <div className="rounded-xl bg-[#ff5c1a]/10 p-2.5 text-[#ff5c1a]">
                                                    <card.icon className="size-5" />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{card.title}</h3>
                                            <ul className="mt-4 space-y-2.5">
                                                {card.points.map((point) => (
                                                    <li key={point} className="flex items-start gap-2 text-sm text-neutral-400">
                                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#ff5c1a]" />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* System works */}
                    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                        <SectionHeading title="How the" highlight="System Works" />
                        <div className="pro-card p-6">
                            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
                                {systemFlow.map((item, index) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <div className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-neutral-200">
                                            {item}
                                        </div>
                                        {index < systemFlow.length - 1 && (
                                            <ArrowRight className="hidden size-4 text-[#ff5c1a] md:block" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Highlight */}
                    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#141414] px-6 py-10 text-white md:px-10">
                            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                                <div>
                                    <SectionEyebrow>
                                        <span className="text-[#ff5c1a]">Growth Focus</span>
                                    </SectionEyebrow>
                                    <h2 className="text-3xl font-bold sm:text-4xl">
                                        Better Results Through Long-Term Marketing
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">
                                        For stronger growth, higher user engagement, and improved revenue potential, continuous digital marketing for up to one year can help deliver better long-term results.
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    {[
                                        { icon: Users, label: 'Higher Installs' },
                                        { icon: ChartLine, label: 'Better Engagement' },
                                        { icon: Coins, label: 'Improved Revenue' },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                                        >
                                            <item.icon className="size-5 text-[#ff5c1a]" />
                                            <span className="font-semibold">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why choose */}
                    <section className="bg-[#111111] py-16">
                        <div className="mx-auto max-w-7xl px-4 md:px-8">
                            <SectionHeading title="Why Choose" highlight="DG Ad Space?" />
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {whyChoose.map((item) => (
                                    <div key={item.title} className="pro-card p-6">
                                        <div className="mb-4 inline-flex rounded-xl bg-[#ff5c1a]/10 p-2.5 text-[#ff5c1a]">
                                            <item.icon className="size-5" />
                                        </div>
                                        <h3 className="font-bold text-white">{item.title}</h3>
                                        <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="bg-[#111111] py-16">
                        <div className="mx-auto max-w-7xl px-4 md:px-8">
                            <SectionHeading title="Client" highlight="Testimonials" />
                            <div className="grid gap-5 md:grid-cols-3">
                                {testimonials.map((item) => (
                                    <article key={item.name} className="pro-card p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex size-11 items-center justify-center rounded-full bg-[#ff5c1a] text-sm font-bold text-white">
                                                {item.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{item.name}</p>
                                                <p className="text-xs text-neutral-400">{item.role}</p>
                                            </div>
                                        </div>
                                        <div className="mb-3 flex text-amber-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className="size-4 fill-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-sm leading-relaxed text-neutral-400">"{item.text}"</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                        <SectionHeading title="Frequently Asked" highlight="Questions" />
                        <div className="mx-auto max-w-3xl space-y-3">
                            {faqs.map(([question, answer]) => (
                                <details key={question} className="pro-card group p-5">
                                    <summary className="cursor-pointer list-none font-semibold text-white marker:content-none">
                                        {question}
                                    </summary>
                                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">{answer}</p>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* Contact */}
                    <section id="contact" className="bg-[#111111] py-16">
                        <div className="mx-auto max-w-7xl px-4 md:px-8">
                            <SectionHeading
                                title="Support &"
                                highlight="Contact"
                                subtitle="Send your query to support@dgadspace.com — you can also upload a file."
                            />
                            <div className="mx-auto mb-5 max-w-3xl rounded-xl border border-[#ff5c1a]/25 bg-[#ff5c1a]/10 px-4 py-3 text-center text-sm text-[#ff9a66]">
                                Support Email:{' '}
                                <a
                                    href="mailto:support@dgadspace.com"
                                    className="font-bold text-white underline decoration-[#ff5c1a] underline-offset-2 hover:text-[#ff5c1a]"
                                >
                                    support@dgadspace.com
                                </a>
                            </div>
                            <form
                                onSubmit={submitInquiry}
                                className="pro-card mx-auto grid max-w-3xl gap-4 p-6 md:grid-cols-2"
                            >
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={data.inquiry_name}
                                        onChange={(e) => setData('inquiry_name', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                    />
                                    {errors.inquiry_name && (
                                        <p className="mt-1 text-xs text-red-400">{errors.inquiry_name}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Project Budget"
                                        value={data.project_budget}
                                        onChange={(e) => setData('project_budget', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Project Type / Subject"
                                        value={data.project_type}
                                        onChange={(e) => setData('project_type', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <textarea
                                        rows={4}
                                        placeholder="Your query / message for support..."
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                                    />
                                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-neutral-300">
                                        Upload file (optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.zip,.rar,.txt"
                                        onChange={(e) => setData('attachment', e.target.files[0] ?? null)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#ff5c1a] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                                    />
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Max 10MB — JPG, PNG, PDF, DOC, ZIP. File goes to support@dgadspace.com
                                    </p>
                                    {errors.attachment && (
                                        <p className="mt-1 text-xs text-red-400">{errors.attachment}</p>
                                    )}
                                    {data.attachment && (
                                        <p className="mt-1 text-xs text-emerald-400">
                                            Selected: {data.attachment.name}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="juego-btn disabled:opacity-70 md:col-span-2"
                                >
                                    <Smartphone className="size-4" />
                                    {processing ? 'Sending to Support...' : 'Send Query to Support'}
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <a
                                    href={whatsappBaseLink}
                                    className="pro-btn bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    <MessageCircle className="size-4" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-white/10 bg-[#050505] text-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
                        <div>
                            <img src="/img/logo.png" alt="DG Ad Space" className="h-16 w-auto max-w-[260px] object-contain object-left drop-shadow sm:h-20 sm:max-w-[320px]" />
                            <p className="mt-3 text-sm text-neutral-400">Your Game. Our Work. Your Income.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                            <a href="#services" className="hover:text-[#ff5c1a]">Services</a>
                            <a href="#pricing" className="hover:text-[#ff5c1a]">Pricing</a>
                            <a href="/game-store" className="hover:text-[#ff5c1a]">Game Store</a>
                            <a href="#contact" className="hover:text-[#ff5c1a]">Contact</a>
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
