import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Rating } from "react-simple-star-rating";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import SkillWidget from "@/Components/shared/partials/SkillWidget";
import JobLinkWidget from "@/Components/shared/partials/JobLinkWidget";
import AboutClient from "@/Components/elements/about/AboutClient";
import { fillColorArray } from "@/lib/fillColorArray";

export default function FreelancerJobView({
    job,
    user,

}: {
    job: any,
    user: any
}) {
    const handleFavoriteJob = (jobId: string) => {
        router.post(
            route("freelancer.favoriteJob.store"),
            {
                user_id: user?.data?.id,
                job_id: jobId,
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {

                },
            }
        );
    };

   // console.log("job", job);
    return (
        <>
            <AppLayout isFreelancerHeader={true} isHeader={false} isFooter={true} >
                <Head title="Job view" />
                <section className="flex justify-center min-h-screen px-0 py-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <div className="container p-6 mx-auto">
                        <div className="flex flex-col mt-6 sm:flex-row text-start ">
                            <div className="flex flex-col w-full pr-6 md:w-2/3 lg:w-3/4 ">

                                <div className='flex flex-col gap-4 pb-8 border-b-2'>
                                    <div className='flex flex-col gap-4 border-b'>
                                        <h1 className='pb-8 text-xl font-semibold font-Inter'>{job?.data?.title}</h1>
                                    </div>
                                    <div className='flex flex-col gap-4'>
                                        <DescriptionWidget description={job?.data?.description} attachments={job?.data?.attachments} id={job?.data?.id} title='' />
                                    </div>

                                </div>
                                <div className="flex flex-col w-full gap-8 py-8 border-b-2 lg:gap-2 lg:flex-row">
                                    <div className="flex flex-row gap-3 lg:w-1/3 ">
                                        <img src="/assets/Icons/job/calendar.png" alt="attachment" className="w-7 h-7" />
                                        <div>
                                            <p className="text-base font-medium text-start font-Inter ">{job?.data?.scope_duration}</p>
                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Project Length</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3 lg:w-1/3 ">
                                        <img src="/assets/Icons/freelancer/people-circle.png" alt="attachment" className="w-7 h-7" />
                                        <div>
                                            <p className="text-base font-medium text-start font-Inter ">{job?.data?.scope_experience}</p>
                                            {job?.data?.scope_experience === "Entry" ? (
                                                <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for some one relatively new to field</p>
                                            ) : job?.data?.scope_experience === "Intermediate" ? (
                                                <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for substantial experience in this field</p>
                                            ) : (
                                                <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Looking for comprehensive and deep expertise in this field</p>
                                            )}

                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3 lg:ml-3 sm:w-1/3 ">
                                        <img src="/assets/Icons/freelancer/cash.png" alt="attachment" className="w-7 h-7" />
                                        <div>
                                            <p className="text-base font-medium text-start font-Inter">$ {parseFloat(job?.data?.budget).toFixed(2)}</p>
                                            <p className="text-sm font-medium text-textSecondary text-start font-Inter ">Fixed price</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 py-8 border-b-2'>
                                    <h1 className='text-xl font-semibold font-Inter'>Category : <span className='font-normal'>{job?.data?.job_category}</span> </h1>
                                </div>

                                <div className='flex flex-col gap-4 py-8 border-b-2'>
                                    <div className='flex flex-col gap-6'>
                                        <h1 className='text-lg font-semibold font-Inter'>You will be asked to answer the following questions when submitting a proposal:</h1>
                                        <div className='flex flex-col gap-2'>
                                            <p className='font-sm'>1. Describe your recent experience with similar projects</p>
                                            <p className='font-sm'>2. How do you propose to solve this? And will you need to add any additional plugins?</p>
                                            <p className='font-sm'>3. When can you begin this work? And when can you have it completed by?</p>
                                            <p className='font-sm'>4. What hours are you usually online based on PST? Note: We are looking for someone who can start the work ASAP. Thanks!</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 p-0 py-4 '>
                                    <SkillWidget skills={job?.data?.skill_list} title='Skills and Expertise' />
                                </div>
                                <div className='flex flex-col gap-4 py-8 mb-5 border-y-2'>
                                    <div className='flex flex-row gap-4'>

                                        <div className='flex flex-row gap-4'>
                                            <div className='flex flex-col gap-2'>
                                                <h1 className='text-xl font-semibold font-Inter'>Activity on this job</h1>
                                                <div>
                                                    <p className='text-sm font-normal text-textSecondary font-Inter'>Proposals: {job?.data?.proposal_count >= 2 ? "Less than " + job?.data?.proposal_count : <span className="text-xs ">{job?.data?.proposal_count}</span>}</p>
                                                    <p className='text-sm font-normal text-textSecondary font-Inter'>Last updated by client: {job?.data?.updated_at_human_ago}</p>
                                                    <p className='text-sm *:font-normal text-textSecondary font-Inter'>Interviewing: 0</p>
                                                    <p className='text-sm font-normal text-textSecondary font-Inter'>Invites sent: 0</p>
                                                    <p className='text-sm font-normal text-textSecondary font-Inter'>Unanswered invites: 0</p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col w-full gap-2 sm:px-5 sm:border-l-2 md:w-1/3 lg:w-1/4 ">
                                <div className="flex flex-col gap-5">
                                    <Link className="flex flex-row items-center justify-center w-auto gap-2 px-8 py-3 rounded-full cursor-pointer bg-primaryBtnColor hover:bg-primaryBtnColorHover text-start font-Inter"
                                        href={route('freelancer.proposals.create', job?.data?.id)}>
                                        <span className="text-sm font-medium text-center text-white font-Inter ">Apply Now</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavoriteJob(job?.data?.id);
                                        }}
                                        className={`flex flex-row items-center justify-center w-auto gap-2 px-8 py-3 rounded-full cursor-pointer text-start font-Inter ${job.data?.is_favorite
                                            ? 'bg-primaryBtnColor text-white'
                                            : 'text-primary border-primary border-2 hover:bg-primaryBtnColorHover hover:text-white'
                                            }`}
                                    >
                                        <svg
                                            width="17"
                                            height="17"
                                            viewBox="0 0 17 17"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M11.7173 3.35156C9.56174 3.35156 8.49924 5.35156 8.49924 5.35156C8.49924 5.35156 7.43674 3.35156 5.28119 3.35156C3.5294 3.35156 2.14217 4.73094 2.12424 6.37687C2.08772 9.79344 5.00395 12.2231 8.20041 14.265C8.28854 14.3214 8.39266 14.3516 8.49924 14.3516C8.60583 14.3516 8.70995 14.3214 8.79807 14.265C11.9942 12.2231 14.9104 9.79344 14.8742 6.37687C14.8563 4.73094 13.4691 3.35156 11.7173 3.35156Z"
                                                fill={job.data?.is_favorite ? '#FFFFFF' : 'none'}
                                                stroke="#004AAD"
                                                strokeWidth="1.00189"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium font-Inter">
                                            {job.data?.is_favorite ? 'Unsave job' : 'Save job'}
                                        </span>
                                    </button>

                                </div>
                                <div className="flex flex-col gap-2 py-4">
                                    <p className="text-sm font-normal text-textSecondary text-start font-Inter ">Send a proposal for : <span className='font-semibold'>15 Connects</span></p>
                                    <p className="text-sm font-normal text-textSecondary text-start font-Inter ">Available Connects : <span className='font-semibold'>{parseFloat(user?.data?.available_connects).toFixed(0)}</span> </p>
                                </div>
                                <div className='flex flex-col'>
                                    <AboutClient user={job?.data?.client} />
                                    <JobLinkWidget jobUrl={job?.data?.public_url} />
                                </div>


                            </div>
                        </div>

                        <div className="flex flex-row text-start ">
                            <div className="flex flex-col w-full ">
                                <div className="flex justify-between gap-4 py-4 ">
                                    <div>
                                        <h2 className='text-xl font-semibold font-Inter'>Client's recent history </h2>
                                    </div>
                                </div>

                                {job?.data?.client?.recent_reviews?.length == 0 ? (
                                    <div className="flex flex-col w-full gap-6 text-center">
                                        <h3 className='text-xl font-medium text-gray-400 font-Inter'>No recent history</h3>
                                    </div>
                                ) : (
                                    <>
                                        {job?.data?.client?.recent_reviews?.map((review: any) => (

                                            <div className='flex flex-col py-6 sm:flex-row'>
                                                <div className='flex flex-col w-full gap-4 sm:w-4/5'>
                                                    <div className='flex '>
                                                        <h1 className='text-xl font-medium border-b-2 border-primaryBtnColorHover text-primaryBtnColor font-Inter'>{review?.offer?.contract_title}</h1>
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-col items-center justify-start gap-1 sm:flex-row ">
                                                            <div className='flex flex-row gap-1'>
                                                                <Rating
                                                                    initialValue={review?.avg_score_rate}
                                                                    readonly
                                                                    transition
                                                                    allowFraction
                                                                    //showTooltip
                                                                    //tooltipArray={tooltipArray}
                                                                    fillColorArray={fillColorArray}
                                                                    iconsCount={5}
                                                                    size={22}
                                                                    emptyStyle={{ display: "flex" }}
                                                                    fillStyle={{
                                                                        display: "-webkit-inline-box",
                                                                    }}
                                                                />
                                                                <span className="mt-1 text-sm font-medium text-textSecondary text-start font-Inter ">
                                                                    {review?.avg_score_rate}
                                                                </span>
                                                            </div>
                                                            <span className="mt-1 text-sm font-medium text-textSecondary text-start font-Inter ">
                                                                <DescriptionWidget description={review?.feedback} attachments={[]} id={0} title='' />
                                                            </span>
                                                        </div>


                                                    </div>
                                                    <div>
                                                        <DescriptionWidget description={review?.your_experience} attachments={[]} id={0} title='Experience' />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-full gap-1 sm:w-1/5'>
                                                    <p>{review?.offer?.created_at_human} - {review?.offer?.due_date_formatted}</p>
                                                    <p>{review?.offer?.payment_type == 'Payment' ? 'Fixed-price' : 'Milestone Project'}</p>
                                                    <p>$ {review?.offer?.offer_price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}



                            </div>
                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
