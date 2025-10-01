import React, { useState } from 'react';
import TextArea from '@/Components/elements/inputs/TextArea';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/elements/inputs/InputError';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/elements/inputs/InputLabel';

const AiTipsComponent = ({
    setDescription,
    descriptionText,
}: {
    setDescription: any;
    descriptionText: string;
}) => {
    const [tips, setTips] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [text, setText] = useState(descriptionText ?? '');

    const handleGenerateTips = async () => {
        if (text) {
            setProcessing(true);
            const response = await fetch(`/freelancer/ai-tips/${text}`);
            if (response.ok) {
                const data = await response.json();
               // console.log('data', data);
                setTips(data.tips);
                setDescription(data.tips);
                setProcessing(false);
            }
            else {
                setProcessing(false);
            }
        }
    }

    // console.log('tips', tips);

    // const tips = [
    //     {
    //         tip: 'Clarify the Purpose',
    //         explanation: 'Clearly state what Hobem AI aims to achieve and its primary functions to provide potential users with a quick understanding of its value.',
    //     },
    //     {
    //         tip: 'Highlight Unique Features',
    //         explanation: 'Detail the unique features that differentiate Hobem AI from competitors. This could include technology used, user interface, or specific use cases',
    //     },
    //     {
    //         tip: 'Add Target Audience',
    //         explanation: 'Identify and describe the target audience for Hobem AI. Understanding who will benefit from the project helps tailor the description.',
    //     },
    // ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % tips.length);
    };


    return (
        <div className="">
            <InputLabel required className="text-xl font-bold">Cover Letter</InputLabel>
            <div className="mt-2 border-4 rounded-3xl">
                <div className="flex justify-between p-4 bg-gray-200 rounded-t-2xl">
                    <div className="flex flex-col w-5/6 sm:w-auto">
                        {tips ? (
                            <p className="text-black">
                                Your first few tips are ready! Check them out.<br />
                                <span className="text-sm text-gray-500 ">Beta feature powered by ChatGPT 4</span>
                            </p>

                        ) : (
                            <p className="text-xs text-black sm:text-sm font-Inter">
                                Get AI-generated tips to help you get started. <br />
                                <span className="text-xs text-gray-500 ">Beta feature powered by ChatGPT 4</span>
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-center w-1/6 sm:w-auto">
                            <button
                                className="flex items-center gap-2 p-2 mt-2 font-medium text-white rounded-full sm:py-2 sm:px-4 bg-gradient-to-r from-blue-700 to-red-700 focus:ring ring-black ring-opacity-10 gradient element-to-rotate"
                                disabled={processing}
                                onClick={() => {
                                    handleGenerateTips();
                                }}
                            >
                               <img src="/assets/Icons/job/logo.png" alt="Panel Icon" className="w-4 h-4" />
                                {/* {loading ? 'Loading...' : 'Write from AI'} */}
                                <span className='hidden sm:block '>
                                    {processing ? 'Loading...' : 'Get tips'}
                                </span>
                            </button>
                    </div>
                </div>
                {tips.length > 0 && (
                <div className="flex w-full h-auto border-b-4 border-gray-200">
                    {/* <div className="text-center ">
                        <button
                            className="h-full bg-blue-200"
                            onClick={handlePrevious}
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    </div> */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {tips.map((tip: any, index) => (
                                <div
                                    key={index}
                                    className="flex-none w-full p-4 space-y-2 "
                                >
                                    <div className="flex items-center gap-2">
                                    <img src="/assets/Icons/client/logoIcon.png" alt="Panel Icon" className="w-6 h-6" />
                                     <span className="text-sm text-gray-400">
                                           Tip {index + 1} of {tips.length}
                                        </span>
                                    </div>
                                    <div className="">
                                    <h3 className="text-lg text-gray-800">

                                       {tip.tip}</h3>
                                    <p className="text-sm text-gray-500">{tip.explanation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            className="h-full "
                            onClick={handleNext}
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                )}
                <div className="">
                    <TextArea
                        id="description"
                        name="description"
                        value={text}
                        className="block w-full border-none rounded-b-3xl"
                        placeholder="Write a cover letter of your proposal here"
                        rows={8}
                        onChange={(e) => {
                            setText(e.target.value);
                            setDescription(e.target.value);
                        }
                        }
                    />

                    {/* <InputError
                        message={errors.description}
                        className="mt-2"
                    /> */}
                </div>
            </div>
            <p className="mt-1 text-xs text-right text-gray-500">1000 Characters Only</p>
        </div >
    );
};

export default AiTipsComponent;
