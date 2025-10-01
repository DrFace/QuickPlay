import React, { useState } from 'react';
import PaymentMethodModal from './PaymentMethodModal';
import ConfirmationModal from './ConfirmationModal';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';

export default function GetPaid({
    countryMap,
    bankNames,
    bankAddress,
    paymentMethod,
}: {
    countryMap: { label: string; value: string }[];
    bankNames: { label: string; value: string }[];
    bankAddress: { label: string; value: string }[];
    paymentMethod: any;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenConfirmationModal = (id: number) => {
        setSelectedPaymentId(id);
        setIsConfirmationModalOpen(true);
    };

    const handleCloseConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
        setSelectedPaymentId(null);
    };

    const { post } = useForm({});

    const onConfirmDelete = () => {
        if (selectedPaymentId) {
            post(route('freelancer.bankMethod.delete', { id: selectedPaymentId }));
        }
        handleCloseConfirmationModal();
    };

    return (
        <div className="flex flex-col items-start justify-start gap-10">
            <div className="w-full h-auto p-6 bg-transparent rounded-xl border border-gray-300 flex flex-col justify-start items-start gap-2.5">
                <div className="relative w-full h-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-semibold text-black">Available balance</div>
                    </div>
                    <div className="text-2xl font-semibold text-blue-800">$0.00</div>
                    <div className="text-sm font-semibold text-black">+$0.00 pending</div>

                    <div className="mt-10 text-center">
                        <div className="text-2xl font-medium text-black lg:px-20">
                            To withdraw earnings, first you need to set up a withdrawal method
                        </div>
                        <div className="mt-2 text-sm font-semibold text-black">
                            It may take up to 3 days to activate your withdrawal method.
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-10 py-2.5 bg-blue-800 text-white rounded-full"
                            onClick={handleOpenModal}
                        >
                            Add a method
                        </button>
                    </div>
                </div>

                {paymentMethod.length > 0 && (
                    <div className="flex flex-col items-start justify-start w-full p-6 bg-transparent border-2 border-gray-300 rounded-xl">
                        <div className="mb-4 text-2xl font-semibold text-black">Added Payment Method</div>

                        {paymentMethod.map((paymentDetails: any) => (
                            <div
                                key={paymentDetails.id}
                                className="flex flex-col items-start justify-start w-full p-4 border-b border-gray-200 last:border-none"
                            >
                                <div className="text-base font-medium text-gray-600">
                                    <div className="flex items-center gap-10">
                                        <p><strong>Account Holder Name:</strong> {paymentDetails.account_holder_name}</p>
                                        {/* <button
                                            onClick={() => handleOpenConfirmationModal(paymentDetails.id)}
                                            className="flex items-center justify-center w-5 h-5 p-1 bg-white rounded-full ring-primary ring-2"
                                        >
                                            <TrashIcon className="w-4 h-4 text-primary" />
                                        </button> */}
                                    </div>
                                    <p><strong>Account Number:</strong> {paymentDetails.account_number}</p>
                                    <p><strong>IBAN Number:</strong> {paymentDetails.iban_number}</p>
                                    <p><strong>Bank Name:</strong> {paymentDetails.bank_name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start justify-start w-full p-6 bg-transparent border-2 border-gray-300 rounded-xl">
                <div className="mb-4 text-2xl font-semibold text-black">Last withdrawal</div>
                <div className="text-base font-medium text-gray-600">
                    You haven’t made any withdrawals yet.
                </div>
            </div>

            {isModalOpen && (
                <PaymentMethodModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    countryMap={countryMap}
                    bankNames={bankNames}
                    bankAddress={bankAddress}
                />
            )}

            {isConfirmationModalOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onClose={handleCloseConfirmationModal}
                    onConfirm={onConfirmDelete}
                />
            )}
        </div>
    );
}
