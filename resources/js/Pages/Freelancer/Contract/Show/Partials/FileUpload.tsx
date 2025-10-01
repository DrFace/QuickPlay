import React, { useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const FileUpload = ({
    setData,
    attachmentFilePath,
    type,
}: {
    setData: any;
    attachmentFilePath: any;
    type: any;
}) => {
    const [file, setFile] = useState<any | null>(attachmentFilePath && attachmentFilePath.length > 0 ? attachmentFilePath[0] : null);

    const [fileError, setFileError] = useState<string | null>(null);
    const MAX_FILE_SIZE_MB = 50;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e?.target?.files ? e?.target?.files[0] : null;
        if (!selectedFile) return;
        const totalSize = (selectedFile?.size / (1024 * 1024)); // Size in MB
        if (totalSize > MAX_FILE_SIZE_MB) {
            setFileError(`Maximum ${MAX_FILE_SIZE_MB}MB allowed for the file.`);
            return;
        }

        // Prepare the file with a preview URL
        const newFile = Object.assign(selectedFile, {
            preview: URL.createObjectURL(selectedFile),
            originalName: selectedFile.name,
            newName: selectedFile.name, // Set initial newName to original name
        });

        setFile(newFile);
        setData('attachment', newFile);
        setFileError(null); // Reset error if file is valid
    };

    const removeFile = () => {
        setFile(null);
        setData('attachment', null);
        setFileError(null);
    };

    const handleDownload = (file: any) => {
        const link = document?.createElement('a');
        link.href = file?.preview || file?.path_url;
        link.download = file?.file_name || file?.newName || file?.originalName;
        link.click();
    };

    return (
        <div className="mt-4">
            <div className="w-full text-center bg-gray-100 border-2 border-blue-500 border-dashed rounded-md">
                <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-blue-500">File uploaded:</p>
                    <div className="flex flex-col gap-4 p-2 text-center">
                        {file ? (
                            <div className="relative">
                                {type === 'edit' ? (
                                    // Show only the file name in edit mode
                                    <div className="flex items-center justify-between p-2 bg-blue-200 rounded-lg">
                                        <div className="flex-1 text-left">
                                            <p className="text-sm text-gray-800">{file?.file_name || file.originalName}</p>
                                            <p className="text-xs text-gray-500">{(file?.size / (1024 * 1024))?.toFixed(2)} MB</p>
                                        </div>
                                        {/* Download button */}
                                        <button
                                            type='button'
                                            onClick={() => handleDownload(file)}
                                            className="p-1 ml-2 text-blue-500 bg-white rounded-full"
                                        >
                                            <ArrowDownTrayIcon className="w-6 h-6" />
                                        </button>
                                        {/* Remove button */}
                                        <button
                                            type='button'
                                            onClick={removeFile}
                                            className="p-1 ml-2 text-red-500 bg-white rounded-full"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                ) : (
                                    // Show file preview (image or iframe) in create mode
                                    <>
                                        <div className="p-2 bg-blue-200 rounded-t-lg">
                                            <p className="text-sm text-gray-800">{file?.newName || file?.originalName}</p>
                                            <p className="text-xs text-gray-500">File type: {file?.type}</p>
                                        </div>
                                        {/* Download button */}
                                        <button
                                            type='button'
                                            onClick={() => handleDownload(file)}
                                            className="absolute flex items-center justify-center w-6 h-6 text-blue-500 bg-white rounded-full top-1 right-8"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4 " />
                                        </button>
                                        {/* Remove button */}
                                        <button
                                            type='button'
                                            onClick={removeFile}
                                            className="absolute flex items-center justify-center w-6 h-6 text-red-500 bg-white rounded-full top-1 right-1"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                        <div className="flex items-center justify-between px-2 py-2 text-left bg-gray-800">
                                            <p className="text-xs text-gray-100">{file?.file_name || file?.originalName}</p>
                                            <p className="text-xs text-gray-200">{(file?.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {fileError && <p className="text-red-500">{fileError}</p>}
                                <div className="flex flex-col items-center justify-center w-full">
                                    <input
                                        type="file"
                                        name="attachment"
                                        accept=".zip"
                                        className="hidden"
                                        id="file-input"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-input" className="w-full">
                                        <div className="flex flex-col items-center justify-center h-24 text-base font-medium">
                                            <p className="text-gray-600">
                                                Drag or <span className="text-blue-500 cursor-pointer">upload</span> project file
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
