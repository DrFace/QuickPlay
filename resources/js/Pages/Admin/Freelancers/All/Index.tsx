import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PencilIcon } from "@heroicons/react/20/solid";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function FreelancerPage({
    auth,
    freelancers,
    filters,
}:{
    auth: { user?: PageProps["auth"]["user"] };
    freelancers: any;
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
            name: "Freelancers",
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
            sortField: "created_at",
            sortable: true,
        },
    ];

    const search = {
        placeholder: "Search Here",
        status: filters.status || "",
    };

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Freelancers" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Freelancers
                    </h2>
                </div>
            </div>
            <div>
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.freelancers.index")}
                    search={search}
                    links={freelancers?.meta?.links}
                >
                    {freelancers.data.map((freelancer: any) => (
                        <TableBody
                            key={freelancer.id}
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2"
                                        href={route("admin.freelancers.show", {
                                            freelancer: freelancer.id,
                                        })}
                                    >
                                        <EyeIcon className="w-3 h-3 mr-2" /> view
                                    </PrimaryLink>
                                    <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.freelancers.destroy", {
                                            freelancer: freelancer.id,
                                        })}
                                        label="Delete"
                                    />
                                </>
                            }
                        >
                            <TableTd>{freelancer.first_name} {freelancer.last_name}</TableTd>
                            <TableTd>{freelancer.email}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{freelancer?.created_at_human}</small>
                            </TableTd>
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
