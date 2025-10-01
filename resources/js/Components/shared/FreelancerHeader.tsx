import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    ChevronDownIcon,
    ChevronUpIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Dropdown from "../elements/other/Dropdown";
import SwitchButton from "../elements/buttons/SwitchButton";
import NotificationWidget from "./partials/NotificationWidget";


export default function FreelancerHeader({ appName }: { appName: string }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    let { url }: any = usePage();
    if (url == '/' || url.includes('/?category')) {
        url = '/home'
    }
    const [isVisible, setIsVisible] = useState(true);
    const { auth } = usePage().props;
    const user = (auth as { user?: any }).user;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null); // Ref with appropriate type for the dropdown menu

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]); // Ensure dropdownRef is included as a dependency



    const dropdownNavigation = {
        pages: [

            {
                name: "Find a Work",
                href: route("freelancer.dashboard"),
                startsWith: "/dashboard",
                isMalty: false,
                isVisible: true,
            },
            {
                name: "My Jobs",
                id: 1,
                startsWith: "/",
                isMalty: true,
                isVisible: true,
                maltyLinks: [
                    { name: "My Proposals", href: route("freelancer.proposals.index"), id: 1 },
                    { name: "My Contracts", href: route("freelancer.contracts.index"), id: 2 },

                ],
            },
            {
                name: "Manage Finances",
                id: 1,
                startsWith: "/",
                isMalty: true,
                isVisible: true,
                maltyLinks: [
                    { name: "Financial Overview", href: route("freelancer.financial.overview"), id: 1 },
                    { name: "Transaction History", href: route("freelancer.financial.history"), id: 2 },

                ],
            },
            {
                name: "Messages",
                href: route("freelancer.messages"),
                startsWith: "/messages",
                isMalty: false,
                isVisible: user ? true : false,
            },
            {
                name: "Tickets",
                href: route("freelancer.ticket"),
                startsWith: "/ticket",
                isMalty: false,
                isVisible: user ? true : false,
            },
        ],
    };

    const navigation = {
        pages: user
            ? [
                {
                    name: "Find a Work",
                    href: route("freelancer.dashboard"),
                    startsWith: "/dashboard",
                    isVisible: true,
                    isMalty: false,
                },
                {
                    name: "My Proposals",
                    href: route("freelancer.proposals.index"),
                    startsWith: "/",
                    isVisible: true,
                    isMalty: false,
                },
                {
                    name: "My Contracts",
                    href: route("freelancer.contracts.index"),
                    startsWith: "/",
                    isVisible: true,
                    isMalty: false,
                },
                {
                    name: "Financial overview",
                    href: route("freelancer.financial.overview"),
                    startsWith: "/",
                    isVisible: true,
                    isMalty: false,
                },
                {
                    name: "Transaction history",
                    href: route("freelancer.financial.history"),
                    startsWith: "/",
                    isVisible: true,
                    isMalty: false,
                },
                {
                    name: "Messages",
                    href: route("freelancer.messages"),
                    startsWith: "/messages",
                    isVisible: true,
                    isMalty: false,
                },
                {
                    name: "Ticket",
                    href: route("freelancer.ticket"),
                    startsWith: "/ticket",
                    isVisible: true,
                    isMalty: false,
                },

            ] :
            [
                {
                    name: "Log in",
                    href: route("login"),
                    startsWith: "/login",
                    isVisible: true,
                    isMalty: false,
                },
                {
                    name: "Sign up",
                    href: route("register"),
                    startsWith: "/register",
                    isVisible: true,
                    isMalty: false,
                },
            ]

    };

    const { data, setData, post, processing, errors, reset } = useForm({
        is_active: user?.is_active ?? false,
    });

    const [activeStatus, setActiveStatus] = useState(user?.active_status ?? false);
    const handleToggle = () => {
        setActiveStatus(!activeStatus);
        post(route('profile.activate'));
        setIsDropdownOpen(false);
    };


    const [settingsOpen, setSettingsOpen] = useState(false);

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    };

    return (
        <>
            <Transition.Root show={mobileMenuOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40 lg:hidden"
                    onClose={setMobileMenuOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex ">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white shadow-xl">
                                <div className="flex justify-end px-4 pt-5 pb-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <XMarkIcon
                                            className="w-6 h-6"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                                    {/*user profile */}
                                    <div className="flex justify-between px-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="w-10 h-10 rounded-full"
                                                    src={user?.avatar}
                                                    alt="avatar"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user?.full_name}
                                                </p>
                                                <p className="text-sm font-normal text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={toggleSettings}
                                            className="">
                                            {settingsOpen ? (
                                                <ChevronUpIcon className="w-4 h-4" aria-hidden="true" />
                                            ) : (
                                                <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                                            )}
                                        </button>
                                    </div>
                                    {settingsOpen &&
                                        <div className="flex flex-col gap-5 py-2 ">
                                            <Link href={route('freelancer.profile')} className="flex gap-3 px-4 ml-10 justify-left">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_5397_2401)">
                                                        <path d="M9.99747 19C5.03312 19 0.991563 14.9596 1.00001 10.0037C0.999493 8.82031 1.23236 7.64847 1.6853 6.55523C2.13823 5.46199 2.80233 4.46882 3.63959 3.63256C4.47684 2.7963 5.4708 2.13338 6.56458 1.68175C7.65836 1.23011 8.83047 0.998635 10.0138 1.00056C14.9799 1.00507 19.0079 5.04213 19.0011 10.0082C18.9992 12.3944 18.0496 14.6822 16.3612 16.3684C14.6727 18.0546 12.3837 19.0012 9.99747 19ZM16.2671 14.6396C18.6654 11.4735 18.3065 6.77052 14.999 3.99202C11.7152 1.23154 6.85223 1.65068 4.02415 4.96832C1.36733 8.08541 1.83942 12.2977 3.75204 14.6328C3.77795 14.5984 3.805 14.5669 3.82697 14.5325C4.70638 13.1737 5.9593 12.483 7.57277 12.4695C9.18624 12.456 10.8121 12.4633 12.4312 12.4695C13.7269 12.4729 14.8193 12.941 15.6914 13.901C15.8993 14.1269 16.0717 14.3849 16.2671 14.6396ZM10.0026 13.665C9.11582 13.665 8.22795 13.6334 7.34291 13.6723C6.11253 13.7286 5.23368 14.359 4.66919 15.4441C4.60046 15.5764 4.61286 15.6598 4.72553 15.7652C6.11535 17.0158 7.74177 17.72 9.60594 17.8085C11.7738 17.911 13.6667 17.204 15.2829 15.7533C15.3855 15.6609 15.4007 15.5894 15.3393 15.4677C14.7821 14.3686 13.901 13.7326 12.6616 13.6728C11.7771 13.6323 10.8887 13.665 10.0026 13.665Z" fill="black" />
                                                        <path d="M6.73894 8.2285C6.76034 7.08375 7.16934 6.11476 8.07467 5.39141C9.31407 4.40439 11.0137 4.49341 12.1562 5.58633C13.537 6.90685 13.6368 9.20086 12.3759 10.6391C10.887 12.3377 8.31974 12.0442 7.20709 10.047C6.89428 9.4924 6.73282 8.86524 6.73894 8.2285ZM12.0796 8.27244C12.0706 7.62739 11.8937 7.08206 11.5016 6.61672C10.7197 5.6883 9.43012 5.64661 8.58677 6.51813C7.62905 7.50571 7.7175 9.22227 8.76648 10.1073C9.10867 10.4016 9.54483 10.5637 9.99613 10.5644C10.4474 10.5651 10.8841 10.4044 11.2272 10.1113C11.8064 9.62 12.0588 8.97834 12.0796 8.27244Z" fill="black" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_5397_2401">
                                                            <rect width="17.9994" height="18" fill="white" transform="translate(1 1)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span className="text-sm font-medium text-black font-Inter">Your Profile</span>
                                            </Link>
                                            <Link href={route('freelancer.account')} className="flex gap-3 px-4 ml-10 justify-left">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_5397_2299)">
                                                        <path d="M9.9854 12.7C11.4766 12.7 12.6854 11.4912 12.6854 10C12.6854 8.50883 11.4766 7.3 9.9854 7.3C8.49423 7.3 7.2854 8.50883 7.2854 10C7.2854 11.4912 8.49423 12.7 9.9854 12.7Z" stroke="black" stroke-width="1.2" />
                                                        <path d="M11.5739 1.1368C11.2436 1 10.8242 1 9.98537 1C9.14657 1 8.72717 1 8.39687 1.1368C8.17833 1.22726 7.97976 1.35991 7.81252 1.52715C7.64527 1.6944 7.51263 1.89296 7.42217 2.1115C7.33937 2.3122 7.30607 2.5471 7.29347 2.8882C7.28786 3.13479 7.21967 3.37591 7.0953 3.58891C6.97093 3.80192 6.79446 3.97981 6.58247 4.1059C6.36727 4.22654 6.12494 4.29049 5.87825 4.29175C5.63155 4.29301 5.38858 4.23153 5.17217 4.1131C4.86977 3.9529 4.65107 3.8647 4.43417 3.8359C3.96105 3.77368 3.4826 3.90188 3.10397 4.1923C2.82137 4.411 2.61077 4.7737 2.19137 5.5C1.77197 6.2263 1.56137 6.589 1.51547 6.9445C1.48454 7.17891 1.50009 7.41711 1.56125 7.64551C1.6224 7.8739 1.72795 8.08801 1.87187 8.2756C2.00507 8.4484 2.19137 8.5933 2.48027 8.7751C2.90597 9.0424 3.17957 9.4978 3.17957 10C3.17957 10.5022 2.90597 10.9576 2.48027 11.224C2.19137 11.4067 2.00417 11.5516 1.87187 11.7244C1.72795 11.912 1.6224 12.1261 1.56125 12.3545C1.50009 12.5829 1.48454 12.8211 1.51547 13.0555C1.56227 13.4101 1.77197 13.7737 2.19047 14.5C2.61077 15.2263 2.82047 15.589 3.10397 15.8077C3.29156 15.9516 3.50567 16.0572 3.73406 16.1183C3.96246 16.1795 4.20066 16.195 4.43507 16.1641C4.65107 16.1353 4.86977 16.0471 5.17217 15.8869C5.38858 15.7685 5.63155 15.707 5.87825 15.7082C6.12494 15.7095 6.36727 15.7735 6.58247 15.8941C7.01717 16.1461 7.27547 16.6096 7.29347 17.1118C7.30607 17.4538 7.33847 17.6878 7.42217 17.8885C7.51263 18.107 7.64527 18.3056 7.81252 18.4728C7.97976 18.6401 8.17833 18.7727 8.39687 18.8632C8.72717 19 9.14657 19 9.98537 19C10.8242 19 11.2436 19 11.5739 18.8632C11.7924 18.7727 11.991 18.6401 12.1582 18.4728C12.3255 18.3056 12.4581 18.107 12.5486 17.8885C12.6314 17.6878 12.6647 17.4538 12.6773 17.1118C12.6953 16.6096 12.9536 16.1452 13.3883 15.8941C13.6035 15.7735 13.8458 15.7095 14.0925 15.7082C14.3392 15.707 14.5822 15.7685 14.7986 15.8869C15.101 16.0471 15.3197 16.1353 15.5357 16.1641C15.7701 16.195 16.0083 16.1795 16.2367 16.1183C16.4651 16.0572 16.6792 15.9516 16.8668 15.8077C17.1503 15.5899 17.36 15.2263 17.7794 14.5C18.1988 13.7737 18.4094 13.411 18.4553 13.0555C18.4862 12.8211 18.4706 12.5829 18.4095 12.3545C18.3483 12.1261 18.2428 11.912 18.0989 11.7244C17.9657 11.5516 17.7794 11.4067 17.4905 11.2249C17.2796 11.0967 17.1048 10.9171 16.9825 10.7028C16.8602 10.4886 16.7943 10.2467 16.7912 10C16.7912 9.4978 17.0648 9.0424 17.4905 8.776C17.7794 8.5933 17.9666 8.4484 18.0989 8.2756C18.2428 8.08801 18.3483 7.8739 18.4095 7.64551C18.4706 7.41711 18.4862 7.17891 18.4553 6.9445C18.4085 6.5899 18.1988 6.2263 17.7803 5.5C17.36 4.7737 17.1503 4.411 16.8668 4.1923C16.6792 4.04838 16.4651 3.94283 16.2367 3.88168C16.0083 3.82053 15.7701 3.80497 15.5357 3.8359C15.3197 3.8647 15.101 3.9529 14.7977 4.1131C14.5814 4.23137 14.3386 4.29276 14.092 4.2915C13.8455 4.29024 13.6033 4.22638 13.3883 4.1059C13.1763 3.97981 12.9998 3.80192 12.8754 3.58891C12.7511 3.37591 12.6829 3.13479 12.6773 2.8882C12.6647 2.5462 12.6323 2.3122 12.5486 2.1115C12.4581 1.89296 12.3255 1.6944 12.1582 1.52715C11.991 1.35991 11.7924 1.22726 11.5739 1.1368Z" stroke="black" stroke-width="1.2" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_5397_2299">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>

                                                <span className="text-sm font-medium text-black font-Inter" >Account settings</span>
                                            </Link>
                                            <Link href={route('logout')} method={"post"} className="flex gap-3 px-4 ml-10 justify-left">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 2H3C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H10" stroke="black" stroke-width="1.2" stroke-linecap="round" />
                                                    <path d="M7 10H18.5" stroke="black" stroke-width="1.2" stroke-linecap="round" />
                                                    <path d="M15 6.5L18.5 10L15 13.5" stroke="black" stroke-width="1.2" stroke-linecap="round" />
                                                </svg>
                                                <span className="text-sm font-medium text-black font-Inter">Log out</span>
                                            </Link>
                                        </div>
                                    }

                                </div>
                                <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                                    {navigation?.pages?.map((page: any) => (
                                        <div key={page?.id} className="text-start ">
                                            {(page?.isMalty && page?.isVisible) ? (
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button
                                                            //className="items-center flex-1 hidden text-sm font-semibold leading-6 text-gray-900 gap-x-1 lg:flex"
                                                            className={` ${url?.startsWith(
                                                                page?.startsWith
                                                            )
                                                                ? " text-primary-600 border-primary"
                                                                : " text-gray-900 hover:text-primary-600 border-transparent hover:border-primary "
                                                                } px-6 py-3  items-center flex-1 hidden text-sm font-semibold leading-6 text-gray-900 gap-x-1 lg:flex`}
                                                        >

                                                            {page?.name}
                                                            <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content>
                                                        {1 < 2 ? (
                                                            page?.maltyLinks?.map((item: any) => (
                                                                <Dropdown.Link
                                                                    key={item?.id}
                                                                    href={item?.href}
                                                                    method={item?.method}
                                                                    className={` ${item?.textColor ? item?.textColor : 'text-gray-900'} `}>
                                                                    {item?.name}
                                                                </Dropdown.Link>
                                                            ))
                                                        ) : null}
                                                    </Dropdown.Content>
                                                </Dropdown>

                                            ) : (
                                                page?.isVisible &&
                                                <div
                                                    key={page?.name}
                                                    className="flow-root"
                                                >
                                                    <Link
                                                        href={page?.href}
                                                        className={` ${url?.startsWith(
                                                            page?.startsWith
                                                        )
                                                            ? " text-primary-600 border-primary"
                                                            : " text-gray-900 hover:text-primary-600 border-transparent hover:border-primary "
                                                            }  -m-2 block p-2 font-medium `}
                                                    >
                                                        {page?.name}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <header className="sticky top-0 left-0 right-0 z-10 ">
                <nav aria-label="Top">
                    {/*navigation */}
                    <div className={`absolute top-0 left-0 w-full  bg-white shadow ${isVisible ? '' : 'hidden'}`}>
                        <div className="px-6 py-4 ">
                            <div>
                                <div className="flex items-center justify-between h-auto">
                                    <div className="relative flex ">
                                        <div className="flex justify-start ">
                                            <Link href={route("freelancer.dashboard")} className="hidden lg:flex">
                                                <img
                                                    className="h-[46px] w-auto object-contain"
                                                    src="/assets/images/ai-geeks.png?a=234"
                                                    alt={appName}
                                                />
                                            </Link>
                                            <Link
                                                href={route("freelancer.dashboard")}
                                                className="lg:hidden"
                                            >
                                                <span className="sr-only">
                                                    {appName}
                                                </span>
                                                <img
                                                    src="/assets/images/ai-geeks.png?a=234"
                                                    alt={appName}
                                                    className="w-auto h-10"
                                                />
                                            </Link>
                                            {/* dropdown */}
                                            <div className="relative flex ml-3 ">
                                                {dropdownNavigation?.pages?.map((page: any) => (
                                                    <div key={page?.id} className="text-center ">
                                                        {(page?.isMalty && page.isVisible) ? (
                                                            <Dropdown>
                                                                <Dropdown.Trigger>
                                                                    <button
                                                                        // className="items-center flex-1 hidden text-sm font-semibold leading-6 text-gray-900 gap-x-1 lg:flex"
                                                                        className='items-center flex-1 hidden px-6 py-3 text-sm font-semibold leading-6 text-gray-900 gap-x-1 lg:flex'
                                                                    >
                                                                        {page?.name}
                                                                        <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                                                                    </button>
                                                                </Dropdown.Trigger>
                                                                <Dropdown.Content>
                                                                    {1 < 2 ? (
                                                                        page?.maltyLinks?.map((item: any) => (
                                                                            <Dropdown.Link key={item?.id} href={item?.href} className={` ${item?.textColor ? item.textColor : 'text-gray-900'} `}>
                                                                                {item?.name}
                                                                            </Dropdown.Link>
                                                                        ))
                                                                    ) : null}
                                                                </Dropdown.Content>
                                                            </Dropdown>
                                                        ) : (
                                                            page?.isVisible &&
                                                            <Link
                                                                href={page?.href}
                                                                className='hidden px-6 py-3 text-sm font-semibold leading-6 text-gray-900 lg:flex'
                                                            >
                                                                {page?.name}
                                                            </Link>

                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative flex justify-end gap-3">
                                        {/* notifications */}
                                        {/* <div className="items-center justify-center hidden h-full py-1 sm:flex">
                                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.37354 9.60744C9.37354 9.60744 9.45791 7.67384 11.3388 6.12345C12.4556 5.20295 13.7968 4.93634 14.9985 4.91994C16.096 4.90646 17.0769 5.0922 17.6634 5.37814C18.6659 5.86916 20.6235 7.06447 20.6235 9.60744C20.6235 12.2834 18.9138 13.4963 16.9702 14.8328C15.0267 16.1694 14.5298 17.4801 14.5298 18.9824" stroke="black" stroke-width="1.00189" stroke-miterlimit="10" stroke-linecap="round" />
                                                <path d="M14.5312 25.3136C15.5675 25.3136 16.4075 24.4735 16.4075 23.4372C16.4075 22.4009 15.5675 21.5608 14.5312 21.5608C13.4949 21.5608 12.6548 22.4009 12.6548 23.4372C12.6548 24.4735 13.4949 25.3136 14.5312 25.3136Z" fill="black" />
                                            </svg>

                                        </div>
                                        <div className="items-center justify-center hidden h-full py-1 sm:flex">
                                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9542 2.81311H3.9843C3.337 2.81311 2.81226 3.33785 2.81226 3.98515V11.955C2.81226 12.6023 3.337 13.1271 3.9843 13.1271H11.9542C12.6015 13.1271 13.1262 12.6023 13.1262 11.955V3.98515C13.1262 3.33785 12.6015 2.81311 11.9542 2.81311Z" stroke="black" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M26.0169 2.81271H18.047C17.3997 2.81271 16.875 3.33745 16.875 3.98476V11.9546C16.875 12.6019 17.3997 13.1267 18.047 13.1267H26.0169C26.6642 13.1267 27.189 12.6019 27.189 11.9546V3.98476C27.189 3.33745 26.6642 2.81271 26.0169 2.81271Z" stroke="black" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M11.9537 16.8753H3.98381C3.33651 16.8753 2.81177 17.4 2.81177 18.0473V26.0172C2.81177 26.6645 3.33651 27.1893 3.98381 27.1893H11.9537C12.601 27.1893 13.1257 26.6645 13.1257 26.0172V18.0473C13.1257 17.4 12.601 16.8753 11.9537 16.8753Z" stroke="black" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M26.0169 16.8753H18.047C17.3997 16.8753 16.875 17.4 16.875 18.0473V26.0172C16.875 26.6645 17.3997 27.1893 18.047 27.1893H26.0169C26.6642 27.1893 27.189 26.6645 27.189 26.0172V18.0473C27.189 17.4 26.6642 16.8753 26.0169 16.8753Z" stroke="black" stroke-width="1.00189" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>

                                        </div> */}
                                        <div className="items-center justify-center hidden h-full py-1 lg:flex">
                                            <NotificationWidget />
                                        </div>
                                        {/* user profile */}
                                        <div className="hidden space-x-3 lg:flex">
                                            {/* dropdown */}
                                            <div className="relative flex ml-3">
                                                <Dropdown>
                                                    <Dropdown.Trigger>

                                                        <button
                                                            type="button"
                                                            aria-hidden="true"
                                                            className="flex-shrink-0 "
                                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        >
                                                            <img
                                                                className="w-10 h-10 rounded-full"
                                                                src={user?.avatar}
                                                                alt="User Avatar"
                                                            />
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content>
                                                        <Dropdown.Link href={""} className="mt-2 text-gray-900 hover:bg-white">

                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    className="w-12 h-12 rounded-full"
                                                                    src={user?.avatar}
                                                                    alt="User Avatar"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 truncate font-Inter">
                                                                        {user?.full_name}
                                                                    </p>
                                                                    <p className="text-sm font-normal text-gray-500 truncate font-Inter">
                                                                        Freelancer
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Link>
                                                        <div
                                                            className="flex justify-between w-full px-4 py-2 text-gray-900 hover:bg-white"
                                                        >

                                                            <span className="text-sm font-medium text-black font-Inter" >Online for messages</span>
                                                            <SwitchButton onChange={handleToggle} isChecked={activeStatus} className="z-20" />
                                                        </div>

                                                        {/* your profile */}
                                                        <Dropdown.Link href={route('freelancer.profile')} className="flex gap-3 px-4 py-2 text-gray-900 border-t-2 border-gray-200 justify-left">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clip-path="url(#clip0_5397_2401)">
                                                                    <path d="M9.99747 19C5.03312 19 0.991563 14.9596 1.00001 10.0037C0.999493 8.82031 1.23236 7.64847 1.6853 6.55523C2.13823 5.46199 2.80233 4.46882 3.63959 3.63256C4.47684 2.7963 5.4708 2.13338 6.56458 1.68175C7.65836 1.23011 8.83047 0.998635 10.0138 1.00056C14.9799 1.00507 19.0079 5.04213 19.0011 10.0082C18.9992 12.3944 18.0496 14.6822 16.3612 16.3684C14.6727 18.0546 12.3837 19.0012 9.99747 19ZM16.2671 14.6396C18.6654 11.4735 18.3065 6.77052 14.999 3.99202C11.7152 1.23154 6.85223 1.65068 4.02415 4.96832C1.36733 8.08541 1.83942 12.2977 3.75204 14.6328C3.77795 14.5984 3.805 14.5669 3.82697 14.5325C4.70638 13.1737 5.9593 12.483 7.57277 12.4695C9.18624 12.456 10.8121 12.4633 12.4312 12.4695C13.7269 12.4729 14.8193 12.941 15.6914 13.901C15.8993 14.1269 16.0717 14.3849 16.2671 14.6396ZM10.0026 13.665C9.11582 13.665 8.22795 13.6334 7.34291 13.6723C6.11253 13.7286 5.23368 14.359 4.66919 15.4441C4.60046 15.5764 4.61286 15.6598 4.72553 15.7652C6.11535 17.0158 7.74177 17.72 9.60594 17.8085C11.7738 17.911 13.6667 17.204 15.2829 15.7533C15.3855 15.6609 15.4007 15.5894 15.3393 15.4677C14.7821 14.3686 13.901 13.7326 12.6616 13.6728C11.7771 13.6323 10.8887 13.665 10.0026 13.665Z" fill="black" />
                                                                    <path d="M6.73894 8.2285C6.76034 7.08375 7.16934 6.11476 8.07467 5.39141C9.31407 4.40439 11.0137 4.49341 12.1562 5.58633C13.537 6.90685 13.6368 9.20086 12.3759 10.6391C10.887 12.3377 8.31974 12.0442 7.20709 10.047C6.89428 9.4924 6.73282 8.86524 6.73894 8.2285ZM12.0796 8.27244C12.0706 7.62739 11.8937 7.08206 11.5016 6.61672C10.7197 5.6883 9.43012 5.64661 8.58677 6.51813C7.62905 7.50571 7.7175 9.22227 8.76648 10.1073C9.10867 10.4016 9.54483 10.5637 9.99613 10.5644C10.4474 10.5651 10.8841 10.4044 11.2272 10.1113C11.8064 9.62 12.0588 8.97834 12.0796 8.27244Z" fill="black" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_5397_2401">
                                                                        <rect width="17.9994" height="18" fill="white" transform="translate(1 1)" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                            <span className="text-sm font-medium text-black font-Inter">Your Profile</span>
                                                        </Dropdown.Link>
                                                        <Dropdown.Link href={route('freelancer.account')} className="flex gap-3 px-4 py-2 text-gray-900 border-t-2 border-gray-200 justify-left">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clip-path="url(#clip0_5397_2299)">
                                                                    <path d="M9.9854 12.7C11.4766 12.7 12.6854 11.4912 12.6854 10C12.6854 8.50883 11.4766 7.3 9.9854 7.3C8.49423 7.3 7.2854 8.50883 7.2854 10C7.2854 11.4912 8.49423 12.7 9.9854 12.7Z" stroke="black" stroke-width="1.2" />
                                                                    <path d="M11.5739 1.1368C11.2436 1 10.8242 1 9.98537 1C9.14657 1 8.72717 1 8.39687 1.1368C8.17833 1.22726 7.97976 1.35991 7.81252 1.52715C7.64527 1.6944 7.51263 1.89296 7.42217 2.1115C7.33937 2.3122 7.30607 2.5471 7.29347 2.8882C7.28786 3.13479 7.21967 3.37591 7.0953 3.58891C6.97093 3.80192 6.79446 3.97981 6.58247 4.1059C6.36727 4.22654 6.12494 4.29049 5.87825 4.29175C5.63155 4.29301 5.38858 4.23153 5.17217 4.1131C4.86977 3.9529 4.65107 3.8647 4.43417 3.8359C3.96105 3.77368 3.4826 3.90188 3.10397 4.1923C2.82137 4.411 2.61077 4.7737 2.19137 5.5C1.77197 6.2263 1.56137 6.589 1.51547 6.9445C1.48454 7.17891 1.50009 7.41711 1.56125 7.64551C1.6224 7.8739 1.72795 8.08801 1.87187 8.2756C2.00507 8.4484 2.19137 8.5933 2.48027 8.7751C2.90597 9.0424 3.17957 9.4978 3.17957 10C3.17957 10.5022 2.90597 10.9576 2.48027 11.224C2.19137 11.4067 2.00417 11.5516 1.87187 11.7244C1.72795 11.912 1.6224 12.1261 1.56125 12.3545C1.50009 12.5829 1.48454 12.8211 1.51547 13.0555C1.56227 13.4101 1.77197 13.7737 2.19047 14.5C2.61077 15.2263 2.82047 15.589 3.10397 15.8077C3.29156 15.9516 3.50567 16.0572 3.73406 16.1183C3.96246 16.1795 4.20066 16.195 4.43507 16.1641C4.65107 16.1353 4.86977 16.0471 5.17217 15.8869C5.38858 15.7685 5.63155 15.707 5.87825 15.7082C6.12494 15.7095 6.36727 15.7735 6.58247 15.8941C7.01717 16.1461 7.27547 16.6096 7.29347 17.1118C7.30607 17.4538 7.33847 17.6878 7.42217 17.8885C7.51263 18.107 7.64527 18.3056 7.81252 18.4728C7.97976 18.6401 8.17833 18.7727 8.39687 18.8632C8.72717 19 9.14657 19 9.98537 19C10.8242 19 11.2436 19 11.5739 18.8632C11.7924 18.7727 11.991 18.6401 12.1582 18.4728C12.3255 18.3056 12.4581 18.107 12.5486 17.8885C12.6314 17.6878 12.6647 17.4538 12.6773 17.1118C12.6953 16.6096 12.9536 16.1452 13.3883 15.8941C13.6035 15.7735 13.8458 15.7095 14.0925 15.7082C14.3392 15.707 14.5822 15.7685 14.7986 15.8869C15.101 16.0471 15.3197 16.1353 15.5357 16.1641C15.7701 16.195 16.0083 16.1795 16.2367 16.1183C16.4651 16.0572 16.6792 15.9516 16.8668 15.8077C17.1503 15.5899 17.36 15.2263 17.7794 14.5C18.1988 13.7737 18.4094 13.411 18.4553 13.0555C18.4862 12.8211 18.4706 12.5829 18.4095 12.3545C18.3483 12.1261 18.2428 11.912 18.0989 11.7244C17.9657 11.5516 17.7794 11.4067 17.4905 11.2249C17.2796 11.0967 17.1048 10.9171 16.9825 10.7028C16.8602 10.4886 16.7943 10.2467 16.7912 10C16.7912 9.4978 17.0648 9.0424 17.4905 8.776C17.7794 8.5933 17.9666 8.4484 18.0989 8.2756C18.2428 8.08801 18.3483 7.8739 18.4095 7.64551C18.4706 7.41711 18.4862 7.17891 18.4553 6.9445C18.4085 6.5899 18.1988 6.2263 17.7803 5.5C17.36 4.7737 17.1503 4.411 16.8668 4.1923C16.6792 4.04838 16.4651 3.94283 16.2367 3.88168C16.0083 3.82053 15.7701 3.80497 15.5357 3.8359C15.3197 3.8647 15.101 3.9529 14.7977 4.1131C14.5814 4.23137 14.3386 4.29276 14.092 4.2915C13.8455 4.29024 13.6033 4.22638 13.3883 4.1059C13.1763 3.97981 12.9998 3.80192 12.8754 3.58891C12.7511 3.37591 12.6829 3.13479 12.6773 2.8882C12.6647 2.5462 12.6323 2.3122 12.5486 2.1115C12.4581 1.89296 12.3255 1.6944 12.1582 1.52715C11.991 1.35991 11.7924 1.22726 11.5739 1.1368Z" stroke="black" stroke-width="1.2" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_5397_2299">
                                                                        <rect width="20" height="20" fill="white" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>

                                                            <span className="text-sm font-medium text-black font-Inter" >Account settings</span>
                                                        </Dropdown.Link>
                                                        {/* <Dropdown.Link href={""} className="mt-2 space-y-4 text-gray-900 border-t-2 border-gray-200 ">
                                                            <span className="text-sm font-medium text-textSecondary font-Inter">Switch accounts</span>

                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    className="w-12 h-12 rounded-full"
                                                                    src={user?.avatar}
                                                                    alt="User Avatar"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-black truncate font-Inter">
                                                                        {user?.full_name}
                                                                    </p>
                                                                    <p className="text-sm font-normal text-gray-500 truncate font-Inter">
                                                                        Client
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Link> */}
                                                        <Dropdown.Link href={route('logout')} method={"post"} className="flex gap-3 px-4 py-2 text-gray-900 border-t-2 border-gray-200 justify-left">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 2H3C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H10" stroke="black" stroke-width="1.2" stroke-linecap="round" />
                                                                <path d="M7 10H18.5" stroke="black" stroke-width="1.2" stroke-linecap="round" />
                                                                <path d="M15 6.5L18.5 10L15 13.5" stroke="black" stroke-width="1.2" stroke-linecap="round" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-black font-Inter">Log out</span>
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mobile menu and search (lg-) */}
                                    <div className="flex items-center justify-end flex-1 gap-2 lg:hidden">
                                        <div className="items-center justify-center h-full py-1 lg:flex">
                                            <NotificationWidget />
                                        </div>
                                        <button
                                            type="button"
                                            className="p-2 -ml-2 text-black"
                                            onClick={() =>
                                                setMobileMenuOpen(true)
                                            }
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            <Bars3Icon
                                                className="w-6 h-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header >
        </>
    );
}
