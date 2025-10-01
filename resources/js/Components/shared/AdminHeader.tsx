import { Dialog, Menu, Transition } from "@headlessui/react";
import { Bars3CenterLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { Fragment, ReactNode, useState } from "react";
import Breadcrumbs from "../elements/header/BreadCumbs";
import { Link } from "@inertiajs/react";
import NavItem from "./AdminSidebar/partials/NavItem";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import SideNavLinks from "@/lib/SideNavLinks";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

const AdminHeader = ({
    user,
    header,
    bRoutes,
}: {
    user: any;
    header?: ReactNode;
    bRoutes: any;
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [Dropdown, setDropdown] = useState(false);
    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[101] lg:hidden"
                    onClose={setSidebarOpen}
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
                        <div className="fixed inset-0 bg-opacity-75 bg-slate-900" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-slate-200">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="w-6 h-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <nav
                                    className="flex-shrink-0 h-screen pb-10 mt-5 overflow-y-auto"
                                    aria-label="Sidebar"
                                >
                                    <div className="flex items-center justify-center">
                                        <img
                                            className="h-10 mx-auto"
                                            src={"/assets/images/ai-geeks.png"}
                                            alt="site logo"
                                        />
                                    </div>
                                    <div className="flex flex-col px-8 py-3 mt-4 space-x-2 bg-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center justify-start px-4 space-x-2">
                                                <img
                                                    className="object-cover w-10 h-10 rounded-full"
                                                    src={user?.avatar ?? "/assets/images/avatars/user.png"}
                                                />
                                                <p className="text-sm font-medium ">
                                                    {user?.full_name}
                                                </p>
                                            </div>
                                            <div>
                                                {Dropdown ? (
                                                    <ChevronDownIcon className="w-4 h-4 " onClick={() => setDropdown(false)} />
                                                ) : (
                                                    <ChevronUpIcon className="w-4 h-4 " onClick={() => setDropdown(true)} />
                                                )}
                                            </div>
                                        </div>
                                        {Dropdown && (
                                        <div className="px-12 space-y-1">
                                            <Link
                                                href={route('logout')}
                                                method={"post"}
                                                as="button"
                                                type="button"
                                                className="block w-full px-4 py-2 text-sm text-left text-gray-700"
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                    </div>
                                    <div className="px-2 mt-4 space-y-1">
                                        {/* {navigationLinks.map((item: any, index: number) => (
                                            <NavItem
                                                key={item.name + index}
                                                name={item.name}
                                                routeName={route(item.route)}
                                                startWith={item.startWith}
                                                icon={item.icon}
                                                link={item.link}
                                                border={item.border}
                                                children={item.children}
                                            />
                                        ))} */}
                                          <SideNavLinks/>

                                    </div>
                                </nav>

                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <div className="lg:pt-4  lg:mt-0 lg:px-3 relative lg:fixed bg-slate-900 lg:bg-gradient-to-r lg:from-slate-200 lg:to-slate-100 top-0 left-0 right-0 z-50 backdrop-blur-[6px]">
                <header className="flex z-50 lg:h-[4.3rem] w-full flex-shrink-0 bg-slate-900 lg:rounded-xl">
                    {/* Search bar */}
                    <div className="grid w-full lg:flex lg:flex-1 lg:justify-between lg:mx-auto lg:max-w-full lg:px-8">
                        <div className="fixed top-0 left-0 right-0 z-50 w-full py-3 border-b bg-slate-900 border-slate-700 lg:relative lg:top-0 lg:flex lg:flex-1 lg:divide-x lg:divide-slate-800">
                            <div className="relative w-full px-4 lg:px-0 justify-between lg:w-[210px] flex lg:block lg:justify-start">
                                <img
                                    className="h-[50px] object-contain self-center"
                                    src={"/assets/images/ai-geeks.png"}
                                    alt="site logo"
                                />
                                <button
                                    type="button"
                                    className=" focus:outline-none focus:ring-2 focus:ring-inset focus:ring-transparent lg:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <span className="sr-only">
                                        Open sidebar
                                    </span>
                                    <Bars3CenterLeftIcon
                                        className="self-center w-6 h-6 text-slate-200"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            <div className="hidden pl-8 lg:flex lg:ml-0">
                                <Breadcrumbs routes={bRoutes} />
                            </div>
                        </div>
                        <div className="flex justify-between px-4 py-4 lg:ml-4 lg:py-0 lg:px-0 lg:bg-transparent lg:items-center md:ml-6">
                            <div className="flex lg:hidden">
                                <Breadcrumbs routes={bRoutes} />
                            </div>
                            <div className="flex">
                                <Menu
                                    as="div"
                                    className="relative self-center ml-3"
                                >
                                    <div>
                                        <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-transparent group">
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                <span className="sr-only">
                                                    Open user menu for{" "}
                                                </span>
                                                <img
                                                    className="object-cover w-10 h-10 rounded-full"
                                                    src={user?.avatar ?? "/assets/images/avatars/user.png"}
                                                />
                                            </span>
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
                                        <Menu.Items className="absolute right-0 z-50 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg dropdown-menu ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {/* <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href={route(
                                                            "profile.edit"
                                                        )}
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100"
                                                                : "",
                                                            "block w-full px-4 py-2 text-left text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Profile
                                                    </Link>
                                                )}
                                            </Menu.Item> */}
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href={route('logout')}
                                                        method={"post"}
                                                        as="button"
                                                        type="button"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100"
                                                                : "",
                                                            "block w-full px-4 py-2 text-left text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Logout
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </>
    );
};
export default AdminHeader;
