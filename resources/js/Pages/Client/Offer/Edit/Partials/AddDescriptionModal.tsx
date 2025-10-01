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
        offer,
    }: {
        onClose: () => void,
        user: any
        offer:any
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        description : offer.contract_description ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setProcessing(true);

        post(route('client.offer.description-update', offer.id),
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
                    <h2 className="text-2xl font-semibold ">Description of the work</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <span className="flex py-4 text-sm text-gray-500">
                    Use this space for writing a detailed description of the work you did on this project.
                </span>
                <div className="flex flex-col gap-1 pb-4 ml-4">
                    <ul className="ml-4 text-sm text-gray-500 list-disc">
                        <li>Describe the project’s goals.</li>
                        <li>Describe the technologies you want to use.</li>
                        <li>Describe what you did and the impact you made.</li>
                    </ul>
                </div>

                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div>
                        <InputLabel
                        required
                            htmlFor="description"
                            value="Offer Description"
                        />
                        <TextArea
                            id="profile_overview"
                            name="profile_overview"
                            value={data.description}
                            placeholder='Briefly describe the project’s goals. your solution and the impact you made.'
                            className="block w-full mt-1 placeholder:text-xs"
                            isFocused={true}
                            maxLength={1000}
                            required
                            disabled={processing}
                            rows={8}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        <span className="text-sm text-gray-500">Less than 1000 characters</span>
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
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

export default AddDescriptionModal;
