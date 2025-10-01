import AppLayout from "@/Layouts/AppLayout";
import { User } from "@/types";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";

export default function MyContracts(
    {
        user,
        offers,
        completedOffers,
    }: {
        user: User,
        offers: any,
        completedOffers: any,
    }) {

    const [sortType, setSortType] = useState("in-progress");
    const [selectedOffers, setSelectedOffers] = useState(offers);

    const handleSortType = (type: string) => {
        setSortType(type);
        if (type === "in-progress") {
            setSelectedOffers(offers);
        } else {
            setSelectedOffers(completedOffers);
        }
    };

   // console.log(offers.data);
    return (
        <AppLayout isFreelancerHeader={true} isHeader={false}>
            <Head title="Contracts" />
            <div className="relative min-h-screen p-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 max-w-7xl">
                <div className="mt-20 mb-4 text-3xl font-semibold text-black sm:text-4xl sm:mb-8">
                    My Contracts
                </div>
                <div className="flex flex-col gap-6 pb-6 border-borderColor">
                    <div className="flex flex-row gap-6 border-b">
                        <button
                            className={`p-1 text-base font-medium text-start ${sortType === "in-progress" ? "text-primary border-b border-primary" : "text-gray-800"
                                }`}
                            onClick={() => handleSortType("in-progress")} >
                            Active
                        </button>
                        <button
                            className={`p-1 text-base font-medium text-start ${sortType === "completed" ? "text-primary border-b-2 border-primary" : "text-gray-800"
                                }`}
                            onClick={() => handleSortType("completed")}
                        >
                            Completed
                        </button>
                    </div>

                </div>
                <div className="flex flex-col gap-4">
                    {/* Task 1 */}
                    {selectedOffers?.length === 0 ? (
                        <div className="flex flex-col w-full p-4 sm:p-6">
                            <div className="items-center w-full text-lg font-semibold text-center text-gray-500 sm:text-xl font-Inter">
                                {sortType === "in-progress" ? "No active contracts" : "No completed contracts"}
                            </div>
                        </div>
                    ) : (
                        selectedOffers?.map((offer: any) => (

                            <Link href={route("freelancer.contract.show", offer?.id)} className="flex flex-col w-full p-4 border-b border-gray-300 hover:bg-blue-100 sm:p-6">
                                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-2">
                                    <div className="text-lg font-semibold text-black sm:text-xl font-Inter">
                                        {offer?.job_post?.title}
                                    </div>
                                    {offer?.status !== "completed" &&
                                        <div className="flex-row justify-end hidden gap-4 sm:flex">
                                            <Link
                                                href={route("freelancer.messages.show", offer?.proposal_id)}
                                                type="button"
                                                className="px-4 py-1 text-sm font-medium text-blue-700 bg-white border-2 border-blue-700 rounded-full text-nowrap sm:px-4 sm:py-1 sm:text-base font-Inter">
                                                Send a message
                                            </Link>
                                        </div>
                                    }

                                </div>
                                <div className="flex flex-col gap-2 mt-4 sm:mt-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                        <div className="flex flex-row w-full sm:w-1/3">
                                            <div className="relative flex items-start w-20 gap-4">
                                                <div className={`absolute w-3 h-3  rounded-full left-1 top-1 ring-2 ring-white ${offer?.user?.active_status ? "bg-green-500" : "bg-red-500"}`}></div>
                                                <img
                                                    className="rounded-full w-14 h-14"
                                                    src={offer?.user?.avatar}
                                                    alt="avatar"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-black text-start first-letter:capitalize font-Inter">
                                                    {offer?.user?.full_name}
                                                </div>
                                                <div className="text-sm text-gray-600 text-start font-Inter">
                                                    {offer?.user?.country}
                                                </div>
                                                <div className="text-sm text-gray-600 text-start font-Inter">
                                                    {offer?.user?.user_country_time}
                                                </div>
                                            </div>
                                        </div>
                                        {offer?.status !== "completed" &&
                                            <div className="flex flex-row justify-end gap-4 sm:hidden">
                                                <Link
                                                    href={route("freelancer.messages.show", offer?.proposal_id)}
                                                    type="button"
                                                    className="px-4 py-1 text-sm font-medium text-blue-700 bg-white border-2 border-blue-700 rounded-full text-nowrap sm:px-4 sm:py-1 sm:text-base font-Inter">
                                                    Send a message
                                                </Link>
                                            </div>
                                        }
                                        <div className="flex flex-col w-full gap-1 sm:w-2/3">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                {offer?.status === "accepted" ?
                                                    <div className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded sm:text-sm font-Inter">
                                                        Active
                                                    </div>
                                                    : offer?.status === "pending" ?
                                                        <div className="px-2 py-1 text-xs font-medium text-white bg-yellow-500 rounded sm:text-sm font-Inter">
                                                            Pending
                                                        </div>
                                                        : offer?.status === "completed" &&
                                                        <div className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded sm:text-sm font-Inter">
                                                            Completed
                                                        </div>
                                                }

                                                <div className="text-xs font-semibold text-black sm:text-sm font-Inter">
                                                    {offer?.active_milestone?.name}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-600 sm:text-sm font-Inter">
                                                Due on {offer?.active_milestone?.dueDate}
                                            </div>
                                            <div className="flex flex-col text-xs text-gray-600 sm:text-sm font-Inter">
                                                <span>
                                                    $ {offer?.offer_price} Budget
                                                </span>
                                                <span>
                                                    $ {offer?.complete_milestone_amount} Escrow
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 sm:text-sm font-Inter">
                                        {offer?.created_at_human} - Present
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}


                </div>
            </div>
        </AppLayout>
    );
}
