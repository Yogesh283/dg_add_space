import { Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Payments({ payments }) {
    return (
        <MemberLayout title="My Payments" subtitle="Payment history for all your game purchases.">
            <Head title="Payments" />
            <div className="pro-card overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#111111] text-xs uppercase tracking-wide text-[#ff9a66]">
                        <tr>
                            <th className="px-4 py-3">Txn ID</th>
                            <th className="px-4 py-3">Game</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.data.map((p) => (
                            <tr key={p.id} className="border-t border-white/10 hover:bg-[#ff5c1a]/5">
                                <td className="px-4 py-3 font-medium text-white">{p.transaction_id}</td>
                                <td className="px-4 py-3 text-neutral-300">{p.game_purchase?.game_name || '-'}</td>
                                <td className="px-4 py-3 font-semibold text-[#ff5c1a]">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                                <td className="px-4 py-3 text-neutral-300">{p.method}</td>
                                <td className="px-4 py-3 capitalize text-neutral-300">{p.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payments.data.length === 0 && <p className="p-6 text-sm text-neutral-500">No payments yet.</p>}
            </div>
        </MemberLayout>
    );
}
