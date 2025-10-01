import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
    ArrowRightCircleIcon,
    Bars3Icon,
    ChevronDoubleDownIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, usePage } from "@inertiajs/react";

import HeaderSearch from "./HeaderSearch";
import Dropdown from "../elements/other/Dropdown";
import i18n from "../../i18n";


function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function Header({ appName }: { appName: string }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    let { url }: any = usePage();
    if (url == '/' || url.includes('/?category')) {
        url = '/home'
    }

    const [opacity, setOpacity] = useState(25);
    const [isVisible, setIsVisible] = useState(true);
    const { auth } = usePage().props;
    const user = (auth as { user?: any }).user;

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setOpacity(100);
            setIsVisible(true);
            if (scrollPosition > 300) {
                setOpacity(100);
                setIsVisible(true);
            } else {
                setOpacity(Math.max(25 + (scrollPosition / 300) * 75, 0));
                setIsVisible(scrollPosition <= 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

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
    }, [dropdownRef]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const dashboardRoute = () => {
        if (user['user_type'] == 'client') {
            return "client.home";
        } else if (user['user_type'] == 'freelancer') {
            return "freelancer.dashboard";
        }
        else if (user['user_type'] == 'admin') {
            return "admin.dashboard";
        }
        else {
            return "login";
        }
    }

    const messageRoute = () => {
        if (!user) {
            return "login";
        }
        if (user['user_type'] == 'client') {
            return "client.messages";
        } else if (user['user_type'] == 'freelancer') {
            return "freelancer.messages";
        }
        else {
            return "login";
        }
    }

    const dropdownNavigation = {
        pages: [
            {
                name: "Start Browsing",
                href: route("freelancer.dashboard"),
                startsWith: "/freelancer",
                isMalty: false,
                isVisible: user ? user['user_type'] == 'freelancer' ? true : false : true,
            },
            {
                name: "About us",
                href: route("about.index"),
                startsWith: "/register",
                isMalty: false,
                isVisible: user ? false : true,
            },
            {
                name: "Home",
                href: route("about.index"),
                startsWith: "/register",
                isMalty: false,
                isVisible: user ? false : true,
            },
            {
                name: "Home",
                href: route("about.index"),
                startsWith: "/register",
                isMalty: false,
                isVisible: user ? false : true,
            },
            {
                name: "Home",
                href: route("about.index"),
                startsWith: "/register",
                isMalty: false,
                isVisible: user ? false : true,
            },
            {
                name: "Talent",
                href: route("client.talent"),
                startsWith: "/talent",
                isMalty: false,
                isVisible: user ? user['user_type'] == 'client' ? true : false : false,
            },
            {
                name: "My Jobs",
                id: 1,
                startsWith: "/",
                isMalty: true,
                isVisible: user ? user['user_type'] == 'freelancer' ? true : false : false,
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
                isVisible: user ? user['user_type'] == 'freelancer' ? true : false : false,
                maltyLinks: [
                    { name: "Financial Overview", href: route("freelancer.financial.overview"), id: 1 },
                    { name: "Transaction History", href: route("freelancer.financial.history"), id: 2 },
                ],
            },
            {
                name: "Messages",
                href: route(messageRoute()),
                startsWith: "/register",
                isMalty: false,
                isVisible: user ? user['user_type'] == 'client' || user['user_type'] == 'freelancer' ? true : false : false,
            },
            {
                name: "Tickets",
                href: route("freelancer.ticket"),
                startsWith: "/ticket",
                isMalty: false,
                isVisible: user ? user['user_type'] == 'freelancer' ? true : false : false,
            },
            {
                name: "Threads",
                href: route("client.ticket"),
                startsWith: "/ticket",
                isMalty: false,
                isVisible: user ? true : false,
            },
            {
                name: "Sports Categories",
                id: 1,
                startsWith: "/",
                isMalty: true,
                isVisible: true,
                maltyLinks: [
                    { name: "Cricket", href: route("client.job.all"), id: 3 },
                    { name: "Football", href: route("client.job.all"), id: 3 },
                    { name: "Basketball", href: route("client.job.all"), id: 3 },
                    { name: "Badminton", href: route("client.job.all"), id: 3 },
                    { name: "All Contracts", href: `${route("client.job.all")}?sortType=contracts`, id: 4 },
                ],
            }
        ],
    };

    const navigation = {
        pages: user
            ? [
                {
                    name: "Dashboard",
                    href: route(dashboardRoute()),
                    startsWith: "/",
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

    const mergedNavigation = {
        pages: [...dropdownNavigation.pages, ...navigation.pages],
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
                                <div className="flex px-4 pt-5 pb-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                                    {mergedNavigation?.pages?.map((page: any) => (
                                        <div key={page?.id} className="text-start ">
                                            {(page?.isMalty && page?.isVisible) ? (
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button
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
                                                        {page?.maltyLinks?.map((item: any) => (
                                                            <Dropdown.Link key={item?.id} href={item?.href} className={` ${item?.textColor ? item?.textColor : 'text-gray-900'} `}>
                                                                {item?.name}
                                                            </Dropdown.Link>
                                                        ))}
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            ) : (
                                                page?.isVisible &&
                                                <div key={page?.name} className="flow-root">
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
                    <div className={`absolute top-0 left-0 w-full  bg-white shadow ${isVisible ? '' : 'hidden'}`}>
                        <div className="px-6 py-4 ">
                            <div>
                                <div className="flex items-center justify-between h-auto">
                                    <div className="relative flex lg:w-3/5 ">
                                        <div className="flex justify-start ">
                                            <Link href={route("home")} className="hidden lg:flex">
                                                <img
                                                    className="h-[46px] w-auto object-contain"
                                                    src="/assets/images/ai-geeks.png?a=234"
                                                    alt={appName}
                                                />
                                            </Link>
                                            <Link href={route("home")} className="lg:hidden">
                                                <span className="sr-only">{appName}</span>
                                                <img
                                                    src="/assets/images/ai-geeks.png?a=234"
                                                    alt={appName}
                                                    className="w-auto h-10"
                                                />
                                            </Link>
                                            <div className="relative flex ml-3 ">
                                                {dropdownNavigation?.pages?.map((page: any) => (
                                                    <div key={page.id} className="text-center ">
                                                        {(page?.isMalty && page.isVisible) ? (
                                                            <Dropdown>
                                                                <Dropdown.Trigger>
                                                                    <button
                                                                        className={` ${url.startsWith(
                                                                            page.startsWith
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
                                                                    {page?.maltyLinks?.map((item: any) => (
                                                                        <Dropdown.Link key={item?.id} href={item?.href} className={` ${item?.textColor ? item.textColor : 'text-gray-900'} `}>
                                                                            {item?.name}
                                                                        </Dropdown.Link>
                                                                    ))}
                                                                </Dropdown.Content>
                                                            </Dropdown>
                                                        ) : (
                                                            page?.isVisible &&
                                                            <Link
                                                                href={page?.href}
                                                                className={` ${url.startsWith(
                                                                    page.startsWith
                                                                )
                                                                    ? " text-white bg-primaryBtnColor text-md font-Inter font-medium hover:bg-primaryBtnColorHover px-6 py-3 rounded-full"
                                                                    : " text-black hover:text-primary-600 text-md font-Inter font-medium bg-transparent px-6 py-3  hover:text-primary rounded-full"
                                                                    }  hidden text-sm font-semibold leading-6 text-gray-900 lg:flex `}
                                                            >
                                                                {page?.name}
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative lg:w-[700px] flex justify-end">
                                        {navigation?.pages?.map((page: any) => (
                                            <div key={page.id} className="text-center ">
                                                {page?.isMalty ? (
                                                    <Dropdown>
                                                        <Dropdown.Trigger>
                                                            <button
                                                                className={` ${url.startsWith(
                                                                    page.startsWith
                                                                )
                                                                    ? " text-primary-600 border-primary"
                                                                    : " text-gray-900 hover:text-primary-600 border-transparent hover:border-primary "
                                                                    }  -m-2 p-2  border-b-2 items-center flex-1 hidden text-sm font-semibold leading-6 text-gray-900 gap-x-1 lg:flex`}
                                                            >
                                                                {page?.name}
                                                                <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                                                            </button>
                                                        </Dropdown.Trigger>
                                                        <Dropdown.Content>
                                                            {page?.maltyLinks.map((item: any) => (
                                                                <Dropdown.Link key={item.id} href={item.href}>
                                                                    {item.name}
                                                                </Dropdown.Link>
                                                            ))}
                                                        </Dropdown.Content>
                                                    </Dropdown>
                                                ) : (
                                                    <Link
                                                        href={page?.href}
                                                        className={` ${url.startsWith(
                                                            page.startsWith
                                                        )
                                                            ? " text-white bg-primaryBtnColor text-md font-Inter font-medium hover:bg-primaryBtnColorHover px-8 py-3 rounded-full"
                                                            : " text-black hover:text-primary-600 text-md font-Inter font-medium bg-transparent px-8 py-3  hover:text-primary rounded-full"
                                                            }  hidden text-sm font-semibold leading-6 text-gray-900 lg:flex `}
                                                    >
                                                        {page?.name}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}

                                        {/* 🔹 Language Switcher */}

                                    </div>

                                    <div className="flex items-center justify-end flex-1 lg:hidden">
                                        <button
                                            type="button"
                                            className="p-2 -ml-2 text-black"
                                            onClick={() => setMobileMenuOpen(true)}
                                        >
                                            <span className="sr-only">Open menu</span>
                                            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
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
