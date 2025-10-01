import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { Rating } from "react-simple-star-rating";
import { fillColorArray } from "@/lib/fillColorArray";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import SkillWidget from "@/Components/shared/partials/SkillWidget";
import PortfolioCarouselView from "@/Components/elements/carousel/PortfolioCarouselView";
export default function FreelancerJobView({
    user,
    activePortfolios,
    educations,
    userLanguages,
    employmentHistory,
    reviews,
}: {
    user: any,
    activePortfolios: any,
    educations: any,
    userLanguages: any;
    employmentHistory: any[];
    reviews: any[];
}) {

    const getYouTubeEmbedUrl = (url: any) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    };

    return (
        <>
            <AppLayout isFooter={false}
                isHeader={false}
            >
                <Head title="Profile" />
                <div className="container flex flex-col py-10 mx-auto bg-white">
                    <section className="flex min-h-screen px-4 py-5 mt-10 bg-white ">
                        <div className="container flex flex-col gap-4 pt-8 mx-auto ">
                            <div className="border-2 border-borderColor rounded-3xl">
                                <div className="justify-between p-4 border-b-2">
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="relative items-start hidden w-20 gap-4 mr-5 lg:flex ">
                                            <div className={`absolute w-3 h-3  rounded-full left-1 top-1 ring-2 ring-white ${user?.active_status ? "bg-green-500" : "bg-red-500"}`}></div>
                                            <img
                                                className="sm:w-[70px] sm:h-[70px] rounded-full"
                                                src={user?.avatar}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full gap-4">
                                            <div className="flex flex-col justify-between w-full gap-4 lg:flex-row">
                                                <div className="flex flex-row gap-2 text-start">
                                                    <div className="relative items-start w-20 gap-4 mr-5 lg:hidden ">
                                                        <div className={`absolute w-3 h-3  rounded-full left-1 top-1 ring-2 ring-white ${user?.active_status ? "bg-green-500" : "bg-red-500"}`}></div>
                                                        <img
                                                            className="w-[60px] h-[60px] rounded-full"
                                                            src={user?.avatar}
                                                            alt="avatar"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-3xl font-semibold font-Inter ">{user?.full_name}</span>
                                                        <div className="flex items-center gap-2 text-sm font-medium text-textSecondary">
                                                            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00042 16.6571L7.60137 15.9799C8.28328 15.199 8.89661 14.458 9.44232 13.7532L9.8928 13.159C11.7738 10.6247 12.7147 8.61324 12.7147 7.12657C12.7147 3.95324 10.1566 1.38086 7.00042 1.38086C3.84423 1.38086 1.28613 3.95324 1.28613 7.12657C1.28613 8.61324 2.22709 10.6247 4.10804 13.159L4.55851 13.7532C5.33703 14.7508 6.15153 15.7187 7.00042 16.6571Z" stroke="#676767" stroke-linecap="round" stroke-linejoin="round" />
                                                                <path d="M7.00009 9.47626C8.31506 9.47626 9.38105 8.41027 9.38105 7.09531C9.38105 5.78034 8.31506 4.71436 7.00009 4.71436C5.68513 4.71436 4.61914 5.78034 4.61914 7.09531C4.61914 8.41027 5.68513 9.47626 7.00009 9.47626Z" stroke="#676767" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            <span className="">{user?.country} - {user?.user_country_time}</span>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row ">
                                    <div className="flex flex-col w-full gap-4 p-4 md:w-1/2 lg:border-r-2 lg:w-1/4 border-borderColor">
                                        <div className="flex flex-row gap-4">
                                            <div className="flex flex-col w-1/2 ">
                                                <span className="text-lg font-semibold font-Inter">$ {user?.earned}</span>
                                                <span className="text-sm text-textSecondary">Total earnings</span>
                                            </div>
                                            <div className="flex flex-col w-1/2 ">
                                                <span className="text-lg font-semibold font-Inter">{user?.active_offer_count}</span>
                                                <span className="text-sm text-textSecondary">Total contract</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-between py-2">
                                            <span className="text-lg font-semibold font-Inter">Video introduction</span>
                                        </div>
                                        {user?.meta_data?.video_link &&
                                            <div className="flex flex-col gap-4 max-w-[300px]">
                                                <div className="youtube-video">
                                                    <iframe
                                                        src={getYouTubeEmbedUrl(user?.meta_data?.video_link)}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        width="100%"
                                                        height="100%"
                                                        scrolling="no"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </div>
                                        }
                                        <div className="flex flex-col ">
                                            <div className="flex flex-row justify-between py-2">
                                                <span className="text-lg font-semibold font-Inter">Languages</span>
                                            </div>
                                            {userLanguages?.map((language: any, index: number) => (
                                                <div key={index} className="flex flex-row items-center justify-between space-y-2 ">
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-sm font-medium text-black text-nowrap ">{language?.language} :</span>
                                                        <div className="flex flex-row gap-1">
                                                            <span className="text-sm text-textSecondary">{language?.level}</span>
                                                            <div>
                                                                <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8.50104 1.6875C4.69297 1.6875 1.59479 4.96793 1.59479 9C1.59479 13.0321 4.69297 16.3125 8.50104 16.3125C12.3091 16.3125 15.4073 13.0321 15.4073 9C15.4073 4.96793 12.3091 1.6875 8.50104 1.6875ZM12.0953 6.54926L7.63278 12.1743C7.58383 12.236 7.52292 12.2859 7.45417 12.3205C7.38543 12.3551 7.31046 12.3737 7.23434 12.375H7.22537C7.15091 12.375 7.07729 12.3584 7.00928 12.3263C6.94126 12.2942 6.88039 12.2473 6.83059 12.1887L4.91809 9.93867C4.86952 9.88413 4.83173 9.81985 4.80696 9.74962C4.78219 9.6794 4.77092 9.60463 4.77382 9.52973C4.77673 9.45482 4.79374 9.38129 4.82387 9.31345C4.854 9.24561 4.89663 9.18482 4.94926 9.13468C5.00189 9.08453 5.06345 9.04603 5.13034 9.02143C5.19722 8.99684 5.26807 8.98664 5.33873 8.99146C5.40938 8.99627 5.47842 9.01599 5.54178 9.04945C5.60513 9.08292 5.66153 9.12946 5.70766 9.18633L7.21143 10.9554L11.2818 5.82574C11.3731 5.71397 11.5023 5.64474 11.6414 5.633C11.7805 5.62126 11.9184 5.66796 12.0253 5.76301C12.1322 5.85806 12.1994 5.99382 12.2125 6.14095C12.2256 6.28807 12.1835 6.43474 12.0953 6.54926Z" fill="#004AAD" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>

                                        <div className="flex flex-col gap-4 ">
                                            <div className="flex flex-row justify-between py-2">
                                                <span className="text-lg font-semibold font-Inter">Education</span>
                                            </div>
                                            {educations.map((education: any, index: number) => (
                                                <div key={index} className="flex flex-row justify-between w-full gap-2">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-2xl font-medium text-black ">{education.school}</span>
                                                        <span className="text-lg font-medium text-textSecondary">{education.degree} {education.area_of_study}</span>
                                                        {education?.end_date ? <span className="text-sm text-textSecondary">{education.start_date_human} - {education.end_date_human}</span> : <span className="text-sm text-textSecondary">{education.start_date_human} - Present</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-3/4 ">
                                        <div className="flex flex-col gap-4 p-8 border-b-2 border-borderColor">
                                            <div className="flex flex-row justify-between sm:gap-20">
                                                <p className="text-3xl font-semibold font-Inter">{user?.meta_data?.title ?? 'Update your title here'}</p>
                                            </div>
                                            <div className="flex flex-row justify-between sm:gap-20">
                                                <p className="mt-2">
                                                    {user?.meta_data?.profile_overview || 'Update your description here'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 p-8 border-b-2 border-borderColor">
                                            <div className="flex flex-col justify-between py-4 sm:gap-5">
                                                <div className="flex flex-row justify-between">
                                                    <span className="text-3xl font-semibold font-Inter">Portfolio</span>
                                                </div>
                                            </div>
                                            <PortfolioCarouselView activePortfolios={activePortfolios} />
                                        </div>
                                        <div className="flex flex-col gap-4 p-8 border-b-2 border-borderColor overflow-y-auto max-h-[560px]">
                                            <span className="text-3xl font-semibold font-Inter">Work History</span>
                                            {reviews?.length > 0 ? (
                                                reviews?.map((review: any) => (
                                                    <div className='flex flex-col py-6 sm:flex-row '>
                                                        <div className='flex flex-col w-full gap-4 sm:w-4/5'>
                                                            <div className='flex '>
                                                                <h1 className='text-xl font-medium text-primaryBtnColor font-Inter'>{review?.offer?.contract_title}</h1>
                                                            </div>
                                                            <div>
                                                                <div className="flex flex-col justify-start gap-4 sm:items-center sm:flex-row ">
                                                                    <div className="flex items-center gap-2">
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
                                                                        <span className="mt-1 text-sm font-medium text-textSecondary text-start">{review?.avg_score_rate}</span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 mt-1 text-sm font-medium text-textSecondary text-start font-Inter">

                                                                        <p>{review?.offer?.created_at_human} - {review?.offer?.due_date_formatted}</p>
                                                                    </div>


                                                                </div>


                                                            </div>
                                                            <div>
                                                                <p className="text-base font-medium text-textSecondary text-start font-Inter ">
                                                                    <DescriptionWidget description={review?.feedback} attachments={[]} id={review?.id} title="" />
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <p>$ {review?.offer?.offer_price}</p>
                                                                <span></span>
                                                                <p>{review?.offer?.payment_type === 'Milestone' ? 'Milestone Project' : 'Fixed-price'}</p>
                                                            </div>
                                                        </div>

                                                    </div>

                                                ))
                                            ) : (
                                                <p className="text-gray-400">No work history available</p>
                                            )}

                                        </div>
                                        <div className='flex flex-row justify-between p-8 '>
                                            <div className="">
                                                <span className="text-3xl font-semibold font-Inter">Skills</span>
                                                <SkillWidget skills={user?.skills} title="" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div>
                            </div>
                        </div>

                    </section>
                    <div className="flex flex-col p-6 m-3 border-2 rounded-2xl border-borderColor">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-medium text-black">Employment History</div>
                        </div>
                        <div className="flex flex-col gap-4 py-4">
                            {employmentHistory && employmentHistory.length > 0 ? (
                                employmentHistory.map((history) => (
                                    <div key={history.id} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-black text-md">
                                                    {history.position} <span className="font-normal">|</span> {history.company_name}
                                                </p>
                                                <p className="text-sm text-gray-500 ">
                                                    {history.start_date.split('T')[0]} – {history.currently_working ? 'Present' : history.end_date.split('T')[0]}
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No employment history available</p>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
