import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';

interface Employment {
    position: string;
    company_name: string;
    start_date: string;
    end_date: string;
    currently_working: boolean;
}

interface AddEmployModalProps {
    onClose: () => void;
    employment: Employment | null;
    type: 'create' | 'edit';
}

export default function AddEmployModal({ onClose, employment, type }: AddEmployModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        position: employment?.position || '',
        company_name: employment?.company_name || '',
        start_date: employment?.start_date || '',
        end_date: employment?.end_date || '',
        currently_working: employment?.currently_working || false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
       // console.log(data);
        post(route('freelancer.employment.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },

        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center">
                    <h2 className="flex py-2 text-lg font-semibold sm:py-6 sm:text-2xl">
                        {type === 'edit' ? 'Edit Employment' : 'Add Employment'}
                    </h2>
                    <button onClick={onClose} type="button" className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel required className="text-lg font-semibold text-black font-Inter mb-2" htmlFor="companyName" value="Company Name" />
                        <TextInput
                            type="text"
                            placeholder="Company Name"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            className="border border-gray-300 rounded-md p-3 w-full"
                        />
                        {errors.company_name && <p className="text-red-600 text-sm mt-1">{errors.company_name}</p>}
                    </div>
                    <div>
                        <InputLabel required className="text-lg font-semibold text-black font-Inter mb-2" htmlFor="position" value="Position" />
                        <TextInput
                            type="text"
                            placeholder="Position"
                            value={data.position}
                            onChange={(e) => setData('position', e.target.value)}
                            className="border border-gray-300 rounded-md p-3 w-full"
                        />
                        {errors.position && <p className="text-red-600 text-sm mt-1">{errors.position}</p>}
                    </div>



                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={data.currently_working}
                            onChange={(e) => setData('currently_working', e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700 font-medium">Currently Working Here</label>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <InputLabel required className="text-lg font-semibold text-black font-Inter mb-2" htmlFor="startDate" value="Start Date" />
                            <TextInput
                                type="date"
                                id="startDate"
                                placeholder="Start Date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full"
                            />
                            {errors.start_date && <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>}
                        </div>

                        <div className="flex-1">
                            <InputLabel className="text-lg font-semibold text-black font-Inter mb-2" htmlFor="endDate" value="End Date" />
                            <TextInput
                                type="date"
                                id="endDate"
                                placeholder="End Date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className={`border border-gray-300 rounded-md p-3 w-full ${data.currently_working ? 'text-gray-400 bg-gray-100' : ''
                                    }`}
                                disabled={data.currently_working}
                            />
                            {errors.end_date && <p className="text-red-600 text-sm mt-1">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="submit"
                            className="px-8 py-2 text-white bg-primaryBtnColor rounded-lg hover:bg-primaryBtnColorHover font-semibold"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
