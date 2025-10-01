import { router, usePage } from '@inertiajs/react';
import React, { FC, useState } from 'react';
import VerifiedModal from './VerifiedModal';
import SelectInput from '@/Components/elements/inputs/SelectInput';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import InputError from '@/Components/elements/inputs/InputError';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    countryMap: { label: string; value: string }[];
    bankNames: { label: string; value: string }[];
    bankAddress: { label: string; value: string }[];
}

const PaymentMethodModal: FC<PaymentMethodModalProps> = ({
    isOpen,
    onClose,
    countryMap,
    bankNames,
    bankAddress,
}) => {
    const [formData, setFormData] = useState({
        accountHolderName: '',
        accountNumber: '',
        ibanNumber: '',
        country: '',
        bankName: '',
        bankAddress: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessages, setErrorMessages] = useState<Partial<{
        accountHolderName: string;
        accountNumber: string;
        ibanNumber: string;
        country: string;
        bankName: string;
        bankAddress: string;
        general: string;
    }>>({});
    const [isVerifiedModalOpen, setIsVerifiedModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrorMessages((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSelectChange = async (value: string) => {
        setFormData((prev) => ({
            ...prev,
            country: value,
            bankName: '',
            bankAddress: '',
        }));
        setErrorMessages((prev) => ({ ...prev, country: '' }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await router.post(route('freelancer.bankMethod.store'), formData, {
                onError: (errors) => {
                    setErrorMessages({
                        accountHolderName: errors.accountHolderName || '',
                        accountNumber: errors.accountNumber || '',
                        ibanNumber: errors.ibanNumber || '',
                        country: errors.country || '',
                        bankName: errors.bankName || '',
                        bankAddress: errors.bankAddress || '',
                        general: errors.general || ''
                    });
                    setIsSubmitting(false);
                },
                onSuccess: () => {
                    setErrorMessages({});
                    setIsVerifiedModalOpen(true);
                }
            });
        } catch (error) {
            setErrorMessages((prev) => ({ ...prev, general: "Failed to submit. Please try again." }));
            setIsSubmitting(false);
        }
    };


    const handleCloseVerifiedModal = () => {
        setIsVerifiedModalOpen(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Add Bank Details</h2>
                    <button onClick={onClose} className="px-3 text-3xl text-gray-500 items-left">
                        &times;
                    </button>
                </div>
                <div className='px-3 py-3 mb-4 space-y-10 bg-blue-100 rounded-lg'>
                    <div className="flex space-x-3">
                        <ExclamationCircleIcon className="w-8 h-8 text-gray-900" />
                        <span className="text-xs text-gray-800">
                            The name on your withdrawal method and the name on your AI-Geeks account
                            need to match exactly to avoid payment failures or delays.
                        </span>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                        <div>
                            <InputLabel required className="block text-sm font-medium text-gray-700">Account Holder Name</InputLabel>
                            <TextInput
                                type="text"
                                name="accountHolderName"
                                placeholder="Enter account holder name"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md placeholder:text-sm"
                            />
                            <InputError message={errorMessages.accountHolderName} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel required className="block text-sm font-medium text-gray-700">Account Number</InputLabel>
                            <TextInput
                                type="text"
                                name="accountNumber"
                                placeholder="Enter account number"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md placeholder:text-sm"
                            />
                            <InputError message={errorMessages.accountNumber} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel required className="block mt-3 text-sm font-medium text-gray-700">IBAN Number</InputLabel>
                        <TextInput
                            type="text"
                            name="ibanNumber"
                            placeholder="Enter IBAN number"
                            value={formData.ibanNumber}
                            onChange={handleChange}
                            className="block w-full p-2 mt-1 mb-3 border border-gray-300 rounded-md placeholder:text-sm"
                        />
                        <InputError message={errorMessages.ibanNumber} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                        <div>
                            <InputLabel required className="block text-sm font-medium text-gray-700">Country</InputLabel>
                            <SelectInput
                                className="block w-full mt-2 placeholder:text-sm font-Inter"
                                options={countryMap}
                                placeholder="Select a country"
                                selectedOption={formData.country ? { value: formData.country, label: formData.country } : null}
                                setData={handleSelectChange}
                            />
                            <InputError message={errorMessages.country} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel required className="block text-sm font-medium text-gray-700">Bank Name</InputLabel>
                            <SelectInput
                                className="block w-full mt-2 placeholder:text-sm font-Inter"
                                options={bankNames}
                                placeholder="Select a bank"
                                selectedOption={formData.bankName ? { value: formData.bankName, label: formData.bankName } : null}
                                setData={(value: string) => setFormData((prev) => ({ ...prev, bankName: value }))}
                            />
                            <InputError message={errorMessages.bankName} className="mt-2" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <InputLabel required className="block mt-3 text-sm font-medium text-gray-700">Bank Address</InputLabel>
                        <SelectInput
                            className="block w-full mt-2 placeholder:text-sm font-Inter"
                            options={bankAddress}
                            placeholder="Select a bank"
                            selectedOption={formData.bankAddress ? { value: formData.bankAddress, label: formData.bankAddress } : null}
                            setData={(value: string) => setFormData((prev) => ({ ...prev, bankAddress: value }))}
                        />
                        <InputError message={errorMessages.bankAddress} className="mt-2" />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="px-8 py-2 ml-4 text-white bg-blue-800 shadow rounded-3xl hover:bg-blue-900"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Set up"}
                        </button>
                    </div>
                </form>
            </div>
            {isVerifiedModalOpen && <VerifiedModal onClose={handleCloseVerifiedModal} issueId={''} />}
        </div>
    );
};

export default PaymentMethodModal;
