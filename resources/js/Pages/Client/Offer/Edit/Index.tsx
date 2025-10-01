import AppLayout from "@/Layouts/AppLayout";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import AddPriceModal from "./Partials/AddPriceModal";
import RadioButton from "@/Components/elements/inputs/RadioButton";
import MilestonesForm from "./Partials/MilestonesForm";
import AddTitleModal from "./Partials/AddTitleModal";
import AddDescriptionModal from "./Partials/AddDescriptionModal";
import InputError from "@/Components/elements/inputs/InputError";
import TextInput from "@/Components/elements/inputs/TextInput";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import FileUpload from "@/Components/shared/partials/FileUpload";

export default function offerCreate({
    offer,
    proposal,
    user,
    type,
}: {
    offer: any;
    proposal: any;
    user: any;
    type: any;
}) {

    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [paidType, setPaidType] = useState<string>(offer?.payment_type ?? 'Milestone');
    const [milestones, setMilestones] = useState(offer?.milestones_formatted ?? [{ description: '', dueDate: new Date().toISOString().split('T')[0], amount: '' }]);
    const [milestonesErrors, setMilestonesErrors] = useState<any>({});
    const [milestonesError, setMilestonesError] = useState<boolean>(false);
    const errorMilestonesRef = useRef<HTMLDivElement>(null); // Create a ref

    const { setData, post, data, errors, processing } = useForm({
        paid_type: paidType ?? offer?.payment_type,
        milestones: milestones ?? offer?.milestones_formatted ?? [{ description: '', dueDate: '', amount: '' }],
        attachments: offer?.attachments ?? '',
        terms: termsAccepted ?? false,
        dueDate: (offer?.due_date)?.split(' ')[0] ?? new Date().toISOString().split('T')[0],
    });


    const handleOpenModal = (Modal: string) => {
        switch (Modal) {
            case "Price":
                setIsPriceModalOpen(true);
                break;
            case "Title":
                setIsTitleModalOpen(true);
                break;
            case "Description":
                setIsDescriptionModalOpen(true);
                break;
            default:
                break;
        }
    };


    const handleCloseModal = (Modal: string) => {
        switch (Modal) {
            case "Price":
                setIsPriceModalOpen(false);
                break;
            case "Title":
                setIsTitleModalOpen(false);
                break;
            case "Description":
                setIsDescriptionModalOpen(false);
                break;

            default:
                break;
        }
    };


    const handlePaidTypeChange = (value: string) => {
        setPaidType(value);
        setData('paid_type', value);
    };

    const handleMilestonesChange = (milestones: any) => {
        setMilestones(milestones);
        setData('milestones', milestones);
    };

    const validateMilestones = () => {
        let valid = true;
        const newErrors: any = {};
        milestones.forEach((milestone: any, index: any) => {
            const error: any = {};
            if (!milestone.description) {
                error.description = "Description is required";
                valid = false;
            }
            if (!milestone.dueDate) {
                error.dueDate = "Due date is required";
                valid = false;
            }
            if (!milestone.amount) {
                error.amount = "Amount is required";
                valid = false;
            }
            if (Object.keys(error).length > 0) {
                newErrors[index] = error;
            }
        });
        setMilestonesErrors(newErrors);
        setMilestonesError(!valid);
        return valid;
    };



    const handelTermsAccepted = () => {
        setTermsAccepted(!termsAccepted);
        setData('terms', !termsAccepted);
    }



    const handelSubmit = () => {

        if (paidType === "Milestone") {
            if (!validateMilestones()) return;
        }
        if (paidType === "Project") {
            setData('milestones', []);
            setMilestones([{ description: '', dueDate: '', amount: '' }]);
            if (!data.dueDate) {
                errors.dueDate = "Due date is required";
                return;
            }
        }


        post(route('client.offer.update', offer.id),
            {
                preserveScroll: true,
                onSuccess: () => {

                },
                onError: (e) => {

                },
            }
        )
    }

    // console.log('offer', offer);
    // console.log('proposal', proposal);

    return (
        <>
            <AppLayout isClientHeader={true} isHeader={false} isFooter={true} >
                <Head title="Offer Create" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto item-center ">
                        <div className="flex flex-col w-full ">
                            <div className="mt-10 mb-8 text-4xl font-semibold text-black font-Inter">
                                <h1>Send an Offer</h1>
                            </div>
                            <div className="flex flex-col w-full gap-4 lg:flex-row">
                                <div className="w-full p-2 lg:w-3/4">
                                    <div className="py-2 text-xl font-semibold text-black font-Inter">
                                        <div className="text-2xl font-semibold text-black">Contract terms</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-lg font-semibold ">Set the terms of your contract</span>
                                        <div className="flex flex-row gap-1 ">
                                            <span className="font-semibold">$ {offer.offer_price}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModal("Price")}
                                                className="flex items-center justify-center w-5 h-5 text-center bg-white rounded-full ">
                                                <PencilIcon className="w-5 h-5 font-semibold text-primary" />
                                            </button>
                                            {isPriceModalOpen &&
                                                <AddPriceModal
                                                    onClose={() => handleCloseModal("Price")}
                                                    offer={offer}

                                                />
                                            }
                                        </div>
                                        <span className="text-base text-textSecondary">This is the price you and {proposal?.freelancer?.first_name} have agreed upon</span>
                                    </div>
                                    <div className="py-4 space-y-8 ">
                                        <div className="flex-grow space-y-3">

                                            <div className="space-y-2">
                                                <div className="text-lg font-semibold text-black">Deposit funds into stripe</div>
                                                <span className="text-base text-textSecondary">stripe is a neutral holding place that project your deposit until work is approved</span>
                                                <div className="flex flex-col gap-2 mt-4">

                                                    <div className="flex items-center gap-2">
                                                        <RadioButton
                                                            label=""
                                                            value="Project"
                                                            selectedValue={paidType}
                                                            onChange={() => handlePaidTypeChange("Project")}
                                                        />
                                                        <div className="flex flex-col gap-1">
                                                            <h2 className="text-lg font-semibold">Deposit ${offer.offer_price} for the whole project</h2>

                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <RadioButton
                                                            label=""
                                                            value="Milestone"
                                                            selectedValue={paidType}
                                                            onChange={() => handlePaidTypeChange("Milestone")}
                                                        />
                                                        <div className="flex flex-col gap-1">
                                                            <h2 className="text-lg font-semibold">Deposit a lesser amount to cover the first milestone</h2>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {paidType === "Milestone" ? (
                                                <div ref={errorMilestonesRef} className="py-4 ml-4 space-y-2">
                                                    <div className="text-lg font-semibold text-black">How many milestones do you want to include ?</div>
                                                    <span className="text-base text-textSecondary">You can always add more milestones later</span>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex flex-col w-full gap-1">
                                                                <MilestonesForm
                                                                    milestones={milestones}
                                                                    onMilestonesChange={handleMilestonesChange}
                                                                    errors={milestonesErrors}
                                                                    error={errors}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col sm:w-1/3 sm:col-span-2'>
                                                    <InputLabel required className="mb-2 text-base font-bold text-black font-Inter" htmlFor="dueDate" value="Due date" />
                                                    <TextInput
                                                        type="date"
                                                        name="dueDate"
                                                        min={new Date()?.toISOString()?.split('T')[0]}
                                                        value={data?.dueDate}
                                                        onChange={(e) => setData('dueDate', e.target.value)}
                                                        className='w-full'
                                                        onKeyDown={(e) => e.preventDefault()} // Prevent typing
                                                    />
                                                    <InputError message={errors.dueDate} className="mt-2" />
                                                </div>
                                            )
                                            }

                                        </div>
                                    </div>
                                    <div className="flex flex-col py-4 ">
                                        <div className="text-lg font-semibold text-black">Contract title</div>
                                        <div className="flex flex-row justify-between sm:gap-20 ">
                                            <span className="text-lg font-Inter">{offer?.contract_title ?? 'You can and title for this contract'}</span>
                                            <button onClick={() => handleOpenModal("Title")}
                                                type="button"
                                                className="flex items-center justify-center w-5 h-5 text-center bg-white rounded-full ">
                                                <PencilIcon className="w-5 h-5 font-semibold text-primary" />
                                            </button>
                                            {isTitleModalOpen &&
                                                <AddTitleModal offer={offer} user={user} onClose={() => handleCloseModal('Title')} />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col ">
                                        <div className="text-lg font-semibold text-black">Description of the work</div>
                                        <div className="flex flex-row justify-between sm:gap-20">
                                            <DescriptionWidget description={offer?.contract_description} id={offer?.id} attachments={[]} title="" />
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModal("Description")}
                                                className="flex items-center justify-center w-5 h-5 text-center bg-white rounded-full ">
                                                <PencilIcon className="w-5 h-5 text-primary" />
                                            </button>
                                            {isDescriptionModalOpen &&
                                                <AddDescriptionModal offer={offer} user={user} onClose={() => handleCloseModal('Description')} />
                                            }
                                        </div>
                                    </div>
                                    <div className="w-full mt-4">
                                        <h2 className="text-lg font-bold text-black font-Inter" >Attachments</h2>
                                        <FileUpload
                                            setData={setData}
                                            attachmentFilePath={data?.attachments}
                                            type={type}
                                        />

                                        <span className="text-xs font-normal text-textSecondary font-Inter">Max file size: 100 MB</span>
                                        <InputError message={errors.attachments} className="mt-2" />
                                    </div>
                                    <div className="flex w-full px-4 py-10 mt-4 border-t-2">
                                        {(offer.status === 'pending' || offer.status === 'draft') && (
                                            <div className="flex flex-col gap-2 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="termsAccepted"
                                                        checked={termsAccepted}
                                                        onChange={() => handelTermsAccepted()}
                                                        className="w-5 h-5 text-blue-600 form-checkbox"
                                                    />
                                                    <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700 font-Inter">
                                                        Yes, I understand and agree to the{" "}
                                                        <a
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href="/terms-service"
                                                            className="text-blue-600 underline">
                                                            AI Geeks Term of Service
                                                        </a>
                                                        , including the{" "}
                                                        <a
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href="/user-agreement"
                                                            className="text-blue-600 underline">
                                                            User Agreement
                                                        </a>{" "}
                                                        and{" "}
                                                        <a
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href="/privacy-policy"
                                                            className="text-blue-600 underline">
                                                            Privacy Policy
                                                        </a>
                                                        .
                                                    </label>
                                                </div>

                                                <div className="flex flex-col justify-end gap-4 sm:gap-1 sm:mt-10 sm:flex-row">
                                                    <Link
                                                        href={route('client.offer.delete', offer.id)}
                                                        type="button"
                                                        disabled={processing}
                                                        className="px-16 py-1 text-center text-black border border-gray-300 hover:bg-primaryBtnColor hover:text-white rounded-3xl"
                                                    >
                                                        Cancel
                                                    </Link>
                                                    <button
                                                        onClick={() => handelSubmit()}
                                                        disabled={processing || !termsAccepted}
                                                        className={`px-16 py-1 text-white border   rounded-3xl ${!termsAccepted ? 'bg-gray-300 ' : 'bg-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColorHover '}`}
                                                    >
                                                        Continue
                                                    </button>
                                                </div>


                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full p-4 space-y-3 lg:border-l-2 lg:w-1/4">
                                    <div className="flex px-2 ">
                                        <div className="relative flex items-start w-24 gap-1 mr-5">
                                            <div className={`absolute w-3 h-3  rounded-full left-1 top-1 ring-2 ring-white ${proposal?.freelancer?.active_status ? "bg-green-500" : "bg-red-500"}`}></div>
                                            <img
                                                className="w-[60px] h-[60px] rounded-full"
                                                src={proposal?.freelancer?.avatar}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full gap-4 sm:flex-row">
                                            <div className="flex flex-col gap-2 text-start">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xl font-semibold font-Inter ">{proposal?.freelancer?.full_name}</span>
                                                    <div className="flex flex-col gap-2 text-sm font-medium text-textSecondary">
                                                        <span className="text-sm font-semibold ">{proposal?.freelancer?.meta_data?.title || 'Title not updated'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full gap-4">
                                        <div className="flex flex-col w-full gap-4 sm:flex-row">
                                            <div className="flex flex-col gap-2 text-start">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1 text-sm font-medium text-textSecondary">
                                                        <span className="text-base font-semibold text-black ">{proposal?.freelancer?.country}</span>
                                                        <span className="text-base font-semibold ">{proposal?.freelancer?.user_country_time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999ZM3.5519 11.9999C3.5519 16.6656 7.3342 20.4479 11.9999 20.4479C16.6656 20.4479 20.4479 16.6656 20.4479 11.9999C20.4479 7.3342 16.6656 3.5519 11.9999 3.5519C7.3342 3.5519 3.5519 7.3342 3.5519 11.9999Z" fill="#D9D9D9" />
                                                    <path d="M11.9999 2.9759C11.9999 2.65779 12.258 2.3981 12.5756 2.41718C13.6394 2.48108 14.6866 2.72179 15.6737 3.13066C16.8384 3.6131 17.8967 4.32024 18.7881 5.21168C19.6796 6.10312 20.3867 7.16142 20.8691 8.32614C21.3516 9.49087 21.5999 10.7392 21.5999 11.9999C21.5999 13.2606 21.3516 14.5089 20.8691 15.6737C20.3867 16.8384 19.6796 17.8967 18.7881 18.7881C17.8967 19.6796 16.8384 20.3867 15.6737 20.8691C14.6866 21.278 13.6394 21.5187 12.5756 21.5826C12.258 21.6017 11.9999 21.342 11.9999 21.0239C11.9999 20.7058 12.2581 20.4499 12.5755 20.4283C13.4879 20.366 14.3855 20.1558 15.2328 19.8048C16.2578 19.3803 17.1891 18.758 17.9735 17.9735C18.758 17.1891 19.3803 16.2578 19.8048 15.2328C20.2294 14.2079 20.4479 13.1093 20.4479 11.9999C20.4479 10.8905 20.2294 9.79195 19.8048 8.76699C19.3803 7.74204 18.758 6.81073 17.9735 6.02627C17.1891 5.2418 16.2578 4.61952 15.2328 4.19497C14.3855 3.844 13.4879 3.63384 12.5755 3.57153C12.2581 3.54986 11.9999 3.29402 11.9999 2.9759Z" fill="#004AAD" />
                                                    <path d="M16.0969 20.0404C16.2414 20.3238 16.1293 20.6724 15.8377 20.7996C14.8608 21.2256 13.8185 21.4865 12.7533 21.5704C11.4965 21.6693 10.2326 21.5197 9.03357 21.1301C7.83459 20.7405 6.72407 20.1186 5.76544 19.2999C4.8068 18.4811 4.01882 17.4815 3.44648 16.3583C2.87413 15.235 2.52864 14.01 2.42973 12.7532C2.33082 11.4964 2.48042 10.2324 2.87 9.03339C3.25957 7.83441 3.88149 6.72389 4.70024 5.76526C5.39413 4.95281 6.21789 4.26294 7.13676 3.72303C7.41103 3.56187 7.75891 3.67607 7.90333 3.95952C8.04775 4.24296 7.93386 4.58813 7.66091 4.75152C6.8762 5.22128 6.17185 5.81604 5.57623 6.51342C4.85573 7.35702 4.30844 8.33427 3.96561 9.38938C3.62279 10.4445 3.49114 11.5568 3.57818 12.6628C3.66522 13.7688 3.96926 14.8468 4.47292 15.8353C4.97658 16.8238 5.67 17.7034 6.5136 18.4239C7.3572 19.1444 8.33445 19.6917 9.38956 20.0345C10.4447 20.3773 11.557 20.509 12.663 20.4219C13.5773 20.35 14.4724 20.1297 15.3137 19.771C15.6063 19.6462 15.9525 19.757 16.0969 20.0404Z" fill="#004AAD" />
                                                    <path d="M7.03609 7.94495L9.40961 10.033L11.5243 7.4298C11.5835 7.35703 11.6583 7.29855 11.7433 7.25871C11.8283 7.21888 11.9211 7.19872 12.0149 7.19974C12.1088 7.20076 12.2012 7.22293 12.2852 7.2646C12.3693 7.30627 12.4429 7.36636 12.5005 7.44041L14.5185 10.0323L16.9687 7.91439C17.0649 7.83139 17.1842 7.77975 17.3106 7.76638C17.437 7.75302 17.5644 7.77857 17.6759 7.83961C17.7874 7.90065 17.8775 7.99428 17.9343 8.10795C17.9911 8.22163 18.0118 8.34993 17.9936 8.47569L17.0579 14.9287H6.95686L6.00683 8.505C5.98796 8.37854 6.00842 8.24934 6.06544 8.1349C6.12245 8.02045 6.21328 7.92629 6.3256 7.86518C6.43792 7.80406 6.56632 7.77893 6.69341 7.7932C6.82049 7.80747 6.94012 7.86044 7.03609 7.94495ZM7.00552 15.5524H16.9862V16.176C16.9862 16.3415 16.9205 16.5001 16.8035 16.617C16.6865 16.734 16.5278 16.7997 16.3624 16.7997H7.62931C7.46387 16.7997 7.30521 16.734 7.18822 16.617C7.07124 16.5001 7.00552 16.3415 7.00552 16.176V15.5524Z" fill="#004AAD" />
                                                </svg>
                                                <span className="text-base font-semibold ">{proposal?.freelancer?.job_success}% Job Success</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
