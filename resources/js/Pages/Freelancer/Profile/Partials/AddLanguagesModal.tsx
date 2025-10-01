import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import SelectInput from '@/Components/elements/inputs/SelectInput';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

const AddLanguagesModal = (
    {
        onClose,
        languages,
    }: {
        onClose: () => void
        languages: {label: string; value: string}[];
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        language: '',
        level: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setProcessing(true);

        post(route('freelancer.language.store'),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    onClose();
                },
                onError: (e) => {
                  //  console.log(e);
                    setProcessing(false);
                },
            }
        )

    };

    const ProficiencyLevels = [
        { label: "Basic", value: "Basic" },
        { label: "Conversational", value: "Conversational" },
        { label: "Fluent", value: "Fluent" },
        { label: "Native", value: "Native" },
    ];

   // console.log("languages",languages);
    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-6 bg-white rounded-lg md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="flex py-6 text-2xl font-semibold ">Add language</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className='flex flex-col gap-4'>
                    <div className="flex flex-col w-full gap-3 sm:gap-8 sm:flex-row">
                        <div className="flex flex-col gap-3 sm:w-1/2">
                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="language" value="Language" />
                            <SelectInput
                                options={languages}
                                selectedOption={Array.isArray(languages) ? languages.find(option => option.value === data.language) : null}  // Safeguard for find()
                                setData={(value: string) => setData('language', value)}
                            />
                             <InputError message={errors.language} className="mt-1" />
                        </div>
                        <div className="flex flex-col gap-3 sm:w-1/2">
                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="level" value="Proficiency level" />
                            <SelectInput
                                options={ProficiencyLevels}
                                selectedOption={ProficiencyLevels?.find(option => option.value === data.level)}
                                setData={(value: string) => setData('level', value)}
                            />
                             <InputError message={errors.level} className="mt-1" />
                        </div>
                    </div>


                    <div className="flex flex-col justify-end gap-1 sm:mt-10 sm:flex-row">
                    <button
                            type = "button"
                            onClick={onClose}
                            className="px-16 py-1 text-black border border-gray-300 hover:bg-primaryBtnColor hover:text-white rounded-3xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-16 py-1 text-white border bg-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColorHover rounded-3xl"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLanguagesModal;
