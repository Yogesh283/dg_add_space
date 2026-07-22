import { Head, Link, usePage } from '@inertiajs/react';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Dashboard({ stats, recentPurchases, recentIncomes }) {
    const { flash } = usePage().props;
    const [copied, setCopied] = useState(false);

    const referralLink = stats.referral_link || '';
    const referralCode = stats.referral_code || '';

    const whatsappShareUrl = useMemo(() => {
        const message = [
            'Join DG Ad Space with my referral link and start earning with ready-made Android games.',
            '',
            `Referral Code: ${referralCode}`,
            `Register here: ${referralLink}`,
        ].join('\n');

        return `https://wa.me/?text=${encodeURIComponent(message)}`;
    }, [referralCode, referralLink]);

    const copyReferral = async () => {
        if (!referralLink) {
            return;
        }

        try {
            await navigator.clipboard.writeText(referralLink);
        } catch {
            const input = document.createElement('textarea');
            input.value = referralLink;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }

        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <MemberLayout
            title="Referral & Earn"
            subtitle="Share your referral link, track wallet, purchases, and level income."
        >
            <Head title="Referral & Earn" />

            {flash?.success && (
                <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                    {flash.success}
                </div>
            )}

            <div className="mb-5 rounded-2xl border border-[#ff5c1a]/30 bg-[#ff5c1a]/5 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[#ff5c1a]">Your Referral</p>
                <p className="mt-1 text-lg font-bold text-neutral-900">Code: {referralCode}</p>
                <p className="mt-2 break-all rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700">
                    {referralLink}
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={copyReferral}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                    >
                        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a
                        href={whatsappShareUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <MessageCircle className="size-4" />
                        Share on WhatsApp
                    </a>
                    <button
                        type="button"
                        onClick={async () => {
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: 'DG Ad Space Referral',
                                        text: `Join with my code ${referralCode}`,
                                        url: referralLink,
                                    });
                                } catch {
                                    // user cancelled share
                                }
                            } else {
                                copyReferral();
                            }
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff5c1a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#ff7338]"
                    >
                        <Share2 className="size-4" />
                        Share
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    ['Wallet Balance', `₹${Number(stats.wallet).toLocaleString('en-IN')}`],
                    ['Games Purchased', stats.purchases],
                    ['Payments', stats.payments],
                    ['Level Income Rows', recentIncomes?.length ?? 0],
                    ['Support Tickets', stats.tickets],
                    ['Direct Referrals', stats.referrals],
                ].map(([label, value]) => (
                    <div key={label} className="pro-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
                        <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <section className="pro-card p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-bold text-neutral-900">Recent Purchases</h2>
                        <Link href="/member/purchases" className="text-sm font-semibold text-[#ff5c1a]">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentPurchases.length === 0 && (
                            <p className="text-sm text-neutral-500">No purchases yet.</p>
                        )}
                        {recentPurchases.map((p) => (
                            <div key={p.id} className="rounded-xl bg-neutral-50 px-3 py-2 text-sm">
                                <p className="font-semibold text-neutral-900">{p.game_name}</p>
                                <p className="text-neutral-500">
                                    {p.order_id} • ₹{Number(p.amount).toLocaleString('en-IN')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pro-card p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-bold text-neutral-900">Recent Level Income</h2>
                        <Link href="/member/incomes" className="text-sm font-semibold text-[#ff5c1a]">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentIncomes.length === 0 && (
                            <p className="text-sm text-neutral-500">No income yet.</p>
                        )}
                        {recentIncomes.map((i) => (
                            <div key={i.id} className="rounded-xl bg-neutral-50 px-3 py-2 text-sm">
                                <p className="font-semibold text-neutral-900">
                                    Level {i.level} • ₹{Number(i.income_amount).toLocaleString('en-IN')}
                                </p>
                                <p className="text-neutral-500">
                                    From {i.from_user?.name} • {i.percent}%
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MemberLayout>
    );
}
