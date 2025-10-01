import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Job, User } from "@/types";
import { Fragment, useEffect, useRef } from "react";
import SearchInput from "@/Components/elements/inputs/SearchInput";
import { useDebouncedCallback } from "use-debounce";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import useState from "react-usestateref";
import Pagination from "@/Components/shared/Pagination";
import { Menu, Transition } from "@headlessui/react";
import TitleWidget from "@/Components/shared/partials/TitleWidget";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function AllJobs({
    user,
    jobs,
    filters,
    offers,
    completedOffers,
}: {
    user: User;
    jobs: any,
    filters: any;
    offers: any;
    completedOffers: any;
}) {
    const [searchParam, setSearchParam] = useState("");
    const [sortType, setSortType] = useState(filters.sortType ?? "all-jobs");
    const [sortBy, setSortBy, sortByRef] = useState(filters.sortBy ?? "created_at");
    const [sortDirection, setSortDirection, sortDirectionRef] = useState(filters.sortDirection ?? "desc");
    const [page, setPage] = useState(filters.page ?? 1);
    const [rowPerPage, setRowPerPage] = useState(filters.perPage ?? 5);

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
        } else {
            revisitPage();
        }
    }, [searchParam, sortBy, sortDirection, sortType]);

    const handleSortBy = (e: any) => {
        setSortBy(e);
        revisitPage();
    };

    const handleSortType = (e: any) => {
        setSortType(e);
        revisitPage();
    }

    function revisitPage() {
        router.get(
            url,
            {
                page: page,
                rowPerPage: rowPerPage,
                sortBy: sortBy,
                sortDirection: sortDirection,
                searchParam: searchParam,
                sortType: sortType,
            },
            {
                replace: true,
                preserveState: true,
            }
        );
    }

    const [selectedOfferType, setSelectedOfferType] = useState('in-progress');
    const [selectedOffers, setSelectedOffers] = useState(offers);

    const handleType = (type: string) => {
        setSelectedOfferType(type);
        if (type === "in-progress") {
            setSelectedOffers(offers);
        } else {
            setSelectedOffers(completedOffers);
        }
    };

    const handleOfferClick = (offer: any) => {
        router.get(route('client.contracts.show', offer?.id));
    };

    // Sample news arrays
    const cricketNews = [
        { id: 1, title: "India Clinches Thrilling Win Against Australia", excerpt: "India edged out Australia in a nail-biting final over, securing a memorable victory in the series.", category: "Cricket", published_at: "2025-09-29T18:30:00Z", author: "Rahul Sharma", image: "/images/cricket/india-vs-aus.jpg", content: "India faced Australia..." },
        { id: 2, title: "ICC Updates Rankings After T20 Series", excerpt: "The latest ICC rankings see some major changes after the concluded T20 series.", category: "Cricket", published_at: "2025-09-28T10:00:00Z", author: "Priya Menon", image: "/images/cricket/icc-rankings.jpg", content: "The ICC has released..." },
        { id: 3, title: "Top 5 Young Cricketers To Watch This Season", excerpt: "A spotlight on emerging talent who could change the game in the upcoming cricket season.", category: "Cricket", published_at: "2025-09-27T14:45:00Z", author: "Amit Desai", image: "/images/cricket/young-stars.jpg", content: "From India to Australia..." }
    ];

    const footballNews = [
        { id: 1, title: "Lionel Messi Leads PSG to Victory", excerpt: "Messi scored a brace as PSG defeated Marseille 3-1 in a thrilling Ligue 1 encounter.", category: "Football", published_at: "2025-09-29T20:00:00Z", author: "Carlos Vega", image: "/images/football/psg-vs-marseille.jpg", content: "PSG dominated the match..." },
        { id: 2, title: "Premier League: Chelsea Tops the Table", excerpt: "Chelsea climbs to the top after a 2-0 win over Liverpool.", category: "Football", published_at: "2025-09-28T16:00:00Z", author: "Sophie Clarke", image: "/images/football/chelsea-liverpool.jpg", content: "Chelsea showed great teamwork..." }
    ];

    const basketballNews = [
        { id: 1, title: "Lakers Win Nail-Biter Against Celtics", excerpt: "LeBron James scores 35 points to lead Lakers past Celtics in a thrilling game.", category: "Basketball", published_at: "2025-09-29T19:00:00Z", author: "James Carter", image: "/images/basketball/lakers-celtics.jpg", content: "The Lakers showed resilience..." }
    ];

    const badmintonNews = [
        { id: 1, title: "PV Sindhu Advances to Finals at World Championship", excerpt: "Sindhu dominates semifinals to reach finals in impressive fashion.", category: "Badminton", published_at: "2025-09-28T15:30:00Z", author: "Ravi Kumar", image: "/images/badminton/sindhu-final.jpg", content: "Sindhu played superbly..." }
    ];

    const allNews = [...cricketNews, ...footballNews, ...basketballNews, ...badmintonNews];

    const title = sortType === "all-jobs" ? "All News" :
        sortType === "contracts" ? "All Cricket News" :
            sortType === "football" ? "All Football News" :
                sortType === "basketball" ? "All Basketball News" :
                    "All Badminton News";

    return (
        <AppLayout isClientHeader={false} isHeader={true} isFooter={true}>
            <Head title={title} />
            <section className="flex justify-center min-h-screen py-20 mt-20 bg-white ">
                <div className="container px-4 mx-auto mt-8 sm:px-6 lg:px-8">
                    <header className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-row items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-semibold">
                                    Hi, {user?.first_name?.charAt(0).toUpperCase() + user?.first_name?.slice(1).toLowerCase()}
                                </div>
                                <div className="text-2xl font-semibold">👋</div>
                            </div>
                            {/* <Link
                                className="flex items-center gap-2 px-4 py-2 text-center text-white bg-blue-800 rounded-full sm:mt-4"
                                href={route("client.job.create")}
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Post a Job</span>
                            </Link> */}
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-6 pb-6 border-borderColor">
                                <div className="flex flex-row gap-6 border-b">
                                    <button className={`p-1 text-base font-medium text-start ${sortType === "all-jobs" ? "text-primary border-b border-primary" : "text-gray-800"}`} onClick={() => handleSortType("all-jobs")}>All News</button>
                                    <button className={`p-1 text-base font-medium text-start ${sortType === "contracts" ? "text-primary border-b-2 border-primary" : "text-gray-800"}`} onClick={() => handleSortType("contracts")}>Cricket</button>
                                    <button className={`p-1 text-base font-medium text-start ${sortType === "football" ? "text-primary border-b-2 border-primary" : "text-gray-800"}`} onClick={() => handleSortType("football")}>Football</button>
                                    <button className={`p-1 text-base font-medium text-start ${sortType === "basketball" ? "text-primary border-b-2 border-primary" : "text-gray-800"}`} onClick={() => handleSortType("basketball")}>Basketball</button>
                                    <button className={`p-1 text-base font-medium text-start ${sortType === "badminton" ? "text-primary border-b-2 border-primary" : "text-gray-800"}`} onClick={() => handleSortType("badminton")}>Badminton</button>
                                </div>

                                <div className="flex flex-col max-h-screen gap-4 overflow-x-auto mt-4">
                                    {sortType === "all-jobs" && <NewsList news={allNews} />}
                                    {sortType === "contracts" && <NewsList news={cricketNews} highlight="text-primary" />}
                                    {sortType === "football" && <NewsList news={footballNews} highlight="text-green-600" />}
                                    {sortType === "basketball" && <NewsList news={basketballNews} highlight="text-purple-600" />}
                                    {sortType === "badminton" && <NewsList news={badmintonNews} highlight="text-orange-600" />}
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-col gap-4 ">
                        {/* Job List */}
                        {sortType === "all-jobs" && jobs?.data?.length > 0 &&
                            <div className="flex flex-col border-gray-200">
                                {jobs?.data?.map((job: any) => (
                                    <div key={job.id} className={`p-4 w-full bg-[#f2f6fb]/40 border-t border-[#cfcfcf] flex flex-col gap-2.5`}>
                                        {/* Job card content preserved */}
                                    </div>
                                ))}
                            </div>
                        }

                        {(jobs?.data?.length > 0 && sortType === "all-jobs") &&
                            <Pagination links={jobs.meta.links} />
                        }
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

// NewsList helper component
function NewsList({ news, highlight = "text-primary" }: { news: any[], highlight?: string }) {
    return (
        <div className="flex flex-col max-h-screen gap-4 overflow-x-auto">
            {news.length > 0 ? (
                news.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 p-4 border-b border-gray-300 sm:p-6 hover:bg-gray-50 cursor-pointer">
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                            <img src={item.image} className="w-[100px] h-[100px] rounded-lg object-cover" alt={item.title} />
                            <div className="flex flex-col gap-1">
                                <h3 className={`text-lg font-semibold ${highlight} font-Inter`}>{item.title}</h3>
                                <p className="text-gray-600 text-sm font-Inter">{item.excerpt}</p>
                                <span className="text-xs text-gray-500 font-Inter">
                                    By {item.author} - {new Date(item.published_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">No News Found.</div>
            )}
        </div>
    );
}

// SortDropdown remains unchanged
export function SortDropdown({ setSortBy, setSortDirection, sortByRef, sortDirectionRef, revisitPage }: any) {
    const sortTypes = [
        { by: "created_at", direction: "desc", label: "Newest First" },
        { by: "created_at", direction: "asc", label: "Oldest First" },
        { by: "status", direction: "desc", label: "Ongoing First" },
        { by: "status", direction: "asc", label: "Draft First" },
    ];

    function getActive(sort: any, direction: any) {
        var current = sortTypes.find(c => c.by == sort && c.direction == direction);
        return current ? current.label : "";
    }

    function sort(option: any) {
        setSortBy(option.by);
        setSortDirection(option.direction);
        revisitPage();
    }

    return (
        <Menu as="div" className="relative inline-block w-40 text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {getActive(sortByRef, sortDirectionRef)}
                    <ChevronDownIcon className="w-5 h-5 -mr-1 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {sortTypes.map((option, index: number) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <button onClick={() => sort(option)} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}>
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
