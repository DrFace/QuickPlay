import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryButton, PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import InputError from "@/Components/elements/inputs/InputError";
import TextCopy from "./Partials/TextCopy";

export default function Payment({
    balanceRequest,
    type,
    requestStatus,

}: {
    balanceRequest: any;
    type: string;
    requestStatus: { label: string; value: string }[];
}) {
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
        {
            name: `${type == "create" ? "Create" : "View"}`,
            hasArrow: true,
            link: "",
        },
    ];
    const { data, setData, post, progress, errors, reset } = useForm({
        status: balanceRequest?.status ?? "",
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(
            route("admin.balance-requests.info.update", {
                balance_request: balanceRequest?.id,
            })
        );
    };

    const title = type == "create" ? "Create Payouts" : "View Payouts";

    // console.log(balanceRequest);
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
                        <PrimaryLink href={route("admin.balance-requests.index")}>
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
                                            <div className={`absolute w-2 h-2  rounded-full left-1 top-1 ring-2 ring-white ${balanceRequest?.user?.active_status ? "bg-green-500" : "bg-red-500"}`}
                                            > </div>
                                            <img
                                                className="w-16 h-16 rounded-full"
                                                src={balanceRequest?.user?.avatar}
                                                alt="avatar"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-lg font-medium text-break font-Inter ">{balanceRequest?.user?.full_name}</span>
                                            <span className="text-base font-semibold text-gray-500 first-letter:capitalize">{balanceRequest?.user?.user_type}- {balanceRequest?.user?.country}</span>
                                            <span className="text-sm font-semibold text-gray-500">{balanceRequest?.user?.user_country_time}</span>
                                        </div>

                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Email</h2>
                                        <TextCopy text={balanceRequest?.user?.email} />
                                    </div>


                                </div>
                                <div className="w-full p-8 space-y-3 bg-white sm:w-1/2 rounded-xl">
                                    <h1 className="text-xl font-bold">Request Payment</h1>

                                    {/* payment type */}
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Total Amount</h2>
                                        <div className="flex items-center justify-between w-full px-4 py-2 border-2 rounded-2xl ">
                                            <span className="text-base font-semibold text-green-500">$ {balanceRequest?.amount}</span>

                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Received Amount</h2>
                                        <div className="flex items-center justify-between w-full px-4 py-2 border-2 rounded-2xl ">
                                            <span className="text-base font-semibold text-red-500">$ {balanceRequest?.received_amount}</span>
                                        </div>
                                    </div>
                                    {/* payment created at */}
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Requested At</h2>
                                        <div className="flex items-center justify-between w-full px-4 py-2 border-2 rounded-2xl ">
                                            <span className="text-sm font-semibold text-gray-500"> {balanceRequest?.created_at_human}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-col w-full p-8 bg-white rounded-xl">
                                <h1 className="text-xl font-bold">Payment Method</h1>
                                <div className="flex flex-col gap-2 p-4">
                                    <div className="flex flex-col w-full gap-3 sm:items-center sm:flex-row">
                                        <h2 className="w-[200px] text-base font-medium">Bank Name :</h2>
                                        <TextCopy text={balanceRequest?.payment_method?.bank_name} />
                                    </div>
                                    <div className="flex flex-col w-full gap-3 sm:items-center sm:flex-row">
                                        <h2 className="w-[200px] text-base font-medium">Account Holder :</h2>
                                        <TextCopy text={balanceRequest?.payment_method?.account_holder_name} />
                                    </div>
                                    <div className="flex flex-col w-full gap-3 sm:items-center sm:flex-row">
                                        <h2 className="w-[200px] text-base font-medium">Account Number :</h2>
                                        <TextCopy text={balanceRequest?.payment_method?.account_number} />
                                    </div>
                                    <div className="flex flex-col w-full gap-3 sm:items-center sm:flex-row">
                                        <h2 className="w-[200px] text-base font-medium">Country :</h2>
                                        <TextCopy text={balanceRequest?.payment_method?.country} />
                                    </div>
                                    <div className="flex flex-col w-full gap-3 sm:items-center sm:flex-row">
                                        <h2 className="w-[200px] text-base font-medium">Address :</h2>
                                        <TextCopy text={balanceRequest?.payment_method?.bank_address} />
                                    </div>
                                </div>


                            </div>

                        </div>

                        <div className="flex w-full lg:w-1/3">
                            <div className="flex flex-col w-full gap-5 ">

                                <div className="w-full p-8 space-y-4 bg-white rounded-xl">
                                    <h1 className="text-xl font-bold">Release Payment</h1>
                                    <span className="text-sm text-gray-500">You can release the payment once the client approves the project</span>
                                    <div>
                                        <InputLabel required htmlFor="status" value="Status" />
                                        <SelectInput
                                            className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm "
                                            options={requestStatus}
                                            selectedOption={requestStatus?.filter(
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


                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Authenticated>
    );
}
