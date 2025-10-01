import { router } from "@inertiajs/react";
import { useState } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    stream: MediaStream | null;
    selfieImage: string | null;
    setShowCameraModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    stream,
    selfieImage,
    setShowCameraModal,
}: ConfirmationModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        onClose();
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            router.post(route('client.identity-verification.store'), { selfie: selfieImage });
            onClose();
        } catch (error) {
            setErrorMessage("Failed to submit. Please try again.");
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg relative w-11/12 max-w-lg">
                <button
                    onClick={stopCamera}
                    className="absolute mt-4 mr-3 top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-center mb-4">Show us it's really you</h2>

                <div className="w-full h-auto rounded-md">
                    <img
                        src={selfieImage as string}
                        alt="Selfie"
                        className="w-full h-auto rounded-md"
                    />
                </div>

                <div className="mt-4 text-center">
                    <button
                        className="px-8 py-2 text-blue-700 border-2 border-blue-600 rounded-3xl shadow hover:bg-blue-700 hover:text-white"
                        onClick={() => {
                            stopCamera();
                            setShowCameraModal(true);
                        }}
                    >
                        Take again
                    </button>
                    <button
                        className="ml-4 px-8 py-2 text-white bg-blue-800 rounded-3xl shadow hover:bg-blue-900"
                        onClick={submit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Confirm"}
                    </button>
                </div>

                {errorMessage && (
                    <div className="mt-4 text-red-600 text-center">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmationModal;
