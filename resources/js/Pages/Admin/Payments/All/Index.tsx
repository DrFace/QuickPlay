import { PageProps } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { PencilIcon } from "@heroicons/react/20/solid";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { EyeIcon } from "@heroicons/react/24/outline";
import useStateRef from "react-usestateref";

export default function Payments({
    auth,
    payments,
    filters,
    paymentStatus,

}: {
    auth: PageProps;
    payments: any;
    filters: any;
    paymentStatus: any;
}) {
    const user: any = auth.user;

    const [status, setStatus, statusRef] = useStateRef(
        filters.status ?? "pending"
     );

     const filterClickHandler = () => {
        router.visit(route("admin.payments.index"), {
           method: "get",
           data: {
              status: statusRef.current,
           },
           preserveState: true,
           replace: true,
        });
     };

     function setShowData(tab: string) {
        setStatus(tab);
        filterClickHandler();
     }

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Payments",
            hasArrow: true,
            link: route("admin.payments.index"),
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
            label: "Amount",
            sortField: "amount",
            sortable: true,
        },
        {
            label: "Payment For",
            sortField: "payment_for",
            sortable: true,
        },

        {
            label: "Type",
            sortField: "type",
            sortable: true,
        },
        {
            label: "Payment",
            sortField: "status",
            sortable: false,
        },
        {
            label: "Release Status",
            sortField: "payment_release_status",
            sortable: false,
        },
        {
            label: "Created At",
            sortField: "created_at",
            sortable: true,
        },
        // {
        //     label: "Updated AT",
        //     sortField: "updated_at",
        //     sortable: true,
        // },
    ];

    const tabList = [
        {
           status: "All",
           label: "All",
        },
        {
           status: "Released",
           label: "Released",
        },
        {
           status: "Can be released",
           label: "Can be released",
        },
     ];

    const createLink = {
        url: route("admin.payments.create"),
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
        status: status,
    };

    const statusFilter = {
        status: status,
     };

   // console.log(payments);

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Payments" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Payments
                    </h2>
                </div>
            </div>
            <div>
            <div className="flex flex-wrap justify-center mt-5 intro-y">
               <div className="flex justify-start">
                  <ul className="flex justify-center font-bold text-center text-white rounded-lg nav nav-link-tabs bg-primary lg:justify-start">
                     {tabList?.map((stat: any, index: any) => (
                        <li
                           key={index}
                           className="nav-item"
                           role="presentation"
                        >
                           <div
                              onClick={(e) => setShowData(stat?.status)}
                              className={`px-16 py-3 rounded-lg hover:cursor-pointer ${
                                 status === stat?.status
                                    ? "bg-secondary"
                                    : "bg-primary"
                              }`}
                           >
                              {stat?.label}
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
            <div>
                {/* Table */}
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.payments.index")}
                    //createLink={createLink}
                    // importLink={importLink}
                    // exportLink={exportLink}
                    // importTemplateLink={importTemplateLink}
                    statusFilter={statusFilter}
                    search={search}
                    links={payments.meta.links}
                >
                    {payments.data.map((payment: any) => (
                        <TableBody
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2 "
                                        href={route("admin.payments.edit", {
                                            payment: payment.id,
                                        })}
                                    >
                                         <EyeIcon className="w-3 h-3 mr-2" /> view
                                    </PrimaryLink>
                                    {/* <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.payments.destroy", {
                                            payment: payment.id,
                                        })}
                                        label="Delete"
                                    /> */}
                                </>
                            }
                            key={payment.id}
                        >
                            {/* <TableTd>
                                <div className="flex">
                                    <Link
                                        href={route("admin.payments.edit", {
                                            payment: payment.id,
                                        })}
                                        className="self-center text-blue-600 font-[700]"
                                    >
                                        {payment?.connects}
                                    </Link>
                                </div>
                            </TableTd> */}
                            <TableTd>{payment?.full_name}</TableTd>
                            <TableTd>{payment?.type === 'credit' ? <span className="text-green-500 text-nowrap">$ {payment?.amount}</span>  : <span className="text-red-500 text-nowrap">$ {payment?.amount}</span> }</TableTd>
                            <TableTd>{payment?.payment_for == 'connect_package' ? 'Connect Package' : payment?.payment_for == 'full_project' ? 'Full Project' : payment?.payment_for == 'milestone' ? 'Milestone' : 'Payout'}</TableTd>
                            <TableTd>{payment?.type == 'credit' ? 'Credit' : 'Debit'}</TableTd>
                            <TableTd>{payment?.status == 'pending' ? 'Pending' : payment?.status == 'succeeded' ? 'Succeeded' : payment?.status == 'failed' ? 'Failed' : 'Refunded'}</TableTd>
                            <TableTd>{payment?.payment_release_status}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{payment?.created_at_human}</small>
                            </TableTd>
                            {/* <TableTd width={120}>
                                <small>{payment?.updated_at_human}</small>
                            </TableTd> */}
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
