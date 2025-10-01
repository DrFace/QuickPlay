import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Link } from '@inertiajs/react';
import { PencilIcon } from "@heroicons/react/20/solid";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function Tickets({
    auth,
    tickets,
    filters,
}: {
    auth: PageProps;
    tickets: {
        id: string;
        subject: string;
        category: string;
        description: string;
        status: string;
        created_at_human: string;
        updated_at: string;
        meta: { links: any };
    }[];
    filters: any;
}) {
    const user: any = auth.user;

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Tickets",
            hasArrow: true,
            link: route("admin.tickets.index"),
        },
    ];

    const tableColumns = [
        {
            label: "",
            sortField: "",
            sortable: false,
        },
        { label: "Subject", sortField: "subject", sortable: true },
        { label: "Category", sortField: "category", sortable: true },
        { label: "Status", sortField: "status", sortable: true },
        { label: "Created At", sortField: "created_at", sortable: true },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [activeSection, setActiveSection] = useState("allTickets");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const search = {
        placeholder: "Search Here",
        status: filters.status || "",
    };

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Tickets" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Issue Reporting Center
                    </h2>
                </div>
            </div>

            <div className="space-y-3">
                {activeSection === "allTickets" && (
                    <MasterTable
                        tableColumns={tableColumns}
                        filters={{ searchParam: searchTerm, page: 1, perPage: 10, sortBy: "subject", sortDirection: "asc" }}
                        url={route("admin.tickets.index")}
                        search={search}
                        links={filteredTickets}
                    >
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket: any) => (
                                <TableBody
                                    buttons={
                                        <>
                                            <PrimaryLink
                                                className="!py-2 "
                                                href={route("admin.tickets.show", {
                                                    ticket: ticket.id,
                                                })}
                                            >
                                                 <EyeIcon className="w-3 h-3 mr-2" /> view
                                            </PrimaryLink>
                                        </>
                                    }
                                    key={ticket.id}
                                >
                                    <TableTd>{ticket.subject}</TableTd>
                                    <TableTd>{ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</TableTd>
                                    <TableTd>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</TableTd>
                                    <TableTd>{ticket.created_at_human}</TableTd>
                                </TableBody>
                            ))
                        ) : (
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="py-4 text-sm text-center text-gray-500"
                                    >
                                        <div className="w-full flex min-h-[100px] justify-center items-center text-center border-dashed border border-gray-200 italic text-gray-500 text-sm">
                                            Sorry, No Data Found
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </MasterTable>
                )}
            </div>
        </Authenticated>
    );
}
