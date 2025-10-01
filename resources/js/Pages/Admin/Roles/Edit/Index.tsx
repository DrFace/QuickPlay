import { FormEventHandler, useCallback, useEffect, useState } from "react";
import InputError from "@/Components/elements/inputs/InputError";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import { PrimaryButton } from "@/Components/elements/buttons/PrimaryButton";
import TextInput from "@/Components/elements/inputs/TextInput";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/elements/inputs/SelectInput";


export default function Edit({ roles, status, type }: { roles: any, status: { label: string; value: string }[], type: string }) {
    const { data, setData, errors, patch } = useForm({
        name: roles.name,
        status: roles.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("admin.roles.update", roles.id));
    };

    const title = type === "create" ? "Create Role" : "Edit Role";

    function t(arg0: string): string | undefined {
        throw new Error("Function not implemented.");
    };

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("dashboard"),
        },
        {
            name: "Roles",
            hasArrow: true,
            link: route("admin.roles.index"),
        },
        {
            name: title,
            hasArrow: false,
            link: "",
        },
    ];
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
            <form
                onSubmit={submit}
                className="grid gap-4 p-8 bg-white rounded-xl 2xl:grid-cols-2"
            >
                {/*Submit Button*/}
                <div className="flex col-span-4 lg:col-span-3">
                    <PrimaryButton className="ml-auto" type="submit">
                        Save & Submit
                    </PrimaryButton>
                </div>
                {/*Name*/}
                <div className="col-span-4 lg:col-span-3">
                    <InputLabel>Role Name</InputLabel>
                    <TextInput
                        className="block w-full mt-1"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                {/* status */}
                <div className="col-span-4 lg:col-span-3">
                    <InputLabel htmlFor="status" value="Status" />
                    <SelectInput
                        className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm "
                        options={status}
                        selectedOption={status.filter(
                            (obj: any) => {
                                return obj.value === data.status;
                            }
                        )}
                        setData={(e: any) => setData("status", e)}
                    />

                </div>
                <InputError message={errors.status} />
            </form>
        </Authenticated>

    )
}

