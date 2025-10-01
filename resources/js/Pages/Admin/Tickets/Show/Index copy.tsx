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
        id: string;
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
            <Head title="Tickets " />
            <div className="md:flex md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold">{ticket.subject}</h1>
            </div>

            <div className="relative p-4 mx-auto space-y-6 sm:p-8 max-w-7xl bg-white shadow-lg rounded-lg">
                <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={ticket.creator?.avatar || "path/to/fallback/image.png"}
                            alt="Ticket Creator"
                            className="w-10 h-10 rounded-full"
                        />
                        <p className="text-lg font-semibold">{user.first_name} {user.last_name}</p>
                    </div>
                    <p className="text-gray-600">Status: {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</p>
                    <p className="text-gray-600">Category: {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</p>
                    <p className="text-gray-600">Description: {ticket.description}</p>
                    <p className="text-gray-500 text-sm">{formatDate(ticket.created_at)}</p>
                </div>
            </div>

            <div className="overflow-y-auto max-h-96 flex flex-col mt-4">
                {ticket_replies.map((reply) => (
                    <div key={reply.id} className={`flex flex-col gap-2 mb-4 ${reply.user_id !== user.id ? 'items-end' : 'items-start'}`}>
                        <div className={`flex p-3 rounded-lg ${reply.user_id !== user.id ? 'bg-gray-200' : 'bg-blue-100'} w-full`}>
                            <img
                                src={reply.user_id === user.id ? user.avatar : ticket.creator?.avatar}
                                alt="Reply Avatar"
                                className="w-10 h-10 rounded-full mr-2"
                            />
                            <div>
                                <p className="font-semibold">{reply.user_id === user.id ? 'Admin' : `${user.first_name} ${user.last_name}`}</p>
                                <p className="px-4 text-start ql-editor" dangerouslySetInnerHTML={{ __html: reply?.reply }} />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">{formatDate(reply.created_at)}</p>
                    </div>
                ))}
            </div>

            <div className="m-3">
                <form onSubmit={handleReply} className="mt-0">
                    <div>
                        <InputLabel htmlFor="status" value="Change Ticket Status Here" />
                        <SelectInput
                            className="border-gray-300 m-3 w-40 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm"
                            options={ticketStatus}
                            selectedOption={ticketStatus.find((obj) => obj.value === data.status)}
                            setData={(e: any) => setData("status", e)}
                        />
                        <InputError message={errors.status} className="mt-2 text-red-600" />
                    </div>

                    <div>
                        <Quill
                            theme="snow"
                            style={{ height: "237px", marginBottom: "70px" }}
                            modules={modules}
                            value={data.reply}
                            formats={formats}
                            onChange={(value: string) => {
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
