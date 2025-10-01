import { useState } from 'react';
import { Link, router } from "@inertiajs/react";
import ConfirmationModal from "./ConfirmationModal";
import AboutClient from "@/Components/elements/about/AboutClient";
import SkillWidget from '@/Components/shared/partials/SkillWidget';
import JobLinkWidget from '@/Components/shared/partials/JobLinkWidget';
import DescriptionWidget from '@/Components/shared/partials/DescriptionWidget';

const JobPost = ({
    job,
    user,
}: {
    job: any;
    user: any;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = () => {
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        setIsModalOpen(false);
        router.post(route('client.job.delete', job.id));
    };

    return (
        <div className="flex flex-col w-full py-6 border border-gray-400 sm:py-0 sm:flex-row rounded-2xl">
            <div className="p-4 sm:p-6 md:w-3/5 lg:w-3/4">
                <div className="py-4 sm:py-8 text-textSecondary">
                    <h2 className="text-base font-normal text-start font-Inter ">Posted {job?.created_at_human_ago}</h2>
                </div>
                <div className="py-8 border-y border-borderColor">
                    <DescriptionWidget description={job?.description} attachments={job?.attachments} id={job?.id} title='' />
                </div>
                <div className="flex flex-col gap-6 py-8 lg:flex-row">
                    <div className="flex flex-row gap-3 lg:w-1/3 ">
                        <img src="/assets/Icons/job/calendar.png" alt="attachment" className="w-8 h-8" />
                        <div>
                            <p className="text-base font-medium text-start font-Inter ">{job?.scope_duration}</p>
                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Project Length</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 lg:w-1/3 ">
                        <img src="/assets/Icons/job/cash.png" alt="attachment" className="w-8 h-8" />
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
                    <div className="flex flex-row gap-3 lg:ml-4 lg:w-1/3 ">
                        <img src="/assets/Icons/job/cash1.png" alt="attachment" className="w-8 h-8" />
                        <div>
                            <p className="text-base font-medium text-start font-Inter">$ {parseFloat(job?.budget).toFixed(2)}</p>
                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Fixed price</p>
                        </div>
                    </div>
                </div>
                <div className="py-4 sm:py-8 text-textSecondary border-y border-borderColor">
                    <h2 className="text-base font-normal text-start font-Inter "><span className="text-black">Category : </span>{job?.job_category}</h2>
                </div>
                <div className="py-8 border-b border-borderColor">
                <SkillWidget skills={job?.skill_list} title="Skills and Expertise" />
                </div>
                <div className="py-6 space-y-3 text-black ">
                    <h2 className="text-xl font-semibold text-start font-Inter ">Activity on this job</h2>
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-textSecondary text-start font-Inter">Proposals : {job?.proposal_count}</p>
                        <p className="text-sm font-medium text-textSecondary text-start font-Inter">Interviewing : {job?.chat_count}</p>
                    </div>
                </div>
            </div>
            <div className="gap-16 px-4 py-2 sm:py-8 sm:px-6 md:w-2/5 lg:w-1/4 sm:border-l" >
                <div className="flex flex-col gap-3">
                    <Link className="flex flex-row items-center w-auto gap-2 cursor-pointer text-start font-Inter"
                        href={route('client.job.edit', job?.id)}>
                        <img src="/assets/Icons/job/edit.png" alt="attachment" className="w-5.5 h-5.5" />
                        <span className="text-base font-medium text-primary text-start font-Inter ">Edit posting</span>
                    </Link>
                    <button
                        type="button"
                        className="flex flex-row items-center w-auto gap-2 cursor-pointer text-start font-Inter"
                        onClick={handleDelete}>
                        <img src="/assets/Icons/job/delete.png" alt="attachment" className="w-5.5 h-5.5" />
                        <span className="text-base font-medium text-primary text-start font-Inter">Remove posting</span>
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <AboutClient user={user?.data} />
                    <JobLinkWidget jobUrl={job?.public_url} />
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default JobPost;
