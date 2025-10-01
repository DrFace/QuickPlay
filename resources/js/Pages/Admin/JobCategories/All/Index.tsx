import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { PencilIcon } from "@heroicons/react/20/solid";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";


export default function Departments({
    auth,
    categories,
    filters,
}: {
    auth: PageProps;
    categories: any;
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
            name: "Job Categories",
            hasArrow: true,
            link: route("admin.categories.index"),
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
            label: "Category",
            sortField: "name",
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
        // {
        //     label: "Updated AT",
        //     sortField: "updated_at",
        //     sortable: true,
        // },
    ];

    const createLink = {
        url: route("admin.categories.create"),
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

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Job Categories" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Job Categories
                    </h2>
                </div>
            </div>
            <div>
                {/* Table */}
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.categories.index")}
                    createLink={createLink}
                    // importLink={importLink}
                    // exportLink={exportLink}
                    // importTemplateLink={importTemplateLink}
                    search={search}
                    links={categories.meta.links}
                >
                    {categories.data.map((category: any) => (
                        <TableBody
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2 "
                                        href={route("admin.categories.edit", {
                                            category: category.id,
                                        })}
                                    >
                                        <PencilIcon className="w-3 h-3 mr-2" />{" "}
                                        {"Edit"}
                                    </PrimaryLink>
                                    <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.categories.destroy", {
                                            category: category.id,
                                        })}
                                        label="Delete"
                                    />
                                </>
                            }
                            key={category.id}
                        >
                            {/* <TableTd>{category.id}</TableTd> */}
                            <TableTd>
                                <div className="flex">
                                    <Link
                                        href={route("admin.categories.edit", {
                                            category: category.id,
                                        })}
                                        className="self-center text-blue-600 font-[700]"
                                    >
                                        {category?.name}
                                    </Link>
                                </div>
                            </TableTd>

                            <TableTd>{category?.status.charAt(0).toUpperCase() + category?.status.slice(1)}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{category?.created_at_human}</small>
                            </TableTd>
                            {/* <TableTd width={120}>
                                <small>{category?.updated_at_human}</small>
                            </TableTd> */}
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
