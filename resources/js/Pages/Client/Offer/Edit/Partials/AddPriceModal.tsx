import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const AddPriceModal = (
    {
        onClose,
        offer,

    }: {
        onClose: () => void
        offer: any,
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        offer_price: offer?.offer_price ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setProcessing(true);

        post(route('client.offer.price-update', offer.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    onClose();
                },
                onError: (e) => {
                    //console.log(e);
                    setProcessing(false);
                },
            }
        )

    };


    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-6 bg-white rounded-lg md:w-3/4 lg:w-1/4 ">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Add Price</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* <span className="flex py-4 text-sm text-gray-500">Enter your offer price , you can always change it later</span> */}
                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div className="py-4 sm:w-1/2">
                        <InputLabel required className="mb-2 text-base font-bold text-black font-Inter" htmlFor="offer_price " value="Offer price" />
                        <div className="flex flex-row items-center gap-2">
                            <span className="text-base text-black font-Inter">$</span>
                        <TextInput
                            id="offer_price"
                            type="number"
                            placeholder='Enter your offer price'
                            name="offer_price"
                            isFocused={true}
                            required
                            value={data.offer_price}
                            className="block w-full h-10 p-2 border rounded-xl placeholder:text-xs font-Inter"
                            onChange={(e) => setData('offer_price', e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            onKeyDown={(e) => {
                                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                    e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                }
                            }}
                        />
                        </div>
                        <InputError message={errors.offer_price} className="mt-2" />
                    </div>
                    <div className="flex flex-col justify-end gap-1 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-10 py-1 text-black border border-gray-300 hover:bg-primaryBtnColor hover:text-white rounded-3xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-10 py-1 text-white border bg-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColorHover rounded-3xl"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPriceModal;
