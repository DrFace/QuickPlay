import AppLayout from '@/Layouts/AppLayout'
import { User } from '@/types';
import { Head, Link, router } from '@inertiajs/react'
import React, { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';

export default function AllProposals({
    user,
    submittedProposals,
    activeProposals,
    offeredProposals,
}: {
    user: User;
    submittedProposals: any,
    activeProposals: any,
    offeredProposals: any,
}) {



   // console.log("submittedProposals", submittedProposals);
   // console.log("activeProposals", activeProposals);
    return (
        <AppLayout isFreelancerHeader={true} isHeader={false}>
            <Head title="My Proposals" />
            <div className="relative min-h-screen p-8 mx-auto mt-20 space-y-8 bg-white max-w-7xl">
                <div className="mt-20 mb-8 text-4xl font-semibold text-black font-Inter">My Proposals</div>

                {/* <div className="flex gap-6 border-b border-gray-300">
                    <button
                        className={`p-1 text-base font-medium text-start font-Inter ${sortType === "active" ? "text-primary border-b-2 border-primary" : "text-gray-800"
                            }`}
                        onClick={() => handleSortType("active")}
                    >
                        Active
                    </button>
                    <button
                        className={`p-1 text-base font-medium text-start font-Inter ${sortType === "archived" ? "text-primary border-b-2 border-primary" : "text-gray-800"
                            }`}
                        onClick={() => handleSortType("archived")}
                    >
                        Archived
                    </button>
                </div> */}

                {/* Proposals Section */}
                <div className="space-y-5">

                    <div className="w-full p-6 border border-gray-300 rounded-2xl">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-semibold text-black">Offers ({offeredProposals?.length})</div>
                                    {/* <img src="/assets/Icons/freelancer/job/question-circle.png" alt="question" className="w-6 h-6" /> */}
                                </div>
                            </div>
                            {offeredProposals?.length > 0 ? offeredProposals.map((proposal: any) => (
                                <div className="pb-4 w-full flex flex-col justify-start items-start gap-2.5">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col items-center justify-start w-full sm:gap-4 sm:flex-row">
                                            <div className="flex flex-col items-start justify-start w-full gap-1 sm:w-1/4">
                                                <div className="text-sm font-medium text-black">Submitted {proposal.created_at_human}</div>
                                                <div className="text-xs font-normal text-gray-500">{proposal.created_at_human_ago}</div>
                                            </div>

                                            <Link className="w-full text-base font-medium text-blue-800 underline"
                                                href={`/freelancer/proposals/${proposal.id}`}
                                            >
                                                <p>{proposal.job.title}</p>
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            )) : <div className="text-sm font-medium text-gray-500">No offered proposals</div>}

                        </div>
                    </div>


                    <div className="w-full p-6 border border-gray-300 rounded-2xl">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-semibold text-black">Active proposal ({activeProposals.length})</div>
                                    {/* <img src="/assets/Icons/freelancer/job/question-circle.png" alt="question" className="w-6 h-6" /> */}
                                </div>
                            </div>
                            {activeProposals.length > 0 ? activeProposals.map((proposal: any) => (
                                <div className="pb-4 w-full flex flex-col justify-start items-start gap-2.5">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col items-center justify-start w-full sm:gap-4 sm:flex-row">
                                            <div className="flex flex-col items-start justify-start w-full gap-1 sm:w-1/4">
                                                <div className="text-sm font-medium text-black">Submitted {proposal.created_at_human}</div>
                                                <div className="text-xs font-normal text-gray-500">{proposal.created_at_human_ago}</div>
                                            </div>

                                            <Link className="w-full text-base font-medium text-blue-800 underline"
                                                href={`/freelancer/proposals/${proposal.id}`}
                                            >
                                                <p>{proposal.job.title}</p>
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            )) : <div className="text-sm font-medium text-gray-500">No active proposals</div>}



                        </div>
                    </div>

                    <div className="w-full p-6 border border-gray-300 rounded-2xl">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-semibold text-black">Submitted proposals ({submittedProposals.length})</div>
                                    {/* <img src="/assets/Icons/freelancer/job/question-circle.png" alt="question" className="w-6 h-6" /> */}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {submittedProposals.length > 0 ? submittedProposals.map((proposal: any) => (
                                    <div className="pb-4 w-full flex flex-col justify-start items-start gap-2.5">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-col items-center justify-start w-full sm:gap-4 sm:flex-row">
                                                <div className="flex flex-col items-start justify-start w-full gap-1 sm:w-1/4">
                                                    <div className="text-sm font-medium text-black">Submitted {proposal.created_at_human}</div>
                                                    <div className="text-xs font-normal text-gray-500">{proposal.created_at_human_ago}</div>
                                                </div>

                                                <Link className="w-full text-base font-medium text-blue-800 underline"
                                                    href={`/freelancer/proposals/${proposal.id}`}
                                                >
                                                    <p>{proposal.job.title}</p>
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                )) : <div className="text-sm font-medium text-gray-500">No submitted proposals</div>}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end h-4">
                    <div className="px-4 border-r border-gray-300 flex justify-center items-center gap-2.5">
                        <Link
                            type='button'
                            href="/freelancer/dashboard"
                            className="text-blue-800 text-base font-medium font-['Inter'] underline leading-none">
                            Search for jobs
                        </Link>
                    </div>
                    <div className="px-4 flex justify-center items-center gap-2.5">
                        <Link
                            type='button'
                            href="/freelancer/profile"
                            className="text-blue-800 text-base font-medium font-['Inter'] underline leading-none">
                            Manage your profile
                        </Link>
                    </div>
                </div>

            </div>
        </AppLayout>
    )
}

