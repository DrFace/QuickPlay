import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Category, Skill } from "@/types";
import { useDropzone } from "react-dropzone";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryButton, PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import InputError from "@/Components/elements/inputs/InputError";
import TextInput from "@/Components/elements/inputs/TextInput";


export default function CreateSkill({
    skill,
    type,
    categoryStatus,

}: {
    skill: Skill;
    type: string;
    categoryStatus: { label: string; value: string }[];

}) {
    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Skills",
            hasArrow: true,
            link: route("admin.skills.index"),
        },
        {
            name: `${type == "create" ? "Create" : "Edit"}`,
            hasArrow: true,
            link: "",
        },
    ];
    const { data, setData, post, processing, errors, reset } = useForm({
        name: skill?.name ?? "",
        status: skill?.status ?? "",
        type: type,
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        //console.log(category.id);
        post(
            route("admin.skills.info.update", {
                skill: skill.id,
            })
        );
    };

    const title = type == "create" ? "Create Skill" : "Edit  Skill";

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
                        <PrimaryLink href={route("admin.skills.index")}>
                            Back to List
                        </PrimaryLink>
                        <PrimaryButton className="ml-auto" disabled={processing} type="submit">
                            Save & Submit
                        </PrimaryButton>
                    </div>
                    <div className="flex flex-col-reverse w-full gap-4 lg:flex-row">

                        <div className="flex flex-col w-full gap-4 lg:w-2/3">

                            <div className="col-span-2">
                                <div className="p-8 space-y-4 bg-white rounded-xl">
                                    <div>
                                        <InputLabel required htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter Name"
                                            value={data.name}
                                            className="block w-full mt-1"
                                            isFocused={true}
                                            //required
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>
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
                                            options={categoryStatus}
                                            placeholder="Select Status"
                                            selectedOption={categoryStatus.filter(
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
