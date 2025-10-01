import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import RadioButton from "@/Components/elements/inputs/RadioButton";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import MilestonesForm from "./Partials/MilestonesForm";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import InputError from "@/Components/elements/inputs/InputError";
import AiTipsComponent from "./Partials/AiTipsComponent";

import TextInput from "@/Components/elements/inputs/TextInput";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import SkillWidget from "@/Components/shared/partials/SkillWidget";
import FileUpload from "@/Components/shared/partials/FileUpload";

export default function CreateProposal(
    {
        job,
        type,
        user,
        proposal,
    }: {
        job: any;
        user: any;
        type: string;
        proposal: any;
    }
) {

    const [paidType, setPaidType] = useState<string>(proposal?.paid_type === "by_project" ? "Project" : "Milestone");
    const [milestones, setMilestones] = useState(proposal?.milestones_formatted ?? [{ description: '', dueDate: new Date().toISOString().split('T')[0], amount: '' }]);
    const [milestonesErrors, setMilestonesErrors] = useState<any>({});
    const [milestonesError, setMilestonesError] = useState<boolean>(false);
    const [connectsError, setConnectsError] = useState<boolean>(false);
    const errorConnectsRef = useRef<HTMLDivElement>(null); // Create a ref
    const errorMilestonesRef = useRef<HTMLDivElement>(null); // Create a ref

    const durations = [
        { value: '1', label: '1 day' },
        { value: '2', label: '2 days' },
        { value: '3', label: '3 days' },
        { value: '4', label: '4 days' },
        { value: '5', label: '5 days' },
        { value: '6', label: '6 days' },
        { value: '7', label: '7 days' },
        { value: '14', label: '2 weeks' },
        { value: '21', label: '3 weeks' },
        { value: '30', label: '1 month' },
        { value: '60', label: '2 months' },
        { value: '90', label: '3 months' },
        { value: '180', label: '6 months' },
        { value: '210', label: '7 months' },
        { value: '240', label: '8 months' },
        { value: '270', label: '9 months' },
        { value: '300', label: '10 months' },
        { value: '330', label: '11 months', },
        { value: '365', label: '1 year' },
    ];

    const { setData, post, data, errors } = useForm({
        job_id: job.id,
        milestones: proposal?.milestones_formatted ?? [{ description: '', dueDate: '', amount: '' }],
        paidType: paidType,
        duration: proposal?.duration || '',
        attachments: proposal?.attachments || [],
        description: proposal?.description || '',
        bid_amount: proposal?.bid_amount || '',
        service_fee: proposal?.service_fee || '',
        amount_received: proposal?.amount_received || '',
        type: type,

    });

    const handlePaidTypeChange = (value: string) => {
        setPaidType(value);
        setData('paidType', value);
        // if (value === "Project") {
        //     setData('bid_amount', '');
        //     setData('service_fee', '');
        //     setData('amount_received', '');
        // }
        // else {
        //   setData('milestones', [{ description: '', dueDate: '', amount: '' }]);
        //   setMilestonesErrors({});
        //   setMilestonesError(false);
        //   setConnectsError(false);
        // }

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        {

            if (validateMilestones() || paidType === "Project") {
                post(route('freelancer.proposals.store', job.id),
                    {
                        preserveScroll: true,
                        onSuccess: (e: any) => {
                            if (e.props.flash.error === "You do not have enough connects to submit a proposal") {
                                setConnectsError(true);
                            }
                        },
                    }
                );


            }
        }
    };

    const setDescription = (value: string) => {
        setData("description", value);
    };

    // Handle changes to the bid_amount input
    const handleBidAmountChange = (e: any) => {
        // Get the input value and convert to a number
        const bidAmount = e.target.value;

        // Update bid_amount in state
        setData((prevData) => ({
            ...prevData,
            bid_amount: bidAmount, // Update with raw value
        }));

        if (bidAmount) {
            const numericBidAmount = parseFloat(bidAmount) || 0;
            // Calculate service fee and amount received
            const serviceFee = numericBidAmount * 0.1; // 20% service fee
            const amountReceived = numericBidAmount - serviceFee;

            // Update service_fee and amount_received in state
            setData((prevData) => ({
                ...prevData,
                service_fee: serviceFee.toFixed(2),
                amount_received: amountReceived.toFixed(2),
            }));
        } else {
            // If bidAmount is empty, clear the calculated fields
            setData((prevData) => ({
                ...prevData,
                service_fee: '',
                amount_received: '',
            }));
        }
    };
    // Effect to recalculate values when bid_amount changes
    useEffect(() => {

        // Recalculate values based on bid_amount
        const bidAmount = parseFloat(data.bid_amount) || 0;
        const serviceFee = bidAmount * 0.1; // 10% service fee
        const amountReceived = bidAmount - serviceFee;

        setData((prevData) => ({
            ...prevData,
            service_fee: serviceFee.toFixed(2),
            amount_received: amountReceived.toFixed(2),
        }));

    }, [data.bid_amount, paidType]);


    useEffect(() => {
        if (connectsError && errorConnectsRef.current) {
            errorConnectsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            //alert("You do not have enough connects to submit a proposal");
        }

        else if (milestonesError && errorMilestonesRef.current) {
            errorMilestonesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            //alert("Please fill in all the required fields");
        }
        else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    }, [connectsError, milestonesErrors]);


   // console.log("proposal", proposal?.milestones_formatted);
   // console.log("job", job);
   // console.log("error", errors);



    return (
        <>
            <AppLayout isFreelancerHeader={true} isHeader={false}>
                <Head title="Freelancer" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto item-center ">
                        <div className="flex flex-col w-full ">
                            <div className="mt-10 mb-8 text-3xl font-semibold text-black sm:text-4xl font-Inter">
                                <h1>Submit a Proposal</h1>
                            </div>
                            <form onSubmit={submit} className="flex flex-col gap-8">
                                <div ref={errorConnectsRef} className="flex flex-col justify-start border border-gray-300 p-7 gap-2.5 rounded-2xl">
                                    <h1 className="text-xl font-medium font-Inter">Proposal settings</h1>
                                    <p className="text-xs font-medium font-Inter">This proposal requires <span className="font-bold">15 Connects</span> </p>
                                    {connectsError &&
                                        <span className="text-xs font-medium text-red-500 font-Inter">Insufficient connects to submit proposal for the job.</span>
                                    }
                                </div>
                                <div className="p-4 space-y-8 border border-gray-300 sm:p-8 rounded-2xl">
                                    <div className="flex flex-col gap-8 lg:flex-row">
                                        {/* Left Side: Job Details */}
                                        <div className="flex-grow w-full space-y-5 lg:w-3/4">
                                            <div className="text-2xl font-semibold text-black">Job details</div>

                                            <div className="space-y-4">
                                                <div className="text-xl font-semibold text-black">{job?.title}</div>
                                                <div className="flex flex-col items-start gap-2 sm:gap-4 sm:items-center sm:flex-row">
                                                    <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full">
                                                        {job?.job_category}
                                                    </div>
                                                    <div className="pl-4 text-xs font-semibold text-gray-500 sm:pl-0">Posted {job?.created_at_human}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="text-base leading-relaxed text-black">
                                                    <DescriptionWidget description={job?.description} id={job?.id} title="" attachments={job?.attachments} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full pl-6 space-y-6 border-gray-300 lg:border-l lg:w-1/4">
                                            <div className="flex flex-col gap-6 item lg:flex-col md:flex-row">
                                                <div className="flex flex-row gap-3 lg:w-full md:w-1/3">
                                                    <img src="/assets/Icons/job/calendar.png" alt="attachment" className="w-7 h-7" />
                                                    <div>
                                                        <p className="text-base font-medium text-start font-Inter ">{job?.scope_duration}</p>
                                                        <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Project Length</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-3 lg:w-full md:w-1/3 ">
                                                    <img src="/assets/Icons/freelancer/people-circle.png" alt="attachment" className="w-7 h-7" />
                                                    <div>
                                                        <p className="text-base font-medium text-start font-Inter ">{job?.scope_experience}</p>
                                                        {job?.scope_experience === "Entry" ? (
                                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for some one relatively new to field</p>
                                                        ) : job?.scope_experience === "Intermediate" ? (
                                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for substantial experience in this field</p>
                                                        ) : (
                                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for comprehensive and deep expertise in this field</p>
                                                        )}

                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-3 lg:w-full md:w-1/3 ">
                                                    <img src="/assets/Icons/freelancer/cash.png" alt="attachment" className="w-7 h-7" />
                                                    <div>
                                                        <p className="text-base font-medium text-start font-Inter">$ {parseFloat(job?.budget).toFixed(2)}</p>
                                                        <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Fixed price</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 space-y-6 border-t border-gray-300">
                                        <SkillWidget skills={job?.skill_list} title="Skills and expertise" />
                                    </div>
                                </div>
                                <div className="p-4 space-y-8 border border-gray-300 sm:p-8 rounded-2xl">
                                    <div className="flex-grow space-y-3">
                                        <div className="text-2xl font-semibold text-black">Terms</div>
                                        <div className="px-2 space-y-2">
                                            <div className="text-lg font-semibold text-black">How do you want to be paid?</div>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-4">
                                                    <RadioButton
                                                        label=""
                                                        value="Milestone"
                                                        selectedValue={paidType}
                                                        onChange={() => handlePaidTypeChange("Milestone")}
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <h2 className="text-lg font-semibold">By milestone</h2>
                                                        <p className="text-xs text-textSecondary">
                                                            Divide the project into smaller segments, called milestones. You'll be paid for milestones as they are completed and approved.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <RadioButton
                                                        label=""
                                                        value="Project"
                                                        selectedValue={paidType}
                                                        onChange={() => handlePaidTypeChange("Project")}
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <h2 className="text-lg font-semibold">By project</h2>
                                                        <p className="text-xs text-textSecondary">
                                                            Get your entire payment at the end, when all work has been delivered.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {paidType === "Milestone" ? (
                                            <div ref={errorMilestonesRef} className="px-2 space-y-2">
                                                <div className="text-lg font-semibold text-black">How many milestones do you want to include?</div>
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col w-full gap-1">
                                                            <MilestonesForm
                                                                milestones={milestones}
                                                                onMilestonesChange={handleMilestonesChange}
                                                                errors={milestonesErrors}
                                                                setData={setData}
                                                                error={errors}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) :
                                            (
                                                <div className="px-2 space-y-2">
                                                    <div className="text-lg font-semibold text-black">How much do you want to be paid for the project?</div>
                                                    <div className="flex flex-col gap-4">
                                                        {/* Pricing Summary Section */}
                                                        <div className='flex flex-col justify-end gap-4 mt-4 border-t-2 sm:flex-row'>
                                                            <div className='flex flex-col items-center justify-center w-full gap-4 py-4 sm:w-1/3'>
                                                                <div className="flex items-center justify-center w-24 h-28">
                                                                    <img src="/assets/Icons/freelancer/price.png" alt="Price Icon" className="w-24 h-28" />
                                                                </div>
                                                                <div className='flex flex-col items-center justify-center gap-1'>
                                                                    <span className='text-xs text-textSecondary'>Includes AI Geeks Fixed-Price Protection.</span>
                                                                    <h3 className='text-sm font-semibold underline text-primaryBtnColorHover'>Learn more</h3>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col w-full gap-4 py-4 sm:w-2/3'>
                                                                <div className='flex flex-col gap-1'>
                                                                    <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
                                                                        <div className="w-full sm:w-2/3 ">
                                                                            <InputLabel required className='text-sm font-semibold'>Bid</InputLabel>
                                                                            <p className='text-xs text-textSecondary'>Total amount the client will see on your proposal.</p>
                                                                        </div>
                                                                        <div className='flex flex-col items-end justify-end w-full gap-2 sm:justify-center sm:w-1/3 sm:col-span-2'>
                                                                            <div className='flex flex-row items-center gap-2 '>
                                                                                <span className="text-lg font-semibold text-black">$</span>
                                                                                <TextInput
                                                                                    type="number"
                                                                                    name="bid_amount"
                                                                                    placeholder="$0.00"
                                                                                    //min="0"
                                                                                    value={data.bid_amount}
                                                                                    onChange={handleBidAmountChange}
                                                                                    className='w-full shadow-none'
                                                                                    onWheel={(e) => e.currentTarget.blur()}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                                                            e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <InputError message={errors.bid_amount} className="mt-2" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='flex flex-col gap-1 py-4 border-y-2'>
                                                                    <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
                                                                        <div className="w-full sm:w-2/3 ">
                                                                            <InputLabel required className='text-sm font-semibold'>10% Freelancer Service Fee</InputLabel>
                                                                        </div>

                                                                        <div className='flex flex-col items-end justify-end w-full gap-2 sm:justify-center sm:w-1/3 sm:col-span-2'>
                                                                            <div className='flex flex-row items-center gap-2 '>
                                                                                <span className="text-lg font-semibold text-black">$</span>

                                                                                <TextInput
                                                                                    type="number"
                                                                                    name="service_fee"
                                                                                    placeholder="$0.00"
                                                                                    disabled={true}
                                                                                    value={data.service_fee}
                                                                                    className='w-full bg-slate-200'
                                                                                    onWheel={(e) => e.currentTarget.blur()}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                                                            e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className='flex flex-col gap-1'>
                                                                    <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
                                                                        <div className="w-full sm:w-2/3 ">
                                                                            <InputLabel required className='text-sm font-semibold'>You’ll Receive</InputLabel>
                                                                            <p className='text-xs text-textSecondary'>Your estimated payment, after service fees.</p>
                                                                        </div>
                                                                        <div className='flex flex-col items-end justify-end w-full gap-2 sm:justify-center sm:w-1/3 sm:col-span-2'>
                                                                            <div className='flex flex-row items-center gap-2 '>
                                                                            <span className="text-lg font-semibold text-black">$</span>
                                                                            <TextInput
                                                                                type="number"
                                                                                name="amount_received"
                                                                                placeholder="$0.00"
                                                                                disabled={true}
                                                                                value={data.amount_received}
                                                                                className='w-full bg-slate-200'
                                                                                onWheel={(e) => e.currentTarget.blur()}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                                                        e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                                                                    }
                                                                                }}
                                                                            />
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="p-4 space-y-8 border border-gray-300 sm:p-8 rounded-2xl">
                                    <div className="w-full md:w-1/2 lg:w-1/3">
                                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="duration" value="How long will this project take ?" />
                                        <SelectInput
                                            className="block w-full mt-2 placeholder:text-sm font-Inter"
                                            options={durations}
                                            placeholder="Select a duration"
                                            //disabled={jobPost.status === 'active'}
                                            selectedOption={durations.filter(
                                                (obj: any) => {
                                                    return obj.value === data.duration;
                                                }
                                            )}
                                            setData={(e: any) => setData("duration", e)}
                                        />
                                        <InputError message={errors.duration} className="mt-2" />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <AiTipsComponent
                                        setDescription={setDescription}
                                        descriptionText={data.description}
                                    />
                                    <InputError message={errors.description} className="mt-0" />
                                </div>
                                <div className="w-full sm:mt-4">
                                    <h2 className="text-lg font-bold text-black font-Inter" >Attachments</h2>
                                    <FileUpload
                                        setData={setData}
                                        attachmentFilePath={data?.attachments}
                                        type={type}
                                    />

                                    <span className="text-xs font-normal text-textSecondary font-Inter">Max file size: 100 MB</span>
                                    <InputError message={errors.attachments} className="mt-2" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <button type="submit" className="px-6 py-2 text-white rounded-3xl bg-primaryBtnColor hover:bg-primaryBtnColorHover ">
                                        {type === "edit" ? "Update Proposal" : " Send for 15 Credits"}

                                    </button>
                                    <Link href={route('freelancer.dashboard')} className="px-6 py-2 text-sm font-medium border-2 rounded-3xl text-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}



