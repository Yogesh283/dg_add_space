import { Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Purchases({ purchases }) {
    return (
        <MemberLayout title="My Purchases" subtitle="All games you have purchased with DG Ad Space.">
            <Head title="Purchases" />
            <div className="pro-card overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#111111] text-xs uppercase tracking-wide text-[#ff9a66]">
                        <tr>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Game</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.data.map((p) => (
                            <tr key={p.id} className="border-t border-white/10 hover:bg-[#ff5c1a]/5">
                                <td className="px-4 py-3 font-medium text-white">{p.order_id}</td>
                                <td className="px-4 py-3 text-neutral-300">{p.game_name}</td>
                                <td className="px-4 py-3 font-semibold text-[#ff5c1a]">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                                <td className="px-4 py-3 capitalize text-neutral-300">{String(p.status).replaceAll('_', ' ')}</td>
                                <td className="px-4 py-3 text-neutral-400">{new Date(p.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    {['pending_payment'].includes(p.status) ? (
                                        <a href={`/member/pay/${p.id}`} className="font-semibold text-[#ff5c1a] hover:underline">
                                            Pay Now
                                        </a>
                                    ) : (
                                        <span className="text-neutral-500">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {purchases.data.length === 0 && <p className="p-6 text-sm text-neutral-500">No games purchased yet.</p>}
            </div>
        </MemberLayout>
    );
}
