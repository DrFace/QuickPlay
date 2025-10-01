import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PencilIcon } from "@heroicons/react/20/solid";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";



export default function BankDetailsPage({
    auth,
    bankDetails,
    filters,
    countryMap,
}: {
    auth: PageProps;
    bankDetails: any;
    filters: any;
    countryMap: any;
}) {
    const user = auth.user;
    const { data, meta } = bankDetails;

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Banks",
            hasArrow: true,
            link: route("admin.bank-details.index"),
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
        //     sortable: true,
        // },
        {
            label: "Bank Name",
            sortField: "bank_name",
            sortable: true,
        },
        {
            label: "Country",
            sortField: "country",
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

    const createLink = {
        url: route("admin.bank-details.create"),
        label: "Create",
    };

    const search = {
        placeholder: "Search Banks",
        status: filters.status || "",
    };

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Banks" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Banks
                    </h2>
                </div>
            </div>

            <div >
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.bank-details.index")}
                    createLink={createLink}
                    search={search}
                    links={bankDetails?.meta?.links}
                >
                    {bankDetails?.data?.map((detail: any) => (
                        <TableBody
                            key={detail.id}
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2"
                                        href={route("admin.bank-details.edit", { id: detail?.id })}
                                    >
                                        <PencilIcon className="w-3 h-3 mr-2" /> Edit
                                    </PrimaryLink>
                                    <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.bank-details.destroy", { id: detail?.id })}
                                        label="Delete"
                                    />
                                </>
                            }
                        >
                            <TableTd>
                                <div className="flex">
                                    <Link
                                        href={route("admin.bank-details.edit", {
                                            id: detail?.id,
                                        })}
                                        className="self-center text-blue-600 font-[700]"
                                    >
                                        {detail?.bank_name}
                                    </Link>
                                </div>
                            </TableTd>

                            {/* <TableTd >{detail.id}</TableTd> */}
                            {/* <TableTd >{detail?.bank_name}</TableTd> */}
                            <TableTd >{detail?.country}</TableTd>
                            <TableTd >{detail?.status.charAt(0).toUpperCase() +detail?.status.slice(1)}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{detail?.created_at_human}</small>
                            </TableTd>
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
