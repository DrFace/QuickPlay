import { FormEventHandler } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryButton, PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import TextInput from "@/Components/elements/inputs/TextInput";
import InputError from "@/Components/elements/inputs/InputError";
import SelectInput from "@/Components/elements/inputs/SelectInput";



export default function EditBankDetailsPage({
    bankDetail,
    type,
    countryMap,
    bankStatus,
}: {
    bankDetail: any;
    type: string;
    countryMap: { label: string; value: string }[];
    bankStatus: { label: string; value: string }[];
}) {
    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Banks",
            hasArrow: true,
            link: route("admin.bank-details.index"),
        },
        {
            name: `${type === "create" ? "Create" : "Edit"}`,
            hasArrow: true,
            link: "",
        },
    ];

    const { data, setData, post, errors, processing } = useForm({
        bank_name: bankDetail?.bank_name ?? "",
        bank_address: bankDetail?.bank_address ?? "",
        country: bankDetail?.country ?? "",
        status: bankDetail?.status ?? "",
        type: type,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!bankDetail || !bankDetail.id) {
            console.error("Bank detail ID is missing.");
            return;
        }

        post(
            route("admin.bank-details.info.update", {
                bank_detail: bankDetail.id,
            })
        );
    };

    const title = type === "create" ? "Add New Bank" : "Edit Bank Details";

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
                        <PrimaryLink href={route("admin.bank-details.index")}>
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
                                        <InputLabel required htmlFor="bank_name" value="Bank Name" />
                                        <TextInput
                                            id="bank_name"
                                            name="bank_name"
                                            type="text"
                                            placeholder="Enter Bank Name"
                                            value={data.bank_name}
                                            className="block w-full mt-1"
                                            isFocused={true}
                                            //required
                                            onChange={(e) =>
                                                setData("bank_name", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.bank_name}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 ">

                                <div className="p-8 space-y-4 bg-white rounded-xl">
                                    <div>
                                        <InputLabel required htmlFor="bank_address" value="Bank Address" />

                                        <TextInput
                                            id="bank_address"
                                            name="bank_address"
                                            type="text"
                                            placeholder="Enter Bank Address"
                                            value={data.bank_address}
                                            className="block w-full mt-1"
                                            isFocused={false}
                                            //required
                                            onChange={(e) =>
                                                setData("bank_address", e.target.value)
                                            }
                                        />

                                        <InputError
                                            message={errors.bank_address}
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
                                            options={bankStatus}
                                            placeholder="Select Status"
                                            selectedOption={bankStatus.filter(
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

                                <div className="p-8 space-y-4 bg-white rounded-xl">
                                    <div>
                                        <InputLabel required htmlFor="country" value="Country" />
                                        <SelectInput
                                            className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm "
                                            options={countryMap}
                                            placeholder="Select Country"
                                            selectedOption={data.country ? { value: data.country, label: data.country } : null}
                                            setData={(e: any) => setData("country", e)}
                                        />
                                        <InputError
                                            message={errors.country}
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


