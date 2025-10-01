import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import SelectMultiInput from '@/Components/elements/inputs/SelectMultiInput';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const AddSkillsModal = (
    {
        onClose,
        user,
        skillsOptions,
    }: {
        onClose: () => void
        user: any
        skillsOptions: { label: string; value: string }[];
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        skills: user.meta_data?.skills ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setProcessing(true);

        post(route('freelancer.skills.update'),
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
            <div className="w-3/4 p-6 bg-white rounded-lg md:w-2/3 lg:w-1/3">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Select Skills</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div className="flex flex-col items-start justify-start w-full p-6 text-left ">
                        <div className="w-full">
                            <InputLabel className="text-base font-bold text-black font-Inter" htmlFor="skills" value="Search skills or add your own" />
                            <SelectMultiInput
                                className="block w-full mt-2 placeholder:text-sm font-Inter"
                                options={skillsOptions}
                                placeholder="Select skills"
                                //disabled={jobPost.status === 'active'}
                                selectedOption={skillsOptions?.filter(
                                    (obj: any) => {
                                        return data?.skills?.includes(
                                            obj.value
                                        );
                                    }
                                )}
                                setData={(e: any) => setData("skills", e)}
                            />
                            <InputError message={errors.skills} className="mt-2" />
                            <p className="mt-1 text-sm font-normal text-textSecondary font-Inter ">For the best results, add 3-5 skills</p>
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

export default AddSkillsModal;
