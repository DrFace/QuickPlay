import AppLayout from "@/Layouts/AppLayout";
import { Job, User } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import useState from "react-usestateref";
import { router } from "@inertiajs/react";
import SearchInput from "@/Components/elements/inputs/SearchInput";
import { Rating } from "react-simple-star-rating";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import ApplicantView from "./Partials/ApplicantView";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import { fillColorArray } from "@/lib/fillColorArray";
import { formatNumber } from "@/lib/utility";



export default function FreelancerDashboard({
    jobs,
    user,
    filters,
    jobSkills,
}: {
    user: any;
    jobs: any;
    filters: any;
    jobSkills: any;
}) {
    const [searchParam, setSearchParam] = useState("");
    const [sortBy, setSortBy, sortByRef] = useState(filters?.sortBy ?? "created_at");
    const [sortDirection, setSortDirection, sortDirectionRef] = useState(filters?.sortDirection ?? "desc");
    const [page, setPage] = useState(filters?.page ?? 1);
    const [rowPerPage, setRowPerPage] = useState(filters?.perPage ?? 5);



    const initialRender = useRef(true);
    const url = window.location.pathname;
    const resetSearch = () => {
        setSearchParam("");
        revisitPage();
    };

    const debouncedHandleSearch = useDebouncedCallback(
        (value: any) => {
            setSearchParam(value);
            revisitPage();
        },
        1000
    );

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        revisitPage();
    }
        , [searchParam, sortBy, sortDirection, page, rowPerPage]);


    function revisitPage() {
        router.get(
            url,
            {
                searchParam: searchParam,
                sortBy: sortBy,
                sortDirection: sortDirection,
                page: page,
                rowPerPage: rowPerPage,
            },
            {
                replace: true,
                //preserveState: true,
                preserveState: true,
                preserveScroll: true,
            }
        );
    }

    const handleRowPerPage = (rows: any) => {
        setRowPerPage(rows + 5);
        revisitPage();
    };


    const [creditDropdown, setCreditDropdown] = useState(true);
    const [preferencesDropdown, setPreferencesDropdown] = useState(true);
    const [proposalsDropdown, setProposalsDropdown] = useState(true);
    const [catalogDropdown, setCatalogDropdown] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleJobClick = (job: any) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleFavoriteJob = (jobId: string) => {
        router.post(
            route("freelancer.favoriteJob.store"),
            {
                user_id: user.id,
                job_id: jobId,
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setIsModalOpen(false);

                },
            }
        );
    };


   // console.log("jobs", jobs.data);
    return (
        <>
            <AppLayout isFreelancerHeader={true} isHeader={false}>
                <Head title="Freelancer Home" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 sm:px-6 lg:px-8 ">
                    <div className="container flex flex-col gap-4 mx-auto mt-8 text-center ">
                        <div className="flex flex-col w-full sm:flex-row ">
                            <div className="p-2 lg:p-6 sm:w-2/3">
                                {/* search bar */}
                                <div className="flex items-center w-full gap-1 ">
                                    <SearchInput
                                        id="search"
                                        className="self-center block w-auto mt-2 font-semibold placeholder:text-sm font-Inter"
                                        defaultValue={searchParam}
                                        placeholder={'Search'}
                                        searchLoader={false}
                                        resetSearch={resetSearch}
                                        autoComplete="search"
                                        onChange={(e) =>
                                            debouncedHandleSearch(e.target.value)
                                        }
                                    />
                                </div>
                                {/* jobs */}
                                {jobs?.data?.length > 0 ? (
                                    <div className="flex flex-col mt-10">
                                        <h1 className="py-5 text-xl font-medium text-left font-Inter ">Jobs you might like</h1>
                                        {jobs?.data?.map((job: any) => (
                                            <button key={job.id} type="button" className="flex flex-col px-4 py-4 text-left border-t hover:bg-cardsColor"
                                                onClick={() => handleJobClick(job)}>
                                                <span className="text-xs font-semibold text-left text-textSecondary font-Inter">Posted {job?.created_at_human_ago}</span>
                                                <div className="flex flex-row justify-between gap-2 py-4 ">
                                                    <h2 className="text-lg font-semibold font-Inter ">{job.title}</h2>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFavoriteJob(job.id);
                                                        }}
                                                        className={`p-2`}
                                                    >
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16"
                                                            fill={job.is_favorite ? "#004AAD" : "none"}
                                                            stroke="#004AAD"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M11.0304 2.50195C9.00123 2.50195 8.00102 4.50239 8.00102 4.50239C8.00102 4.50239 7.0008 2.50195 4.97161 2.50195C3.3225 2.50195 2.01659 3.88163 1.99971 5.52792C1.96533 8.94523 4.71061 11.3754 7.7197 13.4178C7.80266 13.4742 7.90068 13.5044 8.00102 13.5044C8.10135 13.5044 8.19937 13.4742 8.28233 13.4178C11.2911 11.3754 14.0364 8.94523 14.0023 5.52792C13.9854 3.88163 12.6795 2.50195 11.0304 2.50195Z"
                                                                strokeWidth="1.00189"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>


                                                </div>
                                                <DescriptionWidget description={job?.description} id={job?.id} title="" attachments={job?.attachments} />
                                                <div className="grid items-center justify-center grid-cols-2 gap-3 py-5 md:grid-cols-3 lg:grid-cols-4 sm: ">
                                                    {(job?.skill_list) ? (
                                                        (job?.skill_list)?.map((skill: string, index: number) => (
                                                            <p key={index} className="px-3 py-2 text-sm font-medium text-center capitalize bg-skillCardColor text-textSecondary rounded-3xl font-Inter">
                                                                {skill}
                                                            </p>
                                                        ))
                                                    ) : (
                                                        <p>No skills available</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2 sm:gap-4 ">
                                                    {job?.client?.payment_verified &&
                                                        <div className="flex flex-row gap-1 mt-2">
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M8.00264 1.50049C4.41779 1.50049 1.50122 4.41706 1.50122 8.0019C1.50122 11.5867 4.41779 14.5033 8.00264 14.5033C11.5875 14.5033 14.5041 11.5867 14.5041 8.0019C14.5041 4.41706 11.5875 1.50049 8.00264 1.50049ZM11.3862 5.82299L7.18527 10.8241C7.13919 10.879 7.08185 10.9233 7.01714 10.9541C6.95242 10.9849 6.88185 11.0014 6.81019 11.0026H6.80175C6.73165 11.0025 6.66234 10.9878 6.59832 10.9592C6.53429 10.9307 6.47698 10.889 6.43011 10.8369L4.62971 8.83646C4.58399 8.78797 4.54842 8.73082 4.5251 8.66838C4.50178 8.60594 4.49117 8.53947 4.49391 8.47288C4.49664 8.40628 4.51266 8.3409 4.54102 8.28058C4.56938 8.22027 4.60951 8.16623 4.65906 8.12164C4.7086 8.07706 4.76656 8.04282 4.82952 8.02096C4.89248 7.99909 4.95918 7.99003 5.0257 7.99431C5.09221 7.99859 5.1572 8.01612 5.21684 8.04587C5.27648 8.07562 5.32958 8.117 5.373 8.16757L6.78862 9.74041L10.6204 5.17973C10.7063 5.08036 10.8279 5.0188 10.9589 5.00836C11.0899 4.99793 11.2197 5.03945 11.3203 5.12395C11.4209 5.20846 11.4842 5.32916 11.4965 5.45997C11.5089 5.59078 11.4692 5.72118 11.3862 5.82299Z" fill="#004AAD" />
                                                            </svg>
                                                            <p className="text-xs font-medium text-textSecondary text-start font-Inter ">Payment verified</p>
                                                        </div>
                                                    }
                                                    <div className="flex flex-row gap-1 ">
                                                        <Rating
                                                            initialValue={job?.client?.rating}
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
                                                        {/* <span className="mt-1.5 text-xs font-medium text-textSecondary text-start font-Inter ">
                                                            4.5
                                                        </span> */}
                                                    </div>
                                                    <div className="flex flex-row gap-1 mt-2 ">
                                                        <p className="text-xs font-medium text-textSecondary text-start font-Inter ">${formatNumber(job?.client?.total_spent)} spent</p>
                                                    </div>
                                                    <div className="flex flex-row gap-1 mt-2 ">
                                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8.02246 1.50391C5.53755 1.50391 3.52148 3.42276 3.52148 5.78609C3.52148 8.50543 6.52214 12.8148 7.62394 14.3033C7.66967 14.3661 7.72962 14.4172 7.79888 14.4525C7.86814 14.4877 7.94475 14.5061 8.02246 14.5061C8.10018 14.5061 8.17679 14.4877 8.24605 14.4525C8.31531 14.4172 8.37525 14.3661 8.42099 14.3033C9.52279 12.8154 12.5234 8.50762 12.5234 5.78609C12.5234 3.42276 10.5074 1.50391 8.02246 1.50391Z" stroke="#676767" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M8.02389 7.50872C8.85311 7.50872 9.52532 6.83651 9.52532 6.00729C9.52532 5.17807 8.85311 4.50586 8.02389 4.50586C7.19467 4.50586 6.52246 5.17807 6.52246 6.00729C6.52246 6.83651 7.19467 7.50872 8.02389 7.50872Z" stroke="#676767" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>

                                                        <p className="text-xs font-medium text-textSecondary text-start font-Inter ">{job?.client?.country}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-1 mt-2 ">
                                                    <span className="text-xs font-medium text-textSecondary text-start font-Inter ">Proposals: {job?.proposal_count >= 2 ? "Less than " + job?.proposal_count : <span className="text-xs ">{job?.proposal_count}</span>}</span>
                                                </div>


                                            </button>
                                        ))}
                                        {/* load more button */}
                                        {rowPerPage <= jobs.data.length ? (
                                            <div className="flex justify-center mt-5">
                                                <button className="px-6 py-2 font-semibold border-2 text-primary rounded-3xl border-primary font-Inter hover:bg-primary hover:text-white"
                                                    onClick={() => {
                                                        handleRowPerPage(rowPerPage);
                                                    }}

                                                >
                                                    Load more jobs
                                                </button>
                                            </div>
                                        ) :
                                            (
                                                <div className="flex justify-center mt-5">
                                                    <p className="text-lg font-medium text-textSecondary font-Inter">
                                                        No more
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-96">
                                        <p className="text-lg font-medium text-textSecondary font-Inter">
                                            No jobs found
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-5 p-2 lg:p-6 sm:w-1/3">
                                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-cardsColor">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="rounded-full w-14 h-14"
                                                src={user?.avatar}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-xl font-medium text-gray-900 truncate">
                                                {user?.full_name}
                                            </p>
                                            <p className="text-sm font-normal text-gray-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start w-full ">
                                        <Link href={route('freelancer.complete.profile')}
                                         className="w-auto mt-2 font-semibold text-left border-b-2 border-primary text-primary">
                                            Complete your profile
                                        </Link>
                                    </div>

                                    {/* percentage bar */}
                                    <div className="flex flex-col w-full gap-1">
                                        {/* Percentage Progress Bar Container */}
                                        <div className="flex flex-row items-center justify-between w-full h-2 gap-2 bg-progressBarColor rounded-3xl">
                                            {/* Dynamic Progress Bar */}
                                            <div className="flex w-full flex-col h-[8px] bg-gray-400 rounded-3xl">
                                                {/* Progress bar */}
                                                <div
                                                    className="h-full bg-primary rounded-3xl"
                                                    style={{ width: `${user?.profile_complete_percentage}%` }} // Dynamically set the width
                                                ></div>
                                            </div>
                                            {/* Percentage Text */}
                                            <p className="text-xs font-medium text-textSecondary font-Inter">
                                                {user?.profile_complete_percentage}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 px-5 py-6 rounded-2xl bg-cardsColor">
                                    <div className="flex flex-col py-4">
                                        <div className="flex flex-row items-center justify-between py-2">
                                            <h1 className="text-xl font-medium text-left font-Inter">Credits</h1>
                                            {creditDropdown ? (
                                                <ChevronDownIcon className="w-4 h-4 " onClick={() => setCreditDropdown(false)} />
                                            ) : (
                                                <ChevronUpIcon className="w-4 h-4 " onClick={() => setCreditDropdown(true)} />
                                            )}
                                        </div>
                                        {creditDropdown &&
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-row justify-between">
                                                    <p className="text-sm font-medium text-left font-Inter">Available: {parseFloat(user?.available_connects).toFixed(0)} Connects</p>
                                                </div>
                                                <div className="flex flex-row gap-4 justify-left">
                                                    <p className="text-sm font-medium text-left border-b border-primaryBtnColorHover text-primary font-Inter"><Link href={route('freelancer.account')}>View details</Link></p>

                                                    <p className="text-sm font-medium text-left border-b border-primaryBtnColorHover text-primary font-Inter"><Link href={route('freelancer.credits')}>Buy credits</Link></p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="flex flex-col gap-4 py-4 border-t-2">
                                        <div className="flex flex-row items-center justify-between py-2">
                                            <h1 className="text-xl font-medium text-left font-Inter">Preferences</h1>
                                            {preferencesDropdown ? (
                                                <ChevronDownIcon className="w-4 h-4 " onClick={() => setPreferencesDropdown(false)} />
                                            ) : (
                                                <ChevronUpIcon className="w-4 h-4 " onClick={() => setPreferencesDropdown(true)} />
                                            )}
                                        </div>
                                        {preferencesDropdown &&
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-base font-semibold text-left font-Inter">Profile Visibility</p>
                                                        <p className="text-sm font-medium text-left text-gray-500 font-Inter">{user?.meta_data?.visibility || 'Update your account setting'}</p>
                                                    </div>
                                                    {/* <button className="flex">
                                                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5647 3.19349L13.3076 4.9364L14.2667 3.94671C14.4202 3.79312 14.505 3.56009 14.505 3.34113C14.5054 3.2344 14.4846 3.12865 14.4439 3.02998C14.4032 2.93131 14.3434 2.84166 14.2679 2.76621L13.7361 2.23445C13.6606 2.15865 13.5708 2.09856 13.4719 2.05765C13.373 2.01674 13.267 1.99582 13.16 1.9961C12.9426 1.9961 12.708 2.08055 12.555 2.23445L11.5647 3.19349ZM1.50073 14.9985H3.21986L12.9379 5.30487L11.1947 3.56137L1.50073 13.2794V14.9985Z" fill="#004AAD" />
                                                        </svg>
                                                    </button> */}
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-base font-semibold text-left font-Inter">Project Preference</p>
                                                        <p className="text-sm font-medium text-left text-gray-500 font-Inter">{user?.meta_data?.project_preference || 'Update your account setting'}</p>
                                                    </div>
                                                    {/* <button className="flex">
                                                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5647 3.19349L13.3076 4.9364L14.2667 3.94671C14.4202 3.79312 14.505 3.56009 14.505 3.34113C14.5054 3.2344 14.4846 3.12865 14.4439 3.02998C14.4032 2.93131 14.3434 2.84166 14.2679 2.76621L13.7361 2.23445C13.6606 2.15865 13.5708 2.09856 13.4719 2.05765C13.373 2.01674 13.267 1.99582 13.16 1.9961C12.9426 1.9961 12.708 2.08055 12.555 2.23445L11.5647 3.19349ZM1.50073 14.9985H3.21986L12.9379 5.30487L11.1947 3.56137L1.50073 13.2794V14.9985Z" fill="#004AAD" />
                                                        </svg>
                                                    </button> */}
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-col gap-2 ">
                                                        <p className="text-base font-semibold text-left font-Inter">My Categories</p>

                                                        {jobSkills && jobSkills?.length > 0 ? (
                                                            jobSkills?.map((skill: any, index: number) => (
                                                                <p key={index} className="text-sm font-medium text-left text-gray-500 font-Inter">{skill?.category_name}</p>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm font-medium text-left text-gray-500 font-Inter">No categories added</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-4 py-4 border-t-2">
                                        <div className="flex flex-row items-center justify-between py-2">
                                            <h1 className="text-xl font-medium text-left font-Inter">Proposals</h1>
                                            {proposalsDropdown ? (
                                                <ChevronDownIcon className="w-4 h-4 " onClick={() => setProposalsDropdown(false)} />
                                            ) : (
                                                <ChevronUpIcon className="w-4 h-4 " onClick={() => setProposalsDropdown(true)} />
                                            )}
                                        </div>
                                        {proposalsDropdown &&
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-col gap-4">
                                                        <p className="text-xs font-medium text-left underline text-primaryBtnColor font-Inter"><Link href={route('freelancer.proposals.index')}>My Proposals</Link></p>
                                                        {/* <p className="text-xs font-medium text-left underline text-primaryBtnColor font-Inter">1 active candidates</p>
                                                        <p className="text-xs font-medium text-left underline text-primaryBtnColor font-Inter">6 submitted proposals</p> */}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* <div className="flex flex-col gap-4 py-4 border-t-2">
                                        <div className="flex flex-row items-center justify-between py-2">
                                            <h1 className="text-xl font-medium text-left font-Inter">Project Catalog</h1>
                                            {catalogDropdown ? (
                                                <ChevronDownIcon className="w-4 h-4 " onClick={() => setCatalogDropdown(false)} />
                                            ) : (
                                                <ChevronUpIcon className="w-4 h-4 " onClick={() => setCatalogDropdown(true)} />
                                            )}
                                        </div>
                                        {catalogDropdown &&
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-col gap-4">
                                                        <p className="text-xs font-medium text-left underline text-primaryBtnColor font-Inter">My Project Dashboard</p>
                                                        <p className="text-xs font-medium text-left text-black font-Inter"> <span className="underline text-primaryBtnColor" >Create a Catalog project</span> for clients to purchase instantly</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div> */}
                                </div>

                            </div>
                        </div>

                    </div>
                </section>
                {isModalOpen && (
                    <ApplicantView
                        job={selectedJob}
                        onClose={() => setIsModalOpen(false)}
                        user={user}
                        handleFavoriteJob={handleFavoriteJob}

                    />
                )}
            </AppLayout>
        </>
    );
}

