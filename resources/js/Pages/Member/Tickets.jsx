import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Tickets({ tickets, purchases }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        message: '',
        game_purchase_id: '',
        priority: 'medium',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('member.tickets.store'), {
            onSuccess: () => reset('subject', 'message', 'game_purchase_id'),
        });
    };

    return (
        <MemberLayout title="Support Tickets" subtitle="Generate tickets for game issues and get admin replies.">
            <Head title="Tickets" />

            {flash?.success && (
                <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    {flash.success}
                </div>
            )}

            <form onSubmit={submit} className="mb-6 pro-card p-5">
                <h2 className="mb-3 font-bold text-white">Generate Ticket</h2>
                <div className="grid gap-3 md:grid-cols-2">
                    <input
                        placeholder="Subject / Problem title"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a]"
                    />
                    <select
                        value={data.game_purchase_id}
                        onChange={(e) => setData('game_purchase_id', e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#ff5c1a]"
                    >
                        <option value="">Related game (optional)</option>
                        {purchases.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.game_name} ({p.order_id})
                            </option>
                        ))}
                    </select>
                    <select
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#ff5c1a] md:col-span-2"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <textarea
                        rows={4}
                        placeholder="Describe your problem..."
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ff5c1a] md:col-span-2"
                    />
                </div>
                {(errors.subject || errors.message) && (
                    <p className="mt-2 text-xs text-red-400">{errors.subject || errors.message}</p>
                )}
                <button
                    type="submit"
                    disabled={processing}
                    className="juego-btn mt-3 px-4 py-2.5 disabled:opacity-70"
                >
                    {processing ? 'Creating...' : 'Create Ticket'}
                </button>
            </form>

            <div className="space-y-3">
                {tickets.data.map((t) => (
                    <Link
                        key={t.id}
                        href={`/member/tickets/${t.id}`}
                        className="block pro-card p-4 transition hover:-translate-y-0.5 hover:border-[#ff5c1a]/40 hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold text-white">{t.subject}</p>
                                <p className="text-xs text-neutral-500">{t.ticket_no} • {t.replies_count} replies</p>
                            </div>
                            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase text-neutral-300">
                                {t.status}
                            </span>
                        </div>
                    </Link>
                ))}
                {tickets.data.length === 0 && <p className="text-sm text-neutral-500">No tickets yet.</p>}
            </div>
        </MemberLayout>
    );
}
