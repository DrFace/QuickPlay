import PortfolioCarouselView from '@/Components/elements/carousel/PortfolioCarouselView';
import DescriptionWidget from '@/Components/shared/partials/DescriptionWidget';
import SkillWidget from '@/Components/shared/partials/SkillWidget';
import { formatNumber } from '@/lib/utility';
import { Job } from '@/types';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { fillColorArray } from "@/lib/fillColorArray";
import { Rating } from 'react-simple-star-rating';

const ApplicantView = ({ proposal, onClose, job }: { proposal: any; onClose: () => void, job: Job }) => {
    const modalRef = useRef<HTMLDivElement>(null); // Explicitly define the type

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose(); // Close the modal
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!proposal) return null;


    const [selectedWorkHistory, setSelectedWorkHistory] = useState('completed');

    const handleWorkHistory = (type: string) => () => {
        setSelectedWorkHistory(type);
    };


   // console.log("proposal", proposal);

    return (
        <div className="fixed inset-0 z-20 flex justify-end bg-black bg-opacity-70">
            <div
                ref={modalRef}
                className="w-11/12 h-full overflow-y-auto bg-white shadow-lg w- sm:w-2/3 rounded-tl-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-borderColor">

                    <Link
                        href={route('client.applicant.show', proposal?.id)}
                        className="flex items-center space-x-2 text-primaryBtnColor hover:text-primaryBtnColorHover">
                        <ArrowLeftIcon className="w-6 h-6 cursor-pointer" />
                    </Link>

                    <a
                        href={route('client.applicant.show', proposal?.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primaryBtnColor hover:text-primaryBtnColorHover"
                    >
                        <span className="text-xs font-medium sm:text-base">Open proposal in a new window</span>
                        <ArrowTopRightOnSquareIcon className="w-6 h-6 cursor-pointer" />
                    </a>

                    {/* <button onClick={onClose}>Close</button> */}
                </div>
                <div className="p-2 sm:p-6">
                    <div className="flex px-3 py-4 border-2 sm:px-6 lg:py-8 rounded-t-3xl">
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex flex-col justify-between w-full gap-4 lg:flex-row">
                                <div className="flex flex-row w-full gap-2 lg:w-2/3 text-start">
                                    <div className="relative items-start gap-4 mr-5 sm:w-20 ">
                                        <div className="absolute w-3 h-3 bg-green-400 rounded-full left-1 top-1 ring-2 ring-white"></div>
                                        <img
                                            className="w-[70px] h-[70px] rounded-full"
                                            src={proposal?.freelancer?.avatar}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xl font-semibold font-Inter ">{proposal?.freelancer?.full_name} </span>
                                            <div className="flex items-center gap-2 text-sm font-medium text-textSecondary">
                                                <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00042 16.6571L7.60137 15.9799C8.28328 15.199 8.89661 14.458 9.44232 13.7532L9.8928 13.159C11.7738 10.6247 12.7147 8.61324 12.7147 7.12657C12.7147 3.95324 10.1566 1.38086 7.00042 1.38086C3.84423 1.38086 1.28613 3.95324 1.28613 7.12657C1.28613 8.61324 2.22709 10.6247 4.10804 13.159L4.55851 13.7532C5.33703 14.7508 6.15153 15.7187 7.00042 16.6571Z" stroke="#676767" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M7.00009 9.47626C8.31506 9.47626 9.38105 8.41027 9.38105 7.09531C9.38105 5.78034 8.31506 4.71436 7.00009 4.71436C5.68513 4.71436 4.61914 5.78034 4.61914 7.09531C4.61914 8.41027 5.68513 9.47626 7.00009 9.47626Z" stroke="#676767" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <span className="">{proposal?.freelancer?.country}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-textSecondary">
                                                <span className="">{proposal?.freelancer?.user_country_time}</span>
                                            </div>

                                        </div>
                                        <div className="flex flex-col gap-4 md:flex-row">
                                            <Link
                                                href={route('client.talent.show', proposal?.freelancer?.id)}
                                                className="underline text-start text-primaryBtnColor hover:text-primaryBtnColorHover">View profile</Link>
                                            <div className="flex items-center gap-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999ZM3.5519 11.9999C3.5519 16.6656 7.3342 20.4479 11.9999 20.4479C16.6656 20.4479 20.4479 16.6656 20.4479 11.9999C20.4479 7.3342 16.6656 3.5519 11.9999 3.5519C7.3342 3.5519 3.5519 7.3342 3.5519 11.9999Z" fill="#D9D9D9" />
                                                    <path d="M11.9999 2.9759C11.9999 2.65779 12.258 2.3981 12.5756 2.41718C13.6394 2.48108 14.6866 2.72179 15.6737 3.13066C16.8384 3.6131 17.8967 4.32024 18.7881 5.21168C19.6796 6.10312 20.3867 7.16142 20.8691 8.32614C21.3516 9.49087 21.5999 10.7392 21.5999 11.9999C21.5999 13.2606 21.3516 14.5089 20.8691 15.6737C20.3867 16.8384 19.6796 17.8967 18.7881 18.7881C17.8967 19.6796 16.8384 20.3867 15.6737 20.8691C14.6866 21.278 13.6394 21.5187 12.5756 21.5826C12.258 21.6017 11.9999 21.342 11.9999 21.0239C11.9999 20.7058 12.2581 20.4499 12.5755 20.4283C13.4879 20.366 14.3855 20.1558 15.2328 19.8048C16.2578 19.3803 17.1891 18.758 17.9735 17.9735C18.758 17.1891 19.3803 16.2578 19.8048 15.2328C20.2294 14.2079 20.4479 13.1093 20.4479 11.9999C20.4479 10.8905 20.2294 9.79195 19.8048 8.76699C19.3803 7.74204 18.758 6.81073 17.9735 6.02627C17.1891 5.2418 16.2578 4.61952 15.2328 4.19497C14.3855 3.844 13.4879 3.63384 12.5755 3.57153C12.2581 3.54986 11.9999 3.29402 11.9999 2.9759Z" fill="#004AAD" />
                                                    <path d="M16.0969 20.0404C16.2414 20.3238 16.1293 20.6724 15.8377 20.7996C14.8608 21.2256 13.8185 21.4865 12.7533 21.5704C11.4965 21.6693 10.2326 21.5197 9.03357 21.1301C7.83459 20.7405 6.72407 20.1186 5.76544 19.2999C4.8068 18.4811 4.01882 17.4815 3.44648 16.3583C2.87413 15.235 2.52864 14.01 2.42973 12.7532C2.33082 11.4964 2.48042 10.2324 2.87 9.03339C3.25957 7.83441 3.88149 6.72389 4.70024 5.76526C5.39413 4.95281 6.21789 4.26294 7.13676 3.72303C7.41103 3.56187 7.75891 3.67607 7.90333 3.95952C8.04775 4.24296 7.93386 4.58813 7.66091 4.75152C6.8762 5.22128 6.17185 5.81604 5.57623 6.51342C4.85573 7.35702 4.30844 8.33427 3.96561 9.38938C3.62279 10.4445 3.49114 11.5568 3.57818 12.6628C3.66522 13.7688 3.96926 14.8468 4.47292 15.8353C4.97658 16.8238 5.67 17.7034 6.5136 18.4239C7.3572 19.1444 8.33445 19.6917 9.38956 20.0345C10.4447 20.3773 11.557 20.509 12.663 20.4219C13.5773 20.35 14.4724 20.1297 15.3137 19.771C15.6063 19.6462 15.9525 19.757 16.0969 20.0404Z" fill="#004AAD" />
                                                    <path d="M7.03609 7.94495L9.40961 10.033L11.5243 7.4298C11.5835 7.35703 11.6583 7.29855 11.7433 7.25871C11.8283 7.21888 11.9211 7.19872 12.0149 7.19974C12.1088 7.20076 12.2012 7.22293 12.2852 7.2646C12.3693 7.30627 12.4429 7.36636 12.5005 7.44041L14.5185 10.0323L16.9687 7.91439C17.0649 7.83139 17.1842 7.77975 17.3106 7.76638C17.437 7.75302 17.5644 7.77857 17.6759 7.83961C17.7874 7.90065 17.8775 7.99428 17.9343 8.10795C17.9911 8.22163 18.0118 8.34993 17.9936 8.47569L17.0579 14.9287H6.95686L6.00683 8.505C5.98796 8.37854 6.00842 8.24934 6.06544 8.1349C6.12245 8.02045 6.21328 7.92629 6.3256 7.86518C6.43792 7.80406 6.56632 7.77893 6.69341 7.7932C6.82049 7.80747 6.94012 7.86044 7.03609 7.94495ZM7.00552 15.5524H16.9862V16.176C16.9862 16.3415 16.9205 16.5001 16.8035 16.617C16.6865 16.734 16.5278 16.7997 16.3624 16.7997H7.62931C7.46387 16.7997 7.30521 16.734 7.18822 16.617C7.07124 16.5001 7.00552 16.3415 7.00552 16.176V15.5524Z" fill="#004AAD" />
                                                </svg>

                                                <span className="text-xs font-semibold sm:text-base ">{proposal?.freelancer?.job_success}% Job Success</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="justify-end">
                                    <div className='flex gap-3'>
                                        <Link
                                            type="button"
                                            href={`/client/messages/${proposal.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-8 py-1 font-semibold border-2 sm:py-3 rounded-3xl text-primary border-primary">
                                            Message
                                        </Link>
                                        {proposal?.proposal_status == 'submitted' &&
                                            <Link
                                                type="button"
                                                href={`/client/offer/job/${proposal.job_post_id}/proposal/${proposal.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-8 py-1 font-semibold text-white border-2 border-primary sm:py-3 rounded-3xl font-Inter bg-primary">
                                                Hire
                                            </Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col border-2 border-t-0 lg:flex-row text-start rounded-b-3xl">
                        <div className="flex flex-col w-full gap-1 p-4 border-b-2 lg:border-b-0 lg:w-1/3 lg:border-r-2">
                            <h2 className='text-lg font-medium font-Inter'>Applicant</h2>
                            <p className='text-base font-normal font-Inter'>{proposal?.freelancer?.first_name} has applied to your job </p>
                            <span className='font-semibold text-black'>{job?.data?.title}</span>
                        </div>
                        <div className="flex flex-col w-full p-4 sm:p-6 lg:w-2/3">
                            <div className="flex flex-col gap-4 py-3 border-b-2 sm:py-8 sm:flex-row sm:justify-between">
                                <div className='flex flex-col w-full gap-4'>
                                    <h2 className='text-2xl font-medium font-Inter'>Proposal Details</h2>
                                </div>
                                <div className='flex flex-col w-full sm:items-center '>
                                    <h3 className='text-2xl font-medium font-Inter' >$ {proposal?.bid_amount}</h3>
                                    <p className='text-sm font-medium font-Inter text-textSecondary'>Proposed Bid</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 py-3 ">
                                <DescriptionWidget description={proposal?.description} attachments={proposal?.attachments} id={proposal?.id} title='Cover Letter' />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col mt-6 border-2 lg:flex-row text-start rounded-3xl">
                        <div className="flex flex-col w-full gap-2 border-r-2 lg:w-1/3">
                            <div className="flex flex-row justify-between p-4 border-b-2">
                                <div className="flex flex-col w-1/2 gap-2 text-start">
                                    <h3 className='text-2xl font-medium font-Inter'>$ {formatNumber(proposal?.freelancer?.earned)}</h3>
                                    <span className='text-sm font-medium font-Inter text-textSecondary'>Total earnings</span>
                                </div>
                                <div className='flex flex-col text-left '>
                                    <h3 className='text-2xl font-medium font-Inter' >{proposal?.freelancer?.active_offer_count}</h3>
                                    <span className='text-sm font-medium font-Inter text-textSecondary'>Total jobs</span>
                                </div>

                            </div>
                            <div className="flex flex-col justify-between gap-6 p-4">
                                <div className='flex flex-col gap-3 text-start'>
                                    <h3 className='text-lg font-medium font-Inter'>Languages</h3>
                                    {proposal?.freelancer?.language?.map((language: any, index: number) => (
                                        <div key={index} className="flex flex-row items-center justify-between space-y-2 ">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-sm font-medium text-black ">{language?.language} :</span>
                                                <span className="text-sm text-textSecondary">{language?.level}</span>
                                                <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.50104 1.6875C4.69297 1.6875 1.59479 4.96793 1.59479 9C1.59479 13.0321 4.69297 16.3125 8.50104 16.3125C12.3091 16.3125 15.4073 13.0321 15.4073 9C15.4073 4.96793 12.3091 1.6875 8.50104 1.6875ZM12.0953 6.54926L7.63278 12.1743C7.58383 12.236 7.52292 12.2859 7.45417 12.3205C7.38543 12.3551 7.31046 12.3737 7.23434 12.375H7.22537C7.15091 12.375 7.07729 12.3584 7.00928 12.3263C6.94126 12.2942 6.88039 12.2473 6.83059 12.1887L4.91809 9.93867C4.86952 9.88413 4.83173 9.81985 4.80696 9.74962C4.78219 9.6794 4.77092 9.60463 4.77382 9.52973C4.77673 9.45482 4.79374 9.38129 4.82387 9.31345C4.854 9.24561 4.89663 9.18482 4.94926 9.13468C5.00189 9.08453 5.06345 9.04603 5.13034 9.02143C5.19722 8.99684 5.26807 8.98664 5.33873 8.99146C5.40938 8.99627 5.47842 9.01599 5.54178 9.04945C5.60513 9.08292 5.66153 9.12946 5.70766 9.18633L7.21143 10.9554L11.2818 5.82574C11.3731 5.71397 11.5023 5.64474 11.6414 5.633C11.7805 5.62126 11.9184 5.66796 12.0253 5.76301C12.1322 5.85806 12.1994 5.99382 12.2125 6.14095C12.2256 6.28807 12.1835 6.43474 12.0953 6.54926Z" fill="#004AAD" />
                                                </svg>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                                {/* <div className='flex flex-col gap-3 text-start'>
                                    <h3 className='text-lg font-medium font-Inter'>Verifications</h3>
                                    <div className='flex gap-1 text-sm font-medium font-Inter'>
                                        <h4 className='text-black'><span className='text-black'>Phone number: </span>Verified</h4>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.00098 1.6875C4.96891 1.6875 1.68848 4.96793 1.68848 9C1.68848 13.0321 4.96891 16.3125 9.00098 16.3125C13.033 16.3125 16.3135 13.0321 16.3135 9C16.3135 4.96793 13.033 1.6875 9.00098 1.6875ZM12.8066 6.54926L8.08164 12.1743C8.02981 12.236 7.96532 12.2859 7.89253 12.3205C7.81974 12.3551 7.74036 12.3737 7.65977 12.375H7.65027C7.57143 12.375 7.49348 12.3584 7.42146 12.3263C7.34945 12.2942 7.28499 12.2473 7.23227 12.1887L5.20727 9.93867C5.15584 9.88413 5.11583 9.81985 5.0896 9.74962C5.06337 9.6794 5.05144 9.60463 5.05451 9.52973C5.05759 9.45482 5.07561 9.38129 5.1075 9.31345C5.1394 9.24561 5.18454 9.18482 5.24027 9.13468C5.29599 9.08453 5.36118 9.04603 5.432 9.02143C5.50282 8.99684 5.57784 8.98664 5.65265 8.99146C5.72746 8.99627 5.80056 9.01599 5.86764 9.04945C5.93472 9.08292 5.99444 9.12946 6.04328 9.18633L7.63551 10.9554L11.9453 5.82574C12.042 5.71397 12.1788 5.64474 12.3261 5.633C12.4734 5.62126 12.6194 5.66796 12.7325 5.76301C12.8457 5.85806 12.9169 5.99382 12.9308 6.14095C12.9446 6.28807 12.9 6.43474 12.8066 6.54926Z" fill="#004AAD" />
                                        </svg>
                                    </div>
                                    <div className='flex gap-1 text-sm font-medium font-Inter'>
                                        <h4 className='text-black'><span className='text-black'>ID: </span>Verified</h4>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.00098 1.6875C4.96891 1.6875 1.68848 4.96793 1.68848 9C1.68848 13.0321 4.96891 16.3125 9.00098 16.3125C13.033 16.3125 16.3135 13.0321 16.3135 9C16.3135 4.96793 13.033 1.6875 9.00098 1.6875ZM12.8066 6.54926L8.08164 12.1743C8.02981 12.236 7.96532 12.2859 7.89253 12.3205C7.81974 12.3551 7.74036 12.3737 7.65977 12.375H7.65027C7.57143 12.375 7.49348 12.3584 7.42146 12.3263C7.34945 12.2942 7.28499 12.2473 7.23227 12.1887L5.20727 9.93867C5.15584 9.88413 5.11583 9.81985 5.0896 9.74962C5.06337 9.6794 5.05144 9.60463 5.05451 9.52973C5.05759 9.45482 5.07561 9.38129 5.1075 9.31345C5.1394 9.24561 5.18454 9.18482 5.24027 9.13468C5.29599 9.08453 5.36118 9.04603 5.432 9.02143C5.50282 8.99684 5.57784 8.98664 5.65265 8.99146C5.72746 8.99627 5.80056 9.01599 5.86764 9.04945C5.93472 9.08292 5.99444 9.12946 6.04328 9.18633L7.63551 10.9554L11.9453 5.82574C12.042 5.71397 12.1788 5.64474 12.3261 5.633C12.4734 5.62126 12.6194 5.66796 12.7325 5.76301C12.8457 5.85806 12.9169 5.99382 12.9308 6.14095C12.9446 6.28807 12.9 6.43474 12.8066 6.54926Z" fill="#004AAD" />
                                        </svg>
                                    </div>
                                </div> */}
                                <div className='flex flex-col text-start'>
                                    <h3 className='mb-3 text-lg font-medium font-Inter'>Education</h3>
                                    {proposal?.freelancer?.educations.map((education: any, index: number) => (
                                        <div key={index} className="flex flex-row justify-between w-full gap-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-2xl font-medium text-black ">{education.school}</span>
                                                <span className="text-lg font-medium text-textSecondary">{education.degree} {education.area_of_study}</span>
                                                <span className="text-sm text-textSecondary">{education.start_date_human} - {education.end_date_human}</span>
                                            </div>

                                        </div>
                                    ))}


                                </div>


                            </div>
                        </div>
                        <div className="flex flex-col w-full lg:w-2/3 ">

                            <div className='flex flex-col gap-4 p-4 border-b-2 lg:p-8'>
                                <div>
                                    <h1 className='text-xl font-semibold font-Inter'>{proposal?.freelancer?.meta_data?.title || 'Title not updated'}</h1>
                                </div>
                                <div>
                                    <DescriptionWidget title='' description={proposal?.freelancer?.meta_data?.profile_overview} attachments={[]} id={proposal?.id} />
                                </div>
                            </div>

                            <div className='flex flex-col gap-4 p-8 border-b-2'>
                                <div>
                                    <h1 className='text-xl font-semibold font-Inter'>Recent Work History</h1>
                                </div>
                                <div className='flex flex-row gap-4 border-b-2'>
                                    <button
                                        type='button'
                                        onClick={handleWorkHistory('completed')}
                                        className={`text-base font-medium font-Inter border-b-2 ${selectedWorkHistory === 'completed' ? 'border-primary text-primaryBtnColor hover:text-primaryBtnColorHover' : 'border-transparent text-textSecondary hover:text-primaryBtnColorHover'}`}>
                                        Completed jobs
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleWorkHistory('in_progress')}
                                        className={`text-base font-medium font-Inter border-b-2 ${selectedWorkHistory === 'in_progress' ? 'border-primary text-primaryBtnColor hover:text-primaryBtnColorHover' : 'border-transparent text-textSecondary hover:text-primaryBtnColorHover'}`}>
                                        In progress
                                    </button>
                                </div>



                                {selectedWorkHistory === 'completed' ? (
                                    <div className='flex flex-col py-4 border-b-2'>
                                        {proposal?.freelancer?.recent_reviews?.length > 0 ? (
                                            proposal?.freelancer?.recent_reviews?.map((review: any) => (
                                                <div className='flex flex-col py-3 sm:flex-row '>
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
                                            <div className="flex items-center justify-center w-full py-3">
                                                <p className="text-base font-normal text-gray-400 text-start font-Inter">No completed work history available</p>
                                            </div>

                                        )}

                                    </div>
                                ) : (
                                    <>
                                        {proposal?.freelancer?.in_progress_offers?.length > 0 ? (
                                            proposal?.freelancer?.in_progress_offers?.map((offer: any) => (
                                                <div className='flex flex-col py-4 border-b-2'>
                                                    <div>
                                                        <h1 className='text-xl font-medium text-primary font-Inter'>{offer?.contract_title}</h1>
                                                        <span className='text-sm fort-normal text-textSecondary font-Inter'>{offer?.created_at_human} - Present</span>
                                                    </div>
                                                    <div className='flex flex-col gap-2 mt-2'>
                                                        {/* <div className="flex items-center gap-2 text-sm font-medium text-textSecondary">
                                                            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00042 16.6571L7.60137 15.9799C8.28328 15.199 8.89661 14.458 9.44232 13.7532L9.8928 13.159C11.7738 10.6247 12.7147 8.61324 12.7147 7.12657C12.7147 3.95324 10.1566 1.38086 7.00042 1.38086C3.84423 1.38086 1.28613 3.95324 1.28613 7.12657C1.28613 8.61324 2.22709 10.6247 4.10804 13.159L4.55851 13.7532C5.33703 14.7508 6.15153 15.7187 7.00042 16.6571Z" stroke="#676767" stroke-linecap="round" stroke-linejoin="round" />
                                                                <path d="M7.00009 9.47626C8.31506 9.47626 9.38105 8.41027 9.38105 7.09531C9.38105 5.78034 8.31506 4.71436 7.00009 4.71436C5.68513 4.71436 4.61914 5.78034 4.61914 7.09531C4.61914 8.41027 5.68513 9.47626 7.00009 9.47626Z" stroke="#676767" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            <span className="">United State</span>
                                                        </div> */}
                                                        <span className='text-sm fort-normal text-textSecondary font-Inter'>Job in progress</span>
                                                        <div className='flex flex-row justify-between lg:w-1/2'>
                                                            <span className='text-sm font-medium font-Inter'>$ {offer?.offer_price}</span>
                                                            <span className='w-1/2 text-sm font-medium font-Inter text-textSecondary'>{offer?.payment_type === 'Milestone' ? 'Milestone Project' : 'Fixed-price'}</span>
                                                        </div>

                                                    </div>

                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center w-full py-3">
                                                <p className="text-base font-normal text-gray-400 text-start font-Inter">No in progress work history available</p>
                                            </div>
                                        )}
                                    </>
                                )}


                            </div>
                            <div className='flex flex-col gap-4 p-8 border-b-2'>
                                <div>
                                    <h1 className='text-xl font-semibold font-Inter'>Portfolio</h1>
                                    <PortfolioCarouselView activePortfolios={proposal?.freelancer?.portfolios} />
                                </div>


                            </div>
                            <div className='flex flex-col gap-4 p-4 '>
                                <SkillWidget skills={proposal?.freelancer?.skills} title='Skills' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantView;
