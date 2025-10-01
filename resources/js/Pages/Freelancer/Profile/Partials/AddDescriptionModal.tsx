import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextArea from '@/Components/elements/inputs/TextArea';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const AddDescriptionModal = (
    {
        onClose,
        user,
    }: {
        onClose: () => void,
        user: any
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        profile_overview: user.meta_data.profile_overview ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setProcessing(true);

        post(route('freelancer.profile-overview.update'),
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
    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-6 bg-white rounded-lg md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Profile overview</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <span className="flex py-4 text-sm text-gray-500">
                    Use this space to show clients you have the skills and experience they're looking for.
                </span>
                <div className="flex flex-col gap-1 pb-4 ml-4">
                    <ul className="ml-4 text-sm text-gray-500 list-disc">
                        <li>Describe your strengths and skills</li>
                        <li>Highlight projects, accomplishments and education</li>
                        <li>Keep it short and make sure it's error-free</li>
                    </ul>
                </div>

                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div>
                        <InputLabel
                            required
                            htmlFor="profile_overview"
                            value="Project description"
                        />
                        <TextArea
                            id="profile_overview"
                            name="profile_overview"
                            required
                            value={data.profile_overview}
                            placeholder="Briefly describe the project’s goals. Your solution and the impact you made."
                            className="block w-full mt-1 placeholder:text-xs"
                            isFocused={true}
                            rows={8}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 1000) {
                                    setData("profile_overview", value);
                                }
                            }}
                        />
                        <InputError
                            message={errors.profile_overview}
                            className="mt-2"
                        />
                        <div className="text-sm text-gray-500">
                            {data.profile_overview.length} / 1000 characters
                        </div>
                    </div>
                    <div className="flex flex-col justify-end gap-1 sm:mt-10 sm:flex-row">
                        <button
                            type="button"
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

export default AddDescriptionModal;
