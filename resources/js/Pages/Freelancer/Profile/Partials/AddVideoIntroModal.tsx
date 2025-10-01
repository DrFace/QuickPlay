import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import SelectInput from '@/Components/elements/inputs/SelectInput';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const AddVideoIntroModal = (
    {
        onClose,
        user,
    }: {
        onClose: () => void,
        user: any
    }) => {
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        video_link: user.meta_data.video_link ?? '',
        video_type: user.meta_data.video_type ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setProcessing(true);

        post(route('freelancer.youtube.update'),
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
    const VideoTypes = [
        { label: "Me talking about my skills and experience", value: "Me talking about my skills and experience" },
        { label: "Visual samples of my work", value: "Visual samples of my work" },
        { label: "Something else", value: "Something else" },
    ];

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-6 bg-white rounded-lg md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="flex py-6 text-2xl font-semibold ">Add video introduction</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className='flex flex-col gap-4'>
                    <div className="w-full">
                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="video_link" value="Link to your YouTube video" />
                        <TextInput
                            id="video_link"
                            type="text"
                            placeholder='Enter YouTube video link'
                            name="video_link"
                            isFocused={true}
                            value={data.video_link}
                            className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                            onChange={(e) => setData('video_link', e.target.value)}
                        />
                        <InputError message={errors.video_link} className="mt-2" />
                        <span className="text-sm text-gray-500">All fields are required unless otherwise indicated.</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="video_type" value="What type of video is this?" />
                        <SelectInput
                            options={VideoTypes}
                            selectedOption={VideoTypes.find(option => option.value === data.video_type)}
                            setData={(value: string) => setData('video_type', value)}
                        />
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

export default AddVideoIntroModal;
