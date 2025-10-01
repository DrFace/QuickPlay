import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { PencilIcon } from "@heroicons/react/20/solid";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function Sports({
    auth,
    sports,
    filters,
}: {
    auth: PageProps;
    sports: any;
    filters: any;
}) {
    const user: any = auth.user;

    const bRoutes = [
        { name: "Dashboard", hasArrow: true, link: route("admin.dashboard") },
        { name: "Sports Categories", hasArrow: true, link: route("admin.sports.index") },
    ];

    const tableColumns = [
        { label: "Sport", sortField: "name", sortable: true },
        { label: "Status", sortField: "status", sortable: true },
        { label: "Created At", sortField: "created_at", sortable: true },
    ];

    const createLink = { url: route("admin.sports.create"), label: "Create" };
    const search = { placeholder: "Search Here", status: filters.status || "" };

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Sports Categories" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Sports Categories
                    </h2>
                </div>
            </div>

            <MasterTable
                tableColumns={tableColumns}
                filters={filters}
                url={route("admin.sports.index")}
                createLink={createLink}
                search={search}
                links={sports.meta.links}
            >
                {sports.data.map((sport: any) => (
                    <TableBody
                        key={sport.id}
                        buttons={
                            <>
                                <PrimaryLink className="!py-2" href={route("admin.sports.edit", { sport: sport.id })}>
                                    <PencilIcon className="w-3 h-3 mr-2" /> Edit
                                </PrimaryLink>
                                <ConfirmButton className="!py-2" url={route("admin.sports.destroy", { sport: sport.id })} label="Delete" />
                            </>
                        }
                    >
                        <TableTd>
                            <Link href={route("admin.sports.edit", { sport: sport.id })} className="self-center text-blue-600 font-[700]">
                                {sport?.name}
                            </Link>
                        </TableTd>
                        <TableTd>{sport?.status.charAt(0).toUpperCase() + sport?.status.slice(1)}</TableTd>
                        <TableTd width={120}>
                            <small className="text-nowrap">{sport?.created_at_human}</small>
                        </TableTd>
                    </TableBody>
                ))}
            </MasterTable>
        </Authenticated>
    );
}
