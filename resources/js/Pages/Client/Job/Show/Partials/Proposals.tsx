import SearchInput from "@/Components/elements/inputs/SearchInput";
import { Job } from "@/types";
import { Fragment, useEffect, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import { useDebouncedCallback } from "use-debounce";
import ApplicantView from "./ApplicantView";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import useState from "react-usestateref";
import DescriptionWidget from "@/Components/shared/partials/DescriptionWidget";
import SkillWidget from "@/Components/shared/partials/SkillWidget";
import { formatNumber } from "@/lib/utility";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function Proposals({
    filters,
    proposals,
    job,
    chatProposals,
}: {
    filters: any;
    proposals: any;
    job: Job;
    chatProposals: any;
}) {

    const [selectedSortType, setSelectedSortType] = useState(proposals?.data);

    const [searchParam, setSearchParam] = useState("");
    const [sortBy, setSortBy, sortByRef] = useState(filters.sortBy ?? "created_at");
    const [sortDirection, setSortDirection, sortDirectionRef] = useState(filters.sortDirection ?? "desc");
    const [rowPerPage, setRowPerPage] = useState(filters?.perPage ?? 5);
    const [sortType, setSortType] = useState(filters?.sortType ?? "all");

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
        , [searchParam, sortBy, sortDirection, rowPerPage]);



    const handleSortType = (e: any) => {
        setSortType(e);
        setSelectedSortType(e === "all" ? proposals?.data : chatProposals);
    }





    function revisitPage() {

        router.get(
            url,
            {
                sortBy: sortBy,
                sortDirection: sortDirection,
                searchParam: searchParam,
                rowPerPage: rowPerPage,
            },
            {
                replace: true,
                preserveState: true,
            }
        );
    }


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const handleProposalClick = (proposal: any) => {
        setSelectedProposal(proposal);
        setIsModalOpen(true);
    };

    const handleRowPerPage = (rows: any) => {
        setRowPerPage(rows + 5);
        revisitPage();
    };

   // console.log("proposals", proposals);
    return (
        <div className="flex flex-col w-full gap-0">
            <div className="flex flex-col w-full border-t border-gray-400 border-x rounded-t-2xl">
                {/* filter */}
                <div className="gap-6 pt-8">
                    <div className="flex gap-6 px-8 border-b border-borderColor">
                        <button
                            className={`p-1 text-base  ont-medium text-start font-Inter ${sortType === "all" ? "text-primary" : "text-gray-800"}`}
                            onClick={() => handleSortType("all")}
                        >All Proposals ({proposals?.data?.length ?? 0})
                        </button>
                        <button
                            className={`p-1 text-base ont-medium text-start font-Inter ${sortType === "messaged" ? "text-primary" : "text-gray-800"}`}
                            onClick={() => handleSortType("messaged")}
                        >Messaged ({chatProposals?.length ?? 0})
                        </button>
                    </div>
                    {sortType === "all" && (
                        <div className="flex gap-6 px-8 ">
                            <div className="flex flex-col items-center justify-between w-full gap-6 pt-4 pb-8 sm:px-8 sm:flex-row ">
                                {/* search bar */}
                                <div className="flex items-center w-full gap-1 sm:w-2/4">
                                    <SearchInput
                                        id="search"
                                        className="self-center block w-auto mt-2 font-semibold placeholder:text-sm font-Inter"
                                        //isFocused
                                        defaultValue={searchParam}
                                        searchLoader={false}
                                        placeholder={'Search'}
                                        resetSearch={resetSearch}
                                        autoComplete="search"
                                        onChange={(e) =>
                                            debouncedHandleSearch(e.target.value)
                                        }
                                    />
                                </div>
                                {/* sort */}
                                <div className="flex items-center w-full gap-1 sm:justify-center md:w-1/2 lg:w-1/4">
                                    <h2 className="w-20 text-base font-bold sm:w-12 ont-medium text-start font-Inter">Sort :</h2>
                                    <SortDropdown
                                        setSortBy={setSortBy}
                                        setSortDirection={setSortDirection}
                                        sortByRef={sortByRef.current}
                                        sortDirectionRef={sortDirectionRef.current}
                                        revisitPage={revisitPage}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {sortType === "all" ?
                <div className="flex flex-col w-full border border-t border-gray-400 rounded-b-3xl ">
                    {proposals?.data?.length === 0 && (
                        <div className="flex flex-col gap-4 py-10 sm:gap-8">
                            <span className="text-lg font-semibold text-gray-500">No proposals found</span>
                        </div>
                    )}

                    <div className="flex flex-col">
                        {proposals?.data?.map((proposal: any, index: number) => (
                            <button className={`flex px-3 sm:px-6 py-6 sm:py-12 border-b-2  bg-cardsColor bg-opacity-60 hover:bg-opacity-100  ${index === proposals.data.length - 1 ? "rounded-b-3xl" : ""}`}
                                onClick={() => handleProposalClick(proposal)}>
                                <div className="relative items-start w-[78px] hidden gap-4 mr-5 sm:flex">
                                    <div className="absolute w-3 h-3 bg-green-400 rounded-full left-1 top-1 ring-2 ring-white"></div>
                                    <img
                                        className="w-[70px] h-[70px] rounded-full"
                                        src={proposal?.freelancer?.avatar}
                                        alt="avatar"
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-2">

                                    <div className="flex flex-col justify-between w-full gap-4 sm:items-center sm:flex-row">
                                        <div className="flex flex-col gap-2 text-start">
                                            <div className="flex items-center gap-4 ">
                                                <div className="relative flex items-start w-12 sm:gap-4 sm:mr-5 sm:hidden ">
                                                    <div className="absolute z-20 w-3 h-3 bg-green-400 rounded-full left- top-1 ring-2 ring-white"></div>
                                                    <img
                                                        className="w-12 h-12 rounded-full"
                                                        src={proposal?.freelancer?.avatar}
                                                        alt="avatar"
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium font-Inter ">{proposal?.freelancer?.full_name}</span>
                                                    <span className="text-xl font-semibold font-Inter ">{proposal?.freelancer?.meta_data?.title || 'Title not updated'}</span>
                                                    <span className="text-sm font-semibold text-gray-500">{proposal?.freelancer?.country} - {proposal?.freelancer?.user_country_time}</span>
                                                </div>

                                            </div>
                                            <div className="flex flex-wrap gap-4 sm:gap-8">
                                                <span className="text-base font-semibold ">$ {proposal?.bid_amount}</span>
                                                <span className="text-base font-semibold ">$ {formatNumber(proposal?.freelancer?.earned)} earned</span>
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
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                type="button"
                                                href={`/client/messages/${proposal.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-8 py-1 font-semibold border-2 sm:py-3 rounded-3xl text-primary border-primary">
                                                Message
                                            </Link>
                                            <Link
                                                type="button"
                                                href={`/client/offer/job/${proposal.job_post_id}/proposal/${proposal.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-8 py-1 font-semibold text-white border-2 border-primary sm:py-3 rounded-3xl font-Inter bg-primary">
                                                Hire
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex text-start">
                                        <DescriptionWidget description={proposal?.description} attachments={proposal?.attachments} id={proposal?.id} title='' />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <SkillWidget skills={proposal?.freelancer?.skills} title="" />
                                    </div>
                                </div>
                            </button>

                        ))}

                    </div>

                </div>
                :
                <div className="flex flex-col w-full border border-t border-gray-400 rounded-b-3xl ">
                    {chatProposals?.length === 0 && (
                        <div className="flex flex-col gap-4 py-10 sm:gap-8">
                            <span className="text-lg font-semibold text-gray-500">No proposals found</span>
                        </div>
                    )}

                    <div className="flex flex-col">
                        {chatProposals?.map((proposal: any, index: number) => (
                            <button className={`flex px-3 sm:px-6 py-6 sm:py-12 border-b-2  bg-cardsColor bg-opacity-60 hover:bg-opacity-100  ${index === proposals.data.length - 1 ? "rounded-b-3xl" : ""}`}
                                onClick={() => handleProposalClick(proposal)}>
                                <div className="relative items-start w-[78px] hidden gap-4 mr-5 sm:flex">
                                    <div className="absolute w-3 h-3 bg-green-400 rounded-full left-1 top-1 ring-2 ring-white"></div>
                                    <img
                                        className="w-[70px] h-[70px] rounded-full"
                                        src={proposal?.freelancer?.avatar}
                                        alt="avatar"
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-2">

                                    <div className="flex flex-col justify-between w-full gap-4 sm:items-center sm:flex-row">
                                        <div className="flex flex-col gap-2 text-start">
                                            <div className="flex items-center gap-4 ">
                                                <div className="relative flex items-start w-12 sm:gap-4 sm:mr-5 sm:hidden ">
                                                    <div className="absolute z-20 w-3 h-3 bg-green-400 rounded-full left- top-1 ring-2 ring-white"></div>
                                                    <img
                                                        className="w-12 h-12 rounded-full"
                                                        src={proposal?.freelancer?.avatar}
                                                        alt="avatar"
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium font-Inter ">{proposal?.freelancer?.full_name}</span>
                                                    <span className="text-xl font-semibold font-Inter ">{proposal?.freelancer?.meta_data?.title || 'Title not updated'}</span>
                                                    <span className="text-sm font-semibold text-gray-500">{proposal?.freelancer?.country} - {proposal?.freelancer?.user_country_time}</span>
                                                </div>

                                            </div>
                                            <div className="flex flex-wrap gap-4 sm:gap-8">
                                                <span className="text-base font-semibold ">$ {proposal?.bid_amount}</span>
                                                <span className="text-base font-semibold ">${formatNumber(proposal?.freelancer?.earned)} earned</span>
                                                <div className="flex items-center gap-2">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999ZM3.5519 11.9999C3.5519 16.6656 7.3342 20.4479 11.9999 20.4479C16.6656 20.4479 20.4479 16.6656 20.4479 11.9999C20.4479 7.3342 16.6656 3.5519 11.9999 3.5519C7.3342 3.5519 3.5519 7.3342 3.5519 11.9999Z" fill="#D9D9D9" />
                                                        <path d="M11.9999 2.9759C11.9999 2.65779 12.258 2.3981 12.5756 2.41718C13.6394 2.48108 14.6866 2.72179 15.6737 3.13066C16.8384 3.6131 17.8967 4.32024 18.7881 5.21168C19.6796 6.10312 20.3867 7.16142 20.8691 8.32614C21.3516 9.49087 21.5999 10.7392 21.5999 11.9999C21.5999 13.2606 21.3516 14.5089 20.8691 15.6737C20.3867 16.8384 19.6796 17.8967 18.7881 18.7881C17.8967 19.6796 16.8384 20.3867 15.6737 20.8691C14.6866 21.278 13.6394 21.5187 12.5756 21.5826C12.258 21.6017 11.9999 21.342 11.9999 21.0239C11.9999 20.7058 12.2581 20.4499 12.5755 20.4283C13.4879 20.366 14.3855 20.1558 15.2328 19.8048C16.2578 19.3803 17.1891 18.758 17.9735 17.9735C18.758 17.1891 19.3803 16.2578 19.8048 15.2328C20.2294 14.2079 20.4479 13.1093 20.4479 11.9999C20.4479 10.8905 20.2294 9.79195 19.8048 8.76699C19.3803 7.74204 18.758 6.81073 17.9735 6.02627C17.1891 5.2418 16.2578 4.61952 15.2328 4.19497C14.3855 3.844 13.4879 3.63384 12.5755 3.57153C12.2581 3.54986 11.9999 3.29402 11.9999 2.9759Z" fill="#004AAD" />
                                                        <path d="M16.0969 20.0404C16.2414 20.3238 16.1293 20.6724 15.8377 20.7996C14.8608 21.2256 13.8185 21.4865 12.7533 21.5704C11.4965 21.6693 10.2326 21.5197 9.03357 21.1301C7.83459 20.7405 6.72407 20.1186 5.76544 19.2999C4.8068 18.4811 4.01882 17.4815 3.44648 16.3583C2.87413 15.235 2.52864 14.01 2.42973 12.7532C2.33082 11.4964 2.48042 10.2324 2.87 9.03339C3.25957 7.83441 3.88149 6.72389 4.70024 5.76526C5.39413 4.95281 6.21789 4.26294 7.13676 3.72303C7.41103 3.56187 7.75891 3.67607 7.90333 3.95952C8.04775 4.24296 7.93386 4.58813 7.66091 4.75152C6.8762 5.22128 6.17185 5.81604 5.57623 6.51342C4.85573 7.35702 4.30844 8.33427 3.96561 9.38938C3.62279 10.4445 3.49114 11.5568 3.57818 12.6628C3.66522 13.7688 3.96926 14.8468 4.47292 15.8353C4.97658 16.8238 5.67 17.7034 6.5136 18.4239C7.3572 19.1444 8.33445 19.6917 9.38956 20.0345C10.4447 20.3773 11.557 20.509 12.663 20.4219C13.5773 20.35 14.4724 20.1297 15.3137 19.771C15.6063 19.6462 15.9525 19.757 16.0969 20.0404Z" fill="#004AAD" />
                                                        <path d="M7.03609 7.94495L9.40961 10.033L11.5243 7.4298C11.5835 7.35703 11.6583 7.29855 11.7433 7.25871C11.8283 7.21888 11.9211 7.19872 12.0149 7.19974C12.1088 7.20076 12.2012 7.22293 12.2852 7.2646C12.3693 7.30627 12.4429 7.36636 12.5005 7.44041L14.5185 10.0323L16.9687 7.91439C17.0649 7.83139 17.1842 7.77975 17.3106 7.76638C17.437 7.75302 17.5644 7.77857 17.6759 7.83961C17.7874 7.90065 17.8775 7.99428 17.9343 8.10795C17.9911 8.22163 18.0118 8.34993 17.9936 8.47569L17.0579 14.9287H6.95686L6.00683 8.505C5.98796 8.37854 6.00842 8.24934 6.06544 8.1349C6.12245 8.02045 6.21328 7.92629 6.3256 7.86518C6.43792 7.80406 6.56632 7.77893 6.69341 7.7932C6.82049 7.80747 6.94012 7.86044 7.03609 7.94495ZM7.00552 15.5524H16.9862V16.176C16.9862 16.3415 16.9205 16.5001 16.8035 16.617C16.6865 16.734 16.5278 16.7997 16.3624 16.7997H7.62931C7.46387 16.7997 7.30521 16.734 7.18822 16.617C7.07124 16.5001 7.00552 16.3415 7.00552 16.176V15.5524Z" fill="#004AAD" />
                                                    </svg>
                                                    <span className="text-base font-semibold "> {proposal?.freelancer?.job_success}% Job Success</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                type="button"
                                                href={`/client/messages/${proposal.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-8 py-1 font-semibold border-2 sm:py-3 rounded-3xl text-primary border-primary">
                                                Message
                                            </Link>
                                            <Link
                                                type="button"
                                                href={`/client/offer/job/${proposal.job_post_id}/proposal/${proposal.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-8 py-1 font-semibold text-white border-2 border-primary sm:py-3 rounded-3xl font-Inter bg-primary">
                                                Hire
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex text-start">
                                        <DescriptionWidget description={proposal?.description} attachments={proposal?.attachments} id={proposal?.id} title='' />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <SkillWidget skills={proposal?.freelancer?.skills} title="" />
                                    </div>
                                </div>
                            </button>

                        ))}

                    </div>

                </div>
            }


            {/* load more button */}
            {sortType === "all" && (
                rowPerPage <= selectedSortType.length ? (
                    <div className="flex justify-center mt-5">
                        <button className="px-6 py-2 font-semibold border-2 text-primary rounded-3xl border-primary font-Inter hover:bg-primary hover:text-white"
                            onClick={() => {
                                handleRowPerPage(rowPerPage);
                            }}

                        >
                            Load more
                        </button>
                    </div>
                ) :
                    (
                        <div className="flex justify-center mt-5">
                            {proposals?.data?.length !== 0 && (
                                <p className="text-lg font-medium text-textSecondary font-Inter">
                                    No more
                                </p>
                            )}
                        </div>
                    )
            )}

            {isModalOpen && (
                <ApplicantView
                    proposal={selectedProposal}
                    onClose={() => setIsModalOpen(false)}
                    job={job}
                />
            )}
        </div>
    );
}



export function SortDropdown({
    setSortBy,
    setSortDirection,
    sortByRef,
    sortDirectionRef,
    revisitPage,
}: any) {
    const sortTypes = [
        {
            by: "created_at",
            direction: "desc",
            label: "Newest First",
        },
        {
            by: "created_at",
            direction: "asc",
            label: "Oldest First",
        },
        {
            by: "bid_amount",
            direction: "desc",
            label: "Highest price",
        },
        {
            by: "bid_amount",
            direction: "asc",
            label: "Lowest price",
        },


    ];

    function getActive(sort: any, direction: any) {
        var current = sortTypes.find(function (current, index, array) {
            if (current.by == sort && current.direction == direction) {
                return current;
            }
        });
        return current ? "" + current.label : "";
    }

    function sort(option: any) {
        setSortBy(option.by);
        setSortDirection(option.direction);
        revisitPage();
    }
    return (
        <Menu as="div" className="relative inline-block w-full text-left sm:w-40">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {getActive(sortByRef, sortDirectionRef)}
                    <ChevronDownIcon
                        className="w-5 h-5 -mr-1 text-gray-400"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {sortTypes.map((option, index: number) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <button
                                        onClick={() => sort(option)}
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700",
                                            "block px-4 py-2 text-sm"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
