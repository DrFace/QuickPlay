import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PencilIcon } from "@heroicons/react/20/solid";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import { EyeIcon } from "@heroicons/react/24/outline";



export default function IdentityVerificationPage({
    auth,
    identityVerifications,
    filters,
}: {
    auth: PageProps;
    identityVerifications: any;
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
            name: "Identity Verifications",
            hasArrow: true,
            link: route("admin.identity-verifications.index"),
        },
    ];

    const tableColumns = [
        {
            label: "",
            sortField: "",
            sortable: false,
        },
        // {
        //     label: "ID",
        //     sortField: "id",
        //     sortable: false,
        // },
        {
            label: "Full Name",
            sortField: "full_name",
            sortable: true,
        },
        {
            label: "Status",
            sortField: "status",
            sortable: true,
        },
        {
            label: "Created At",
            sortField: "created_at",
            sortable: true,
        },
    ];

    const search = {
        placeholder: "Search Verifications",
        status: filters.status || "",
    };

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Identity Verifications" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Identity Verifications
                    </h2>
                </div>
            </div>
            <div>
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.identity-verifications.index")}
                    search={search}
                    links={identityVerifications?.meta?.links}
                >
                    {identityVerifications.data.map((verification: any) => (
                        <TableBody
                            key={verification.id}
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2"
                                        href={route("admin.identity-verifications.show", { id: verification.id })}
                                    >
                                         <EyeIcon className="w-3 h-3 mr-2" /> view
                                    </PrimaryLink>
                                    {/* <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.identity-verifications.destroy", { id: verification.id })}
                                        label="Delete"
                                    /> */}
                                </>
                            }
                        >
                            {/* <TableTd>{verification.id}</TableTd> */}
                            <TableTd>{verification?.full_name}</TableTd>
                            <TableTd>
                                <span
                                    className={`font-bold first-letter:capitalize ${verification.status === "step_two_done"
                                            ? "text-yellow-500"
                                            : verification.status === "Verified"
                                                ? "text-green-500"
                                                : "text-gray-900"
                                        }`}
                                >
                                    {verification.status === "step_two_done" ? "Pending" : "Verified"}
                                </span>
                            </TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{verification?.created_at_human}</small>
                            </TableTd>
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
