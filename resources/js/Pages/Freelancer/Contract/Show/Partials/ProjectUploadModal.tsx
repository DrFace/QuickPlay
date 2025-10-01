import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import FileUpload from "./FileUpload";
import InputError from "@/Components/elements/inputs/InputError";
import InputLabel from "@/Components/elements/inputs/InputLabel";





const ProjectUploadModal = (
    {
        onClose,
        id,
        url,
    }: {
        onClose: () => void
        id: any
        url: string

    }) => {


    const { setData, post, data, errors, processing } = useForm({
        attachment: null,
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        {
         //   console.log(data)
            post(route(url, id),
                {
                    preserveScroll: true,
                    onSuccess: (e: any) => {
                        onClose();
                        window.location.reload();
                    },

                }
            );

        }
    };

  //  console.log('error loading', errors);
    // console.log('Error loading:', errors['attachments.0']);


    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-4 bg-white rounded-lg sm:p-8 md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold ">Submit Work</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col items-start py-4 text-start ">
                    <span className='text-base text-gray-500'>To upload your work, please submit a .zip file containing all the necessary files.</span>
                </div>
                <form onSubmit={submit} className='flex flex-col gap-2 lg:p-4'>
                    <div className="flex flex-row items-center justify-center w-full gap-3 px-8 py-4 bg-blue-100 rounded-xl">
                        <div className="w-full mt-4">

                            <InputLabel className="mt-2 text-start" required htmlFor="attachment" value="Submit your work"/>
                            <FileUpload
                                setData={setData}
                                attachmentFilePath={data?.attachment}
                                type={'create'}
                            />

                            <span className="text-xs font-normal text-textSecondary font-Inter">Max file size: 50 MB (.zip format only)</span>
                            <InputError message={errors.attachment} className="mt-2" />
                        </div>


                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-left">Please submit your work for review. Once client approved it will be marked as completed.
                        </p>
                    </div>
                    <div className="flex flex-col items-end justify-end w-full gap-4 sm:flex-row">
                        <div className="flex flex-row gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white border-2 rounded-full hover:bg-primaryBtnColorHover bg-primaryBtnColor border-primaryBtnColor">
                                {processing ? 'Submitting...' : 'Submit Work'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>



    );
}

export default ProjectUploadModal;
