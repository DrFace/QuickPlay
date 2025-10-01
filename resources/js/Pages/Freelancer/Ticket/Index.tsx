import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { PlusIcon } from '@heroicons/react/24/outline';
import TicketModal from "./TicketModal";
import { Link } from '@inertiajs/react';

interface TicketProps {
    user: { id: string; name: string; email: string };
    tickets: {
        id: string;
        subject: string;
        category: string;
        description: string;
    }[];
}

export default function Ticket({ user, tickets }: TicketProps) {
    const [activeSection, setActiveSection] = useState<string>("allTickets");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAllTickets, setShowAllTickets] = useState<boolean>(false);

    const handleSectionClick = (section: string) => {
        setActiveSection(section);
    };

    const totalIssues = tickets.length;

    const displayedTickets = showAllTickets ? tickets : tickets.slice(0, 10);

    return (
        <AppLayout isFreelancerHeader={true} isHeader={false}>
            <Head title="Tickets" />
            <div className="relative min-h-screen p-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 max-w-7xl">
                <div className="flex flex-col items-start justify-between mt-12 mb-4 sm:flex-row sm:mt-16">
                    <div className="mt-3 text-3xl font-semibold text-black sm:text-4xl sm:mb-0 whitespace-nowrap">
                        Issue Reporting Center
                    </div>
                    <div className="flex justify-end w-full mt-2">
                        <button
                            className="flex items-center justify-center h-10 gap-1 p-4 rounded-full bg-acivationColor sm:w-36 mt- sm:mt-0"
                            onClick={() => setShowModal(true)}
                        >
                            <PlusIcon className="w-5 h-5 text-white" />
                            <span className="p-1 text-base font-medium text-white">Add Ticket</span>
                        </button>
                    </div>
                </div>

                <div className="border-b border-OverviewborderColor">
                    <div className="flex items-center justify-start pt-3">
                        <div className="w-full md:w-[155px] flex flex-col items-start space-y-1 justify-start relative">
                            <div
                                className={`text-base font-semibold cursor-pointer gap-4 ${activeSection === "allTickets"
                                    ? "text-acivationColor"
                                    : "text-OverviewborderColor"
                                    }`}
                                onClick={() => handleSectionClick("allTickets")}
                            >

                            </div>
                            <div
                                className={`w-1/2  ${activeSection === "allTickets"
                                    ? "border-acivationColor"
                                    : "border-transparent"
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {activeSection === "allTickets" && (
                        <div>
                          <ul className="space-y-6">
    {displayedTickets.length > 0 ? (
        displayedTickets.map((ticket, index) => (
            <li key={ticket.id} className="overflow-hidden border border-gray-300 rounded-2xl">
                <Link
                    href={route('freelancer.ReplyTicket', ticket.id)}
                    className="block p-6 gap-2.5 hover:bg-gray-100 transition"
                >
                    <div className="font-bold text-lg leading-[20px] mb-2">
                        {ticket.subject}
                    </div>

                    <h3 className="font-medium text-sm leading-[17px] text-textSecondary">
                        Issues {String(totalIssues - tickets.indexOf(ticket)).padStart(3, '0')}
                    </h3>

                    <div className="grid grid-cols-[96px_5px_1fr] gap-y-2 gap-x-0 pt-4">
                        <p className="text-base leading-[19px] font-medium text-textSecondary">Subject</p>
                        <p className="text-base leading-[19px] font-semibold text-textSecondary">:</p>
                        <p className="text-base leading-[19px] font-medium text-textSecondary ml-3">{ticket.subject}</p>

                        <p className="text-base leading-[19px] font-medium text-textSecondary">Category</p>
                        <p className="text-base leading-[19px] font-semibold text-textSecondary">:</p>
                        <p className="text-base leading-[19px] font-medium text-textSecondary ml-3">
                            {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                        </p>

                        <p className="text-base leading-[19px] font-medium text-textSecondary">Description</p>
                        <p className="text-base leading-[19px] font-semibold text-textSecondary">:</p>
                        <p className="text-base leading-[19px] font-medium text-textSecondary ml-3">{ticket.description}</p>
                    </div>
                </Link>
            </li>
        ))
    ) : (
        <li className="text-center text-base leading-[19px] text-textSecondary">
            No Ticket Yet
        </li>
    )}
</ul>

                            {totalIssues > 10 && (
                                <button
                                    className="p-2 mt-4 text-white rounded bg-acivationColor"
                                    onClick={() => setShowAllTickets(!showAllTickets)}
                                >
                                    {showAllTickets ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <TicketModal show={showModal} onClose={() => setShowModal(false)} />
            </div>
        </AppLayout>
    );
}
