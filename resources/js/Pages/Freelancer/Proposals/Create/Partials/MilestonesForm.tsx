import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';

type Milestone = {
    description: string;
    dueDate: string;
    amount: string;

};

const MilestonesForm = (
    {
        milestones,
        onMilestonesChange,
        errors,
        setData,
        error
    }:
        {
            milestones: Milestone[];
            onMilestonesChange: (milestones: Milestone[]) => void;
            errors: {
                [key: number]: {
                    description?: string;
                    dueDate?: string;
                    amount?: string;
                };
            };
            setData: any;
            error: any;
        }) => {
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [serviceFee, setServiceFee] = useState<number>(0);
    const [amountReceived, setAmountReceived] = useState<number>(0);
    const [minDate, setMinDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Calculate the total price, service fee, and amount received
        const total = milestones.reduce((sum, milestone) => sum + parseFloat(milestone.amount || '0'), 0);
        const fee = total * 0.1; // Assuming a 20% service fee
        const received = total - fee;

        setTotalPrice(total);
        setServiceFee(fee);
        setAmountReceived(received);

        setData('bid_amount', total);

    }, [milestones]);



    const handleAddMilestone = () => {

        const lastMilestoneDate = milestones.length > 0
        ? milestones[milestones.length - 1].dueDate
        : new Date().toISOString().split('T')[0]; // Today's date

        onMilestonesChange([...milestones, { description: '', dueDate: lastMilestoneDate , amount: '' }]);
    };

    const handleRemoveMilestone = (index: number) => {
        const newMilestones = milestones.filter((_, i) => i !== index);
        onMilestonesChange(newMilestones);
    };

    const handleMilestoneChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newMilestones = [...milestones];
        if (name in newMilestones[index]) {
            newMilestones[index][name as keyof Milestone] = value;
        }
        onMilestonesChange(newMilestones);
    };




   // console.log('milestones', milestones);

    return (
        <>
            <div className='flex flex-col w-full gap-4'>
                <h3>How many milestones do you want to include?</h3>

                {/* Grid Layout for Labels and Inputs */}
                <div className='hidden grid-cols-12 gap-4 mb-2 lg:grid max-w-[1200px]'>
                    <div className='col-span-1'></div>
                    <div className='col-span-5'>
                        <InputLabel required>Description</InputLabel>
                    </div>
                    <div className='col-span-3'>
                        <InputLabel required>Due Date</InputLabel>
                    </div>
                    <div className='col-span-2 lg:text-end'>
                        <InputLabel required>Amount</InputLabel>
                    </div>
                    <div className='col-span-1'></div>
                </div>

                {milestones?.map((milestone, index) => (
                   <div key={index} className="grid items-center grid-cols-1 gap-4 mb-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-12 max-w-[1200px]">
                        {/* Index */}
                        <div className="flex items-center justify-start lg:flex-col lg:justify-center lg:col-span-1">
                            <span>{index + 1}</span>
                            {(error[`milestones.${index}.dueDate`] || error[`milestones.${index}.amount`] ) ? <InputError className='hidden text-white lg:mb-4 lg:flex' message="-" /> : null}
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-1 gap-4 sm:col-span-4 md:col-span-5 lg:col-span-5">
                            <div className="grid-cols-3">
                            <InputLabel className='mb-2 lg:hidden' required>Description</InputLabel>
                            <TextInput
                                type="text"
                                name="description"
                                placeholder="Description"
                                maxLength={2000}
                                value={milestone?.description}
                                onChange={(e) => handleMilestoneChange(index, e)}
                                className="w-full"
                            />
                            </div>
                            {errors[index]?.description && <InputError message={errors[index]?.description} />}
                            {<InputError message={error[`milestones.${index}.description`]} />}
                            {(error[`milestones.${index}.dueDate`] || error[`milestones.${index}.amount`] ) ? <InputError className='hidden text-white lg:flex' message="-" /> : null}
                        </div>

                        {/* Due Date and Amount - Arrange side-by-side on large screens */}
                        <div className="grid grid-cols-1 gap-4 md:pl-28 sm:pl-20 lg:pl-0 sm:col-span-4 sm:justify-between md:col-span-5 lg:col-span-5 sm:flex sm:flex-row">
                            {/* Due Date */}
                            <div className="grid-cols-3 sm:grid-cols-2 ">
                            <InputLabel className='mb-2 lg:hidden' required>Due Date</InputLabel>
                                <TextInput
                                    type="date"
                                    name="dueDate"
                                    value={milestone?.dueDate}
                                    min={index > 0 ? milestones[index - 1].dueDate : minDate}
                                    max={index < milestones.length - 1 ? milestones[index + 1].dueDate : undefined}
                                    onChange={(e) => handleMilestoneChange(index, e)}
                                    className="w-full min-w-[200px]"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                                {errors[index]?.dueDate && <InputError message={errors[index]?.dueDate} />}
                                {<InputError message={error[`milestones.${index}.dueDate`]} />}
                            </div>

                            {/* Amount */}
                            <div className="grid-cols-2 sm:grid-cols-2 ">
                                <InputLabel className='mb-2 lg:hidden' required>Amount</InputLabel>
                                <TextInput
                                    type="number"
                                    name="amount"
                                    placeholder="$0.00"
                                    value={milestone?.amount}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Only update if the value is numeric and within the 10-character limit
                                        // if (value.length <= 10 && !isNaN(parseFloat(value))) {
                                     if (value.length <= 10 ) {
                                            handleMilestoneChange(index, e);
                                        }
                                    }}
                                    className="w-full"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    onKeyDown={(e) => {
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                        }
                                    }}
                                />
                                {errors[index]?.amount && <InputError message={errors[index]?.amount} />}
                                {<InputError message={error[`milestones.${index}.amount`]} />}
                            </div>
                        </div>

                        {/* Remove Button */}
                        <div className="flex items-center justify-end col-span-1 lg:justify-start">
                            {milestones.length > 1 && (
                                <button type="button" onClick={() => handleRemoveMilestone(index)}>
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                ))}
               <div className="flex justify-end gap-4 mt-1 ">
                    <button className='px-4 py-1 border-2 text-start border-primaryBtnColorHover rounded-3xl text-primary' type="button" onClick={handleAddMilestone}>
                        Add milestone +
                    </button>
                </div>
                {/* Pricing Summary Section */}
                <div className='flex justify-end gap-4 mt-4 border-t-2'>
                    <div className='flex flex-col items-center w-1/3 gap-4 py-4'>
                        <div className="flex items-center justify-center w-24 h-28">
                            <img src="/assets/Icons/freelancer/price.png" alt="Price Icon" className="w-24 h-28" />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-1'>
                            <p className='text-xs text-textSecondary'>Includes AI Geeks Fixed-Price Protection.</p>
                            <h3 className='text-sm font-semibold underline text-primaryBtnColorHover'>Learn more</h3>
                        </div>
                    </div>
                    <div className='flex flex-col w-2/3 gap-4 py-4'>
                        <div className='flex flex-col gap-1'>
                            <div className='flex justify-between'>
                                <h3 className='text-sm font-semibold'>Total price of project</h3>
                                <span className='text-sm font-semibold'>${totalPrice?.toFixed(2)}</span>
                            </div>
                            <p className='text-xs text-textSecondary'>This includes all milestones, and is the amount your client will see.</p>
                        </div>
                        <div className='flex flex-col gap-1 py-4 border-y-2'>
                            <div className='flex justify-between'>
                                <h3 className='text-sm font-semibold'>10% Freelancer Service Fee</h3>
                                <span className='text-sm font-semibold'>${serviceFee?.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex justify-between'>
                                <h3 className='text-sm font-semibold'>You’ll Receive</h3>
                                <span className='text-sm font-semibold'>${amountReceived?.toFixed(2)}</span>
                            </div>
                            <p className='text-xs text-textSecondary'>Your estimated payment, after service fees.</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default MilestonesForm;
