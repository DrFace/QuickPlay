// src/components/PaymentForm.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Head, router } from '@inertiajs/react';
import InputLabel from '@/Components/elements/inputs/InputLabel';


const stripePromise = loadStripe("pk_test_51PvHQ7KI6hbvNBHBTKsRQEjo7wUUoavhNWpG9gtcs2jmIO2Nty1S8n09nEtgB7NVIQDACEpfyyVxQB9zvpsnlbJd004JVFxrDP");

interface PaymentFormProps {
    price: number;
    secret: string;
    connectPackageId: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    price,
    secret,
    connectPackageId,

}) => {

    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState<string | null>(secret);
    const [cardHolderName, setCardHolderName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // useEffect(() => {
    //     // Get client secret from the backend based on the price
    //     axios.get(`/freelancer/payment-intent/${price}`).then((res) => {
    //         setClientSecret(res.data.clientSecret);
    //     });
    // }, [price]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) return;
        setIsSubmitting(true);
        const cardElement = elements.getElement(CardElement);
        try {
            const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: {
                        name: cardHolderName,
                    },
                },
            });

            if (error) {
                setError(error.message || 'Payment failed');
                setIsSubmitting(false);
                return;
            }

            if (setupIntent) {
                const data = {
                    payment_method: setupIntent.payment_method,
                    price,
                    connectPackageId,
                };
                router.post(route('freelancer.processPayment'), data as any);
            }
        } catch (err) {
            setError('Payment failed');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40 bg-client-home-pattern">
             <Head title="Payment" />
            <div className="w-full p-6 bg-transparent rounded-lg md:w-2/3 lg:w-1/2">
                <form onSubmit={handleSubmit} className="max-w-lg p-4 mx-auto space-y-4 bg-white border rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Payment</h2>
                        <button
                            onClick={() => window.history.back()}
                            className="text-gray-500 hover:text-gray-800"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4 text-xl font-bold text-center">Pay $ {price}</div>

                    {error && <div className="text-center text-red-500">{error}</div>}

                    <div>
                        <InputLabel required htmlFor="card-holder-name" className="block mb-2">Card Holder Name</InputLabel>
                        <input
                            type="text"
                            id="card-holder-name"
                            placeholder='Card Holder Name'
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <InputLabel required htmlFor="card-element" className="block mb-2">Credit or Debit Card</InputLabel>
                        <div className="p-2 border rounded-md">
                            <CardElement options={{ hidePostalCode: true }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-3 text-white bg-green-500 rounded-lg ${isSubmitting ? 'opacity-50' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const PaymentPage: React.FC<{
    price: number,
    clientSecret: string,
    connectPackageId: string,
}> = ({
    price,
    clientSecret,
    connectPackageId,
}) => (
        <Elements stripe={stripePromise}>
            <PaymentForm
                price={price}
                secret={clientSecret}
                connectPackageId={connectPackageId}
            />
        </Elements>
    );

export default PaymentPage;
