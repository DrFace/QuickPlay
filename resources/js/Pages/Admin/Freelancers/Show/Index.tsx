import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";
import TextCopy from "../../Payments/Edit/Partials/TextCopy";

interface PaymentMethod {
    id: string;
    account_holder_name: string;
    account_number: string;
    iban_number: string;
    country: string;
    bank_name: string;
    bank_address: string;
}

interface Freelancer {
    address?: string;
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at_human: string;
    avatar: string;
    user_type: string;
    active_status: boolean;
    country: string;
    user_country_time: string;
    meta_data?: {
        address_line1?: string;
        address_line2?: string;
        address_line3?: string;
        title?: string;
    };
    paymentMethods?: PaymentMethod[];
}

interface FreelancerShowPageProps {
    auth: {
        user?: any;
    };
    freelancer: Freelancer;
    paymentMethods: PaymentMethod[];
    activeOffers: any;
}

export default function FreelancerShowPage({ auth, freelancer, paymentMethods, activeOffers }: FreelancerShowPageProps) {
    const bRoutes = [
        {
            name: "Dashboard",
            hasArrow: true,
            link: route("admin.dashboard"),
        },
        {
            name: "Freelancers",
            hasArrow: true,
            link: route("admin.freelancers.index"),
        },
        {
            name: `${freelancer.first_name} ${freelancer.last_name}`,
            hasArrow: true,
            link: route("admin.freelancers.show", { freelancer: freelancer.id }),
        },
    ];

    const address = [
        freelancer.meta_data?.address_line1,
        freelancer.meta_data?.address_line2,
        freelancer.meta_data?.address_line3,
    ]
        .filter(Boolean)
        .join(", ");
    // console.log(freelancer);
    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title={`Freelancer - ${freelancer.first_name} ${freelancer.last_name}`} />
            <div className="mb-4 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        View Freelancer
                    </h2>
                </div>
            </div>
            <div className="flex justify-end mt-4 md:mt-0 md:ml-4">
                <PrimaryLink className="ml-auto" href={route("admin.freelancers.index")}>
                    Back to List
                </PrimaryLink>
            </div>

            <div className="flex flex-col gap-4 mx-auto mt-4 lg:flex-row max-w-7xl">
                <div className="w-full p-6 space-y-4 bg-white rounded-lg shadow-md lg:w-1/3">
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center w-16 h-16 mx-auto">
                            <div className={`absolute w-2 h-2  rounded-full left-1 top-1 ring-2 ring-white ${freelancer?.active_status ? "bg-green-500" : "bg-red-500"}`}
                            > </div>
                            <img
                                className="w-16 h-16 rounded-full"
                                src={freelancer.avatar}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium">{freelancer.first_name} {freelancer.last_name}</p>
                        <p className="text-gray-500">{freelancer.country} - {freelancer.user_country_time}</p>
                        <p className="text-sm text-gray-500">Joined since - {freelancer.created_at_human}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-medium">Email</h2>
                        <TextCopy text={freelancer?.email} />
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    {address &&
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                            <p className="mt-2 text-lg text-gray-700">
                                {address || "N/A"}
                            </p>
                        </div>
                    }

                    {freelancer.meta_data?.title && (
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900">Title</h3>
                            <p className="mt-2 text-lg text-gray-700">
                                {freelancer.meta_data?.title}
                            </p>
                        </div>
                    )}

                    {/* Payment Methods Section */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                        <div className="mt-2 overflow-x-auto">
                            {paymentMethods.length > 0 ? (
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-sm font-semibold text-left text-gray-900 border-b">Account Holder</th>
                                            <th className="px-4 py-2 text-sm font-semibold text-left text-gray-900 border-b">Account Number</th>
                                            <th className="px-4 py-2 text-sm font-semibold text-left text-gray-900 border-b">IBAN</th>
                                            <th className="px-4 py-2 text-sm font-semibold text-left text-gray-900 border-b">Bank Name</th>
                                            <th className="px-4 py-2 text-sm font-semibold text-left text-gray-900 border-b">Country</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentMethods.map((method) => (
                                            <tr key={method.id}>
                                                <td className="px-4 py-2 text-gray-700 border-b">{method.account_holder_name}</td>
                                                <td className="px-4 py-2 text-gray-700 border-b">{method.account_number}</td>
                                                <td className="px-4 py-2 text-gray-700 border-b">{method.iban_number}</td>
                                                <td className="px-4 py-2 text-gray-700 border-b">{method.bank_name}</td>
                                                <td className="px-4 py-2 text-gray-700 border-b">{method.country}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No payment methods available.</p>
                            )}
                        </div>
                    </div>

                    {/* <div className="flex w-full lg:w-1/3">
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

                            </div>
                        </div> */}

                    <div className="">
                        <div className="flex gap-2 mt-2 overflow-x-auto">
                            <div className="flex w-full lg:w-1/2">
                                <div className="flex flex-col w-full gap-5 ">
                                    <div className="w-full p-4 space-y-4 bg-white rounded-xl">
                                        <h1 className="text-xl font-bold">Earned Amount</h1>
                                        <div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full lg:w-1/2">
                                <div className="flex flex-col w-full gap-5 ">
                                    <div className="w-full p-4 space-y-4 bg-white rounded-xl">
                                        <h1 className="text-xl font-bold">Pending Amount</h1>
                                        <div>

                                        </div>

                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="">
                        <div className="flex gap-2 mt-2 overflow-x-auto">
                            <div className="flex w-full lg:w-1/2">
                                <div className="flex flex-col w-full gap-5 ">
                                    <div className="w-full p-4 space-y-4 bg-white rounded-xl">
                                        <h1 className="text-xl font-bold">Withdrawal amount</h1>
                                        <div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full lg:w-1/2">
                                <div className="flex flex-col w-full gap-5 ">
                                    <div className="w-full p-4 space-y-4 bg-white rounded-xl">
                                        <h1 className="text-xl font-bold">Payout amount</h1>
                                        <div>

                                        </div>

                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {activeOffers && activeOffers.length > 0 && (
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900">Ongoing Offers</h3>
                            <p className="mt-2 text-lg text-gray-700">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead className="bg-gray-200">
                                        <tr>

                                            <th className="px-4 py-2 border-b text-start">Title</th>
                                            <th className="px-4 py-2 border-b">Amount</th>
                                            <th className="px-4 py-2 border-b">Create At</th>
                                            {status && <th className="px-4 py-2 border-b">Status</th>}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeOffers.map((offer: any) => (
                                            <tr key={offer.id}>

                                                <td className="px-4 py-2 border-b cursor-pointer">
                                                    <div className="max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis">
                                                        {offer?.contract_title}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-center border-b whitespace-nowrap">{offer?.offer_price}</td>
                                                <td className="w-24 px-4 py-2 text-center border-b whitespace-nowrap">{offer?.created_at_human}</td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </p>
                        </div>
                    )}



                </div>
            </div>
        </Authenticated>
    );
}
