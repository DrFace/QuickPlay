import InputError from '@/Components/elements/inputs/InputError';
import { useForm } from '@inertiajs/react';
import React, { useCallback, useEffect, useState, FormEventHandler } from 'react';
import { useDropzone } from 'react-dropzone';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ThankYouModal from './ThankYouModal';

interface IDUploadModalProps {
    onClose: () => void;
}

const IDUploadModal: React.FC<IDUploadModalProps> = ({ onClose }) => {
    const [processing, setProcessing] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [issueId, setIssueId] = useState<string>('001');
    const [error, setError] = useState<string | null>(null);
    const { data, setData, post, errors, progress, reset } = useForm({
        idImage: null as File | null,
    });

    const [images, setImages] = useState<any[]>([]);
    const [canCleanImage, setCanCleanImage] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: any[]) => {
            setError(null);
            if (fileRejections.length > 0) {
                setError("Invalid file format. Please upload an image file (JPEG or PNG).");
                return;
            }
            setImages(
                acceptedFiles.map((file: any) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
            setCanCleanImage(true);
            setData('idImage', acceptedFiles[0]);
        },
        [setData]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    });

    const thumb = images.map((file: any) => (
        <div key={file.name}>
            <div>
                <img
                    alt={file.name}
                    src={file.preview}
                    width={300}
                    height={300}
                    className="h-[200px] w-full overflow-hidden object-contain rounded-xl bg-gray-700"
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                    }}
                />
            </div>
        </div>
    ));

    const remove = (file: any) => {
        const newImages = [...images];
        newImages.splice(file, 1);
        setImages(newImages);
        setCanCleanImage(false);
    };

    useEffect(() => {
        return () => images.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, [images]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        post(route('client.identity-verification.id-card.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setShowThankYouModal(true);
            },
            onError: (error) => {
                console.error(error);
                setProcessing(false);
            },
        });
    };

    return (
        <>
            {showThankYouModal ? (
                <ThankYouModal issueId={issueId} onClose={onClose} />
            ) : (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Government issued photo ID</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            <ExclamationCircleIcon className="w-6 h-6 text-gray-900 inline" /> All ID must be valid
                        </p>
                        <form onSubmit={submit} method="POST">
                            <div className="text-sm mb-2 text-gray-900 font-bold">Upload Your ID </div>
                            <div className="border-dashed bg-gray-200 border-2 border-blue-500 p-6 rounded-lg text-center mb-4">
                                <div {...getRootProps({ className: 'dropzone' })} className="border-dashed cursor-pointer p-6 rounded-lg text-center mb-4">
                                    <input type="file" {...getInputProps()} />
                                    {images.length > 0 ? (
                                        thumb
                                    ) : (
                                        <span className="text-gray-600">
                                            drag or <span className="text-blue-500 cursor-pointer">upload ID</span>
                                        </span>
                                    )}
                                </div>
                                {progress && (
                                    <progress value={progress.percentage} className="absolute top-0 left-0 h-2 bg-emerald-500" max="100">
                                        {progress.percentage}%
                                    </progress>
                                )}
                                {canCleanImage && (
                                    <button
                                        className="mx-auto mt-2 w-[70px] rounded bg-gray-300 py-1 px-2 text-sm text-gray-700 hover:bg-gray-500 hover:text-gray-900"
                                        type="button"
                                        onClick={() => remove(0)}
                                    >
                                        Clean
                                    </button>
                                )}
                            </div>
                            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                            <InputError message={errors?.idImage} />
                            <p className="text-sm text-gray-500">Max file size: 100 MB</p>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={processing}>
                                    {processing ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default IDUploadModal;
