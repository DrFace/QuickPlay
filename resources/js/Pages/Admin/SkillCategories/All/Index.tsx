import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { PencilIcon } from "@heroicons/react/20/solid";
import MasterTable, { TableBody, TableTd } from "@/Components/elements/tables/masterTable";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import ConfirmButton from "@/Components/elements/buttons/ConfirmButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";


export default function Skills({
    auth,
    skills,
    filters,
}: {
    auth: PageProps;
    skills: any;
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
            name: "Skill Categories",
            hasArrow: true,
            link: route("admin.skills.index"),
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
            label: "Skill",
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
        url: route("admin.skills.create"),
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
            <Head title="Skill Categories" />
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Skill Categories
                    </h2>
                </div>
            </div>
            <div>
                {/* Table */}
                <MasterTable
                    tableColumns={tableColumns}
                    filters={filters}
                    url={route("admin.skills.index")}
                    createLink={createLink}
                    // importLink={importLink}
                    // exportLink={exportLink}
                    // importTemplateLink={importTemplateLink}
                    search={search}
                    links={skills.meta.links}
                >
                    {skills.data.map((skill: any) => (
                        <TableBody
                            buttons={
                                <>
                                    <PrimaryLink
                                        className="!py-2 "
                                        href={route("admin.skills.edit", {
                                            skill: skill.id,
                                        })}
                                    >
                                        <PencilIcon className="w-3 h-3 mr-2" />{" "}
                                        {"Edit"}
                                    </PrimaryLink>
                                    <ConfirmButton
                                        className="!py-2"
                                        url={route("admin.skills.destroy", {
                                            skill: skill.id,
                                        })}
                                        label="Delete"
                                    />
                                </>
                            }
                            key={skill.id}
                        >
                            {/* <TableTd>{skill.id}</TableTd> */}
                            <TableTd>
                                <div className="flex">
                                    <Link
                                        href={route("admin.skills.edit", {
                                            skill: skill.id,
                                        })}
                                        className="self-center text-blue-600 font-[700]"
                                    >
                                        {skill?.name}
                                    </Link>
                                </div>
                            </TableTd>

                            <TableTd>{skill?.status.charAt(0).toUpperCase() + skill?.status.slice(1)}</TableTd>
                            <TableTd width={120}>
                                <small className="text-nowrap">{skill?.created_at_human}</small>
                            </TableTd>
                            {/* <TableTd width={120}>
                                <small>{skill?.updated_at_human}</small>
                            </TableTd> */}
                        </TableBody>
                    ))}
                </MasterTable>
            </div>
        </Authenticated>
    );
}
