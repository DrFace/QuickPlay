import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryButton, PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import InputError from "@/Components/elements/inputs/InputError";
import TextInput from "@/Components/elements/inputs/TextInput";
import TextCopy from "./Partials/TextCopy";
import MilestoneTable from "./Partials/MilestoneTable";



export default function Payment({
    payment,
    type,
    paymentStatus,
    adminStatus,

}: {
    payment: any;
    type: string;
    paymentStatus: { label: string; value: string }[];
    adminStatus: { label: string; value: string }[];
}) {
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
        {
            name: `${type == "create" ? "Create" : "Edit"}`,
            hasArrow: true,
            link: "",
        },
    ];
    const { data, setData, post, progress, errors, reset } = useForm({
        status: payment?.status ?? "",
        admin_status: payment?.admin_status ?? "",
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(
            route("admin.payments.info.update", {
                payment: payment?.id,
            })
        );
    };

    const title = type == "create" ? "Create Payment" : "View Payment";


    const statusChanged = () => {
        if (payment?.payment_for === "milestone") {
            for (let milestone of payment?.offer?.milestones) {
                if (milestone.id === payment?.offer_milestone_id) {
                    if (milestone.status === "completed") {
                        return true;
                    }
                    else {
                        return false;

                    }
                }
            }

        }
        else if (payment?.payment_for === "full_project") {
            if (payment?.offer?.status === "completed") {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    const statusChangedText = () => {
        if (payment?.payment_for === "milestone") {
            for (let milestone of payment?.offer?.milestones) {
                if (milestone.id === payment?.offer_milestone_id) {
                    if (milestone.status === "completed") {
                        return 'Client has approved the milestone, you can release the payment';
                    }
                    else {
                        if (milestone.project_status === "uploaded") {
                            return 'Freelancer has uploaded the project, Client has to approve the milestone';
                        }
                        else {
                            return 'Freelancer has not uploaded the project yet';
                        }

                    }
                }
            }

        }
        else if (payment?.payment_for === "full_project") {
            if (payment?.offer?.status === "completed") {
                return 'Client has approved the project, you can release the payment';
            }
            else {
                return 'Client has not approved the project yet';
            }
        } else {
            return 'Client has not approved the project yet';
        }
    }

  //  console.log(payment);
    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title={title} />
            <div className="mb-4 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {title}
                    </h2>
                </div>
            </div>
            <form onSubmit={submit} className="flex flex-col ">
                <div className="flex flex-col w-full gap-8 ">
                    <div className="flex items-center justify-between w-full">
                        <PrimaryLink href={route("admin.payments.index")}>
                            Back to List
                        </PrimaryLink>
                        <PrimaryButton className="ml-auto" type="submit">
                            Save & Submit
                        </PrimaryButton>
                    </div>
                    <div className="flex flex-col-reverse w-full gap-4 lg:flex-row">

                        <div className="flex flex-col w-full gap-4 lg:w-2/3">
                            <div className="flex flex-col-reverse w-full gap-5 sm:flex-row">
                                <div className="w-full p-8 space-y-3 bg-white sm:w-1/2 rounded-xl">
                                    <div className="flex items-center gap-4 ">
                                        <div className="relative flex items-start w-16 sm:gap-4 ">
                                        <div className={`absolute w-2 h-2  rounded-full left-1 top-1 ring-2 ring-white ${payment?.user?.active_status ? "bg-green-500" : "bg-red-500"}`}
                                                                        > </div>
                                            <img
                                                className="w-16 h-16 rounded-full"
                                                src={payment?.user?.avatar}
                                                alt="avatar"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-lg font-medium text-break font-Inter ">{payment?.user?.full_name}</span>
                                            <span className="text-base font-semibold text-gray-500 first-letter:capitalize">{payment?.user?.user_type}- {payment?.user?.country}</span>
                                            <span className="text-sm font-semibold text-gray-500">{payment?.user?.user_country_time}</span>
                                        </div>

                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Email</h2>
                                        <TextCopy text={payment?.user?.email} />
                                    </div>
                                    {payment?.stripe_customer_id && (
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-base font-medium">Stripe ID
                                            </h2>
                                            <TextCopy text={payment?.stripe_customer_id} />
                                        </div>
                                    )}

                                </div>
                                <div className="w-full p-8 space-y-3 bg-white sm:w-1/2 rounded-xl">
                                    <h1 className="text-xl font-bold">Payment Details</h1>

                                    {/* payment type */}
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Amount</h2>
                                        <div className="flex items-center justify-between w-full px-4 py-2 border-2 rounded-2xl ">
                                            <span className="text-base font-semibold text-gray-500">{payment?.type === 'credit' ? <span className="text-green-500">$ {payment?.amount}</span> : <span className="text-red-500">$ {payment?.amount}</span>}</span>
                                            <span className="text-base font-semibold text-gray-500 first-letter:capitalize">{payment?.type} Value</span>
                                        </div>
                                    </div>

                                    {/* payment reason */}
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Reason</h2>
                                        <div className="flex items-center justify-between w-full px-4 py-2 border-2 rounded-2xl ">
                                            <span className="text-sm font-semibold text-gray-500">{payment?.description}</span>
                                        </div>
                                    </div>


                                    {/* payment created at */}
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Created At</h2>
                                        <div className="flex items-center justify-between w-full px-4 py-2 border-2 rounded-2xl ">
                                            <span className="text-sm font-semibold text-gray-500"> {payment?.created_at_human}</span>
                                        </div>
                                    </div>
                                    {/* Payment Receipt */}
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Receipt</h2>
                                        <div className="flex items-center justify-between w-full px-4 py-2 border-2 rounded-2xl">
                                            <div className="flex gap-4">
                                                {/* View Receipt Button */}
                                                <a
                                                    href={payment?.receipt_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View
                                                </a>

                                                {/* Download Receipt Button */}
                                                {/* <button
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = payment?.receipt_url;
                                                        link.download = "receipt.pdf"; // Specify the filename
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Download PDF
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-5 sm:flex-row">
                                {payment?.payment_for !== "connect_package" && payment?.payment_for !== "balance_payment" &&
                                    <div className="w-full p-8 space-y-4 bg-white rounded-xl">
                                        <h1 className="text-xl font-bold">Contract Details</h1>
                                        <div className="flex flex-col gap-6 lg:flex-row">
                                            <div className="flex flex-col w-full gap-3 bg-white ">

                                                <div className="flex flex-row items-center justify-between w-full gap-4">
                                                    <div className="flex flex-col">
                                                        <p className="text-lg font-medium text-gray-900">Project Title</p>
                                                        <p className="text-sm text-gray-500">{payment?.offer?.contract_title}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-between w-full gap-4 lg:flex-row">
                                                    <div className="flex flex-row items-center justify-between w-full gap-4 lg:w-1/2">
                                                        <div className="flex flex-col">
                                                            <p className="text-lg font-medium text-gray-900">Full Price: <span className="font-medium">$ {payment?.offer?.offer_price}</span></p>
                                                            <p className="text-sm text-gray-500">{payment?.offer?.payment_type === 'Project' ? "Full Project" : "Milestone Vice"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row justify-between w-full gap-4 md:w-1/2 lg:w-1/2">
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-800">Start at</h3>
                                                            <p className="text-sm text-gray-500">{payment?.offer?.created_at_human}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-800">Due Date</h3>
                                                            <p className="text-sm text-gray-500">{payment?.offer?.due_date_formatted}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {payment?.offer?.payment_type === 'Milestone' && (
                                                    <div className="flex flex-col gap-2 ">
                                                        <div className="text-lg font-medium text-black">Milestones</div>
                                                        <MilestoneTable milestones={payment?.offer?.milestones} status={true} />
                                                    </div>
                                                )}


                                            </div>
                                        </div>



                                    </div>
                                }
                            </div>
                        </div>

                        <div className="flex w-full lg:w-1/3">
                            <div className="flex flex-col w-full gap-5 ">
                                <div className="w-full p-8 space-y-4 bg-white rounded-xl">
                                    <h1 className="text-xl font-bold">Payment</h1>
                                    <div>
                                        <InputLabel htmlFor="Status" value="Status" />
                                        <SelectInput
                                            className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm "
                                            options={paymentStatus}
                                            disabled={true}
                                            selectedOption={paymentStatus.filter(
                                                (obj: any) => {
                                                    return obj.value === data.status;
                                                }
                                            )}
                                            setData={(e: any) => setData("status", e)}
                                        />
                                        <InputError
                                            message={errors.status}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                {payment?.payment_for !== "connect_package" && payment?.payment_for !== "balance_payment" &&
                                    <div className="w-full p-8 space-y-4 bg-white rounded-xl">
                                        <h1 className="text-xl font-bold">{payment?.payment_for === "milestone" ? "Milestone Status" : "Project Status"}</h1>
                                        <span className="text-sm text-gray-500">{statusChangedText()}</span>
                                    </div>
                                }

                                {payment?.payment_for !== "connect_package" && payment?.payment_for !== "balance_payment" &&
                                    <div className="w-full p-8 space-y-4 bg-white rounded-xl">
                                        <h1 className="text-xl font-bold">Release Payment</h1>
                                        <span className="text-sm text-gray-500">You can release the payment once the client approves the project</span>
                                        <div>
                                            <InputLabel required htmlFor="admin_status" value="Admin Status" />
                                            <SelectInput
                                                className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm "
                                                options={adminStatus}
                                                disabled={!statusChanged()}
                                                selectedOption={adminStatus.filter(
                                                    (obj: any) => {
                                                        return obj.value === data.admin_status;
                                                    }
                                                )}
                                                setData={(e: any) => setData("admin_status", e)}
                                            />
                                            <InputError
                                                message={errors.admin_status}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                }
                                {/* <div>
                                <InputLabel htmlFor="amount" value="Amount (USD)" />
                                <TextInput
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={data.amount}
                                    className="block w-full mt-1"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    onWheel={(e) => e.currentTarget.blur()}
                                     onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                            }
                                        }}
                                />
                                <InputError
                                    message={errors.amount}
                                    className="mt-2"
                                />
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Authenticated>
    );
}
