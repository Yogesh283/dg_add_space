import { Head, Link, usePage } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Dashboard({ stats, recentPurchases, recentIncomes }) {
    const { flash } = usePage().props;

    return (
        <MemberLayout
            title="Referral & Earn"
            subtitle="Share your referral link, track wallet, purchases, and level income."
        >
            <Head title="Referral & Earn" />

            {flash?.success && (
                <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    {flash.success}
                </div>
            )}

            <div className="mb-5 pro-card border-[#ff5c1a]/30 bg-[#ff5c1a]/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#ff5c1a]">Your Referral</p>
                <p className="mt-1 text-lg font-bold text-white">Code: {stats.referral_code}</p>
                <p className="mt-1 break-all text-sm text-neutral-400">{stats.referral_link}</p>
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
                        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <section className="pro-card p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-bold text-white">Recent Purchases</h2>
                        <Link href="/member/purchases" className="text-sm font-semibold text-[#ff5c1a]">View all</Link>
                    </div>
                    <div className="space-y-2">
                        {recentPurchases.length === 0 && <p className="text-sm text-neutral-500">No purchases yet.</p>}
                        {recentPurchases.map((p) => (
                            <div key={p.id} className="rounded-xl bg-white/5 px-3 py-2 text-sm">
                                <p className="font-semibold text-white">{p.game_name}</p>
                                <p className="text-neutral-500">{p.order_id} • ₹{Number(p.amount).toLocaleString('en-IN')}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pro-card p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-bold text-white">Recent Level Income</h2>
                        <Link href="/member/incomes" className="text-sm font-semibold text-[#ff5c1a]">View all</Link>
                    </div>
                    <div className="space-y-2">
                        {recentIncomes.length === 0 && <p className="text-sm text-neutral-500">No income yet.</p>}
                        {recentIncomes.map((i) => (
                            <div key={i.id} className="rounded-xl bg-white/5 px-3 py-2 text-sm">
                                <p className="font-semibold text-white">Level {i.level} • ₹{Number(i.income_amount).toLocaleString('en-IN')}</p>
                                <p className="text-neutral-500">From {i.from_user?.name} • {i.percent}%</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MemberLayout>
    );
}
