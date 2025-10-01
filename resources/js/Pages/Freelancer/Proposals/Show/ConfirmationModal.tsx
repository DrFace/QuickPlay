import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg p-4 md:p-6 lg:p-8 bg-white rounded-lg border border-gray-300 shadow-lg mx-4 sm:mx-6 md:mx-0">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full mb-6">
                        <img
                            src="/assets/Icons/job/deletemodel.png"
                            alt="Delete Confirmation"
                            className="w-20 h-20 md:w-24 md:h-24"
                        />
                    </div>
                    <h2 className="text-xl md:text-2xl font-medium text-black mb-4 text-center">
                    Withdraw Proposal
                    </h2>
                    <p className="text-center text-sm md:text-base text-black mb-6">
                    Are you sure you want to withdraw this proposal? 
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            className="px-6 py-2 bg-gray-100 border rounded-full text-gray-700 w-full sm:w-auto"
                            onClick={onClose}
                        >
                            No, Keep it
                        </button>
                        <button
                            className="px-6 py-2 bg-red-500 rounded-full text-white w-full sm:w-auto"
                            onClick={onConfirm}
                        >
                            Yes, Withdraw it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
