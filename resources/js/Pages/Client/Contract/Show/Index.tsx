import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { CheckIcon, HandThumbUpIcon, UserIcon } from '@heroicons/react/20/solid';
import { FolderArrowDownIcon } from "@heroicons/react/24/outline";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import { useState } from "react";
import RequestChangesModal from "./Partials/RequestChangesModal";
import { RouteParams } from "../../../../../../vendor/tightenco/ziggy/src/js";


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

    const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);
    const [templateMessage, setTemplateMessage] = useState('template message');
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
            status: (project?.status === 'draft' || offer?.status == 'pending') ? 'upcoming' : project?.status === 'uploaded' ? 'current' : 'completed',
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

    const milestoneLength = completeMilestone?.length + pendingMilestone?.length + 3;
    const startMilestone = { id: 1, title: 'Start of Project', type: 'start', status: 'completed' };
    const reviewMilestone = { id: milestoneLength, title: 'Review the work', type: 'review', status: review?.status == 'draft' ? 'current' : review?.status === 'submitted' ? 'completed' : 'upcoming' };
    const endMilestone = { id: (milestoneLength + 1), title: 'Project Complete', type: 'end', status: review?.status === 'submitted' ? 'completed' : 'upcoming' };


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
            id: completeMilestone?.length + 3 + idx,
            title: milestone?.title || 'Upcoming milestone',
            type: 'milestone',
            attachment: milestone?.attachments,
            date: milestone?.due_date_human,
            status: 'upcoming',
        })),
        reviewMilestone,
        endMilestone
    ];


    // console.log('offer', offer);
    // console.log('project', project);
    // console.log('review', review);
    // console.log('currentMilestone', currentMilestone);
    // console.log('pendingMilestone', pendingMilestone);
    // console.log('completeMilestone', completeMilestone);
    //  console.log('milestoneTimeline', milestoneTimeline);

    const handleDownload = (file: any) => {
        const link = document.createElement('a');
        link.href = file.path_url;
        link.download = file.file_name;
        link.click();
    }

    const handleRequestChanges = (message: string) => {
        setTemplateMessage(message);
        setIsRequestChangesModalOpen(true);
    }

    //  console.log('currentMilestone', currentMilestone);


    return (
        <>
            <AppLayout isClientHeader={false} isHeader={true} isFooter={true} >
                <Head title="Contract View" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto mt-8 text-center ">
                        <h1 className="text-2xl font-medium first-letter:capitalize text-start font-Inter ">{offer?.contract_title}</h1>
                        {/* panel */}
                        <div className="flex flex-col w-full gap-3 lg:flex-row">
                            <div className="flex flex-col w-full gap-8 lg:w-2/3">
                                <div className="flex flex-col w-full p-4 overflow-auto border-2 border-gray-200 sm:gap-4 rounded-2xl">
                                    <h1 className="py-5 text-xl font-bold first-letter:capitalize text-start font-Inter ">Project Timeline</h1>
                                    {offer?.payment_type === 'Project' &&
                                        <div className="flow-root">
                                            <ul role="list" className="-mb-8">
                                                {timeline?.map((event, eventIdx) => (
                                                    <li key={event?.id}>
                                                        <div className="relative pb-8">
                                                            {eventIdx !== timeline?.length - 1 ? (
                                                                <span aria-hidden="true" className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${event.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                            ) : null}
                                                            <div className="relative flex space-x-3">
                                                                <div>
                                                                    <span
                                                                        className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${event.status === 'completed' ? 'border-2 border-blue-500 bg-blue-500' : event.status === 'current' ? 'border-2 border-blue-500 bg-white' : 'border-2 border-gray-200 bg-white'} `}
                                                                    >
                                                                        {event?.status === 'completed' ? (
                                                                            <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                                                        ) : (
                                                                            <span className={`flex  items-center justify-center  ${event?.status === 'current' ? 'text-blue-600 ' : 'text-black'} `}>
                                                                                {event?.id}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex lg:pl-10">
                                                                    <div className="flex flex-col justify-start gap-2">
                                                                        <h3 className="text-lg font-bold text-start font-Inter">
                                                                            {event?.title}
                                                                        </h3>
                                                                        {event.id === 1 ?
                                                                            event.status === 'completed' ?
                                                                                <div className="flex flex-col gap-1">
                                                                                    <p className="font-semibold text-left"><span className="font-bold text-blue-500">{offer?.freelancer?.first_name}</span> is starting the project at this time.</p>
                                                                                    <span className="font-bold text-left">$ {offer?.offer_price}</span>
                                                                                    <span className="text-xs font-bold text-left text-gray-400">{offer?.created_at_human}</span>                                                                            </div>
                                                                                : event.status === 'current' ?
                                                                                    <p className="text-left">{offer?.freelancer?.first_name} is actively working on the project at this time.</p>
                                                                                    : event.status === 'upcoming' ?
                                                                                        <p className="text-left">Phone screening with Nicolas.</p>
                                                                                        : null
                                                                            : event.id === 2 ?
                                                                                event.status === 'completed' ?
                                                                                    <div className="flex flex-col w-full gap-3 lg:pr-10">
                                                                                        <p className="text-left">Final Project</p>
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
                                                                                                            <span className="text-base font-bold text-left text-primaryBtnColor">Work Download for Review</span>
                                                                                                            <span className="text-xs font-semibold underline hover:text-primaryBtnColorHover text-primaryBtnColor">{attachment?.file_name}</span>
                                                                                                            <span className="text-xs font-semibold text-gray-500">({(attachment?.size / (1024 * 1024)).toFixed(2)} MB)- {project?.updated_at_human}</span>
                                                                                                        </div>
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>


                                                                                        </div>
                                                                                    </div>

                                                                                    : event.status === 'current' ?
                                                                                        <div className="flex flex-col gap-3 lg:pr-10">
                                                                                            <span className="font-bold text-left">Successfully initiated the project.</span>
                                                                                            <div className="flex flex-row items-center justify-center gap-3 px-8 py-4 bg-blue-100 lg:w-1/2 rounded-xl">

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
                                                                                                                <span className="text-base font-bold text-left text-primaryBtnColor">Work Download for Review</span>
                                                                                                                <span className="text-xs font-semibold underline hover:text-primaryBtnColorHover text-primaryBtnColor">{attachment?.file_name}</span>
                                                                                                                <span className="text-xs font-semibold text-gray-500">({(attachment?.size / (1024 * 1024)).toFixed(2)} MB)- {project?.updated_at_human}</span>
                                                                                                            </div>
                                                                                                        </button>
                                                                                                    ))}
                                                                                                </div>


                                                                                            </div>
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <p className="text-left">Please review the work and let me know if you have any feedback or changes.
                                                                                                    You have 14 days from the submission of work to make a payment or request changes. If neither action
                                                                                                    is taken, the ${offer?.offer_price} held in escrow will be  released to <span className="font-bold text-blue-500"> {offer?.freelancer?.first_name}.</span>
                                                                                                </p>
                                                                                            </div>
                                                                                            <div className="flex flex-col gap-4 lg:w-1/2 sm:flex-row">
                                                                                                <button
                                                                                                    type='button'
                                                                                                    onClick={() => handleRequestChanges('Please review the work and let me know if you have any feedback or changes. You have 14 days from the ')}
                                                                                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                    Request Changes
                                                                                                </button>
                                                                                                <Link type="button"
                                                                                                    href={route('client.project.approve', project?.id)}
                                                                                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white border-2 rounded-full hover:bg-primaryBtnColorHover bg-primaryBtnColor border-primaryBtnColor">
                                                                                                    Approve
                                                                                                </Link>
                                                                                            </div>

                                                                                        </div>
                                                                                        : event.status === 'upcoming' ?
                                                                                            <p className="text-left"><span className="font-bold text-blue-500">{offer?.freelancer?.first_name}</span> is actively working on the project at this time.</p>
                                                                                            : null
                                                                                : event.id === 3 ?
                                                                                    event.status === 'completed' ?
                                                                                        <p className="text-left">Feedback submit completed</p>
                                                                                        : event.status === 'current' ?
                                                                                            <>
                                                                                                <p className="text-left"> Give your review for the <span className="font-bold text-blue-500">{offer?.freelancer?.first_name}</span> and end contracts.</p>
                                                                                                <Link
                                                                                                    href={route('client.contracts.review', offer?.id)}
                                                                                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                    Review Work
                                                                                                </Link>
                                                                                            </>
                                                                                            : event.status === 'upcoming' ?
                                                                                                <p className="text-left">Give feedback  to developer</p>

                                                                                                : null
                                                                                    : event.id === 4 ?
                                                                                        event.status === 'completed' ?
                                                                                            <p className="text-left">Successfully completed the project.</p>
                                                                                            : event.status === 'current' ?
                                                                                                <p className="text-left">Advanced to interview by</p>
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
                                                                        <p className="text-left"><span className="font-bold text-blue-500">{offer?.freelancer?.first_name}</span> is starting the project at this time.</p>
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
                                                                                    <>
                                                                                        <p className="text-left"> Give your review for the <span className="font-bold text-blue-500">{offer?.freelancer?.first_name}</span> and end contracts.</p>
                                                                                        <Link
                                                                                            href={`/client/contracts/${offer.id}/review`}
                                                                                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                            Review Work
                                                                                        </Link>
                                                                                    </>
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
                                                                                </h3>
                                                                                <p className="text-left">Advanced to interview by</p>
                                                                            </div>
                                                                            :

                                                                            <div className="flex lg:pl-10">
                                                                                <div className="flex flex-col justify-start gap-2">
                                                                                    <h3 className="text-lg font-bold text-start font-Inter">
                                                                                        {event?.title}
                                                                                    </h3>
                                                                                    {event?.status === 'completed' && (
                                                                                        <>
                                                                                            <p className="text-left text-blue-500">This milestone is completed.</p>
                                                                                            <div className="flex flex-row items-center gap-3 px-8 py-4 bg-blue-100 rounded-xl">

                                                                                                <div className="flex flex-col gap-1">


                                                                                                    {event?.attachment?.map((attachment: any) => (
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
                                                                                                                <span className="text-base font-bold text-left text-primaryBtnColor">Work Download for Review</span>
                                                                                                                <span className="text-xs font-semibold underline hover:text-primaryBtnColorHover text-primaryBtnColor">{attachment?.file_name}</span>
                                                                                                                <span className="text-xs font-semibold text-gray-500">({(attachment?.size / (1024 * 1024)).toFixed(2)} MB)- {project?.updated_at_human}</span>
                                                                                                            </div>
                                                                                                        </button>
                                                                                                    ))}
                                                                                                </div>


                                                                                            </div>
                                                                                        </>

                                                                                    )}
                                                                                    {event?.status === 'current' && (

                                                                                        <div className="flex flex-col gap-3 lg:pr-10">
                                                                                            {currentMilestone?.status === 'paid' ?
                                                                                                <>
                                                                                                    <p className="text-left text-blue-600">This milestone is in progress.</p>
                                                                                                    {currentMilestone?.project_status === 'uploaded' ?
                                                                                                        <>
                                                                                                            <span className="font-bold text-left">Successfully initiated the project.</span>
                                                                                                            <div className="flex flex-row items-center gap-3 px-8 py-4 bg-blue-100 lg:w-1/2 rounded-xl">
                                                                                                                <div className="flex flex-col gap-1">
                                                                                                                    {event?.attachment?.map((attachment: any) => (
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
                                                                                                                                <span className="text-base font-bold text-left text-primaryBtnColor">Work Download for Review</span>
                                                                                                                                <span className="text-xs font-semibold underline hover:text-primaryBtnColorHover text-primaryBtnColor">{attachment?.file_name}</span>
                                                                                                                                <span className="text-xs font-semibold text-gray-500">({(attachment?.size / (1024 * 1024)).toFixed(2)} MB)- {project?.updated_at_human}</span>
                                                                                                                            </div>
                                                                                                                        </button>
                                                                                                                    ))}
                                                                                                                </div>


                                                                                                            </div>
                                                                                                            <div className="flex flex-col gap-1">
                                                                                                                <p className="text-left">Please review the work and let me know if you have any feedback or changes.
                                                                                                                    You have 14 days from the submission of work to make a payment or request changes. If neither action
                                                                                                                    is taken, the ${currentMilestone?.amount}  held in escrow for this milestone will be  released to <span className="text-blue-500 "> {offer?.freelancer?.first_name}</span>
                                                                                                                </p>
                                                                                                            </div>
                                                                                                            <div className="flex flex-col gap-4 lg:w-1/2 sm:flex-row">
                                                                                                                <button
                                                                                                                    type='button'
                                                                                                                    onClick={() => handleRequestChanges(`I am requesting changes`)}
                                                                                                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                                    Request Changes
                                                                                                                </button>
                                                                                                                <Link type="button"
                                                                                                                    href={route('client.milestoneProject.approve', currentMilestone?.id)}
                                                                                                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white border-2 rounded-full hover:bg-primaryBtnColorHover bg-primaryBtnColor border-primaryBtnColor">
                                                                                                                    Approve
                                                                                                                </Link>
                                                                                                            </div>
                                                                                                        </>
                                                                                                        :
                                                                                                        <div className="flex flex-col gap-1">
                                                                                                            <p className="text-left">Please wait for the freelancer to submit the work for this milestone.
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    }

                                                                                                </>
                                                                                                :
                                                                                                <>
                                                                                                    <p className="text-left">Please pay the milestone to start the work.</p>
                                                                                                    <div className="flex flex-col justify-between w-full gap-4 sm:flex-row">
                                                                                                        <div className="flex flex-col gap-1">
                                                                                                            <h1 className="font-bold text-left">Milestone Payment :  <span className="font-semibold text-left text-gray-500 ">$ {currentMilestone?.amount}</span></h1>

                                                                                                            <span className="text-xs font-semibold text-left text-gray-500">Due by {currentMilestone?.due_date_human}</span>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <Link
                                                                                                                href={route('client.hire', offer?.id)}
                                                                                                                type="button" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 rounded-full text-primary border-primaryBtnColor hover:bg-primaryBtnColorHover hover:text-white">
                                                                                                                Pay Now
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
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
                                                <Link href={route('client.offer.show', offer?.id)}
                                                    className="text-blue-500 underline">View original offer</Link>
                                                <Link href={route('client.applicant.show', offer?.proposal_id)}
                                                    className="text-blue-500 underline">View original proposal</Link>
                                                <Link href={route('client.job.show', offer?.job_post_id)}
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
                                <div className="flex flex-col w-full gap-8 p-8 border-2 border-gray-200 rounded-2xl">
                                    <h1 className="py-5 text-xl font-bold first-letter:capitalize text-start font-Inter ">Order Summary</h1>
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
                                    <div className="flex flex-row w-full gap-4">
                                        <div className="relative flex items-start w-28 ">
                                            <div className="absolute z-20 w-3 h-3 bg-green-400 rounded-full left- top-1 ring-2 ring-white"></div>
                                            <img
                                                className="w-[70px] h-[70px] rounded-full"
                                                src={offer?.freelancer?.avatar}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between w-full gap-4 sm:items-center sm:flex-row">
                                            <div className="flex flex-col gap-2 text-start">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-medium text-blue-600 underline font-Inter "> {offer?.freelancer?.full_name}</span>
                                                    <span className="text-sm font-semibold font-Inter ">{offer?.freelancer?.meta_data?.title ?? 'Title not updated'} </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-start text-left">
                                        <span className="text-sm font-bold 0 font-Inter">{offer?.freelancer?.country}</span>
                                        <span className="text-sm font-medium text-gray-500">{offer?.freelancer?.user_country_time}</span>
                                    </div>

                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={route('client.messages.show', offer?.proposal_id)}
                                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white border-2 text-primary border-primaryBtnColor rounded-2xl hover:bg-primaryBtnColorHover hover:text-white cursor-pointer" >

                                       <span className="text-sm font-bold font-Inter">Message</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {isRequestChangesModalOpen &&
                            <RequestChangesModal onClose={() => setIsRequestChangesModalOpen(false)} templateMessage={templateMessage} offer={offer} />
                        }


                    </div>
                </section>
            </AppLayout>
        </>
    );
}
