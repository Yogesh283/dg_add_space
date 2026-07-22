import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function PayRazorpay({ purchase, razorpay }) {
    const { flash, errors } = usePage().props;
    const [opening, setOpening] = useState(false);
    const [error, setError] = useState('');

    const openCheckout = async () => {
        setError('');
        setOpening(true);

        if (!razorpay?.key || !razorpay?.order_id) {
            setError('Razorpay keys/order missing. Add RAZORPAY_KEY and RAZORPAY_SECRET in .env.');
            setOpening(false);
            return;
        }

        const ok = await loadRazorpayScript();
        if (!ok) {
            setError('Unable to load Razorpay checkout. Check internet and try again.');
            setOpening(false);
            return;
        }

        const options = {
            key: razorpay.key,
            amount: razorpay.amount,
            currency: razorpay.currency || 'INR',
            name: razorpay.name,
            description: razorpay.description,
            order_id: razorpay.order_id,
            prefill: razorpay.prefill || {},
            theme: { color: '#ff5c1a' },
            handler(response) {
                router.post(route('member.pay.razorpay', purchase.id), {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });
            },
            modal: {
                ondismiss() {
                    setOpening(false);
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp) => {
            setError(resp?.error?.description || 'Payment failed. Please try again.');
            setOpening(false);
        });
        rzp.open();
        setOpening(false);
    };

    useEffect(() => {
        if (purchase.status === 'pending_payment' && razorpay?.key && razorpay?.order_id) {
            openCheckout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MemberLayout title="Pay with Razorpay" subtitle="Auto payment — UPI / Card / NetBanking. No admin approval needed.">
            <Head title={`Pay ${purchase.order_id}`}>
                <script src="https://checkout.razorpay.com/v1/checkout.js" />
            </Head>

            {flash?.success && (
                <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    {flash.success}
                </div>
            )}

            {(error || errors?.payment) && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error || errors.payment}
                </div>
            )}

            <div className="mx-auto max-w-xl">
                <div className="pro-card p-6 text-center md:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        <ShieldCheck className="size-3.5" />
                        Razorpay Auto Gateway
                    </div>

                    <h2 className="text-2xl font-bold text-white">{purchase.game_name}</h2>
                    <p className="mt-1 text-sm text-neutral-400">
                        Order: <span className="font-semibold text-white">{purchase.order_id}</span>
                    </p>

                    <div className="mt-5 rounded-2xl border border-[#ff5c1a]/30 bg-[#ff5c1a]/10 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-400">Amount</p>
                        <p className="mt-1 text-3xl font-extrabold text-[#ff5c1a]">
                            ₹{Number(purchase.amount).toLocaleString('en-IN')}
                        </p>
                    </div>

                    {purchase.status === 'paid' ? (
                        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                            <CheckCircle2 className="mx-auto mb-2 size-6" />
                            Payment successful. Order is paid automatically.
                        </div>
                    ) : (
                        <>
                            <p className="mt-5 text-sm text-neutral-400">
                                Pay with UPI, Card, NetBanking or Wallet. On success, order becomes Paid automatically — no admin role.
                            </p>
                            <button
                                type="button"
                                onClick={openCheckout}
                                disabled={opening}
                                className="juego-btn mt-6 w-full disabled:opacity-70"
                            >
                                {opening ? 'Opening Razorpay...' : 'Pay Now with Razorpay'}
                            </button>
                        </>
                    )}

                    <a
                        href="/member/purchases"
                        className="mt-4 inline-flex text-sm font-semibold text-neutral-400 hover:text-[#ff5c1a]"
                    >
                        Back to My Purchases
                    </a>
                </div>
            </div>
        </MemberLayout>
    );
}
