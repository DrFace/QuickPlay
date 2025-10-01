import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextArea from '@/Components/elements/inputs/TextArea';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const RequestChangesModal = (
    {
        onClose,
        templateMessage,
        offer,
    }: {
        onClose: () => void,
        templateMessage: string,
        offer: any,
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        message: '',
        offer_id: offer?.id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        post(route('client.requestChanges.send'),
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
        <div onClick={onClose}  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div onClick={(e) => e.stopPropagation()} className="w-3/4 p-6 bg-white rounded-lg md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Request changes</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <span className="flex py-4 text-sm text-gray-500">
                    Use this space to show clients you have the skills and experience they're looking for.
                </span>

                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div className="flex flex-col gap-1 text-start">
                        <InputLabel
                        required
                            htmlFor="message"
                            value="Message"
                        />
                        <TextArea
                            id="message"
                            name="message"
                            required
                            placeholder='Enter your message here'
                            value={data.message}
                            className="block w-full mt-1 placeholder:text-xs"
                            isFocused={true}
                            maxLength={500}
                            rows={8}
                            onChange={(e) =>
                                setData("message", e.target.value)
                            }
                        />
                        <span className="text-sm text-gray-500">Less than 500 characters</span>
                        <InputError
                            message={errors.message}
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

export default RequestChangesModal;
