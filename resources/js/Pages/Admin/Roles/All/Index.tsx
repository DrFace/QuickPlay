import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import MasterTable, {
    TableBody,
    TableTd,
} from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import { PencilIcon } from "@heroicons/react/20/solid";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function Roles({
    auth,
    roles,
    filters,
}: {
    auth: PageProps;
    roles: any;
    filters: any;
}) {

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("dashboard"),
        },
        {
            name: "Roles",
            hasArrow: true,
            link: route("admin.roles.index"),
        },
    ];

    const tableColumns = [
        {
            label: "",
            sortField: "",
            sortable: false,
        },
        {
            label: "ID",
            sortField: "id",
            sortable: true,
        },
        {
            label: "Role",
            sortField: "name",
            sortable: true,
        },
        {
            label: "Actions",
            sortField: "status",
            sortable: false,
        },
        {
            label: "Created At",
            sortField: "created_at",
            sortable: true,
        },

    ];

    const createLink = {
        url: route("admin.roles.create"),
        label: "Create Role",
    }

    const importLink = {
        url: route("admin.roles.create"),
        label: "Import Roles",
    }

    const exportLink = {
        url: route("admin.roles.create"),
        label: "Export Roles",
    }


    const search = {
        placeholder: "Search Roles...",
        status: filters.status || "",
    }

   // console.log(roles);

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Roles" />
            <div className="mb-4 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Roles
                    </h2>
                </div>
            </div>

            <div>
                {/* Table */}
                <MasterTable
                    tableColumns={tableColumns}
                    url={route("admin.roles.index")}
                    createLink={createLink}
                    importLink={importLink}
                    exportLink={exportLink}
                    search={search}
                    filters={filters}
                    links={roles.meta.links}
                >
                    {roles.data.map((role: any) => (
                        <TableBody
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2"
                                        href={route("admin.roles.edit", {
                                            role: role.id,
                                        })}
                                    >
                                        <PencilIcon className="w-5 h-5 mr-4" />
                                        {"Edit"}
                                    </PrimaryLink>
                                    <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.roles.destroy", {
                                            role: role.id,
                                        })}
                                        label="Delete"
                                    />
                                </>

                            }
                            key={role.id}
                        >
                            <TableTd>{role.id}</TableTd>
                            <TableTd>{role.name}</TableTd>
                            <TableTd>{role.status}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{role?.created_at_human}</small>
                            </TableTd>
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>


    );
}
