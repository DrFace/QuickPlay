import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { CheckIcon } from '@heroicons/react/20/solid'
import { DivideIcon, FolderArrowDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ProjectUploadModal from "./Partials/ProjectUploadModal";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import AboutClient from "@/Components/elements/about/AboutClient";


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function OfferView({
    offer,
    user,
    project,
    review,
    completeMilestone,
    pendingMilestone,
    currentMilestone,
    recentActivity,
}: {
    offer: any;
    user: any;
    project: any;
    review: any;
    completeMilestone: any;
    pendingMilestone: any;
    currentMilestone: any;
    recentActivity: any;
}) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenNew, setIsModalOpenNew] = useState(false);
    const timeline = [
        {
            id: 1,
            title: 'Start of Project',
            content: 'Navin M is actively working on the project at this time.',
            status: 'completed',
        },
        {
            id: 2,
            title: 'Complete the work',
            content: 'Successfully initiated the project.',
            status: project?.status === 'completed' ? 'completed' : 'current',
        },
        {
            id: 3,
            title: 'Review the work',
            content: 'Completed phone screening with',
            status: review?.status === 'draft' ? 'current' : review?.status === 'submitted' ? 'completed' : 'upcoming',
        },
        {
            id: 4,
            title: 'Project Complete',
            content: 'Advanced to interview by',
            status: review?.status === 'submitted' ? 'completed' : 'upcoming',
        },

    ]

    // Define the start, review, and end milestones
    const milestoneLength = completeMilestone.length + pendingMilestone.length + 3;
    const startMilestone = { id: 1, title: 'Start of Project', type: 'start', status: 'completed' };
    const reviewMilestone = { id: milestoneLength, title: 'Review the work', type: 'review', status: review?.status == 'draft' ? 'current' : review?.status === 'submitted' ? 'completed' : 'upcoming' };
    const endMilestone = { id: (milestoneLength + 1), title: 'Project Complete', type: 'end', status: review?.status === 'submitted' ? 'completed' : 'upcoming' };

    // Create the new milestoneTimeline array in the required order
    const milestoneTimeline = [
        startMilestone,
        ...completeMilestone?.map((milestone: any, idx: any) => ({
            id: idx + 2,
            title: milestone?.title || 'Milestone Complete',
            type: 'milestone',
            attachment: milestone?.attachments,
            date: milestone?.due_date_human,
            status: 'completed',
        })),
        ...(currentMilestone
            ? [{
                id: completeMilestone?.length + 2,
                title: currentMilestone?.title || 'Complete the milestone',
                type: 'milestone',
                attachment: currentMilestone?.attachments,
                date: currentMilestone?.due_date_human,
                status: 'current',
            }]
            : []
        ),
        ...pendingMilestone.map((milestone: any, idx: any) => ({
            id: completeMilestone?.length + 3 + idx,  // Adjust ID as needed
            title: milestone?.title || 'Upcoming milestone',
            type: 'milestone',
            attachment: milestone?.attachments,
            date: milestone?.due_date_human,
            status: 'upcoming',
        })),
        reviewMilestone,                             // Review milestone
        endMilestone                                 // End milestone
    ];


    const handleDownload = (file: any) => {
        const link = document.createElement('a');
        link.href = file.path_url;
        link.download = file.file_name;
        link.click();
    }


    // console.log('offer', offer);
    // console.log('project', project);
    // console.log('currentMilestone', currentMilestone);
    // console.log('milestoneTimeline', milestoneTimeline);
    // console.log('completeMilestone', completeMilestone);
    // console.log('pendingMilestone', pendingMilestone);

    return (
        <>
            <AppLayout isFreelancerHeader={true} isHeader={false}>
                <Head title="Contract View" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto mt-8 text-center ">
                        <h1 className="text-2xl font-medium first-letter:capitalize text-start font-Inter ">{offer?.contract_title}</h1>
                        {/* panel */}
                        <div className="flex flex-col w-full gap-3 lg:flex-row">
                            <div className="flex flex-col w-full gap-8 lg:w-2/3">
                                <div className="flex flex-col w-full p-4 border-2 border-gray-200 sm:gap-4 rounded-2xl">
                                    <h1 className="py-5 text-xl font-bold first-letter:capitalize text-start font-Inter ">Project Timeline</h1>
                                    {offer?.payment_type == 'Project' &&
                                        <div className="flow-root">
                                            <ul role="list" className="-mb-8">
                                                {timeline.map((event, eventIdx) => (
                                                    <li key={event.id}>
                                                        <div className="relative pb-8">
                                                            {eventIdx !== timeline.length - 1 ? (
                                                                <span aria-hidden="true" className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${event.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                            ) : null}
                                                            <div className="relative flex space-x-3">
                                                                <div>
                                                                    <span
                                                                        className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${event.status === 'completed' ? 'border-2 border-blue-500 bg-blue-500' : event.status === 'current' ? 'border-2 border-blue-500 bg-white' : 'border-2 border-gray-200 bg-white'} `}
                                                                    >
                                                                        {event.status === 'completed' ? (
                                                                            <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                                                        ) : (
                                                                            <span className={`flex  items-center justify-center  ${event.status === 'current' ? 'text-blue-600 ' : 'text-black'} `}>
                                                                                {event.id}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex lg:pl-10">
                                                                    <div className="flex flex-col justify-start gap-2">
                                                                        <h3 className="text-lg font-bold text-start font-Inter">
                                                                            {event.title}
                                                                        </h3>
                                                                        {event?.id === 1 ?
                                                                            event?.status === 'completed' ?
                                                                                <div className="flex flex-col gap-1">
                                                                                    <p className="font-semibold text-left"><span className="font-bold text-blue-500 ">{offer?.user?.first_name}</span> is fully funded for this project.</p>
                                                                                    <span className="font-bold text-left">Payment : $ {offer?.offer_price}</span>
                                                                                    <span className="text-xs font-bold text-left text-gray-400">{offer?.created_at_human}</span>
                                                                                </div>
                                                                                : event.status === 'current' ?
                                                                                    <p className="text-left"><span className="font-bold text-blue-500 ">{offer?.user?.first_name}</span> is actively working on the project at this time.</p>
                                                                                    : event.status === 'upcoming' ?
                                                                                        <p className="text-left">Phone screening with Nicolas.</p>
                                                                                        : null
                                                                            : event.id === 2 ?
                                                                                event.status === 'completed' ?
                                                                                    <p className="text-left">{offer?.user?.first_name} is satisfied with the work and has approved the project.</p>
                                                                                    : event.status === 'current' ?
                                                                                        <div className="flex flex-col gap-2">
                                                                                            <p className="text-left">You can submit your work for review to {offer?.user?.first_name}.</p>
                                                                                            {project?.attachments?.length > 0 ?
                                                                                                <div className="flex flex-row items-center justify-center gap-3 px-8 py-4 bg-blue-100 rounded-xl">
                                                                                                    <div className="flex flex-col gap-1">
                                                                                                        {project?.attachments?.map((attachment: any) => (
                                                                                                            <button
                                                                                                                type='button'
                                                                                                                className="flex flex-row items-center gap-4 text-start j"
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation();
                                                                                                                    handleDownload(attachment);
                                                                                                                }}
                                                                                                            >
                                                                                                                <div className="flex items-center justify-center rounded-full">
                                                                                                                    <FolderArrowDownIcon className="w-8 h-8 text-blue-500" />
                                                                                                                </div>
                                                                                                                <div className="flex flex-col gap-1">
                                                                                                                    <span className="text-base font-bold text-left text-primaryBtnColor">Submit Work</span>
                                                                                                                    <span className="text-xs font-semibold underline hover:text-primaryBtnColorHover text-primaryBtnColor">{attachment?.file_name}</span>
                                                                                                                    <span className="text-xs font-semibold text-gray-500">({(attachment?.size / (1024 * 1024)).toFixed(2)} MB)- {project?.updated_at_human}</span>
                                                                                                                </div>
                                                                                                            </button>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                                : null}
                                                                                            <span className="text-xs font-bold text-left text-gray-400">Submit before {offer?.due_date}</span>

                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => setIsModalOpen(true)}
                                                                                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                {project?.attachments?.length > 0 ? 'Re-upload Work' : 'Submit Work'}
                                                                                            </button>
                                                                                            {isModalOpen &&
                                                                                                <ProjectUploadModal onClose={() => setIsModalOpen(false)} id={project?.id} url={'freelancer.project.submit'} />
                                                                                            }
                                                                                        </div>

                                                                                        : event.status === 'upcoming' ?
                                                                                            <p className="text-left">Phone screening with Nicolas.</p>
                                                                                            : null
                                                                                : event.id === 3 ?
                                                                                    event.status === 'completed' ?
                                                                                        <p className="text-left">Feedback submit completed</p>
                                                                                        : event.status === 'current' ?
                                                                                            <div className="flex flex-col w-full gap-2">
                                                                                                <p className="text-left"> Give your review for the project and end contracts.</p>
                                                                                                <div className="flex " >
                                                                                                    <Link
                                                                                                        href={route('freelancer.contracts.review', offer.id)}
                                                                                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                        Review Work
                                                                                                    </Link>
                                                                                                </div>
                                                                                            </div>
                                                                                            : event.status === 'upcoming' ?
                                                                                                <p className="text-left">Yor can give feedback after {offer?.user?.first_name} accept the work.</p>
                                                                                                : null
                                                                                    : event.id === 4 ?
                                                                                        event.status === 'completed' ?
                                                                                            <p className="text-left">Project successfully completed.</p>
                                                                                            : event.status === 'upcoming' ?
                                                                                                <p className="text-left"></p>
                                                                                                : null
                                                                                        : null}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    }

                                    {offer?.payment_type === 'Milestone' &&
                                        <div className="flow-root">
                                            <ul role="list" className="-mb-8">
                                                {milestoneTimeline?.map((event, eventIdx) => (
                                                    <li key={event?.id}>
                                                        <div className="relative pb-8">
                                                            {eventIdx !== milestoneTimeline.length - 1 && (
                                                                <span aria-hidden="true" className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${event.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                            )}
                                                            <div className="relative flex space-x-3">
                                                                <div>
                                                                    <span
                                                                        className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${event.status === 'completed' ? 'border-2 border-blue-500 bg-blue-500' : event.status === 'current' ? 'border-2 border-blue-500 bg-white' : 'border-2 border-gray-200 bg-white'}`}
                                                                    >
                                                                        {event.status === 'completed' ? (
                                                                            <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                                                        ) : (
                                                                            <span className={`flex items-center justify-center ${event.status === 'current' ? 'text-blue-600' : 'text-black'}`}>
                                                                                {event.id}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {event?.type === 'start' ?
                                                                    <div className="flex flex-col justify-start gap-2">
                                                                        <h3 className="text-lg font-bold text-start font-Inter">
                                                                            {event?.title}
                                                                        </h3>
                                                                        <div className="flex flex-col gap-1">
                                                                            <p className="font-semibold text-left"><span className="font-bold text-blue-500 ">{offer?.user?.first_name}</span> is offer  <span className="font-bold text-left">$ {offer?.offer_price}</span> for this full project.</p>
                                                                            <span className="text-xs font-bold text-left text-gray-400">{offer?.created_at_human}</span>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    event?.type === 'review' ?
                                                                        <div className="flex flex-col justify-start gap-2">
                                                                            <h3 className="text-lg font-bold text-start font-Inter">
                                                                                {event?.title}
                                                                            </h3>
                                                                            {event.status === 'completed' ?
                                                                                <p className="text-left">Feedback submit completed</p>
                                                                                : event.status === 'current' ?
                                                                                    <div className="flex flex-col w-full gap-2">
                                                                                        <p className="text-left"> Give your review for the project and end contracts.</p>
                                                                                        <div className="flex" >
                                                                                            <Link
                                                                                                href={route('freelancer.contracts.review', offer.id)}
                                                                                                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                Review Work
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>

                                                                                    : event.status === 'upcoming' ?
                                                                                        <p className="text-left">Give feedback  to developer</p>
                                                                                        : null
                                                                            }


                                                                        </div>
                                                                        :
                                                                        event?.type === 'end' ?
                                                                            <div className="flex flex-col justify-start gap-2">
                                                                                <h3 className="text-lg font-bold text-start font-Inter">
                                                                                    {event?.title}
                                                                                </h3>{event.status === 'completed' ?
                                                                                    <p className="text-left">Project successfully completed.</p>
                                                                                    : event.status === 'upcoming' ?
                                                                                        <p className="text-left"></p>
                                                                                        : null
                                                                                }
                                                                            </div>
                                                                            :

                                                                            <div className="flex lg:pl-10">
                                                                                <div className="flex flex-col justify-start gap-2">
                                                                                    <h3 className="text-lg font-bold text-start font-Inter">
                                                                                        {event?.title}
                                                                                    </h3>
                                                                                    {event?.status === 'completed' && (
                                                                                        <p className="text-left text-blue-500">This milestone is completed.</p>
                                                                                    )}
                                                                                    {event?.status === 'current' && (
                                                                                        <div className="flex flex-col gap-2">
                                                                                            <p className="text-left">You can submit your work for review to <span className="font-bold text-blue-500 ">{offer?.user?.first_name}</span>.</p>
                                                                                            {currentMilestone?.project_status === 'uploaded' ?
                                                                                                <div className="flex">

                                                                                                    <div className="flex flex-col items-center justify-center gap-1 px-6 py-4 bg-blue-100 rounded-xl">
                                                                                                        {currentMilestone?.attachments?.map((attachment: any) => (
                                                                                                            <button
                                                                                                                type='button'
                                                                                                                className="flex flex-row items-center gap-4 text-start j"
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation();
                                                                                                                    handleDownload(attachment);
                                                                                                                }}
                                                                                                            >
                                                                                                                <div className="flex items-center justify-center rounded-full">
                                                                                                                    <FolderArrowDownIcon className="w-8 h-8 text-blue-500" />
                                                                                                                </div>
                                                                                                                <div className="flex flex-col gap-1">
                                                                                                                    <div>
                                                                                                                        <span className="text-base font-bold text-left text-primaryBtnColor">Submit Work</span>
                                                                                                                    </div>
                                                                                                                    <span className="text-xs font-semibold underline hover:text-primaryBtnColorHover text-primaryBtnColor">{attachment?.file_name}</span>
                                                                                                                    <span className="text-xs font-semibold text-gray-500">({(attachment?.size / (1024 * 1024)).toFixed(2)} MB)- {project?.updated_at_human}</span>
                                                                                                                </div>
                                                                                                            </button>
                                                                                                        ))}
                                                                                                    </div>


                                                                                                </div>
                                                                                                : null}
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <h1 className="font-bold text-left">Description :</h1>
                                                                                                <DescriptionWidget description={currentMilestone?.description} id={currentMilestone?.id} attachments={[]} title="" />
                                                                                                <h1 className="font-bold text-left">Payment : <span className="font-semibold text-left text-gray-500 ">$ {currentMilestone?.amount}</span></h1>
                                                                                                <span className="text-xs font-bold text-left text-gray-400">Submit before {currentMilestone?.due_date_human}</span>
                                                                                            </div>

                                                                                            {currentMilestone?.status === 'paid' ? (
                                                                                                <div>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() => setIsModalOpenNew(true)}
                                                                                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                        {currentMilestone?.project_status === 'uploaded' ? 'Re-upload Work' : 'Submit Work'}
                                                                                                    </button>
                                                                                                </div>

                                                                                            ) : (<p className="text-left text-blue-500">Please wait for the client to pay the milestone before submitting your work.</p>
                                                                                            )}
                                                                                            {isModalOpenNew &&
                                                                                                <ProjectUploadModal onClose={() => setIsModalOpenNew(false)} id={currentMilestone?.id} url={'freelancer.projectMilestone.submit'} />
                                                                                            }
                                                                                        </div>

                                                                                    )}
                                                                                    {event?.status === 'upcoming' && (
                                                                                        <p className="text-left text-gray-500">This milestone is upcoming.</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col w-full gap-4 p-4 border-2 border-gray-200 rounded-2xl">
                                    <h1 className="py-5 text-xl font-bold first-letter:capitalize text-start font-Inter ">Contract Details</h1>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <h1 className="text-xl font-bold first-letter:capitalize text-start font-Inter ">Title</h1>
                                            <h1 className="text-lg font-semibold first-letter:capitalize text-start font-Inter ">{offer?.contract_title}</h1>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h1 className="text-xl font-bold first-letter:capitalize text-start font-Inter ">Description</h1>
                                            <DescriptionWidget description={offer?.contract_description} id={offer?.id} attachments={offer?.attachments} title="" />
                                            <div className="flex flex-col justify-start text-left">
                                                <Link href={route('freelancer.offer.show', offer?.id)}
                                                    className="text-blue-500 underline">View original offer</Link>
                                                <Link href={route('freelancer.proposals.show', offer?.proposal_id)}
                                                    className="text-blue-500 underline">View original proposal</Link>
                                                <Link href={route('freelancer.applicant.show', offer?.job_post_id)}
                                                    className="text-blue-500 underline">View original job posting</Link>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-6">
                                            <h1 className="text-xl font-bold first-letter:capitalize text-start font-Inter ">Summary</h1>
                                            <div className="flex flex-row justify-start w-full py-3 text-left border-b-2 border-gray-200">
                                                <div className="flex w-1/2">
                                                    <span className="flex items-center justify-start gap-2"> Contract type</span>
                                                </div>
                                                <div className="flex w-1/2">
                                                    <span className="flex items-center justify-start gap-2 font-bold">{offer?.payment_type === 'Project' ? 'Fixed Price' : 'Milestone'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start w-full py-3 text-left border-b-2 border-gray-200">
                                                <div className="flex w-1/2">
                                                    <span className="flex items-center justify-start gap-2">Start date</span>
                                                </div>
                                                <div className="flex w-1/2">
                                                    <span className="flex items-center justify-start gap-2 font-bold">{offer?.created_at_human}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-6">
                                            <h1 className="text-xl font-bold first-letter:capitalize text-start font-Inter ">Recent Activity</h1>
                                            {recentActivity?.length === 0 ?
                                                <p className="text-left text-gray-500">No recent activity found.</p>
                                                :
                                                <>
                                                    <div className="flex flex-row justify-between w-full py-3 text-left border-b-2 border-gray-200">
                                                        <div className="flex">
                                                            <span className="flex items-center justify-start gap-2 text-base">Date</span>
                                                        </div>
                                                        <div className="flex ">
                                                            <span className="flex items-center justify-start gap-2 text-base font-bold text-blue-500">Description</span>
                                                        </div>
                                                    </div>
                                                    {recentActivity?.map((activity: any) => (
                                                        <div className="flex flex-row justify-between w-full py-3 text-left border-b-2 border-gray-200">
                                                            <div className="flex">
                                                                <span className="flex items-center justify-start gap-2 text-base">{activity?.created_at_human}</span>
                                                            </div>
                                                            <div className="flex ">
                                                                <span className="flex items-center justify-start gap-2 text-base font-bold first-letter:capitalize">{activity?.activity}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full h-full lg:w-1/3">
                                <div className="flex flex-col w-full gap-2 p-8 border-2 border-gray-200 rounded-2xl">
                                    <h1 className="py-2 text-xl font-bold first-letter:capitalize text-start font-Inter ">Order Summary</h1>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-row w-full text-left ">
                                            <div className="flex flex-col w-1/2 text-left ">
                                                <span className="text-sm font-medium text-gray-500">Type</span>
                                                <span className="text-sm font-bold ">{offer?.payment_type === 'Project' ? 'Fixed Price' : 'Milestone'}</span>
                                            </div>
                                            <div className="flex flex-col w-1/2 text-left ">
                                                <span className="text-sm font-medium text-gray-500">Payment</span>
                                                <span className="text-sm font-bold ">$ {offer?.offer_price}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row w-full text-left ">
                                            <div className="flex flex-col w-1/2 text-left ">
                                                <span className="text-sm font-medium text-gray-500">Start Date</span>
                                                <span className="text-sm font-bold ">{offer?.created_at_human}</span>
                                            </div>
                                            <div className="flex flex-col w-1/2 text-left ">
                                                <span className="text-sm font-medium text-gray-500">Due Date</span>
                                                <span className="text-sm font-bold ">{offer?.due_date_formatted}</span>
                                            </div>
                                        </div>

                                    </div>
                                    <AboutClient user={offer?.user} />
                                    {/* <div className="flex flex-row w-full gap-4">
                                        <div className="relative flex items-start w-28 ">
                                            <div className="absolute z-10 w-3 h-3 bg-green-400 rounded-full left- top-1 ring-2 ring-white"></div>
                                            <img
                                                className="w-[70px] h-[70px] rounded-full"
                                                src={offer?.user?.avatar}
                                                alt="avatar"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-between w-full gap-4 sm:items-center sm:flex-row">
                                            <div className="flex flex-col gap-2 text-start">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-medium text-blue-600 underline font-Inter "> {offer?.user?.full_name}</span>
                                                    <div className="flex flex-col justify-start text-left">
                                                        <span className="text-sm font-bold 0 font-Inter">{offer?.user?.country}</span>
                                                        <span className="text-sm font-medium text-gray-500">{offer?.user?.user_country_time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div> */}
                                    {/* <div className="flex flex-row justify-between w-full gap-4">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                            Message
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>


                    </div>
                </section>
            </AppLayout>
        </>
    );
}
