import { useForm } from '@inertiajs/react';
import Modal from '@/Components/elements/other/Modal';
import { User } from '@/types';
import React from 'react';
import SelectInput from '@/Components/elements/inputs/SelectInput';
import SelectMultiInput from '@/Components/elements/inputs/SelectMultiInput';
import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';

export default function AccountInfoModal({
    show,
    onClose,
    jobCategories,
    skillsOptions
}: {
    show: boolean;
    onClose: () => void;
    jobCategories: { label: string; value: string }[];
    skillsOptions: { label: string; value: string }[];
}) {
    // Initialize form state with useForm
    const { data, setData, post, errors, reset } = useForm({
        job_category: '', // Selected job category
        skills: [] as string[] // Selected skills
    });

    // Form submission handler
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('freelancer.account.updateJobCategoryInfo'), {
            onSuccess: () => {

                onClose(); // Close the modal after saving
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };



    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-xl p-3 bg-white rounded-lg sm:p-8">
            <form onSubmit={submit} className="">
                <div className="flex justify-between">
                    <h2 className="flex justify-center text-xl font-bold">Add Job Category</h2>
                    <button
                        type='button'
                        onClick={onClose}
                        className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Job Category Selection */}
                <div className="mt-4">

                    <InputLabel required htmlFor="job_category"
                    value="Select Job Category" />
                    <SelectInput
                        options={jobCategories}
                        selectedOption={jobCategories.find(option => option.value === data.job_category)}
                        setData={(value: string) => setData('job_category', value)}
                        placeholder="Select a Job Category"
                    />
                    <InputError message={errors.job_category} className="mt-2" />
                </div>

                {/* Skills Selection */}
                <div className="mt-4">
                    <InputLabel required htmlFor="skills"
                    value="Select Skills" />
                    <SelectMultiInput
                        options={skillsOptions}
                        selectedOption={skillsOptions.filter(option => data.skills.includes(option.value))}
                        setData={(value: string[]) => setData('skills', value)}
                        placeholder="Select Skills"
                    />
                    <InputError message={errors.skills} className="mt-2" />
                </div>

                <div className="flex justify-end mt-6">
                    {/* <button type="button" onClick={onClose} className="px-4 py-2 mr-3 bg-gray-300 rounded-md">Cancel</button> */}
                    <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-lg">Save</button>
                </div>
            </form>
       </div>
    </div>
    );
}
