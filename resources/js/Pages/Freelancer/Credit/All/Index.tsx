import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

export default function Credits({
    user,
    connectPackages,
}: {
    user: any;
    connectPackages: { id: string; value: string; label: string; amount: number }[];
}) {
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [newConnects, setNewConnects] = useState<number>(0);
    const [expireDate, setExpireDate] = useState<string>("");
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [processing, setProcessing] = useState(false);


    const handleSelectedOption = (value: any) => {
        setErrorMessage("");
        const selected = connectPackages.find((option) => option.value === value);
        setSelectedOption(selected);
        if (selected) {
            const newConnects = parseInt(selected.value);
            const totalAmount = selected.amount || 0;

            const expiration = new Date();
            expiration.setFullYear(expiration.getFullYear() + 1);
            const formattedExpireDate = expiration.toISOString().split("T")[0];

            setNewConnects(newConnects);
            setTotalAmount(totalAmount);
            setExpireDate(expiration.toLocaleDateString());


        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedOption) {
            setErrorMessage("Please select an amount to buy.");
            return;
        }
        setProcessing(true);
        router.get(route('freelancer.createPaymentIntent', selectedOption.id));
    };

    return (
        <AppLayout isFreelancerHeader={true} isHeader={false}>
            <Head title="Buy Credits" />
            <div className="relative min-h-screen px-10 pt-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 max-w-7xl">
                <div className="mt-20 mb-4 text-3xl font-semibold text-black sm:text-4xl sm:mb-8">
                    Buy Credits
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <div>
                            <div className="text-base font-semibold text-black">
                                Your available connects
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                                {user?.available_connects || 0}
                            </div>
                        </div>
                        <div>
                            <InputLabel required className="text-lg font-semibold text-black">
                                Select the amount to buy
                            </InputLabel>
                            <SelectInput
                                className="block mt-2 lg:w-1/4 placeholder:text-sm font-Inter"
                                options={connectPackages}
                                placeholder="Select Package"
                                selectedOption={connectPackages.find(
                                    (option) => option.value === selectedOption
                                )}
                                setData={(value: any) =>
                                    handleSelectedOption(value)
                                }
                            />
                            {errorMessage && (
                                <div className="mt-2 text-sm text-red-600">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-base font-semibold text-black">
                                Your amount will be charged
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                                ${totalAmount ? totalAmount : "0.00"}{" "}
                                + tax
                            </div>
                        </div>
                        <div>
                            <div className="text-base font-semibold text-black">
                                Your new connects will be
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                                {newConnects || 0}
                            </div>
                        </div>
                        <div>
                            <div className="text-base font-semibold text-black">
                                These connects will expire on
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                                {expireDate || "N/A"}
                            </div>
                        </div>
                    </div>
                    <div className="pb-10">
                        <div className="flex flex-col space-y-4 ">
                            <div className="text-base font-medium text-black">
                                This bundle of Connects will expire 1 year from
                                today. Used Credits rollover to the next month.
                                {/* <span className="ml-1 text-blue-800 underline">
                                    Learn more
                                </span> */}
                            </div>
                            <div className="text-base font-medium text-black font-Inter">
                                You’re authorizing AI Geeks to charge your
                                account. If you have sufficient funds, we will
                                withdraw from your balance.
                                {/* <span className="ml-1 text-blue-800 underline font-Inter">
                                    Learn more
                                </span> */}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-end gap-2 mt-10 sm:mt-16 sm:gap-6 sm:flex-row">
                            <Link
                                href="/freelancer/account-settings"
                                type="button"
                                className="py-1 text-blue-800 bg-white border-2 border-blue-800 rounded-full px-14 font-Inter"
                            >
                                Cancel
                            </Link>


                            <button
                                type="submit"
                                className="py-2 text-white bg-blue-800 rounded-full px-14 font-Inter"
                                disabled={processing}
                            >
                                {processing ? "Processing..." : "Buy Credits"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
