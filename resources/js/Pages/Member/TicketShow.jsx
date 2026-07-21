import { Head, useForm, usePage } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function TicketShow({ ticket }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({ message: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('member.tickets.reply', ticket.id), {
            onSuccess: () => reset('message'),
        });
    };

    return (
        <MemberLayout title={ticket.ticket_no} subtitle={ticket.subject}>
            <Head title={`Ticket ${ticket.ticket_no}`} />

            {flash?.success && (
                <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    {flash.success}
                </div>
            )}

            <div className="mb-4 pro-card p-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase text-neutral-300">{ticket.status}</span>
                </div>
                <p className="mt-3 text-sm text-neutral-400">{ticket.message}</p>
                {ticket.game_purchase && (
                    <p className="mt-2 text-xs text-neutral-500">
                        Related: {ticket.game_purchase.game_name} ({ticket.game_purchase.order_id})
                    </p>
                )}
            </div>

            <div className="mb-4 space-y-3">
                {ticket.replies.map((r) => (
                    <div
                        key={r.id}
                        className={`rounded-2xl border p-4 ${
                            r.is_admin ? 'border-[#ff5c1a]/30 bg-[#ff5c1a]/5' : 'border-white/10 bg-[#141414]'
                        }`}
                    >
                        <p className="text-xs font-bold uppercase text-neutral-500">
                            {r.is_admin ? 'Admin Reply' : r.user?.name || 'You'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-300">{r.message}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={submit} className="pro-card p-5">
                <textarea
                    rows={3}
                    placeholder="Write your reply..."
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                <button
                    type="submit"
                    disabled={processing}
                    className="juego-btn mt-3 px-4 py-2.5 disabled:opacity-70"
                >
                    {processing ? 'Sending...' : 'Send Reply'}
                </button>
            </form>
        </MemberLayout>
    );
}
