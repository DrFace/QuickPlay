import AboutClient from "@/Components/elements/about/AboutClient";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import MilestoneTable from "@/Components/shared/partials/MilestoneTable";
import SkillWidget from "@/Components/shared/partials/SkillWidget";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function FreelancerProposalShow(
    {
        proposal
    }: {
        proposal: any
    }) {

        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleWithdrawClick = () => {
            setIsModalOpen(true);
        };
        const handleModalClose = () => {
            setIsModalOpen(false);
        };

        const handleConfirmWithdraw = () => {
            router.visit(route('freelancer.proposals.destroy', proposal.id), {
                method: 'post',
                onSuccess: () => {
                    setIsModalOpen(false);
                    router.visit(route('freelancer.proposals.index'));
                },
                onError: () => {
                    alert("An error occurred while withdrawing the proposal. Please try again.");
                },
            });
        };

   // console.log("proposal", proposal);
    return (
        <>
            <AppLayout isFreelancerHeader={true} isHeader={false}>
                <Head title="Proposal" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 sm:px-6 lg:px-8 ">
                    <div className="flex flex-col w-full ">

                        <div className="container flex flex-col gap-4 mx-auto item-center ">
                            <div className="mt-10 mb-4 text-4xl font-semibold text-black font-Inter">
                                <h1>Submitted Proposal</h1>
                            </div>

                            <div className="flex flex-col justify-between gap-8 md:flex-row">
                                {/* Job Details and Cover Letter */}
                                <div className="flex-grow space-y-8">
                                    {/* Job Details Card */}
                                    <div className="p-8 space-y-8 border border-gray-300 rounded-2xl">
                                        <div className="text-2xl font-semibold text-black">Job details</div>

                                        <div className="flex flex-col w-full gap-8 lg:flex-row">
                                            {/* Left Side: Job Details */}
                                            <div className="flex-grow space-y-6 lg:w-3/4">
                                                <div className="space-y-4">
                                                    <div className="text-xl font-semibold text-black">
                                                        {proposal.job.title}

                                                    </div>
                                                    <div className="flex flex-col justify-start gap-4 text-center sm:items-center sm:flex-row">
                                                        <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full">
                                                            {proposal.job.job_category}
                                                        </div>
                                                        <div className="text-xs font-semibold text-gray-500">Posted {proposal.job.created_at_human_ago}</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="text-base leading-relaxed text-black">
                                                        <DescriptionWidget description={proposal?.job?.description} id={proposal?.job?.id} title="" attachments={proposal?.job?.attachments} />
                                                    </div>
                                                </div>

                                                <Link
                                                    href={route('freelancer.applicant.show', proposal.job_post_id)}
                                                    className="font-medium text-blue-600 underline">View job posting</Link>
                                            </div>

                                            {/* Right Side: Additional Information */}
                                            <div className="w-full pl-6 space-y-6 border-gray-300 lg:border-l lg:w-1/4">
                                                <div className="flex flex-col gap-6 item lg:flex-col md:flex-row">
                                                    <div className="flex flex-row gap-3 lg:w-full md:w-1/3">
                                                        <img src="/assets/Icons/job/calendar.png" alt="attachment" className="w-7 h-7" />
                                                        <div>
                                                            <p className="text-base font-medium text-start font-Inter ">{proposal?.job?.scope_duration}</p>
                                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Project Length</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row gap-3 lg:w-full md:w-1/3 ">
                                                        <img src="/assets/Icons/freelancer/people-circle.png" alt="attachment" className="w-7 h-7" />
                                                        <div>
                                                            <p className="text-base font-medium text-start font-Inter ">{proposal?.job?.scope_experience}</p>
                                                            {proposal?.job?.scope_experience === "Entry" ? (
                                                                <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for some one relatively new to field</p>
                                                            ) : proposal?.job?.scope_experience === "Intermediate" ? (
                                                                <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for substantial experience in this field</p>
                                                            ) : (
                                                                <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for comprehensive and deep expertise in this field</p>
                                                            )}

                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row gap-3 lg:w-full md:w-1/3 ">
                                                        <img src="/assets/Icons/freelancer/cash.png" alt="attachment" className="w-7 h-7" />
                                                        <div>
                                                            <p className="text-base font-medium text-start font-Inter">$ {parseFloat(proposal?.job?.budget).toFixed(2)}</p>
                                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Fixed price</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                        <div className="p-6 space-y-6 border-gray-300 border-y">
                                            <SkillWidget skills={proposal?.job?.skill_list} title="Skill and expertise" />
                                        </div>

                                        <div className='flex flex-col w-full gap-4 py-4 sm:px-4 '>

                                            <div className="pt-6 space-y-6 ">
                                                <div className="text-2xl font-semibold text-black">Proposal Details</div>
                                                <div className='flex flex-col w-full gap-1 '>
                                                    <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
                                                        <div className="w-full sm:w-2/3 ">
                                                            <span className='text-sm font-semibold'>Bid</span>
                                                            <p className='text-xs text-textSecondary'>Total amount the client will see on your proposal.</p>
                                                        </div>
                                                        <div className='flex flex-col items-end justify-end w-full gap-2 sm:justify-center sm:w-1/3 sm:col-span-2'>
                                                            <div className='flex flex-row items-center gap-2 '>
                                                                <span className="text-lg font-semibold text-black">$</span>
                                                                <span className="text-lg font-semibold text-black">{proposal.bid_amount}</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col gap-1 py-4 border-y-2'>
                                                        <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
                                                            <div className="w-full sm:w-2/3 ">
                                                                <span className='text-sm font-semibold'>10% Freelancer Service Fee</span>
                                                            </div>

                                                            <div className='flex flex-col items-end justify-end w-full gap-2 sm:justify-center sm:w-1/3 sm:col-span-2'>
                                                                <div className='flex flex-row items-center gap-2 '>
                                                                    <span className="text-lg font-semibold text-black">$</span>

                                                                    <span className="text-lg font-semibold text-black">{proposal.service_fee}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className='flex flex-col gap-1'>
                                                        <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
                                                            <div className="w-full sm:w-2/3 ">
                                                                <span className='text-sm font-semibold'>You’ll Receive</span>
                                                                <p className='text-xs text-textSecondary'>Your estimated payment, after service fees.</p>
                                                            </div>
                                                            <div className='flex flex-col items-end justify-end w-full gap-2 sm:justify-center sm:w-1/3 sm:col-span-2'>
                                                                <div className='flex flex-row items-center gap-2 '>
                                                                    <span className="text-lg font-semibold text-black">$</span>
                                                                    <span className="text-lg font-semibold text-black">{proposal.receive_amount}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {proposal.paid_type === 'by_milestone' && (
                                                <div className="py-2 space-y-6">
                                                    <div className="text-2xl font-semibold text-black">Milestones</div>
                                                    <MilestoneTable milestones={proposal?.milestones} status={false} />
                                                </div>
                                            )}
                                            {/* Cover Letter */}
                                            <div className="py-2 space-y-6">
                                                <div className="text-2xl font-semibold text-black">Cover letter</div>
                                                <div className="text-base leading-relaxed text-black">
                                                    <DescriptionWidget title="" description={proposal.description} id={proposal?.id} attachments={proposal?.attachments} />
                                                </div>
                                            </div>

                                            {proposal?.proposal_status === 'submitted' ?

                                                <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row sm:justify-end sm:gap-5">
                                                    <Link
                                                        href={route('freelancer.proposals.edit', proposal?.id)}
                                                        className="w-full px-6 py-3 font-medium text-center text-white bg-blue-800 rounded-full sm:w-auto sm:px-8">
                                                        Change Terms
                                                    </Link>
                                                    <button
                                                    onClick={handleWithdrawClick} // Open modal on click
                                                    className="w-full px-6 py-3 font-medium text-center text-blue-800 border-2 border-blue-800 rounded-full sm:w-auto sm:px-8">
                                                    Withdraw Proposal
                                                </button>
                                                </div>
                                                :
                                                <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row sm:justify-end sm:gap-5">
                                                    <Link
                                                        href={route('freelancer.offer.show', proposal?.offer_id)}
                                                        className="w-full px-6 py-3 font-medium text-center text-white bg-blue-800 rounded-full sm:w-auto sm:px-8">
                                                        View Offer
                                                    </Link>
                                                </div>
                                            }


                                        </div>


                                    </div>
                                </div>

                                {/* About the Client */}
                                <div className="w-full pl-2 space-y-6 lg:w-1/3">
                                    {/* <div className="flex flex-col gap-3 py-8">
                                        <h2 className="text-xl font-semibold text-start font-Inter ">About the client</h2>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row gap-1">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.00264 1.50049C4.41779 1.50049 1.50122 4.41706 1.50122 8.0019C1.50122 11.5867 4.41779 14.5033 8.00264 14.5033C11.5875 14.5033 14.5041 11.5867 14.5041 8.0019C14.5041 4.41706 11.5875 1.50049 8.00264 1.50049ZM11.3862 5.82299L7.18527 10.8241C7.13919 10.879 7.08185 10.9233 7.01714 10.9541C6.95242 10.9849 6.88185 11.0014 6.81019 11.0026H6.80175C6.73165 11.0025 6.66234 10.9878 6.59832 10.9592C6.53429 10.9307 6.47698 10.889 6.43011 10.8369L4.62971 8.83646C4.58399 8.78797 4.54842 8.73082 4.5251 8.66838C4.50178 8.60594 4.49117 8.53947 4.49391 8.47288C4.49664 8.40628 4.51266 8.3409 4.54102 8.28058C4.56938 8.22027 4.60951 8.16623 4.65906 8.12164C4.7086 8.07706 4.76656 8.04282 4.82952 8.02096C4.89248 7.99909 4.95918 7.99003 5.0257 7.99431C5.09221 7.99859 5.1572 8.01612 5.21684 8.04587C5.27648 8.07562 5.32958 8.117 5.373 8.16757L6.78862 9.74041L10.6204 5.17973C10.7063 5.08036 10.8279 5.0188 10.9589 5.00836C11.0899 4.99793 11.2197 5.03945 11.3203 5.12395C11.4209 5.20846 11.4842 5.32916 11.4965 5.45997C11.5089 5.59078 11.4692 5.72118 11.3862 5.82299Z" fill="#004AAD" />
                                                </svg>
                                                <p className="text-xs font-medium text-textSecondary text-start font-Inter ">Payment verified</p>
                                            </div>
                                            <div className="flex flex-row items-center justify-start gap-1 ">
                                                <Rating
                                                    initialValue={4.5}
                                                    readonly
                                                    transition
                                                    allowFraction
                                                    //showTooltip
                                                    //tooltipArray={tooltipArray}
                                                    fillColorArray={fillColorArray}
                                                    iconsCount={5}
                                                    size={20}
                                                    emptyStyle={{ display: "flex" }}
                                                    fillStyle={{
                                                        display: "-webkit-inline-box",
                                                    }}
                                                />
                                                <span className="mt-1.5 text-xs font-medium text-textSecondary text-start font-Inter ">
                                                    4.5
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-textSecondary text-start font-Inter ">4.5 of 33 reviews</p>
                                            </div>

                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-textSecondary text-start font-Inter ">United Kingdom</p>
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">London 10:09 AM</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-textSecondary text-start font-Inter ">52 jobs posted</p>
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">85% hire rate, 1 open job</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-textSecondary text-start font-Inter ">$2.1k total spent</p>
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">48 hires, 2 active</p>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <p className="text-xs font-normal text-textSecondary text-start font-Inter ">Member since Mar 23, 2024</p>
                                        </div>

                                    </div> */}
                                    <AboutClient user={proposal?.job?.client} />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleConfirmWithdraw}
                />
            </AppLayout>
        </>
    );
}
