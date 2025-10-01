import AppLayout from "@/Layouts/AppLayout";
import { User } from "@/types";
import { Head, router } from "@inertiajs/react";
import React from "react";

export default function Hire(
    {
        price,
        freelancer,
        job,
        offer,
    }: {
        price: any;
        freelancer: any;
        job: any;
        offer: any;
    }) {


    const handelPayment = () => {
        router.get(route('client.createPaymentIntent', { id: offer?.id }));
    };

    return (
        <AppLayout isClientHeader={true} isHeader={true} isFooter={true}>
            <Head title="Payment" />

            {/* Main Container */}
            <div className="min-h-screen py-20 sm:px-8 lg:px-10">
                {/* Header Section */}
                <div className="flex flex-col gap-4 px-4 mx-auto mt-24 mb-8 max-w-7xl">
                    <div className="flex flex-row items-center">
                        <div className="text-2xl font-semibold first-letter:capitalize">
                            Hire {freelancer?.full_name}
                        </div>
                    </div>
                    <div>
                    <button
                        onClick={() => window.history.back()}
                        className="items-start mb-4 text-blue-500 hover:text-blue-700"
                    >
                        &larr; Back to Previous Page
                    </button>
                    </div>
                </div>

                {/* Main Payment Section */}
                <section className="flex items-center justify-center bg-white">
                    <div className="grid w-full max-w-4xl grid-cols-1 gap-8 bg-white border border-gray-300 shadow-md lg:grid-cols-2 rounded-3xl">
                        {/* Left Column */}
                        <div className="p-8 border-r border-gray-300">
                            <h2 className="mb-4 text-xl font-semibold font-Inter">Secure Payment with Stripe</h2>
                            <ul className="pl-5 mb-6 space-y-3">
                                <li className="relative font-Inter pl-6 text-gray-600 before:content-['\25A0'] before:absolute before:left-0 before:text-blue-700 before:text-sm">
                                    You are about to be redirected to Stripe's secure payment page to complete the payment for hiring <span className="text-blue-700 underline font-Inter">{freelancer.first_name}</span> for the project
                                    <span className="font-bold text-black font-Inter"> {job?.title} </span>
                                </li>
                                <li className="relative font-Inter pl-6 text-gray-600 before:content-['\25A0'] before:absolute before:left-0 before:text-blue-700 before:text-sm">
                                    Please follow the instructions on the Stripe page to proceed.
                                </li>
                                <li className="relative font-Inter pl-6 text-gray-600 before:content-['\25A0'] before:absolute before:left-0 before:text-blue-700 before:text-sm">
                                    Once your transaction is complete, you'll be automatically returned to AI Geeks with a confirmation of your payment.
                                </li>
                                <li className="relative font-Inter pl-6 text-gray-600 before:content-['\25A0'] before:absolute before:left-0 before:text-blue-700 before:text-sm">
                                    Thank you for using AI Geeks
                                </li>
                            </ul>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col p-8">
                            <div className="flex items-center gap-5 mb-6">
                                <img
                                    className="w-16 h-16 rounded-full"
                                    src={freelancer?.avatar}
                                    alt="avatar"
                                />
                                <div>
                                    <p className="text-base font-Inter">
                                        Hire {freelancer?.full_name} for:
                                    </p>
                                    <p className="font-semibold first-letter:capitalize font-Inter">
                                        {offer?.contract_title ?? "Freelancer not updated yet"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="py-6 border-t border-b border-gray-300">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-Inter">
                                            Subtotal
                                        </span>
                                        <span className="text-gray-600 font-Inter">
                                            {price}
                                        </span>
                                    </div>

                                    <div className="flex justify-between mt-4">
                                        <span className="font-medium font-Inter">
                                            Estimated total
                                        </span>
                                        <span className="text-xl font-medium font-Inter">
                                            ${price}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { handelPayment() }}
                                    className="w-full py-2 my-6 font-medium text-white bg-blue-800 rounded-full font-Inter"
                                >
                                    Proceed to Payment
                                </button>

                                <p className="text-xs text-center text-gray-600 font-Inter">
                                    Any available balance you have will be
                                    applied towards your total amount.
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-4 text-gray-600 font-Inter">
                                    <img
                                        className="w-6 h-6"
                                        src="/assets/Icons/client/protection@2x.png"
                                        alt="protection icon"
                                    />
                                    AI-Geeks Payment Protection
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
