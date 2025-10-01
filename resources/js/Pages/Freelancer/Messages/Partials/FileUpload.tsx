import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FileUpload = ({
    setData,
    type,
}: {
    setData: any;
    type: any;
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const MAX_FILE_SIZE_MB = 100;
    const MAX_FILENAME_LENGTH = 20; // Maximum length for the file name

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        const totalSize = selectedFile.size / (1024 * 1024); // size in MB

        if (totalSize > MAX_FILE_SIZE_MB) {
            setFileError(`Maximum ${MAX_FILE_SIZE_MB}MB allowed for the file.`);
            return;
        }

        setFile(selectedFile);
        setData('attachment', selectedFile);
        setFileError(null); // Clear any previous errors
    };

    const handleCancel = () => {
        setFile(null);
        setData('attachment', null); // Clear the data in the parent component
    };

    const getTruncatedFileName = (name: string) => {
        if (name?.length > MAX_FILENAME_LENGTH) {
            return `${name.substring(0, MAX_FILENAME_LENGTH)}...`;
        }
        return name;
    };

    return (
        <div>
            <div className="w-full">
                <div className="flex flex-col">
                    {fileError && <p className="text-red-500">{fileError}</p>}
                    <div className="flex flex-col">
                        <input
                            type="file"
                            name="attachment"
                            accept=".pdf,.txt,.png,.jpg,.jpeg,.ppt,.pptx"
                            className="hidden"
                            id="file-input"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-input" className="flex items-center justify-center w-full cursor-pointer">
                            <div className="flex items-center">
                                <p className="mr-2">
                                    {file ? (
                                        <button onClick={handleCancel} className="flex items-center">
                                            <span className="mr-2 overflow-hidden text-xs whitespace-nowrap text-ellipsis">
                                                {getTruncatedFileName(file.name)}
                                            </span>
                                            <XMarkIcon className="w-5 h-5 text-red-500" />
                                        </button>
                                    ) : (
                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.1297 9.4993V16.2423C10.1375 16.7353 10.3388 17.2056 10.6903 17.5515C11.0417 17.8975 11.5151 18.0913 12.0082 18.0913C12.5013 18.0913 12.9747 17.8975 13.3261 17.5515C13.6776 17.2056 13.8789 16.7353 13.8867 16.2423L13.8928 7.40399C13.8979 6.98255 13.8193 6.56429 13.6616 6.17345C13.5039 5.78261 13.2701 5.42697 12.9739 5.12714C12.6777 4.82731 12.3249 4.58926 11.936 4.42679C11.5471 4.26432 11.1298 4.18066 10.7084 4.18066C10.2869 4.18066 9.86961 4.26432 9.48071 4.42679C9.09182 4.58926 8.73904 4.82731 8.44283 5.12714C8.14661 5.42697 7.91286 5.78261 7.75512 6.17345C7.59738 6.56429 7.51879 6.98255 7.52391 7.40399V16.3018C7.51532 16.8951 7.62477 17.4842 7.84588 18.0349C8.067 18.5855 8.39537 19.0867 8.81191 19.5093C9.22845 19.9319 9.72484 20.2675 10.2722 20.4966C10.8196 20.7257 11.4071 20.8436 12.0005 20.8436C12.5939 20.8436 13.1813 20.7257 13.7287 20.4966C14.2761 20.2675 14.7725 19.9319 15.189 19.5093C15.6056 19.0867 15.9339 18.5855 16.1551 18.0349C16.3762 17.4842 16.4856 16.8951 16.477 16.3018V7.98711" stroke="black" strokeWidth="1.00189" strokeMiterlimit="10" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
