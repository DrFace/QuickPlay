import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const AddTitleModal = (
    {
        onClose,
        user,
        offer,
    }: {
        onClose: () => void
        user: any
        offer:any,
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        title: offer?.contract_title ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setProcessing(true);

        post(route('client.offer.title-update', offer.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    onClose();
                },
                onError: (e) => {
                   // console.log(e);
                    setProcessing(false);
                },
            }
        )

    };


    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-6 bg-white rounded-lg md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Edit contract title</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <span className="flex py-4 text-sm text-gray-500">Edit the title of your contract</span>
                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div className="w-full">
                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="title " value="Your title" />
                        <TextInput
                            id="title"
                            type="title"
                            placeholder='Enter a brief but descriptive title'
                            name="title"
                            required
                            isFocused={true}
                            value={data.title}
                            className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
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

export default AddTitleModal;
