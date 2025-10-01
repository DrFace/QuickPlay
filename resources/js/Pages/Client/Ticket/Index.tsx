import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { PlusIcon } from '@heroicons/react/24/outline';
import TicketModal from "./TicketModal";
import axios from "axios";

interface TicketProps {
    user: { id: string; name: string; email: string };
    tickets: {
        id: string;
        subject: string;
        category: string;
        description: string;
    }[];
}

interface Fixture {
    id: number;
    name: string;
    starting_at: string;
    league: { name: string; image_path: string };
    state: { name: string };
    participants: {
        id: number;
        name: string;
        image_path: string;
        meta: { location: string };
    }[];
}

export default function Ticket({ user, tickets }: TicketProps) {
    const [activeSection, setActiveSection] = useState<string>("allTickets");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAllTickets, setShowAllTickets] = useState<boolean>(false);

    // Fixtures state
    const [fixtures, setFixtures] = useState<Fixture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleSectionClick = (section: string) => {
        setActiveSection(section);
    };

    const totalIssues = tickets.length;
    const displayedTickets = showAllTickets ? tickets : tickets.slice(0, 10);

    // Fetch fixtures from Sportmonks API
    useEffect(() => {
        const fetchFixtures = async () => {
            try {
                const response = await axios.get(
                    "https://api.sportmonks.com/v3/football/fixtures/between/2025-10-01/2025-10-08",
                    {
                        params: {
                            api_token: "ZfmJgx0vvmKJ5SBKLLJS1JfxvFAdm05RL1Tw6B8PYYUXkrAqjyxNFGlJoWz9",
                            include: "participants;state;season;league",
                            filters: "fixtureStates:1;fixtureLeagues:271",
                        },
                    }
                );
                setFixtures(response.data.data || []);
            } catch (error) {
                console.error("Error fetching fixtures:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFixtures();
    }, []);

    return (
        <AppLayout isClientHeader={true} isHeader={false}>
            <Head title="Tickets" />
            <div className="relative min-h-screen p-4 mx-auto mt-20 space-y-8 bg-white sm:p-8 max-w-7xl">

                {/* Header */}
                <div className="flex flex-col items-start justify-between mt-12 mb-4 sm:flex-row sm:mt-16">
                    <div className="mt-3 text-3xl font-semibold text-black sm:text-4xl sm:mb-0 whitespace-nowrap">
                        Threads
                    </div>
                    <div className="flex justify-end w-full mt-2">
                        <button
                            className="flex items-center justify-center h-10 gap-1 p-4 rounded-full bg-acivationColor sm:w-36 sm:mt-0"
                            onClick={() => setShowModal(true)}
                        >
                            <PlusIcon className="w-5 h-5 text-white" />
                            <span className="p-1 text-base font-medium text-white">New </span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-OverviewborderColor">
                    <div className="flex items-center justify-start pt-3">
                        <div className="w-full md:w-[155px] flex flex-col items-start space-y-1 justify-start relative">
                            <div
                                className={`text-base font-semibold cursor-pointer ${activeSection === "allTickets"
                                    ? "text-acivationColor"
                                    : "text-OverviewborderColor"
                                    }`}
                                onClick={() => handleSectionClick("allTickets")}
                            >
                                Threads
                            </div>
                            <div
                                className={`w-1/2  ${activeSection === "allTickets"
                                    ? "border-acivationColor"
                                    : "border-transparent"
                                    }`}
                            />
                        </div>

                        <div
                            className={`text-base font-semibold cursor-pointer ml-6 ${activeSection === "fixtures"
                                ? "text-acivationColor"
                                : "text-OverviewborderColor"
                                }`}
                            onClick={() => handleSectionClick("fixtures")}
                        >
                            Fixtures
                        </div>
                    </div>
                </div>

                {/* Tickets Section */}
                {activeSection === "allTickets" && (
                    <div>
                        <ul className="space-y-6">
                            {displayedTickets.length > 0 ? (
                                displayedTickets.map((ticket) => (
                                    <li key={ticket.id} className="overflow-hidden border border-gray-300 rounded-2xl">
                                        <Link
                                            href={route('client.ReplyTicket', ticket.id)}
                                            className="block p-6 gap-2.5 hover:bg-gray-100 transition"
                                        >
                                            <div className="font-bold text-lg leading-[20px] mb-2">
                                                {ticket.subject}
                                            </div>

                                            <h3 className="font-medium text-sm leading-[17px] text-textSecondary">
                                                Issues {String(totalIssues - tickets.indexOf(ticket)).padStart(3, '0')}
                                            </h3>

                                            <div className="grid grid-cols-[96px_5px_1fr] gap-y-2 gap-x-0 pt-4">
                                                <p className="font-medium text-textSecondary">Subject</p>
                                                <p>:</p>
                                                <p className="ml-3">{ticket.subject}</p>

                                                <p className="font-medium text-textSecondary">Category</p>
                                                <p>:</p>
                                                <p className="ml-3">{ticket.category}</p>

                                                <p className="font-medium text-textSecondary">Description</p>
                                                <p>:</p>
                                                <p className="ml-3">{ticket.description}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-center text-base text-textSecondary">
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

                {/* Fixtures Section */}
                {activeSection === "fixtures" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Upcoming Fixtures</h2>
                        {loading ? (
                            <p>Loading fixtures...</p>
                        ) : fixtures.length > 0 ? (
                            <ul className="space-y-4">
                                {fixtures.map((fixture) => {
                                    const home = fixture.participants.find((p) => p.meta.location === "home");
                                    const away = fixture.participants.find((p) => p.meta.location === "away");
                                    return (
                                        <li key={fixture.id} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <img src={home?.image_path} alt={home?.name} className="w-8 h-8" />
                                                    <span>{home?.name}</span>
                                                    <span className="mx-2">vs</span>
                                                    <img src={away?.image_path} alt={away?.name} className="w-8 h-8" />
                                                    <span>{away?.name}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {new Date(fixture.starting_at).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                League: {fixture.league.name} ({fixture.state.name})
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No fixtures available.</p>
                        )}
                    </div>
                )}

                {/* Modal */}
                <TicketModal show={showModal} onClose={() => setShowModal(false)} />
            </div>
        </AppLayout>
    );
}
