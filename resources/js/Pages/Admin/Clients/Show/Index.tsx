import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import TextCopy from "../../Payments/Edit/Partials/TextCopy";

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at_human: string;
    avatar: string;
    active_status: boolean;
    country: string;
    user_country_time: string;
    meta_data?: {
        address_line1?: string;
        address_line2?: string;
        address_line3?: string;
        title?: string;
    };
}

interface ClientShowPageProps {
    auth: {
        user?: any;
    };
    client: Client;
    jobs: any;
}

export default function ClientShowPage({ auth, client, jobs }: ClientShowPageProps) {
    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Clients",
            hasArrow: true,
            link: route("admin.clients.index"),
        },
        {
            name: `${client.first_name} ${client.last_name}`,
            hasArrow: true,
            link: route("admin.clients.show", { client: client.id }),
        },
    ];

    const address = [
        client.meta_data?.address_line1,
        client.meta_data?.address_line2,
        client.meta_data?.address_line3,
    ]
        .filter(Boolean)
        .join(", ");

    console.log(jobs);

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title={`Client - ${client.first_name} ${client.last_name}`} />
            <div className="mb-4 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        View Client
                    </h2>
                </div>
            </div>

            <div className="flex justify-end mt-4 md:mt-0 md:ml-4">
                <PrimaryLink href={route("admin.clients.index")}>
                    Back to List
                </PrimaryLink>
            </div>

            <div className="flex flex-col gap-4 mx-auto mt-4 lg:flex-row max-w-7xl">
                <div className="w-full p-6 space-y-4 bg-white rounded-lg shadow-md lg:w-1/3">
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center w-16 h-16 mx-auto">
                            <div className={`absolute w-2 h-2  rounded-full left-1 top-1 ring-2 ring-white ${client?.active_status ? "bg-green-500" : "bg-red-500"}`}
                            > </div>
                            <img
                                className="w-16 h-16 rounded-full"
                                src={client.avatar}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium">{client.first_name} {client.last_name}</p>
                        <p className="text-gray-500">{client.country} - {client.user_country_time}</p>
                        <p className="text-sm text-gray-500">Joined since - {client.created_at_human}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-medium">Email</h2>
                        <TextCopy text={client?.email} />
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    {address &&
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                            <p className="mt-2 text-lg text-gray-700">
                                {address}
                            </p>
                        </div>
                    }

                    {jobs && jobs.length > 0 && (
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900">Jobs</h3>
                            <p className="mt-2 text-lg text-gray-700">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead className="bg-gray-200">
                                        <tr>

                                            <th className="px-4 py-2 border-b text-start">Title</th>
                                            <th className="px-4 py-2 border-b">Create At</th>
                                            {status && <th className="px-4 py-2 border-b">Status</th>}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((job: any) => (
                                            <tr key={job.id}>

                                                <td className="px-4 py-2 border-b cursor-pointer">
                                                    <div className="max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis">
                                                    <a
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href={job?.public_url}
                                                            className="w-auto px-2 py-2 text-base font-semibold rounded-3xl text-primary "
                                                        >
                                                           {job?.title}
                                                        </a>

                                                    </div>
                                                </td>
                                                <td className="w-24 px-4 py-2 text-center border-b whitespace-nowrap">{job.created_at_human}</td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </Authenticated>
    );
}
