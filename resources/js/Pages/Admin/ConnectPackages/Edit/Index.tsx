import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryButton, PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import InputError from "@/Components/elements/inputs/InputError";
import TextInput from "@/Components/elements/inputs/TextInput";


export default function CreateProduct({
    connectPackage,
    type,
    packageStatus,

}: {
    connectPackage: any;
    type: string;
    packageStatus: { label: string; value: string }[];

}) {
    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Connect Packages",
            hasArrow: true,
            link: route("admin.connect-packages.index"),
        },
        {
            name: `${type == "create" ? "Create" : "Edit"}`,
            hasArrow: true,
            link: "",
        },
    ];
    const { data, setData, post, processing, errors, reset } = useForm({
        connects: connectPackage?.connects ?? "",
        amount: connectPackage?.amount ?? "",
        status: connectPackage?.status ?? "",
        type: type,
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(
            route("admin.connect-packages.info.update", {
                connect_package: connectPackage.id,
            }),

        );
    };

    const title = type == "create" ? "Create Connect Package" : "Edit Connect Package";

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
                        <PrimaryLink href={route("admin.connect-packages.index")}>
                            Back to List
                        </PrimaryLink>
                        <PrimaryButton className="ml-auto" disabled={processing} type="submit">
                            Save & Submit
                        </PrimaryButton>
                    </div>
                    <div className="flex flex-col-reverse w-full gap-4 lg:flex-row">

                        <div className="flex flex-col w-full gap-4 lg:flex-row lg:w-2/3">

                            <div className="p-8 space-y-4 bg-white lg:w-1/2 rounded-xl">
                                <div>
                                    <InputLabel required htmlFor="connects" value="Connects" />
                                    <TextInput
                                        id="connects"
                                        name="connects"
                                        type="number"
                                        value={data.connects}
                                        className="block w-full mt-1"
                                        isFocused={true}
                                        placeholder="Enter connects amount"
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (newValue.length <= 5) {
                                                setData('connects', newValue); // Update state only if length is 10 or less
                                            }
                                        }}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                            }
                                        }}
                                    />
                                    <InputError
                                        message={errors.connects}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="p-8 space-y-4 bg-white lg:w-1/2 rounded-xl">
                                <div>
                                    <InputLabel required htmlFor="amount" value="Amount (USD)" />
                                    <TextInput
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        value={data.amount}
                                        className="block w-full mt-1"
                                        isFocused={false}
                                        placeholder="Enter amount in USD"
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (newValue.length <= 5) {
                                                setData('amount', newValue); // Update state only if length is 10 or less
                                            }
                                        }}

                                        onWheel={(e) => e.currentTarget.blur()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <InputError
                                        message={errors.amount}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="flex w-full lg:w-1/3">
                            <div className="flex flex-col w-full gap-5 ">
                                <div className="p-8 space-y-4 bg-white rounded-xl">
                                    <div>
                                        <InputLabel required htmlFor="status" value="Status" />
                                        <SelectInput
                                            className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm "
                                            options={packageStatus}
                                            placeholder="Select Status"
                                            selectedOption={packageStatus.filter(
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
