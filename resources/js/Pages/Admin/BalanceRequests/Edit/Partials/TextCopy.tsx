
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

export default function TextCopy(
    {
        text,
    }: {
        text: string;
    }
) {
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (copied) {
            timeout = setTimeout(() => {
                setCopied(false);
            }, 1500);
        }
        return () => {
            clearTimeout(timeout);
        };
    },
        [copied]
    );

    return (
        <div className="flex flex-col w-full gap-3 ">
            <div className="flex flex-row gap-1 px-4 py-2 border-2 rounded-2xl">
                <p className="w-full font-semibold text-gray-500 truncate text-start">
                    {text}
                </p>
                <div className="flex flex-row justify-end gap-2">
                    <button
                        type="button"
                        className="flex flex-row items-center w-auto gap-2 pl-2 font-bold border-l-2 border-gray-400 cursor-pointer text-primary text-start font-Inter hover:underline"
                        onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true))}
                    >
                        {copied ? (
                            <ClipboardDocumentCheckIcon className="w-6 h-6" />
                        ) : (
                            <ClipboardDocumentIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
