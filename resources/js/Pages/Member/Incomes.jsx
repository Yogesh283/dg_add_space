import { Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Incomes({ incomes, levels }) {
    return (
        <MemberLayout
            title="Level Income"
            subtitle="Earn from team purchases — Level 1 = 10%, Level 2 to 6 = 2% each."
        >
            <Head title="Level Income" />

            <div className="mb-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Object.entries(levels).map(([level, percent]) => (
                    <div key={level} className="pro-card p-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Level {level}</p>
                        <p className="mt-1 text-lg font-bold text-[#ff5c1a]">{percent}%</p>
                    </div>
                ))}
            </div>

            <div className="pro-card overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#111111] text-xs uppercase tracking-wide text-[#ff9a66]">
                        <tr>
                            <th className="px-4 py-3">Level</th>
                            <th className="px-4 py-3">From</th>
                            <th className="px-4 py-3">Game</th>
                            <th className="px-4 py-3">Purchase</th>
                            <th className="px-4 py-3">Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomes.data.map((i) => (
                            <tr key={i.id} className="border-t border-white/10 hover:bg-[#ff5c1a]/5">
                                <td className="px-4 py-3 text-neutral-300">L{i.level} ({i.percent}%)</td>
                                <td className="px-4 py-3 text-neutral-300">{i.from_user?.name}</td>
                                <td className="px-4 py-3 text-neutral-300">{i.game_purchase?.game_name}</td>
                                <td className="px-4 py-3 text-neutral-300">₹{Number(i.purchase_amount).toLocaleString('en-IN')}</td>
                                <td className="px-4 py-3 font-semibold text-emerald-400">₹{Number(i.income_amount).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {incomes.data.length === 0 && (
                    <p className="p-6 text-sm text-neutral-500">No level income yet. Share your referral link.</p>
                )}
            </div>
        </MemberLayout>
    );
}
