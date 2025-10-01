import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import SelectInput from '@/Components/elements/inputs/SelectInput';
import TextArea from '@/Components/elements/inputs/TextArea';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const AddEducationModal = (
    {
        onClose,
        education,
        type,
    }: {
        onClose: () => void;
        education: any;
        type: any;
    }) => {
    const [processing, setProcessing] = useState(false);
    const [dateError, setDateError] = useState('');
    const [lengthErrors, setLengthErrors] = useState({
        school: '',
        area_of_study: '',
        description: '',
    });


    const { data, setData, post, errors, progress, reset } = useForm({
        school: education?.school ?? '',
        start_date: education?.start_date ? education.start_date.split(' ')[0] : '',
        end_date: education?.end_date ? education.end_date.split(' ')[0] : '',
        degree: education?.degree ?? '',
        area_of_study: education?.area_of_study ?? '',
        description: education?.description ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.start_date && data.end_date && data.start_date > data.end_date) {
            setDateError('Start date cannot be after the end date.');
            return;
        }

        setDateError('');
        setProcessing(true);
        {
            type === 'create'
                ?
                post(route('freelancer.education.store'),
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
                :
                post(route('freelancer.education.update', { id: education.id }),
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
        }

    };

    const Degrees = [
        { label: "Bachelor's degree", value: "Bachelor's degree" },
        { label: "Master's degree", value: "Master's degree" },
        { label: "Doctorate", value: "Doctorate" },
        { label: "Associate degree", value: "Associate degree" },
        { label: "High school diploma", value: "High school diploma" },
        { label: "Professional degree", value: "Professional degree" },
        { label: "Diploma", value: "Diploma" },
        { label: "Certificate", value: "Certificate" },
        { label: "Other", value: "Other" },
    ];


    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 px-6 py-2 bg-white rounded-lg md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="flex py-2 text-lg font-semibold sm:py-6 sm:text-2xl ">Add Education Details</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className='flex flex-col gap-1 sm:gap-4'>
                    <div className="w-full ">
                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="school" value="School" />
                        <TextInput
                            id="school"
                            type="text"
                            placeholder='Enter school name'
                            name="school"
                            isFocused={true}
                            value={data.school}
                            className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                            onChange={(e) => setData('school', e.target.value)}
                        />
                        {lengthErrors.school && <div className="text-sm text-red-500">{lengthErrors.school}</div>}
                        <InputError message={errors.school} className="mt-2" />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <div className="flex flex-col w-full sm:gap-6 sm:flex-row">
                            <div className="flex flex-col w-full gap-3 sm:w-1/2">
                            <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="start_date" value="Start Date" />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    isFocused={false}
                                    value={data.start_date}
                                    className="block w-full h-10 p-2 border rounded-xl placeholder:text-xs font-Inter"
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                                <span className="text-xs text-gray-400">Start Date : {education?.start_date_human ?? 'Select Start Date'}</span>
                                <InputError message={errors.start_date} className="sm:mt-2" />
                            </div>
                            <div className="flex flex-col w-full gap-3 sm:w-1/2">
                            <InputLabel className="text-base font-bold text-black font-Inter" htmlFor="end_date" value="End Date (Optional)" />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    name="end_date"

                                    isFocused={false}
                                    value={data.end_date}
                                    className="block w-full h-10 p-2 border rounded-xl placeholder:text-xs font-Inter"
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                                <span className="text-xs text-gray-400">End Date : {education?.end_date_human ?? 'Select End Date'}</span>
                                <InputError message={errors.end_date} className="mt-2" />
                                {dateError && (
                                    <div className="mt-2 text-sm font-medium text-red-600">{dateError}</div>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="w-full">
                        <InputLabel className="text-base font-bold text-black font-Inter" htmlFor="area_of_study" value="Area of Study (Optional)" />
                        <TextInput
                            id="area_of_study"
                            type="text"
                            placeholder='Ex: Computer science'
                            name="area_of_study"
                            isFocused={false}
                            value={data.area_of_study}
                            className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                            onChange={(e) => setData('area_of_study', e.target.value)}
                        />
                        {lengthErrors.area_of_study && <div className="text-sm text-red-500">{lengthErrors.area_of_study}</div>}
                        <InputError message={errors.area_of_study} className="mt-2" />
                    </div>
                    <InputLabel className="text-base font-bold text-black font-Inter" htmlFor="degree" value="Degree (Optional)" />
                    <SelectInput
                        options={Degrees}
                        selectedOption={Degrees.find(option => option.value === data.degree)}
                        setData={(value: string) => setData('degree', value)}
                    />
                    <div>
                        <InputLabel
                            required
                            htmlFor="description"
                            value="Description"
                        />
                        <TextArea
                            id="description"
                            name="description"
                            value={data.description}
                            maxLength={500}
                            placeholder='Briefly describe the project’s goals. your solution and the impact you made.'
                            className="block w-full mt-1 placeholder:text-xs"
                            isFocused={false}
                            rows={4}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        <span className="text-xs text-gray-400 ">Max 500 characters</span>
                        {lengthErrors.description && <div className="text-sm text-red-500">{lengthErrors.description}</div>}
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex flex-col justify-end gap-1 mb-2 sm:mt-2 sm:flex-row">

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
                            {processing ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEducationModal;
