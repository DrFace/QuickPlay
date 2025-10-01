import React, { ReactNode } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputError from "@/Components/elements/inputs/InputError";
import { Link } from '@inertiajs/react';
import "react-quill/dist/quill.snow.css";
import { Inertia } from '@inertiajs/inertia';





interface Ticket {
    id: string;
    subject: string;
    category: string;
    description: string;
    creator?: {
        avatar: string;
        id: string;
    }
}

interface ReplyTicket {
    id: string;
    ticket_id: string;
    subject: string;
    category: string;
    created_at: string;
    reply: string;
    user_id: string;
    rcreator?: {
        avatar: string;
        id: string;
    }
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

const modules = {
    toolbar: [
        // [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link"],
        // ["clean"],
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

    const { data, setData, post, errors } = useForm({
        reply: "",
    });



    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
      //  console.log("Data being sent:", data);

        post(`/client/ReplyTicket/${ticket.id}/reply`, {
            onSuccess: () => {
                setData('reply', '');
               // console.log("Ticket submitted successfully");

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

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        return formattedDate.replace(',', ' at');
    };

   // console.log('Ticket Creator:', ticket.creator);

   // console.log(ticket_replies);
    return (
        <AppLayout isClientHeader={true} isHeader={false}>
            <Head title="Tickets" />
            <div className="relative p-4 mx-auto mt-20 space-y-6 bg-white sm:p-8 max-w-7xl">
                <h1 className="mt-16 mb-6 text-2xl font-bold sm:text-left">{ticket.subject}</h1>

                <div className="relative flex flex-col justify-end gap-2 bg-white border-2 rounded-lg shadow-md border-newborderColor">
                    <div className="flex flex-row items-center justify-start w-full gap-2 p-2 rounded-t-lg bg-newblueColor">
                        <img
                            src={user.avatar}
                            alt="Client Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <h1 className="text-2xl text-textSecondary px-4 text-[16px] font-[500] sm:text-left">
                            {user.first_name} {user.last_name}
                        </h1>
                    </div>

                    <p className="text-textSecondary text-[16px] leading-[19px] font-[500] px-4 text-start mb-10">
                        {ticket.description}
                    </p>


                </div>

                {ticket_replies.map((reply) => (
                    <div key={reply.id} className="relative flex flex-col justify-end gap-2 bg-white border-2 rounded-lg shadow-md border-newborderColor">
                        <div className={`flex flex-row p-2 gap-2 w-full rounded-t-lg  bg-newblueColor ${reply.user_id !== user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex items-center ">
                                <img
                                    src={reply.user_id === user.id ? user.avatar : reply.rcreator?.avatar}
                                    alt="Ticket Creator"
                                    className="w-10 h-10 m-3 rounded-full"
                                />
                                <p className="text-textSecondary text-[16px] leading-[19px] font-[500] px-4 text-start">
                                    {reply.user_id !== user.id ? 'Admin' : `${user.first_name} ${user.last_name}`}
                                </p>
                            </div>
                        </div>

                        <p className="px-4 text-start ql-editor"
                            dangerouslySetInnerHTML={{ __html: reply?.reply }}>
                        </p>
                        <p className="text-textSecondary text-[12px] leading-[19px] font-[500] px-4 text-end ">
                            {formatDate(reply.created_at)}
                        </p>
                    </div>
                ))}

                <div className="flex items-center w-full mb-0 rounded-lg">

                    <img
                        src={user.avatar}
                        alt="Client Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <h1 className="ml-4 text-2xl font-bold">Add Reply</h1>
                </div>




                <form onSubmit={handleReply} className="mt-0">
                    <div>
                        <Quill
                            theme="snow"
                            style={{ height: "237px", marginBottom: "70px" }}
                            modules={modules}
                            value={data.reply}
                            formats={formats}
                            placeholder="Type your reply here..."
                            onChange={(value: string) => {
                               // console.log("Reply content:", value);
                                setData('reply', value);
                            }}
                        />

                        <InputError
                            message={errors.reply}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-row items-center w-full space-x-4 sm:justify-end pt-7">
                        <Link
                            href={route('client.ticket')}
                            className="flex justify-center items-center h-10 bg-white text-primary border-2 border-primary rounded-full text-sm font-medium leading-none w-[245px] px-8"
                        >
                            Close
                        </Link>
                        <button
                            type="submit"
                            className="flex justify-center items-center h-10 bg-primary text-white rounded-full border-none text-sm font-medium leading-none w-[245px] px-8"

                        >
                            <span className="tracking-tight">Submit</span>
                        </button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
