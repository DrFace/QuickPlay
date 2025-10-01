import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-sm p-4 mx-4 bg-white border border-gray-300 rounded-lg shadow-lg md:max-w-md lg:max-w-lg md:p-6 lg:p-8 sm:mx-6 md:mx-0">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full md:w-24 md:h-24">
                        <img
                            src="/assets/Icons/job/deletemodel.png"
                            alt="Delete"
                            className="w-20 h-20 md:w-24 md:h-24"
                        />
                    </div>
                    <h2 className="mb-4 text-xl font-medium text-center text-black md:text-2xl">Decline Offer</h2>
                    <p className="mb-6 text-sm text-center text-black md:text-base">
                        Are you sure you want to decline this offer? <br />
                        This action cannot be undone and all associated data will be lost.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <button
                            className="w-full px-6 py-2 text-gray-700 bg-gray-100 border rounded-full sm:w-auto"
                            onClick={onClose}
                        >
                            No, Keep it
                        </button>
                        <button
                            className="w-full px-6 py-2 text-white bg-red-500 rounded-full sm:w-auto"
                            onClick={onConfirm}
                        >
                            Yes, Decline it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
