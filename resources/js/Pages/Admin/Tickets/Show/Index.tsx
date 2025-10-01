import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Link } from '@inertiajs/react';
import React, { ReactNode, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputError from "@/Components/elements/inputs/InputError";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";

interface Ticket {
    user_id: string;
    status: string;
    id: string;
    subject: string;
    category: string;
    description: string;
    created_at: string;
    creator?: {
        avatar: string;
        active_status: boolean;
        id: string;
        first_name: string;
        last_name: string;
    }
}

interface ReplyTicket {
    avatar: string | undefined;
    id: string;
    ticket_id: string;
    subject: string;
    category: string;
    created_at: string;
    reply: string;
    user_id: string;
    status?: string;
    rcreator?: {
        first_name: string;
        last_name: string;
    };
}

interface PageProps {
    ticket: Ticket;
    user: {
        last_name: ReactNode;
        first_name: ReactNode;
        id: string;
        name: string;
        email: string;
        avatar: string;
    };
    ticket_replies: ReplyTicket[];
    ReplyTicket: ReplyTicket;
    [key: string]: any;
}

const ticketStatus = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'closed', label: 'Closed' },
];

const modules = {
    toolbar: [
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link"],
    ],
    clipboard: {
        matchVisual: false,
    },
};

const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
];

export default function ReplyTicket() {
    const { ticket, user, ticket_replies } = usePage<PageProps>().props;
    const [status, setStatus] = useState(ticket.status || "active");
    const { data, setData, post, errors } = useForm({
        reply: "",
        status: ticket.status || "active",
    });

    const getAvatarUrl = (userId: string) => {
        return `/uploads/avatars/${userId}.png`;
    }

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/tickets/${ticket.id}/status`, {
            data: {
                status: status,
            },
            onSuccess: () => {
                post(`/admin/tickets/${ticket.id}/reply`, {
                    data: {
                        reply: data.reply,
                        status: status,
                    },
                    onSuccess: () => {
                        setData('reply', '');
                    },
                });
            },
        });
    };

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', ' at');
    };

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Tickets",
            hasArrow: true,
            link: route("admin.tickets.index"),
        },
        {
            name: "Replies",
            hasArrow: true,
            link: "#",
        },
    ];

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Tickets" />
            <div className="md:flex md:items-center md:justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{ticket.subject}</h1>
            </div>

            <div className="relative p-6 mx-auto space-y-6 sm:p-8 max-w-7xl bg-white shadow-lg rounded-lg">
                <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center gap-4">

                        <img
                            src={ticket.creator?.avatar || "path/to/fallback/image.png"}
                            alt="Ticket Creator"
                            className="w-12 h-12 rounded-full"
                        />
                        <p className="text-lg font-semibold text-gray-700">
                            {ticket.creator?.first_name} {ticket.creator?.last_name}
                        </p>                </div>
                    <p className="text-gray-600">Status: <span className="font-medium">{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span></p>
                    <p className="text-gray-600">Category: <span className="font-medium">{ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</span></p>
                    <p className="text-gray-600">Description: <span className="font-medium">{ticket.description}</span></p>
                    <p className="text-gray-500 text-sm">{formatDate(ticket.created_at)}</p>
                </div>
            </div>


            <div className="overflow-y-auto max-h-96 flex flex-col mt-4  p-4 rounded-lg ">
                {ticket_replies.map((reply) => (
                    <div
                        key={reply.id}
                        className={`flex flex-col gap-3 mb-6 ${reply.user_id !== user.id ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`flex items-start p-4 border-gray-300 rounded-lg shadow bg-white ${reply.user_id !== user.id ? 'bg-gray-100' : 'bg-blue-50'
                                } w-fit max-w-3xl`}
                        >
                            <img
                                src={reply.user_id === user.id ? user.avatar : ticket.creator?.avatar}
                                alt="Reply Avatar"
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                            <p className="font-semibold text-gray-800">
                        {reply.user_id === user.id ? 'Admin' : `${reply.rcreator?.first_name} ${reply.rcreator?.last_name}`}
                    </p>
                                <div
                                    className="px-2 text-gray-700 ql-editor text-sm"
                                    dangerouslySetInnerHTML={{ __html: reply?.reply }}
                                />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs italic">
                            {formatDate(reply.created_at)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="m-3">
                <form onSubmit={handleReply} className="mt-0">
                    <div className="mb-4">
                        <InputLabel htmlFor="status" value="Change Ticket Status" />
                        <SelectInput
                            className="border-gray-300 m-3 w-40 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm"
                            options={ticketStatus}
                            selectedOption={ticketStatus.find((obj) => obj.value === data.status)}
                            setData={(e: string) => setData("status", e)}
                        />
                        <InputError message={errors.status} className="mt-2 text-red-600" />
                    </div>

                    <div className="mb-4 bg-white">
                        <Quill
                            theme="snow"
                            style={{ height: "237px", marginBottom: "70px" }}
                            modules={modules}
                            value={data.reply}
                            formats={formats}
                            onChange={(value) => {
                                setData('reply', value);
                            }}
                        />
                        <InputError message={errors.reply} className="mt-2 text-red-600" />
                    </div>

                    <div className="flex flex-row space-x-4 items-center sm:justify-end w-full pt-7">
                        <Link
                            href={route('admin.tickets.index')}
                            className="flex justify-center items-center h-10 bg-white text-primary rounded-full border-2 border-primary text-sm font-medium leading-none w-[245px] px-8 hover:bg-gray-100 transition"
                        >
                            Back
                        </Link>
                        <button
                            type="submit"
                            className="flex justify-center items-center h-10 w-60 bg-primary text-white border-none rounded-full text-sm font-medium leading-none px-8 hover:bg-primary-dark transition"
                        >
                            <span className="tracking-tight">Submit</span>
                        </button>
                    </div>
                </form>
            </div>
        </Authenticated>
    );
}
