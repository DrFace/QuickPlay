import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import TextInput from "@/Components/elements/inputs/TextInput";

interface TicketModalProps {
    show: boolean;
    onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ show, onClose }) => {
    const { data, setData, post, errors } = useForm({
        subject: '',
        category: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setData(name as keyof typeof data, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/freelancer/ticket', {
            onSuccess: () => {
               // console.log("Ticket submitted successfully");

                setTimeout(() => {
                    window.location.reload();
                }, 5000);

                setData({ subject: '', category: '', description: '' });

                onClose();
            },
            onError: (error) => {
               // console.error("There was an error creating the ticket:", error);
            },
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="p-8 bg-white rounded-lg shadow-lg sm:w-1/2">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Add Ticket</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div>
                        <InputLabel required className="block text-sm font-medium text-gray-700">Subject</InputLabel>
                        <TextInput
                            type="text"
                            name="subject"
                            maxLength={250}
                            value={data.subject}
                            placeholder="Enter subject"
                            onChange={handleChange}

                            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.subject && <span className="text-red-500">{errors.subject}</span>}
                    </div>
                    <div>
                        <InputLabel required className="block text-sm font-medium text-gray-700">Category</InputLabel>
                        <select
                            name="category"
                            value={data.category}

                            onChange={handleChange}
                            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="" disabled>Select a category</option>
                            <option value="technical">Technical</option>
                            <option value="billing">Billing</option>
                            <option value="general">General</option>
                            <option value="support">Support</option>
                        </select>
                        {errors.category && <span className="text-red-500">{errors.category}</span>}
                    </div>
                    <div>
                        <InputLabel required className="block text-sm font-medium text-gray-700">Description</InputLabel>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            maxLength={1000}
                            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                            rows={4}
                        />
                        <span className="block w-full mt-1 text-sm text-gray-500">Less than 1000 characters</span>
                        {errors.description && <span className="text-red-500">{errors.description}</span>}
                    </div>
                    <div className="flex flex-col items-center w-full space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center justify-center h-10 px-8 text-sm font-medium leading-none bg-white border-2 rounded-full w-60 text-primary border-primary"
                        >
                            <span className="tracking-tight">
                                Cancel
                            </span>
                        </button>

                        <button
                            type="submit"
                            className="flex items-center justify-center h-10 px-8 text-sm font-medium leading-none text-white border-none rounded-full w-60 bg-primary"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketModal;
