import { Head, useForm } from "@inertiajs/react";

import { PrimaryButton, PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import { FormEventHandler, useState } from "react";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import InputError from "@/Components/elements/inputs/InputError";
import TextCopy from "../../Payments/Edit/Partials/TextCopy";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Authenticated from "@/Layouts/AuthenticatedLayout";


export default function IdentityVerification({
    identityVerification,
    identityVerificationStatus
}: {
    identityVerification: any;
    identityVerificationStatus: { label: string; value: string }[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [currentImage, setCurrentImage] = useState<string | null>(null); // Track current image to display

    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Identity Verifications",
            hasArrow: true,
            link: route("admin.identity-verifications.index"),
        },
        {
            name: 'View',
            hasArrow: true,
            link: route("admin.identity-verifications.show", { id: identityVerification.id }),
        },
    ];

    const { data, setData, post, errors } = useForm({
        status: identityVerification?.status ?? "",
        reason: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(
            route("admin.identity-verifications.info.update", {
                identity_verification: identityVerification?.id,
            })
        );
    };

    // Open Modal and Set the Image URL
    const openModal = (imageUrl: string) => {
        setCurrentImage(imageUrl);
        setIsModalOpen(true);
    };

    // Close the Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImage(null);
    };

    const selfieImageUrl = `${identityVerification?.selfie_image_url}`;
    const idCardImageUrl = `${identityVerification?.id_card_image_url}`;

    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title="Identity Verification" />

            <div className="mb-4 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Identity Verification
                    </h2>
                </div>
            </div>

            <form onSubmit={submit} className="flex flex-col ">
                <div className="flex flex-col w-full gap-8 ">
                    <div className="flex items-center justify-between w-full">
                        <PrimaryLink href={route("admin.identity-verifications.index")}>
                            Back to List
                        </PrimaryLink>
                        <PrimaryButton className="ml-auto" type="submit">
                            Save & Submit
                        </PrimaryButton>
                    </div>
                    <div className="flex flex-col-reverse w-full gap-4 lg:flex-row">

                        <div className="flex flex-col w-full gap-4 lg:w-2/3">
                            <div className="flex flex-col w-full gap-5 lg:flex-row">

                                {/* ID Card Image */}
                                <div className="w-full p-6 bg-white rounded-lg shadow-md lg:w-1/2">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">ID Card Image</h3>
                                    <div className="relative mt-4">
                                        {idCardImageUrl ? (
                                            <img
                                                src={idCardImageUrl}
                                                alt="ID Card Image"
                                                className="object-cover w-full cursor-pointer max-h-80"
                                                onClick={() => openModal(idCardImageUrl)} // Open modal with image
                                            />
                                        ) : (
                                            <span className="block text-center">No ID Card Image Available</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => openModal(idCardImageUrl)}
                                            className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full top-2 right-2"
                                        >
                                            <ArrowsPointingOutIcon className="w-6 h-6" /> {/* Maximize Icon */}
                                        </button>
                                    </div>
                                </div>

                                {/* Selfie Image */}
                                <div className="w-full p-6 bg-white rounded-lg shadow-md lg:w-1/2">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">Selfie Image</h3>
                                    <div className="relative mt-4">
                                        {selfieImageUrl ? (
                                            <img
                                                src={selfieImageUrl}
                                                alt="Selfie Image"
                                                className="object-cover w-full cursor-pointer"
                                                onClick={() => openModal(selfieImageUrl)} // Open modal with image
                                            />
                                        ) : (
                                            <span className="block text-center">No Selfie Image Available</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => openModal(selfieImageUrl)}
                                            className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full top-2 right-2"
                                        >
                                            <ArrowsPointingOutIcon className="w-6 h-6" />  {/* Maximize Icon */}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="flex w-full lg:w-1/3">
                            <div className="flex flex-col w-full gap-5 ">
                                <div className="w-full p-8 space-y-3 bg-white rounded-xl">
                                    <div className="flex items-center gap-4 ">
                                        <div className="relative flex items-start w-16 sm:gap-4 ">
                                        <div className={`absolute w-2 h-2  rounded-full left-1 top-1 ring-2 ring-white ${identityVerification?.user?.active_status ? "bg-green-500" : "bg-red-500"}`}
                                                                        > </div>
                                            <img
                                                className="w-16 h-16 rounded-full"
                                                src={identityVerification?.user?.avatar}
                                                alt="avatar"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-lg font-medium text-break font-Inter ">{identityVerification?.user?.full_name}</span>
                                            <span className="text-base font-semibold text-gray-500 first-letter:capitalize">{identityVerification?.user?.user_type}- {identityVerification?.user?.country}</span>
                                            <span className="text-sm font-semibold text-gray-500">{identityVerification?.user?.user_country_time}</span>
                                        </div>

                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-base font-medium">Email</h2>
                                        <TextCopy text={identityVerification?.user?.email} />
                                    </div>

                                </div>
                                <div className="w-full p-8 space-y-4 bg-white rounded-xl">
                                    <div>
                                        <InputLabel required htmlFor="Status" value="Status" />
                                        <SelectInput
                                            className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm "
                                            options={identityVerificationStatus}
                                            selectedOption={identityVerificationStatus.filter(
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
                                    {data.status === "rejected" && (
                                        <div className="mt-4">
                                            <InputLabel required htmlFor="reason" value="Rejection Reason" />
                                            <textarea
                                                id="reason"
                                                className="border-gray-300 mt-1.5 focus:border-primary focus:ring-0.5 focus:ring-primary rounded-md shadow-sm w-full"
                                                value={data.reason}
                                                rows={4}
                                                onChange={(e) => setData("reason", e.target.value)}
                                                placeholder="Provide the reason for rejection"
                                            />
                                            <InputError message={errors.reason} className="mt-2" />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Modal for Full Image View */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative w-full max-w-3xl p-4 bg-white rounded-lg">
                        <button
                            onClick={closeModal}
                            className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
                        >
                            <XMarkIcon className="w-6 h-6" /> {/* Close Icon */}
                        </button>
                        <img src={currentImage ?? ''} alt="Full Image" className="w-full max-h-[80vh] object-contain" />
                    </div>
                </div>
            )}
        </Authenticated>
    );
}
