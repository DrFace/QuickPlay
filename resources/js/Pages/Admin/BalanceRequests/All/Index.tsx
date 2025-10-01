import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { PencilIcon } from "@heroicons/react/20/solid";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { EyeIcon } from "@heroicons/react/24/outline";


export default function Payments({
    auth,
    balanceRequest,
    filters,
    paymentStatus,

}: {
    auth: PageProps;
    balanceRequest: any;
    filters: any;
    paymentStatus: any;
}) {
    const user: any = auth.user;

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Payouts",
            hasArrow: true,
            link: route("admin.balance-requests.index"),
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
            sortField: "full_name",
            sortable: true,
        },
        {
            label: "Status",
            sortField: "status",
            sortable: false,
        },
        {
            label: "Amount",
            sortField: "amount",
            sortable: false,
        },
        {
            label: "Receive Amount",
            sortField: "received_amount",
            sortable: false,
        },
        {
            label: "Created At",
            sortField: "created_at",
            sortable: true,
        },

    ];

    const createLink = {
        url: route("admin.balance-requests.create"),
        label: "Create",
    };

    // const importLink = {
    //     url: route("admin.categories.import"),
    //     label: "Import",
    // };

    // const exportLink = {
    //     url: route("admin.categories.export"),
    //     label: "Export",
    // };

    // const importTemplateLink = {
    //     url: route("admin.categories.import.template"),
    //     label: "Import Template",
    // };

    const search = {
        placeholder: "Search Here",
        status: filters.status || "",
    };

    //console.log(balanceRequest);

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Payouts" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Payouts
                    </h2>
                </div>
            </div>
            <div>
                {/* Table */}
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.balance-requests.index")}
                    //createLink={createLink}
                    // importLink={importLink}
                    // exportLink={exportLink}
                    // importTemplateLink={importTemplateLink}
                    search={search}
                    links={balanceRequest.meta.links}
                >
                    {balanceRequest.data.map((request: any) => (
                        <TableBody
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2 "
                                        href={route("admin.balance-requests.edit", {
                                            balance_request: request.id,
                                        })}
                                    >
                                        <EyeIcon className="w-3 h-3 mr-2" /> view
                                    </PrimaryLink>
                                    {/* <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.balance-requests.destroy", {
                                            balance_request: request.id,
                                        })}
                                        label="Delete"
                                    /> */}
                                </>
                            }
                            key={request.id}
                        >

                            <TableTd>{request?.full_name}</TableTd>
                            <TableTd>{request?.status.charAt(0).toUpperCase() + request?.status.slice(1)}</TableTd>
                            <TableTd>$ {request?.amount}</TableTd>
                            <TableTd>$ {request?.received_amount}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{request?.created_at_human}</small>
                            </TableTd>

                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
