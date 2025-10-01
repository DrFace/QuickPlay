import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { PencilIcon } from "@heroicons/react/20/solid";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { EyeIcon } from "@heroicons/react/24/outline";




export default function ClientPage({
    auth,
    clients,
    filters,
}: {
    auth: { user?: PageProps["auth"]["user"] };
    clients: any;
    filters: any;
}) {
    const user = auth.user;

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Clients",
            hasArrow: true,
            link: route("admin.freelancers.index"),
        },
    ];

    const tableColumns = [
        {
            label: "",
            sortField: "",
            sortable: false,
        },
        {
            label: "Full Name",
            sortField: "first_name",
            sortable: true,
        },

        {
            label: "Email",
            sortField: "email",
            sortable: true,
        },
        {
            label: "Created At",
            sortField: "created_at_human",
            sortable: true,
        },
    ];

    const search = {
        placeholder: "Search Here",
        status: filters.status || "",

    };
   // console.log(clients);

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Clients" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Clients
                    </h2>
                </div>
            </div>
            <div>
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.clients.index")} // Ensure this route handles sorting and searching
                    search={search}
                    links={clients?.meta?.links}
                >
                    {clients.data.map((client:any) => (
                        <TableBody
                            key={client.id}
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2"
                                        href={route("admin.clients.show", { client: client.id })}
                                    >
                                        <EyeIcon className="w-3 h-3 mr-2" /> view
                                    </PrimaryLink>
                                    <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.clients.destroy", { client: client.id })}
                                        label="Delete"
                                    />
                                </>
                            }
                        >
                            <TableTd>{client.full_name}</TableTd>
                            <TableTd>{client.email}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{client?.created_at_human}</small>
                            </TableTd>
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
