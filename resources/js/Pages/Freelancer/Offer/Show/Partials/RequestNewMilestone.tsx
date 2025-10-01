import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';


const RequestNewMilestone = (
    {
        onClose,
        milestone,
        upcomingMilestone,
    }: {
        onClose: () => void,
        milestone: any,
        upcomingMilestone: any,
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        amount: '',
        description: '',
        due_date: '',
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        {
            setProcessing(true);
            post(route('freelancer.newMilestones.request', { milestone: milestone.id }),
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
    };

    const minDate = milestone?.due_date ? milestone?.due_date?.split(' ')[0] : '';
    const maxDate = upcomingMilestone?.due_date ? upcomingMilestone?.due_date?.split(' ')[0] : '';

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 p-6 bg-white rounded-lg md:w-1/2 lg:w-1/3">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Request new milestone</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col p-4 ">
                    <span className='text-xs text-gray-500'>Add a new milestone to your offer, Make sure to fill date correctly</span>
                </div>
                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div className="flex flex-col w-full gap-4 sm:flex-row">
                        <div className='flex flex-col items-center justify-center w-full gap-3 sm:gap-6 '>
                            {/* Due Date and Amount - Arrange side-by-side on large screens */}
                            <div className="flex flex-col w-full gap-3 sm:flex-row">
                                {/* Due Date */}
                                <div className="w-full sm:w-1/2">
                                    <InputLabel className='mb-2 ' required>Due Date</InputLabel>
                                    <TextInput
                                        type="date"
                                        name="due_date"
                                        value={data.due_date}
                                        min={minDate}
                                        max={maxDate}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="w-full"
                                        onKeyDown={(e) => e.preventDefault()}
                                    />

                                    <InputError message={errors.due_date} />
                                </div>

                                {/* Amount */}
                                <div className="w-full sm:w-1/2">
                                    <InputLabel className='mb-2' required>Amount</InputLabel>
                                    <TextInput
                                        type="number"
                                        name="amount"
                                        placeholder="$0.00"
                                        value={data.amount}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (newValue.length <= 10) {
                                                setData('amount', newValue); // Update state only if length is 10 or less
                                            }
                                        }}
                                        className="w-full"
                                        onWheel={(e) => e.currentTarget.blur()}
                                        pattern="[0-9]*"
                                    />

                                    <InputError message={errors.amount} />
                                </div>
                            </div>
                            {/* Description */}
                            <div className="w-full">
                                <div className="">
                                    <InputLabel className='mb-2 ' required>Description</InputLabel>
                                    <TextInput
                                        type="text"
                                        name="description"
                                        placeholder="Description"
                                        maxLength={1000}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <span className="text-xs text-gray-500">Less than 1000 characters</span>
                                <InputError message={errors.description} />
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col justify-end mt-5 sm:flex-row">
                        <button
                            type="submit"
                            className="px-16 py-1 text-white border bg-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColorHover rounded-3xl"
                        >
                            {processing ? 'Requesting...' : 'Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestNewMilestone;
